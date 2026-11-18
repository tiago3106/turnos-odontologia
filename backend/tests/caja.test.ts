import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/db';
import { resetDatabase } from './helpers/reset-db';

const app = createApp();

let appointmentId = '';
let patientId = '';
let providerId = '';

interface PaymentBody {
  id: string;
  status: string;
  amountCents: number;
  createdBy: string;
  annulledAt: string | null;
  annulReason: string | null;
}

function payload(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    appointmentId,
    type: 'turno',
    method: 'efectivo',
    amountCents: 500000,
    ...overrides,
  };
}

async function createPayment(overrides: Record<string, unknown> = {}): Promise<PaymentBody> {
  const res = await request(app).post('/api/payments').send(payload(overrides));
  expect(res.status).toBe(201);
  return res.body as PaymentBody;
}

function todayBuenosAires(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(new Date());
}

beforeAll(async () => {
  await resetDatabase();
  const clinic = await prisma.clinic.create({ data: { name: 'Clínica Test Caja (ficticia)' } });
  const provider = await prisma.provider.create({
    data: { clinicId: clinic.id, name: 'Dra. Ana Ficticia' },
  });
  const unit = await prisma.operatingUnit.create({
    data: { clinicId: clinic.id, name: 'Sillón 1' },
  });
  const procedure = await prisma.procedure.create({
    data: { clinicId: clinic.id, code: 'CONS', name: 'Consulta', defaultDurationMin: 60, priceCents: 500000 },
  });
  const patient = await prisma.patient.create({
    data: { clinicId: clinic.id, name: 'Paciente Ficticio', phone: '000-0000' },
  });
  const start = new Date('2026-11-02T13:00:00.000Z');
  const appointment = await prisma.appointment.create({
    data: {
      clinicId: clinic.id,
      providerId: provider.id,
      operatingUnitId: unit.id,
      procedureId: procedure.id,
      patientName: patient.name,
      start,
      end: new Date(start.getTime() + 60 * 60_000),
    },
  });

  appointmentId = appointment.id;
  patientId = patient.id;
  providerId = provider.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.auditLog.deleteMany();
  await prisma.payment.deleteMany();
});

describe('POST /api/payments', () => {
  it('registra un cobro de turno en efectivo y audita (feliz)', async () => {
    const res = await request(app)
      .post('/api/payments')
      .set('x-actor', 'secretaria.demo')
      .send(payload());

    expect(res.status).toBe(201);
    const body = res.body as PaymentBody;
    expect(body.status).toBe('registrado');
    expect(body.amountCents).toBe(500000);
    expect(body.createdBy).toBe('secretaria.demo');

    const audit = await prisma.auditLog.findFirst({ where: { entityId: body.id } });
    expect(audit?.entity).toBe('payment');
    expect(audit?.action).toBe('create');
    expect(audit?.actor).toBe('secretaria.demo');
  });

  it('registra una seña por MercadoPago con referencia externa (feliz)', async () => {
    const res = await request(app)
      .post('/api/payments')
      .send(payload({ type: 'sena', method: 'mercadopago', amountCents: 150000, externalId: 'mp-ficticio-001' }));

    expect(res.status).toBe(201);
    expect((res.body as PaymentBody).status).toBe('registrado');
  });

  it('rechaza un monto no positivo (error de negocio)', async () => {
    const res = await request(app).post('/api/payments').send(payload({ amountCents: 0 }));

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });

  it('rechaza una seña sin turno asociado (error de negocio)', async () => {
    const res = await request(app)
      .post('/api/payments')
      .send({ patientId, type: 'sena', method: 'efectivo', amountCents: 100000 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });

  it('rechaza un turno inexistente (error de negocio)', async () => {
    const res = await request(app).post('/api/payments').send(payload({ appointmentId: 'no-existe' }));

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('APPOINTMENT_NOT_FOUND');
  });

  it('rechaza un paciente inexistente (error de negocio)', async () => {
    const res = await request(app)
      .post('/api/payments')
      .send({ patientId: 'no-existe', type: 'turno', method: 'efectivo', amountCents: 100000 });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('PATIENT_NOT_FOUND');
  });
});

describe('GET /api/payments', () => {
  it('filtra por turno (feliz)', async () => {
    const payment = await createPayment();
    await createPayment({ appointmentId: undefined, patientId, amountCents: 100000 });

    const res = await request(app).get('/api/payments').query({ appointmentId });

    expect(res.status).toBe(200);
    const body = res.body as PaymentBody[];
    expect(body).toHaveLength(1);
    expect(body[0]?.id).toBe(payment.id);
  });

  it('excluye anulados por defecto y los incluye con includeAnnulled (borde)', async () => {
    const payment = await createPayment();
    await request(app).post(`/api/payments/${payment.id}/annul`).send({ reason: 'error de cobro' });

    const defaults = await request(app).get('/api/payments');
    expect(defaults.body as PaymentBody[]).toHaveLength(0);

    const all = await request(app).get('/api/payments').query({ includeAnnulled: 'true' });
    expect(all.body as PaymentBody[]).toHaveLength(1);
  });

  it('filtra por el día del consultorio (borde)', async () => {
    await createPayment();

    const res = await request(app).get('/api/payments').query({ date: todayBuenosAires() });

    expect(res.status).toBe(200);
    expect((res.body as PaymentBody[]).length).toBeGreaterThanOrEqual(1);
  });
});

describe('POST /api/payments/:id/annul', () => {
  it('anula con motivo y deja trazabilidad (feliz)', async () => {
    const payment = await createPayment();

    const res = await request(app)
      .post(`/api/payments/${payment.id}/annul`)
      .set('x-actor', 'director.demo')
      .send({ reason: 'Paciente desistió' });

    expect(res.status).toBe(200);
    const body = res.body as PaymentBody;
    expect(body.status).toBe('anulado');
    expect(body.annulledAt).not.toBeNull();
    expect(body.annulReason).toBe('Paciente desistió');

    const audit = await prisma.auditLog.findFirst({
      where: { entityId: payment.id, action: 'update' },
    });
    const after = audit?.after as Record<string, unknown> | null;
    expect(after?.status).toBe('anulado');
    expect(audit?.actor).toBe('director.demo');
  });

  it('rechaza anular dos veces (error de negocio)', async () => {
    const payment = await createPayment();
    await request(app).post(`/api/payments/${payment.id}/annul`).send({}).expect(200);

    const res = await request(app).post(`/api/payments/${payment.id}/annul`).send({});

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('PAYMENT_ALREADY_ANNULLED');
  });
});

describe('GET /api/cash/close', () => {
  it('cierra caja por medio y profesional, sin contar anulados (feliz + borde)', async () => {
    await createPayment({ amountCents: 500000, method: 'efectivo' });
    await createPayment({ amountCents: 150000, method: 'mercadopago', type: 'sena' });
    const annulled = await createPayment({ amountCents: 90000, method: 'tarjeta' });
    await request(app).post(`/api/payments/${annulled.id}/annul`).send({ reason: 'error' });

    const res = await request(app).get('/api/cash/close').query({ date: todayBuenosAires() });

    expect(res.status).toBe(200);
    const body = res.body as {
      totalCents: number;
      count: number;
      byMethod: Array<{ method: string; totalCents: number; count: number }>;
      byProvider: Array<{ providerId: string | null; providerName: string; totalCents: number }>;
    };
    expect(body.totalCents).toBe(650000);
    expect(body.count).toBe(2);
    expect(body.byMethod).toHaveLength(2);
    expect(body.byMethod.find((group) => group.method === 'efectivo')?.totalCents).toBe(500000);
    expect(body.byProvider).toHaveLength(1);
    expect(body.byProvider[0]?.providerId).toBe(providerId);
    expect(body.byProvider[0]?.totalCents).toBe(650000);
  });

  it('devuelve una caja vacía si no hubo cobros (borde)', async () => {
    const res = await request(app).get('/api/cash/close').query({ date: '2020-01-01' });

    expect(res.status).toBe(200);
    expect(res.body.totalCents).toBe(0);
    expect(res.body.count).toBe(0);
  });

  it('rechaza una fecha con formato inválido (error de negocio)', async () => {
    const res = await request(app).get('/api/cash/close').query({ date: '2026/11/02' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });
});
