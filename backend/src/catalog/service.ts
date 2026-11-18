import { OperatingUnit, Prisma, Procedure, Provider, ProviderSchedule } from '@prisma/client';
import { prisma } from '../db';
import { ApiError } from '../errors';
import { resolveActiveClinicId } from '../clinic';
import { ActorContext, recordAudit } from '../audit';

export interface CreateProcedureInput {
  code: string;
  name: string;
  defaultDurationMin: number;
  priceCents: number;
}

export interface UpdateProcedureInput {
  name?: string;
  defaultDurationMin?: number;
  priceCents?: number;
  isActive?: boolean;
}

export interface CreateProviderInput {
  name: string;
  specialty?: string | null;
  color?: string | null;
}

export interface UpdateProviderInput {
  name?: string;
  specialty?: string | null;
  color?: string | null;
  isActive?: boolean;
}

export interface CreateOperatingUnitInput {
  name: string;
}

export interface UpdateOperatingUnitInput {
  name?: string;
  isActive?: boolean;
}

export interface CreateProviderScheduleInput {
  dayOfWeek: number;
  startMinute: number;
  endMinute: number;
  intervalMin: number;
}

function procedureSnapshot(procedure: Procedure): Record<string, unknown> {
  return {
    id: procedure.id,
    code: procedure.code,
    name: procedure.name,
    defaultDurationMin: procedure.defaultDurationMin,
    priceCents: procedure.priceCents,
    isActive: procedure.isActive,
  };
}

function providerSnapshot(provider: Provider): Record<string, unknown> {
  return {
    id: provider.id,
    name: provider.name,
    specialty: provider.specialty,
    color: provider.color,
    isActive: provider.isActive,
  };
}

function unitSnapshot(unit: OperatingUnit): Record<string, unknown> {
  return { id: unit.id, name: unit.name, isActive: unit.isActive };
}

function scheduleSnapshot(schedule: ProviderSchedule): Record<string, unknown> {
  return {
    id: schedule.id,
    providerId: schedule.providerId,
    dayOfWeek: schedule.dayOfWeek,
    startMinute: schedule.startMinute,
    endMinute: schedule.endMinute,
    intervalMin: schedule.intervalMin,
  };
}

function isScheduleOverlap(error: unknown): boolean {
  if (error === null || typeof error !== 'object') return false;
  const e = error as {
    code?: unknown;
    message?: unknown;
    meta?: { message?: unknown; constraint?: unknown };
  };
  const haystack = [e.code, e.message, e.meta?.message, e.meta?.constraint]
    .filter((value): value is string => typeof value === 'string')
    .join(' ');
  return haystack.includes('23P01') || haystack.includes('provider_schedule_no_overlap');
}

export async function listProcedures(includeInactive = false): Promise<Procedure[]> {
  const clinicId = await resolveActiveClinicId();
  return prisma.procedure.findMany({
    where: { clinicId, ...(includeInactive ? {} : { isActive: true }) },
    orderBy: { name: 'asc' },
  });
}

export async function createProcedure(
  input: CreateProcedureInput,
  ctx: ActorContext = {},
): Promise<Procedure> {
  const clinicId = await resolveActiveClinicId();
  try {
    return await prisma.$transaction(async (tx) => {
      const procedure = await tx.procedure.create({
        data: {
          clinicId,
          code: input.code,
          name: input.name,
          defaultDurationMin: input.defaultDurationMin,
          priceCents: input.priceCents,
        },
      });
      await recordAudit(tx, {
        clinicId,
        entity: 'procedure',
        entityId: procedure.id,
        action: 'create',
        after: procedureSnapshot(procedure),
        actor: ctx.actor,
        ip: ctx.ip,
      });
      return procedure;
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ApiError(409, 'PROCEDURE_CODE_DUPLICATED', 'Ya existe una prestación con ese código');
    }
    throw error;
  }
}

export async function updateProcedure(
  id: string,
  input: UpdateProcedureInput,
  ctx: ActorContext = {},
): Promise<Procedure> {
  const clinicId = await resolveActiveClinicId();
  const existing = await prisma.procedure.findFirst({ where: { id, clinicId } });
  if (!existing) {
    throw new ApiError(404, 'PROCEDURE_NOT_FOUND', 'Prestación inexistente');
  }

  const data: Prisma.ProcedureUpdateInput = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.defaultDurationMin !== undefined) data.defaultDurationMin = input.defaultDurationMin;
  if (input.priceCents !== undefined) data.priceCents = input.priceCents;
  if (input.isActive !== undefined) data.isActive = input.isActive;

  return prisma.$transaction(async (tx) => {
    const procedure = await tx.procedure.update({ where: { id: existing.id }, data });
    await recordAudit(tx, {
      clinicId,
      entity: 'procedure',
      entityId: procedure.id,
      action: 'update',
      before: procedureSnapshot(existing),
      after: procedureSnapshot(procedure),
      actor: ctx.actor,
      ip: ctx.ip,
    });
    return procedure;
  });
}

export async function listProviders(includeInactive = false): Promise<Provider[]> {
  const clinicId = await resolveActiveClinicId();
  return prisma.provider.findMany({
    where: { clinicId, ...(includeInactive ? {} : { isActive: true }) },
    orderBy: { name: 'asc' },
  });
}

export async function createProvider(
  input: CreateProviderInput,
  ctx: ActorContext = {},
): Promise<Provider> {
  const clinicId = await resolveActiveClinicId();
  return prisma.$transaction(async (tx) => {
    const provider = await tx.provider.create({
      data: {
        clinicId,
        name: input.name,
        specialty: input.specialty ?? null,
        color: input.color ?? null,
      },
    });
    await recordAudit(tx, {
      clinicId,
      entity: 'provider',
      entityId: provider.id,
      action: 'create',
      after: providerSnapshot(provider),
      actor: ctx.actor,
      ip: ctx.ip,
    });
    return provider;
  });
}

export async function updateProvider(
  id: string,
  input: UpdateProviderInput,
  ctx: ActorContext = {},
): Promise<Provider> {
  const clinicId = await resolveActiveClinicId();
  const existing = await prisma.provider.findFirst({ where: { id, clinicId } });
  if (!existing) {
    throw new ApiError(404, 'PROVIDER_NOT_FOUND', 'Profesional inexistente');
  }

  const data: Prisma.ProviderUpdateInput = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.specialty !== undefined) data.specialty = input.specialty;
  if (input.color !== undefined) data.color = input.color;
  if (input.isActive !== undefined) data.isActive = input.isActive;

  return prisma.$transaction(async (tx) => {
    const provider = await tx.provider.update({ where: { id: existing.id }, data });
    await recordAudit(tx, {
      clinicId,
      entity: 'provider',
      entityId: provider.id,
      action: 'update',
      before: providerSnapshot(existing),
      after: providerSnapshot(provider),
      actor: ctx.actor,
      ip: ctx.ip,
    });
    return provider;
  });
}

export async function listOperatingUnits(includeInactive = false): Promise<OperatingUnit[]> {
  const clinicId = await resolveActiveClinicId();
  return prisma.operatingUnit.findMany({
    where: { clinicId, ...(includeInactive ? {} : { isActive: true }) },
    orderBy: { name: 'asc' },
  });
}

export async function createOperatingUnit(
  input: CreateOperatingUnitInput,
  ctx: ActorContext = {},
): Promise<OperatingUnit> {
  const clinicId = await resolveActiveClinicId();
  return prisma.$transaction(async (tx) => {
    const unit = await tx.operatingUnit.create({ data: { clinicId, name: input.name } });
    await recordAudit(tx, {
      clinicId,
      entity: 'operating_unit',
      entityId: unit.id,
      action: 'create',
      after: unitSnapshot(unit),
      actor: ctx.actor,
      ip: ctx.ip,
    });
    return unit;
  });
}

export async function updateOperatingUnit(
  id: string,
  input: UpdateOperatingUnitInput,
  ctx: ActorContext = {},
): Promise<OperatingUnit> {
  const clinicId = await resolveActiveClinicId();
  const existing = await prisma.operatingUnit.findFirst({ where: { id, clinicId } });
  if (!existing) {
    throw new ApiError(404, 'OPERATING_UNIT_NOT_FOUND', 'Sillón inexistente');
  }

  const data: Prisma.OperatingUnitUpdateInput = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.isActive !== undefined) data.isActive = input.isActive;

  return prisma.$transaction(async (tx) => {
    const unit = await tx.operatingUnit.update({ where: { id: existing.id }, data });
    await recordAudit(tx, {
      clinicId,
      entity: 'operating_unit',
      entityId: unit.id,
      action: 'update',
      before: unitSnapshot(existing),
      after: unitSnapshot(unit),
      actor: ctx.actor,
      ip: ctx.ip,
    });
    return unit;
  });
}

async function findProviderInClinic(id: string): Promise<Provider> {
  const clinicId = await resolveActiveClinicId();
  const provider = await prisma.provider.findFirst({ where: { id, clinicId } });
  if (!provider) {
    throw new ApiError(404, 'PROVIDER_NOT_FOUND', 'Profesional inexistente');
  }
  return provider;
}

export async function listProviderSchedules(providerId: string): Promise<ProviderSchedule[]> {
  await findProviderInClinic(providerId);
  return prisma.providerSchedule.findMany({
    where: { providerId },
    orderBy: [{ dayOfWeek: 'asc' }, { startMinute: 'asc' }],
  });
}

export async function listProvidersWithSchedules(): Promise<
  Array<Provider & { schedules: ProviderSchedule[] }>
> {
  const clinicId = await resolveActiveClinicId();
  return prisma.provider.findMany({
    where: { clinicId, isActive: true },
    include: { schedules: { orderBy: [{ dayOfWeek: 'asc' }, { startMinute: 'asc' }] } },
    orderBy: { name: 'asc' },
  });
}

export async function createProviderSchedule(
  providerId: string,
  input: CreateProviderScheduleInput,
  ctx: ActorContext = {},
): Promise<ProviderSchedule> {
  const clinicId = await resolveActiveClinicId();
  await findProviderInClinic(providerId);

  const sameDay = await prisma.providerSchedule.findMany({
    where: { providerId, dayOfWeek: input.dayOfWeek },
  });
  const overlaps = sameDay.some(
    (schedule) => input.startMinute < schedule.endMinute && input.endMinute > schedule.startMinute,
  );
  if (overlaps) {
    throw new ApiError(
      409,
      'PROVIDER_SCHEDULE_OVERLAP',
      'El horario se superpone con otro del mismo profesional y día',
    );
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const schedule = await tx.providerSchedule.create({
        data: {
          providerId,
          dayOfWeek: input.dayOfWeek,
          startMinute: input.startMinute,
          endMinute: input.endMinute,
          intervalMin: input.intervalMin,
        },
      });
      await recordAudit(tx, {
        clinicId,
        entity: 'provider_schedule',
        entityId: schedule.id,
        action: 'create',
        after: scheduleSnapshot(schedule),
        actor: ctx.actor,
        ip: ctx.ip,
      });
      return schedule;
    });
  } catch (error) {
    if (isScheduleOverlap(error)) {
      throw new ApiError(
        409,
        'PROVIDER_SCHEDULE_OVERLAP',
        'El horario se superpone con otro del mismo profesional y día',
      );
    }
    throw error;
  }
}
