import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/db';
import { resetDatabase } from './helpers/reset-db';

const app = createApp();

interface PatientBody {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  dni: string | null;
  isActive: boolean;
}

beforeAll(async () => {
  await resetDatabase();
  await prisma.clinic.create({ data: { name: 'Clínica Test Pacientes (ficticia)' } });
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.auditLog.deleteMany();
  await prisma.patient.deleteMany();
});

function payload(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    name: 'Paciente Ficticio A',
    phone: '1100000001',
    dni: '30111222',
    ...overrides,
  };
}

describe('POST /api/patients', () => {
  it('alta con nombre y teléfono responde 201 y registra auditoría create', async () => {
    const res = await request(app)
      .post('/api/patients')
      .set('x-actor', 'secretaria.demo')
      .send(payload());

    expect(res.status).toBe(201);
    const body = res.body as PatientBody;
    expect(body.name).toBe('Paciente Ficticio A');
    expect(body.isActive).toBe(true);

    const audit = await prisma.auditLog.findFirst({ where: { entityId: body.id } });
    expect(audit?.entity).toBe('patient');
    expect(audit?.action).toBe('create');
    expect(audit?.actor).toBe('secretaria.demo');
  });

  it('rechaza el alta sin teléfono ni email (RN-PA-01) sin persistir ni auditar', async () => {
    const res = await request(app)
      .post('/api/patients')
      .send({ name: 'Paciente Ficticio B' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
    expect(await prisma.patient.count()).toBe(0);
    expect(await prisma.auditLog.count()).toBe(0);
  });

  it('acepta alta solo con email (borde)', async () => {
    const res = await request(app)
      .post('/api/patients')
      .send({ name: 'Paciente Ficticio C', email: 'ficticio@example.com' });

    expect(res.status).toBe(201);
    const body = res.body as PatientBody;
    expect(body.phone).toBeNull();
    expect(body.email).toBe('ficticio@example.com');
  });

  it('rechaza DNI duplicado en la misma clínica con 409', async () => {
    await request(app).post('/api/patients').send(payload()).expect(201);

    const res = await request(app)
      .post('/api/patients')
      .send(payload({ name: 'Paciente Ficticio D' }));

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('PATIENT_DNI_DUPLICATED');
    expect(await prisma.patient.count()).toBe(1);
  });
});

describe('GET /api/patients', () => {
  it('consulta por id existente', async () => {
    const created = await request(app).post('/api/patients').send(payload()).expect(201);
    const id = (created.body as PatientBody).id;

    const res = await request(app).get(`/api/patients/${id}`);

    expect(res.status).toBe(200);
    expect((res.body as PatientBody).phone).toBe('1100000001');
  });

  it('devuelve 404 para un id inexistente', async () => {
    const res = await request(app).get('/api/patients/no-existe');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('PATIENT_NOT_FOUND');
  });

  it('busca de forma parcial e insensible a mayúsculas (borde)', async () => {
    await request(app).post('/api/patients').send(payload()).expect(201);
    await request(app)
      .post('/api/patients')
      .send({ name: 'Otro Paciente Distinto', phone: '1100000002', dni: '30999888' })
      .expect(201);

    const res = await request(app).get('/api/patients').query({ q: 'ficticio' });

    expect(res.status).toBe(200);
    const body = res.body as PatientBody[];
    expect(body).toHaveLength(1);
    expect(body[0]?.name).toBe('Paciente Ficticio A');
  });
});

describe('PATCH /api/patients/:id', () => {
  it('edita el teléfono y registra auditoría update con before/after', async () => {
    const created = await request(app).post('/api/patients').send(payload()).expect(201);
    const id = (created.body as PatientBody).id;

    const res = await request(app)
      .patch(`/api/patients/${id}`)
      .set('x-actor', 'secretaria.demo')
      .send({ phone: '1100000099' });

    expect(res.status).toBe(200);
    expect((res.body as PatientBody).phone).toBe('1100000099');

    const audit = await prisma.auditLog.findFirst({
      where: { entityId: id, action: 'update' },
    });
    const before = audit?.before as Record<string, unknown> | null;
    const after = audit?.after as Record<string, unknown> | null;
    expect(before?.phone).toBe('1100000001');
    expect(after?.phone).toBe('1100000099');
  });

  it('rechaza dejar al paciente sin teléfono ni email (RN-PA-01)', async () => {
    const created = await request(app).post('/api/patients').send(payload()).expect(201);
    const id = (created.body as PatientBody).id;

    const res = await request(app).patch(`/api/patients/${id}`).send({ phone: null });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
    const patient = await prisma.patient.findUnique({ where: { id } });
    expect(patient?.phone).toBe('1100000001');
  });

  it('rechaza un body vacío', async () => {
    const created = await request(app).post('/api/patients').send(payload()).expect(201);
    const id = (created.body as PatientBody).id;

    const res = await request(app).patch(`/api/patients/${id}`).send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });

  it('baja lógica: desaparece del listado por defecto (borde)', async () => {
    const created = await request(app).post('/api/patients').send(payload()).expect(201);
    const id = (created.body as PatientBody).id;

    await request(app).patch(`/api/patients/${id}`).send({ isActive: false }).expect(200);

    const active = await request(app).get('/api/patients');
    expect((active.body as PatientBody[]).some((patient) => patient.id === id)).toBe(false);

    const all = await request(app).get('/api/patients').query({ includeInactive: 'true' });
    expect((all.body as PatientBody[]).some((patient) => patient.id === id)).toBe(true);
  });

  it('devuelve 404 al editar un id inexistente', async () => {
    const res = await request(app).patch('/api/patients/no-existe').send({ name: 'X' });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('PATIENT_NOT_FOUND');
  });
});
