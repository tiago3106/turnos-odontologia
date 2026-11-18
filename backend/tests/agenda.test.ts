import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/db';
import { resetDatabase } from './helpers/reset-db';

const app = createApp();

let providerA = '';
let providerB = '';
let unit1 = '';
let unit2 = '';
let consulta = '';
let extraccion = '';

interface AppointmentBody {
  id: string;
  start: string;
  end: string;
  status: string;
  cancelledAt: string | null;
  cancelReason: string | null;
}

function payload(overrides: Record<string, string> = {}): Record<string, string> {
  return {
    providerId: providerA,
    operatingUnitId: unit1,
    procedureId: consulta,
    patientName: 'Paciente Ficticio',
    start: '2026-11-02T10:00:00.000Z',
    ...overrides,
  };
}

async function create(overrides: Record<string, string> = {}): Promise<AppointmentBody> {
  const res = await request(app).post('/api/appointments').send(payload(overrides));
  expect(res.status).toBe(201);
  return res.body as AppointmentBody;
}

beforeAll(async () => {
  await resetDatabase();
  const clinic = await prisma.clinic.create({ data: { name: 'Clínica Test Agenda (ficticia)' } });
  const a = await prisma.provider.create({ data: { clinicId: clinic.id, name: 'Dra. Ana Ficticia' } });
  const b = await prisma.provider.create({ data: { clinicId: clinic.id, name: 'Dr. Luis Inventado' } });
  const u1 = await prisma.operatingUnit.create({ data: { clinicId: clinic.id, name: 'Sillón 1' } });
  const u2 = await prisma.operatingUnit.create({ data: { clinicId: clinic.id, name: 'Sillón 2' } });
  const c = await prisma.procedure.create({
    data: { clinicId: clinic.id, code: 'CONS', name: 'Consulta', defaultDurationMin: 30 },
  });
  const e = await prisma.procedure.create({
    data: { clinicId: clinic.id, code: 'EXTR', name: 'Extracción', defaultDurationMin: 60 },
  });

  providerA = a.id;
  providerB = b.id;
  unit1 = u1.id;
  unit2 = u2.id;
  consulta = c.id;
  extraccion = e.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.auditLog.deleteMany();
  await prisma.appointment.deleteMany();
});

describe('GET /api/appointments', () => {
  it('lista los turnos del día del consultorio (UTC-3)', async () => {
    await create();
    await create({ start: '2026-11-03T10:00:00.000Z' });

    const res = await request(app).get('/api/appointments').query({ date: '2026-11-02' });

    expect(res.status).toBe(200);
    const body = res.body as AppointmentBody[];
    expect(body).toHaveLength(1);
    expect(body[0]?.status).toBe('confirmado');
  });

  it('filtra por profesional (feliz)', async () => {
    await create();
    await create({ providerId: providerB, operatingUnitId: unit2, start: '2026-11-02T11:00:00.000Z' });

    const res = await request(app).get('/api/appointments').query({ providerId: providerB });

    expect(res.status).toBe(200);
    const body = res.body as AppointmentBody[];
    expect(body).toHaveLength(1);
  });

  it('excluye cancelados por defecto y los incluye con includeCancelled (borde)', async () => {
    const appointment = await create();
    await request(app).post(`/api/appointments/${appointment.id}/cancel`).send({ reason: 'falta' });

    const defaults = await request(app).get('/api/appointments');
    expect(defaults.body as AppointmentBody[]).toHaveLength(0);

    const all = await request(app).get('/api/appointments').query({ includeCancelled: 'true' });
    expect(all.body as AppointmentBody[]).toHaveLength(1);
  });

  it('devuelve 400 si date no tiene formato YYYY-MM-DD', async () => {
    const res = await request(app).get('/api/appointments').query({ date: '02/11/2026' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });
});

describe('GET /api/appointments/:id', () => {
  it('devuelve el turno existente con sus relaciones (feliz)', async () => {
    const appointment = await create();

    const res = await request(app).get(`/api/appointments/${appointment.id}`);

    expect(res.status).toBe(200);
    const body = res.body as AppointmentBody & { provider: { id: string } };
    expect(body.provider.id).toBe(providerA);
  });

  it('devuelve 404 si el turno no existe (error de negocio)', async () => {
    const res = await request(app).get('/api/appointments/no-existe');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('APPOINTMENT_NOT_FOUND');
  });
});

describe('PATCH /api/appointments/:id (reprogramar)', () => {
  it('mueve el turno, recalcula el fin y audita (feliz)', async () => {
    const appointment = await create();

    const res = await request(app)
      .patch(`/api/appointments/${appointment.id}`)
      .set('x-actor', 'secretaria.demo')
      .send({ start: '2026-11-02T12:00:00.000Z' });

    expect(res.status).toBe(200);
    const body = res.body as AppointmentBody;
    expect(body.start).toBe('2026-11-02T12:00:00.000Z');
    expect(new Date(body.end).getTime() - new Date(body.start).getTime()).toBe(30 * 60_000);

    const audit = await prisma.auditLog.findFirst({
      where: { entityId: appointment.id, action: 'update' },
    });
    expect(audit?.actor).toBe('secretaria.demo');
  });

  it('recalcula el fin con la duración del nuevo procedimiento (borde)', async () => {
    const appointment = await create();

    const res = await request(app)
      .patch(`/api/appointments/${appointment.id}`)
      .send({ procedureId: extraccion });

    expect(res.status).toBe(200);
    const body = res.body as AppointmentBody;
    expect(new Date(body.end).getTime() - new Date(body.start).getTime()).toBe(60 * 60_000);
  });

  it('rechaza mover a un horario solapado y deja intacto el turno (error de negocio)', async () => {
    await create();
    const target = await create({ start: '2026-11-02T13:00:00.000Z' });

    const res = await request(app)
      .patch(`/api/appointments/${target.id}`)
      .send({ start: '2026-11-02T10:15:00.000Z' });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('APPOINTMENT_OVERLAP');

    const stored = await prisma.appointment.findUniqueOrThrow({ where: { id: target.id } });
    expect(stored.start.toISOString()).toBe('2026-11-02T13:00:00.000Z');
  });

  it('rechaza reprogramar un turno cancelado (error de negocio)', async () => {
    const appointment = await create();
    await request(app).post(`/api/appointments/${appointment.id}/cancel`).send({});

    const res = await request(app)
      .patch(`/api/appointments/${appointment.id}`)
      .send({ start: '2026-11-02T14:00:00.000Z' });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('APPOINTMENT_CANCELLED');
  });

  it('devuelve 400 si no se envía ningún campo', async () => {
    const appointment = await create();
    const res = await request(app).patch(`/api/appointments/${appointment.id}`).send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });
});

describe('POST /api/appointments/:id/cancel', () => {
  it('cancela, guarda motivo y libera el slot para un turno nuevo (feliz + borde)', async () => {
    const appointment = await create();

    const res = await request(app)
      .post(`/api/appointments/${appointment.id}/cancel`)
      .set('x-actor', 'secretaria.demo')
      .send({ reason: 'El paciente avisó que no puede' });

    expect(res.status).toBe(200);
    const body = res.body as AppointmentBody;
    expect(body.status).toBe('cancelado');
    expect(body.cancelledAt).not.toBeNull();
    expect(body.cancelReason).toBe('El paciente avisó que no puede');

    const retry = await request(app).post('/api/appointments').send(payload());
    expect(retry.status).toBe(201);

    const audit = await prisma.auditLog.findFirst({
      where: { entityId: appointment.id, action: 'update' },
    });
    expect(audit).not.toBeNull();
  });

  it('rechaza cancelar dos veces (error de negocio)', async () => {
    const appointment = await create();
    await request(app).post(`/api/appointments/${appointment.id}/cancel`).send({}).expect(200);

    const res = await request(app).post(`/api/appointments/${appointment.id}/cancel`).send({});

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('APPOINTMENT_ALREADY_CANCELLED');
  });
});

describe('POST /api/appointments/:id/status', () => {
  it('recorre pendiente → confirmado → atendido (feliz)', async () => {
    const appointment = await create({ status: 'pendiente' });

    const confirmed = await request(app)
      .post(`/api/appointments/${appointment.id}/status`)
      .send({ status: 'confirmado' });
    expect(confirmed.status).toBe(200);
    expect((confirmed.body as AppointmentBody).status).toBe('confirmado');

    const attended = await request(app)
      .post(`/api/appointments/${appointment.id}/status`)
      .send({ status: 'atendido' });
    expect(attended.status).toBe(200);
    expect((attended.body as AppointmentBody).status).toBe('atendido');
  });

  it('rechaza una transición inválida (error de negocio)', async () => {
    const appointment = await create({ status: 'pendiente' });

    const res = await request(app)
      .post(`/api/appointments/${appointment.id}/status`)
      .send({ status: 'atendido' });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('INVALID_STATUS_TRANSITION');
  });

  it('rechaza cambiar el estado de un turno cancelado (borde)', async () => {
    const appointment = await create();
    await request(app).post(`/api/appointments/${appointment.id}/cancel`).send({});

    const res = await request(app)
      .post(`/api/appointments/${appointment.id}/status`)
      .send({ status: 'confirmado' });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('APPOINTMENT_CANCELLED');
  });
});
