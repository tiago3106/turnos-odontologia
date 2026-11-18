import { Prisma, PrismaClient } from '@prisma/client';

type DbClient = PrismaClient | Prisma.TransactionClient;

export interface ActorContext {
  actor?: string;
  ip?: string;
}

export interface AuditInput {
  clinicId: string;
  entity: string;
  entityId: string;
  action: 'create' | 'update';
  before?: unknown;
  after?: unknown;
  actor?: string;
  ip?: string;
}

function toJson(value: unknown): Prisma.InputJsonValue | undefined {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export async function recordAudit(db: DbClient, input: AuditInput): Promise<void> {
  await db.auditLog.create({
    data: {
      clinicId: input.clinicId,
      entity: input.entity,
      entityId: input.entityId,
      action: input.action,
      before: toJson(input.before),
      after: toJson(input.after),
      actor: input.actor ?? 'sistema',
      ip: input.ip,
    },
  });
}
