import { Appointment, Prisma } from '@prisma/client';
import { prisma } from '../db';
import { ApiError, isOverlapError } from '../errors';
import { resolveActiveClinicId } from '../clinic';
import { ActorContext, recordAudit } from '../audit';
import { dayRange } from '../dates';

export const APPOINTMENT_STATUSES = [
  'pendiente',
  'confirmado',
  'atendido',
  'ausente',
  'cancelado',
] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

const SCHEDULABLE_STATUSES: AppointmentStatus[] = ['pendiente', 'confirmado'];

const ALLOWED_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  pendiente: ['confirmado', 'ausente'],
  confirmado: ['atendido', 'ausente'],
  atendido: [],
  ausente: [],
  cancelado: [],
};

const appointmentInclude = {
  provider: { select: { id: true, name: true, color: true } },
  operatingUnit: { select: { id: true, name: true } },
  procedure: {
    select: { id: true, code: true, name: true, defaultDurationMin: true, priceCents: true },
  },
  patient: { select: { id: true, name: true } },
} satisfies Prisma.AppointmentInclude;

export type AppointmentWithRelations = Prisma.AppointmentGetPayload<{
  include: typeof appointmentInclude;
}>;

export interface CreateAppointmentInput {
  providerId: string;
  operatingUnitId: string;
  procedureId: string;
  patientName: string;
  patientId?: string;
  start: string;
  status?: 'pendiente' | 'confirmado';
}

export interface ListAppointmentsFilters {
  date?: string;
  from?: string;
  to?: string;
  providerId?: string;
  operatingUnitId?: string;
  status?: AppointmentStatus;
  includeCancelled?: boolean;
  limit?: number;
}

export interface MoveAppointmentInput {
  start?: string;
  providerId?: string;
  operatingUnitId?: string;
  procedureId?: string;
  patientName?: string;
  patientId?: string;
}

function appointmentSnapshot(appointment: Appointment): Record<string, unknown> {
  return {
    id: appointment.id,
    providerId: appointment.providerId,
    operatingUnitId: appointment.operatingUnitId,
    procedureId: appointment.procedureId,
    patientName: appointment.patientName,
    patientId: appointment.patientId,
    start: appointment.start,
    end: appointment.end,
    status: appointment.status,
    cancelledAt: appointment.cancelledAt,
    cancelReason: appointment.cancelReason,
  };
}

function parseStart(value: string): Date {
  const start = new Date(value);
  if (Number.isNaN(start.getTime())) {
    throw new ApiError(400, 'INVALID_START', 'start debe ser una fecha ISO-8601 válida');
  }
  return start;
}

function parseTimestamp(value: string, field: string): Date {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new ApiError(400, 'INVALID_DATE', `${field} debe ser una fecha ISO-8601 válida`);
  }
  return date;
}

async function findAppointmentInClinic(clinicId: string, id: string): Promise<Appointment> {
  const appointment = await prisma.appointment.findFirst({ where: { id, clinicId } });
  if (!appointment) {
    throw new ApiError(404, 'APPOINTMENT_NOT_FOUND', 'Turno inexistente');
  }
  return appointment;
}

async function resolveProcedure(clinicId: string, procedureId: string) {
  const procedure = await prisma.procedure.findFirst({ where: { id: procedureId, clinicId } });
  if (!procedure) {
    throw new ApiError(404, 'PROCEDURE_NOT_FOUND', 'procedureId inexistente');
  }
  return procedure;
}

async function resolveProvider(clinicId: string, providerId: string) {
  const provider = await prisma.provider.findFirst({ where: { id: providerId, clinicId } });
  if (!provider) {
    throw new ApiError(404, 'PROVIDER_NOT_FOUND', 'providerId inexistente');
  }
  return provider;
}

async function resolveOperatingUnit(clinicId: string, operatingUnitId: string) {
  const unit = await prisma.operatingUnit.findFirst({
    where: { id: operatingUnitId, clinicId },
  });
  if (!unit) {
    throw new ApiError(404, 'OPERATING_UNIT_NOT_FOUND', 'operatingUnitId inexistente');
  }
  return unit;
}

async function resolvePatient(clinicId: string, patientId: string) {
  const patient = await prisma.patient.findFirst({
    where: { id: patientId, clinicId, isActive: true },
  });
  if (!patient) {
    throw new ApiError(404, 'PATIENT_NOT_FOUND', 'patientId inexistente o inactivo');
  }
  return patient;
}

function resolveEnd(start: Date, defaultDurationMin: number): Date {
  return new Date(start.getTime() + defaultDurationMin * 60_000);
}

function mapWriteError(error: unknown): never {
  if (isOverlapError(error)) {
    throw new ApiError(
      409,
      'APPOINTMENT_OVERLAP',
      'El profesional o el sillón ya tienen un turno solapado en ese horario',
    );
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
    throw new ApiError(400, 'INVALID_REFERENCE', 'Referencia inexistente en la solicitud');
  }
  throw error;
}

export async function createAppointment(
  input: CreateAppointmentInput,
): Promise<AppointmentWithRelations> {
  const start = parseStart(input.start);
  const clinicId = await resolveActiveClinicId();

  const procedure = await resolveProcedure(clinicId, input.procedureId);
  await resolveProvider(clinicId, input.providerId);
  await resolveOperatingUnit(clinicId, input.operatingUnitId);
  const patient = input.patientId ? await resolvePatient(clinicId, input.patientId) : undefined;

  try {
    return await prisma.appointment.create({
      data: {
        clinicId,
        providerId: input.providerId,
        operatingUnitId: input.operatingUnitId,
        procedureId: input.procedureId,
        patientName: patient?.name ?? input.patientName,
        patientId: patient?.id,
        start,
        end: resolveEnd(start, procedure.defaultDurationMin),
        status: input.status ?? 'confirmado',
      },
      include: appointmentInclude,
    });
  } catch (error) {
    mapWriteError(error);
  }
}

export async function listAppointments(
  filters: ListAppointmentsFilters = {},
): Promise<AppointmentWithRelations[]> {
  const clinicId = await resolveActiveClinicId();
  const where: Prisma.AppointmentWhereInput = { clinicId };

  if (filters.providerId) where.providerId = filters.providerId;
  if (filters.operatingUnitId) where.operatingUnitId = filters.operatingUnitId;
  if (filters.status) where.status = filters.status;
  else if (!filters.includeCancelled) where.status = { not: 'cancelado' };

  if (filters.date) {
    const { start, end } = dayRange(filters.date);
    where.start = { gte: start, lt: end };
  } else if (filters.from || filters.to) {
    const range: Prisma.DateTimeFilter = {};
    if (filters.from) range.gte = parseTimestamp(filters.from, 'from');
    if (filters.to) range.lt = parseTimestamp(filters.to, 'to');
    where.start = range;
  }

  const take = Math.min(Math.max(filters.limit ?? 200, 1), 500);

  return prisma.appointment.findMany({
    where,
    include: appointmentInclude,
    orderBy: { start: 'asc' },
    take,
  });
}

export async function getAppointment(id: string): Promise<AppointmentWithRelations> {
  const clinicId = await resolveActiveClinicId();
  const appointment = await prisma.appointment.findFirst({
    where: { id, clinicId },
    include: appointmentInclude,
  });
  if (!appointment) {
    throw new ApiError(404, 'APPOINTMENT_NOT_FOUND', 'Turno inexistente');
  }
  return appointment;
}

export async function moveAppointment(
  id: string,
  input: MoveAppointmentInput,
  ctx: ActorContext = {},
): Promise<AppointmentWithRelations> {
  const clinicId = await resolveActiveClinicId();
  const existing = await findAppointmentInClinic(clinicId, id);

  if (existing.status === 'cancelado') {
    throw new ApiError(409, 'APPOINTMENT_CANCELLED', 'No se puede reprogramar un turno cancelado');
  }

  const procedureId = input.procedureId ?? existing.procedureId;
  const providerId = input.providerId ?? existing.providerId;
  const operatingUnitId = input.operatingUnitId ?? existing.operatingUnitId;

  if (input.procedureId) await resolveProcedure(clinicId, procedureId);
  if (input.providerId) await resolveProvider(clinicId, providerId);
  if (input.operatingUnitId) await resolveOperatingUnit(clinicId, operatingUnitId);
  const patient = input.patientId ? await resolvePatient(clinicId, input.patientId) : undefined;

  const procedure = await resolveProcedure(clinicId, procedureId);
  const start = input.start ? parseStart(input.start) : existing.start;

  try {
    return await prisma.$transaction(async (tx) => {
      const updated = await tx.appointment.update({
        where: { id: existing.id },
        data: {
          providerId,
          operatingUnitId,
          procedureId,
          patientName: patient?.name ?? input.patientName ?? existing.patientName,
          patientId: input.patientId ? patient?.id : existing.patientId,
          start,
          end: resolveEnd(start, procedure.defaultDurationMin),
        },
      });
      await recordAudit(tx, {
        clinicId,
        entity: 'appointment',
        entityId: updated.id,
        action: 'update',
        before: appointmentSnapshot(existing),
        after: appointmentSnapshot(updated),
        actor: ctx.actor,
        ip: ctx.ip,
      });
      return tx.appointment.findUniqueOrThrow({
        where: { id: updated.id },
        include: appointmentInclude,
      });
    });
  } catch (error) {
    mapWriteError(error);
  }
}

export async function cancelAppointment(
  id: string,
  reason: string | undefined,
  ctx: ActorContext = {},
): Promise<AppointmentWithRelations> {
  const clinicId = await resolveActiveClinicId();
  const existing = await findAppointmentInClinic(clinicId, id);

  if (existing.status === 'cancelado') {
    throw new ApiError(409, 'APPOINTMENT_ALREADY_CANCELLED', 'El turno ya está cancelado');
  }

  return prisma.$transaction(async (tx) => {
    const cancelled = await tx.appointment.update({
      where: { id: existing.id },
      data: { status: 'cancelado', cancelledAt: new Date(), cancelReason: reason ?? null },
    });
    await recordAudit(tx, {
      clinicId,
      entity: 'appointment',
      entityId: cancelled.id,
      action: 'update',
      before: appointmentSnapshot(existing),
      after: appointmentSnapshot(cancelled),
      actor: ctx.actor,
      ip: ctx.ip,
    });
    return tx.appointment.findUniqueOrThrow({
      where: { id: cancelled.id },
      include: appointmentInclude,
    });
  });
}

export async function changeAppointmentStatus(
  id: string,
  status: Exclude<AppointmentStatus, 'cancelado'>,
  ctx: ActorContext = {},
): Promise<AppointmentWithRelations> {
  const clinicId = await resolveActiveClinicId();
  const existing = await findAppointmentInClinic(clinicId, id);
  const current = existing.status as AppointmentStatus;

  if (current === 'cancelado') {
    throw new ApiError(409, 'APPOINTMENT_CANCELLED', 'El turno está cancelado');
  }
  if (!ALLOWED_TRANSITIONS[current].includes(status)) {
    throw new ApiError(
      409,
      'INVALID_STATUS_TRANSITION',
      `No se puede pasar de "${current}" a "${status}"`,
    );
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.appointment.update({ where: { id: existing.id }, data: { status } });
    await recordAudit(tx, {
      clinicId,
      entity: 'appointment',
      entityId: updated.id,
      action: 'update',
      before: appointmentSnapshot(existing),
      after: appointmentSnapshot(updated),
      actor: ctx.actor,
      ip: ctx.ip,
    });
    return tx.appointment.findUniqueOrThrow({
      where: { id: updated.id },
      include: appointmentInclude,
    });
  });
}

export function isSchedulableStatus(status: string): boolean {
  return SCHEDULABLE_STATUSES.includes(status as AppointmentStatus);
}
