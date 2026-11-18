import { Payment, Prisma } from '@prisma/client';
import { prisma } from '../db';
import { ApiError } from '../errors';
import { resolveActiveClinicId } from '../clinic';
import { ActorContext, recordAudit } from '../audit';
import { dayRange } from '../dates';

export const PAYMENT_TYPES = ['turno', 'sena'] as const;
export const PAYMENT_METHODS = ['efectivo', 'tarjeta', 'mercadopago'] as const;
export const PAYMENT_STATUSES = ['registrado', 'anulado'] as const;

export type PaymentType = (typeof PAYMENT_TYPES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

const paymentInclude = {
  patient: { select: { id: true, name: true } },
  appointment: {
    select: {
      id: true,
      start: true,
      status: true,
      provider: { select: { id: true, name: true } },
    },
  },
} satisfies Prisma.PaymentInclude;

export type PaymentWithRelations = Prisma.PaymentGetPayload<{ include: typeof paymentInclude }>;

export interface CreatePaymentInput {
  appointmentId?: string;
  patientId?: string;
  type: PaymentType;
  method: PaymentMethod;
  amountCents: number;
  externalId?: string;
}

export interface ListPaymentsFilters {
  date?: string;
  from?: string;
  to?: string;
  appointmentId?: string;
  patientId?: string;
  type?: PaymentType;
  method?: PaymentMethod;
  status?: PaymentStatus;
  includeAnnulled?: boolean;
  limit?: number;
}

export interface CashGroup {
  method: PaymentMethod;
  totalCents: number;
  count: number;
}

export interface ProviderCashGroup {
  providerId: string | null;
  providerName: string;
  totalCents: number;
  count: number;
}

export interface CashClose {
  date: string;
  totalCents: number;
  count: number;
  byMethod: CashGroup[];
  byProvider: ProviderCashGroup[];
  payments: PaymentWithRelations[];
}

function paymentSnapshot(payment: Payment): Record<string, unknown> {
  return {
    id: payment.id,
    appointmentId: payment.appointmentId,
    patientId: payment.patientId,
    type: payment.type,
    method: payment.method,
    amountCents: payment.amountCents,
    status: payment.status,
    externalId: payment.externalId,
    createdBy: payment.createdBy,
    annulledAt: payment.annulledAt,
    annulReason: payment.annulReason,
  };
}

function parseTimestamp(value: string, field: string): Date {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new ApiError(400, 'INVALID_DATE', `${field} debe ser una fecha ISO-8601 válida`);
  }
  return date;
}

export async function createPayment(
  input: CreatePaymentInput,
  ctx: ActorContext = {},
): Promise<PaymentWithRelations> {
  const clinicId = await resolveActiveClinicId();

  if (input.appointmentId) {
    const appointment = await prisma.appointment.findFirst({
      where: { id: input.appointmentId, clinicId },
    });
    if (!appointment) {
      throw new ApiError(404, 'APPOINTMENT_NOT_FOUND', 'appointmentId inexistente');
    }
  }
  if (input.patientId) {
    const patient = await prisma.patient.findFirst({ where: { id: input.patientId, clinicId } });
    if (!patient) {
      throw new ApiError(404, 'PATIENT_NOT_FOUND', 'patientId inexistente');
    }
  }

  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        clinicId,
        appointmentId: input.appointmentId ?? null,
        patientId: input.patientId ?? null,
        type: input.type,
        method: input.method,
        amountCents: input.amountCents,
        externalId: input.externalId ?? null,
        createdBy: ctx.actor ?? 'sistema',
      },
    });
    await recordAudit(tx, {
      clinicId,
      entity: 'payment',
      entityId: payment.id,
      action: 'create',
      after: paymentSnapshot(payment),
      actor: ctx.actor,
      ip: ctx.ip,
    });
    return tx.payment.findUniqueOrThrow({ where: { id: payment.id }, include: paymentInclude });
  });
}

export async function listPayments(
  filters: ListPaymentsFilters = {},
): Promise<PaymentWithRelations[]> {
  const clinicId = await resolveActiveClinicId();
  const where: Prisma.PaymentWhereInput = { clinicId };

  if (filters.appointmentId) where.appointmentId = filters.appointmentId;
  if (filters.patientId) where.patientId = filters.patientId;
  if (filters.type) where.type = filters.type;
  if (filters.method) where.method = filters.method;
  if (filters.status) where.status = filters.status;
  else if (!filters.includeAnnulled) where.status = { not: 'anulado' };

  if (filters.date) {
    const { start, end } = dayRange(filters.date);
    where.createdAt = { gte: start, lt: end };
  } else if (filters.from || filters.to) {
    const range: Prisma.DateTimeFilter = {};
    if (filters.from) range.gte = parseTimestamp(filters.from, 'from');
    if (filters.to) range.lt = parseTimestamp(filters.to, 'to');
    where.createdAt = range;
  }

  const take = Math.min(Math.max(filters.limit ?? 200, 1), 500);

  return prisma.payment.findMany({
    where,
    include: paymentInclude,
    orderBy: { createdAt: 'desc' },
    take,
  });
}

export async function annulPayment(
  id: string,
  reason: string | undefined,
  ctx: ActorContext = {},
): Promise<PaymentWithRelations> {
  const clinicId = await resolveActiveClinicId();
  const existing = await prisma.payment.findFirst({ where: { id, clinicId } });
  if (!existing) {
    throw new ApiError(404, 'PAYMENT_NOT_FOUND', 'Cobro inexistente');
  }
  if (existing.status === 'anulado') {
    throw new ApiError(409, 'PAYMENT_ALREADY_ANNULLED', 'El cobro ya está anulado');
  }

  return prisma.$transaction(async (tx) => {
    const annulled = await tx.payment.update({
      where: { id: existing.id },
      data: { status: 'anulado', annulledAt: new Date(), annulReason: reason ?? null },
    });
    await recordAudit(tx, {
      clinicId,
      entity: 'payment',
      entityId: annulled.id,
      action: 'update',
      before: paymentSnapshot(existing),
      after: paymentSnapshot(annulled),
      actor: ctx.actor,
      ip: ctx.ip,
    });
    return tx.payment.findUniqueOrThrow({
      where: { id: annulled.id },
      include: paymentInclude,
    });
  });
}

export async function cashClose(date: string): Promise<CashClose> {
  const clinicId = await resolveActiveClinicId();
  const { start, end } = dayRange(date);

  const payments = await prisma.payment.findMany({
    where: { clinicId, status: 'registrado', createdAt: { gte: start, lt: end } },
    include: paymentInclude,
    orderBy: { createdAt: 'asc' },
  });

  const methods = new Map<PaymentMethod, CashGroup>();
  const providers = new Map<string, ProviderCashGroup>();

  for (const payment of payments) {
    const method = payment.method as PaymentMethod;
    const methodGroup = methods.get(method) ?? { method, totalCents: 0, count: 0 };
    methodGroup.totalCents += payment.amountCents;
    methodGroup.count += 1;
    methods.set(method, methodGroup);

    const providerId = payment.appointment?.provider?.id ?? null;
    const providerName = payment.appointment?.provider?.name ?? 'Sin profesional';
    const key = providerId ?? 'sin-profesional';
    const providerGroup = providers.get(key) ?? {
      providerId,
      providerName,
      totalCents: 0,
      count: 0,
    };
    providerGroup.totalCents += payment.amountCents;
    providerGroup.count += 1;
    providers.set(key, providerGroup);
  }

  const byMethod = [...methods.values()].sort((a, b) => a.method.localeCompare(b.method));
  const byProvider = [...providers.values()].sort((a, b) =>
    a.providerName.localeCompare(b.providerName),
  );
  const totalCents = payments.reduce((sum, payment) => sum + payment.amountCents, 0);

  return { date, totalCents, count: payments.length, byMethod, byProvider, payments };
}
