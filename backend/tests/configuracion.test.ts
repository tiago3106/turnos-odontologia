import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/db';
import { resetDatabase } from './helpers/reset-db';

const app = createApp();

interface IdBody {
  id: string;
  isActive?: boolean;
  priceCents?: number;
}

let providerId = '';
let unitId = '';

beforeAll(async () => {
  await resetDatabase();
  await prisma.clinic.create({ data: { name: 'Clínica Test Configuración (ficticia)' } });
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.auditLog.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.providerSchedule.deleteMany();
  await prisma.procedure.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.operatingUnit.deleteMany();

  const clinic = await prisma.clinic.findFirstOrThrow({ where: { isActive: true } });
  const provider = await prisma.provider.create({
    data: { clinicId: clinic.id, name: 'Dra. Ana Ficticia' },
  });
  const unit = await prisma.operatingUnit.create({
    data: { clinicId: clinic.id, name: 'Sillón 1' },
  });
  providerId = provider.id;
  unitId = unit.id;
});

describe('Prestaciones', () => {
  it('crea una prestación con precio en centavos y registra auditoría', async () => {
    const res = await request(app)
      .post('/api/procedures')
      .set('x-actor', 'director.demo')
      .send({ code: 'CONS', name: 'Consulta', defaultDurationMin: 30, priceCents: 150000 });

    expect(res.status).toBe(201);
    const body = res.body as IdBody;
    expect(body.priceCents).toBe(150000);

    const audit = await prisma.auditLog.findFirst({ where: { entityId: body.id } });
    expect(audit?.entity).toBe('procedure');
    expect(audit?.action).toBe('create');
  });

  it('rechaza un código de prestación duplicado con 409', async () => {
    await request(app)
      .post('/api/procedures')
      .send({ code: 'CONS', name: 'Consulta', defaultDurationMin: 30, priceCents: 0 })
      .expect(201);

    const res = await request(app)
      .post('/api/procedures')
      .send({ code: 'CONS', name: 'Otra', defaultDurationMin: 20, priceCents: 0 });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('PROCEDURE_CODE_DUPLICATED');
  });

  it('rechaza una duración inválida', async () => {
    const res = await request(app)
      .post('/api/procedures')
      .send({ code: 'X', name: 'X', defaultDurationMin: 0, priceCents: 0 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });

  it('actualiza precio y deja snapshot before/after en auditoría', async () => {
    const created = await request(app)
      .post('/api/procedures')
      .send({ code: 'CONS', name: 'Consulta', defaultDurationMin: 30, priceCents: 100000 })
      .expect(201);
    const id = (created.body as IdBody).id;

    const res = await request(app).patch(`/api/procedures/${id}`).send({ priceCents: 120000 });

    expect(res.status).toBe(200);
    expect((res.body as IdBody).priceCents).toBe(120000);

    const audit = await prisma.auditLog.findFirst({
      where: { entityId: id, action: 'update' },
    });
    const before = audit?.before as Record<string, unknown> | null;
    const after = audit?.after as Record<string, unknown> | null;
    expect(before?.priceCents).toBe(100000);
    expect(after?.priceCents).toBe(120000);
  });

  it('el listado por defecto excluye prestaciones inactivas (borde)', async () => {
    const created = await request(app)
      .post('/api/procedures')
      .send({ code: 'CONS', name: 'Consulta', defaultDurationMin: 30, priceCents: 0 })
      .expect(201);
    const id = (created.body as IdBody).id;

    await request(app).patch(`/api/procedures/${id}`).send({ isActive: false }).expect(200);

    const active = await request(app).get('/api/procedures');
    expect((active.body as IdBody[]).some((procedure) => procedure.id === id)).toBe(false);

    const all = await request(app).get('/api/procedures').query({ includeInactive: 'true' });
    expect((all.body as IdBody[]).some((procedure) => procedure.id === id)).toBe(true);
  });
});

describe('Profesionales y sillones', () => {
  it('crea un profesional con color válido', async () => {
    const res = await request(app)
      .post('/api/providers')
      .send({ name: 'Dr. Luis Inventado', specialty: 'Ortodoncia', color: '#22AA66' });

    expect(res.status).toBe(201);
    expect((res.body as { specialty: string }).specialty).toBe('Ortodoncia');
  });

  it('rechaza un color inválido', async () => {
    const res = await request(app)
      .post('/api/providers')
      .send({ name: 'Dr. Luis Inventado', color: 'verde' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });

  it('crea un sillón y lo devuelve en /api/schedule/sills', async () => {
    const res = await request(app).post('/api/operating-units').send({ name: 'Sillón 2' });
    expect(res.status).toBe(201);

    const list = await request(app).get('/api/schedule/sills');
    expect((list.body as IdBody[]).some((unit) => unit.id === unitId)).toBe(true);
    expect((list.body as Array<{ name: string }>).some((unit) => unit.name === 'Sillón 2')).toBe(true);
  });
});

describe('Horarios del profesional', () => {
  it('crea un horario válido y lo expone en /api/schedule/providers', async () => {
    const res = await request(app)
      .post(`/api/schedule/providers/${providerId}/schedules`)
      .set('x-actor', 'director.demo')
      .send({ dayOfWeek: 1, startMinute: 540, endMinute: 720, intervalMin: 15 });

    expect(res.status).toBe(201);
    const body = res.body as IdBody;
    expect(body.id).toBeTruthy();

    const audit = await prisma.auditLog.findFirst({ where: { entityId: body.id } });
    expect(audit?.entity).toBe('provider_schedule');

    const providers = await request(app).get('/api/schedule/providers');
    const found = (providers.body as Array<{ id: string; schedules: unknown[] }>).find(
      (provider) => provider.id === providerId,
    );
    expect(found?.schedules).toHaveLength(1);
  });

  it('rechaza un horario solapado del mismo profesional y día con 409', async () => {
    await request(app)
      .post(`/api/schedule/providers/${providerId}/schedules`)
      .send({ dayOfWeek: 1, startMinute: 540, endMinute: 720, intervalMin: 15 })
      .expect(201);

    const res = await request(app)
      .post(`/api/schedule/providers/${providerId}/schedules`)
      .send({ dayOfWeek: 1, startMinute: 600, endMinute: 780, intervalMin: 15 });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('PROVIDER_SCHEDULE_OVERLAP');
    expect(await prisma.providerSchedule.count()).toBe(1);
  });

  it('permite horarios contiguos (fin == inicio siguiente) (borde)', async () => {
    await request(app)
      .post(`/api/schedule/providers/${providerId}/schedules`)
      .send({ dayOfWeek: 1, startMinute: 540, endMinute: 720, intervalMin: 15 })
      .expect(201);

    const res = await request(app)
      .post(`/api/schedule/providers/${providerId}/schedules`)
      .send({ dayOfWeek: 1, startMinute: 720, endMinute: 900, intervalMin: 15 });

    expect(res.status).toBe(201);
  });

  it('rechaza un rango inválido', async () => {
    const res = await request(app)
      .post(`/api/schedule/providers/${providerId}/schedules`)
      .send({ dayOfWeek: 1, startMinute: 720, endMinute: 540, intervalMin: 15 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });

  it('devuelve 404 si el profesional no existe', async () => {
    const res = await request(app)
      .post('/api/schedule/providers/no-existe/schedules')
      .send({ dayOfWeek: 1, startMinute: 540, endMinute: 720, intervalMin: 15 });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('PROVIDER_NOT_FOUND');
  });

  it('la base de datos rechaza el solape aunque se saltee el servicio', async () => {
    await request(app)
      .post(`/api/schedule/providers/${providerId}/schedules`)
      .send({ dayOfWeek: 2, startMinute: 540, endMinute: 720, intervalMin: 15 })
      .expect(201);

    await expect(
      prisma.providerSchedule.create({
        data: { providerId, dayOfWeek: 2, startMinute: 600, endMinute: 780, intervalMin: 15 },
      }),
    ).rejects.toThrow();
  });
});
