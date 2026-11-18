import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/db';
import { resetDatabase } from './helpers/reset-db';

const app = createApp();

let clinicId = '';
let providerA = '';
let providerB = '';
let unit1 = '';
let unit2 = '';
let procedureConsulta = '';
let procedureLimpieza = '';
let patientId = '';

beforeAll(async () => {
  await resetDatabase();
  const clinic = await prisma.clinic.create({ data: { name: 'Clínica Test (ficticia)' } });
  clinicId = clinic.id;

  const a = await prisma.provider.create({ data: { clinicId, name: 'Dra. Ana Ficticia' } });
  const b = await prisma.provider.create({ data: { clinicId, name: 'Dr. Luis Inventado' } });
  const u1 = await prisma.operatingUnit.create({ data: { clinicId, name: 'Sillón 1' } });
  const u2 = await prisma.operatingUnit.create({ data: { clinicId, name: 'Sillón 2' } });
  const consulta = await prisma.procedure.create({
    data: { clinicId, code: 'CONS', name: 'Consulta', defaultDurationMin: 30 },
  });
  const limpieza = await prisma.procedure.create({
    data: { clinicId, code: 'LIMP', name: 'Limpieza', defaultDurationMin: 45 },
  });
  const patient = await prisma.patient.create({
    data: { clinicId, name: 'Paciente Ficticio', phone: '555-0100', dni: '30999999' },
  });

  patientId = patient.id;
  providerA = a.id;
  providerB = b.id;
  unit1 = u1.id;
  unit2 = u2.id;
  procedureConsulta = consulta.id;
  procedureLimpieza = limpieza.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.appointment.deleteMany();
});

interface AppointmentBody {
  id: string;
  start: string;
  end: string;
  status: string;
  patientId: string | null;
  patient: { id: string; name: string } | null;
}

function payload(overrides: Record<string, string> = {}): Record<string, string> {
  return {
    providerId: providerA,
    operatingUnitId: unit1,
    procedureId: procedureConsulta,
    patientName: 'Paciente Ficticio',
    start: '2026-11-02T10:00:00.000Z',
    ...overrides,
  };
}

describe('POST /api/appointments', () => {
  it('CA-1: crea un turno libre y calcula el fin según la duración del procedimiento', async () => {
    const res = await request(app).post('/api/appointments').send(payload());

    expect(res.status).toBe(201);
    const body = res.body as AppointmentBody;
    expect(new Date(body.end).getTime() - new Date(body.start).getTime()).toBe(30 * 60_000);
    expect(body.status).toBe('confirmado');
  });

  it('RN-AG-01: rechaza solape parcial del mismo profesional aunque el sillón cambie', async () => {
    await request(app).post('/api/appointments').send(payload()).expect(201);

    const res = await request(app)
      .post('/api/appointments')
      .send(payload({ operatingUnitId: unit2, start: '2026-11-02T10:15:00.000Z' }));

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('APPOINTMENT_OVERLAP');
  });

  it('RN-AG-01: rechaza solape total del mismo profesional', async () => {
    await request(app).post('/api/appointments').send(payload()).expect(201);

    const res = await request(app).post('/api/appointments').send(payload());

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('APPOINTMENT_OVERLAP');
  });

  it('RN-AG-02: rechaza solape del sillón aunque cambie el profesional', async () => {
    await request(app).post('/api/appointments').send(payload()).expect(201);

    const res = await request(app)
      .post('/api/appointments')
      .send(payload({ providerId: providerB, start: '2026-11-02T10:15:00.000Z' }));

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('APPOINTMENT_OVERLAP');
  });

  it('CA-2: permite turnos contiguos (el fin coincide con el inicio siguiente)', async () => {
    await request(app).post('/api/appointments').send(payload()).expect(201);

    const res = await request(app)
      .post('/api/appointments')
      .send(payload({ start: '2026-11-02T10:30:00.000Z' }));

    expect(res.status).toBe(201);
  });

  it('CA-1: permite el mismo horario con profesional y sillón distintos', async () => {
    await request(app).post('/api/appointments').send(payload()).expect(201);

    const res = await request(app)
      .post('/api/appointments')
      .send(payload({ providerId: providerB, operatingUnitId: unit2 }));

    expect(res.status).toBe(201);
  });

  it('RN-AG-01+RN-AG-02: dos inserciones concurrentes solo aceptan una', async () => {
    const [first, second] = await Promise.all([
      request(app).post('/api/appointments').send(payload()),
      request(app).post('/api/appointments').send(payload({ operatingUnitId: unit2 })),
    ]);

    const statuses = [first.status, second.status].sort();
    expect(statuses).toEqual([201, 409]);
    expect(await prisma.appointment.count()).toBe(1);
  });

  it('devuelve 400 con detalles cuando el payload es inválido', async () => {
    const res = await request(app).post('/api/appointments').send({ providerId: providerA });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
    expect(Array.isArray(res.body.details)).toBe(true);
  });

  it('devuelve 404 cuando el procedimiento no existe', async () => {
    const res = await request(app).post('/api/appointments').send(payload({ procedureId: 'no-existe' }));

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('PROCEDURE_NOT_FOUND');
  });

  it('el fin del turno respeta la duración de otro procedimiento (45 min)', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send(payload({ procedureId: procedureLimpieza }));

    expect(res.status).toBe(201);
    const body = res.body as AppointmentBody;
    expect(new Date(body.end).getTime() - new Date(body.start).getTime()).toBe(45 * 60_000);
  });

  it('C-06.2: vincula el turno al paciente y deriva su nombre', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({ ...payload(), patientName: 'Nombre viejo', patientId });

    expect(res.status).toBe(201);
    const body = res.body as AppointmentBody;
    expect(body.patientId).toBe(patientId);
    expect(body.patient?.name).toBe('Paciente Ficticio');
    expect(res.body.patientName).toBe('Paciente Ficticio');
  });

  it('C-06.2: rechaza patientId inexistente con 404', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({ ...payload(), patientId: 'paciente-no-existe' });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('PATIENT_NOT_FOUND');
  });
});

describe('GET /api/health', () => {
  it('responde ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
