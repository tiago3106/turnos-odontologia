import { Patient, Prisma } from '@prisma/client';
import { prisma } from '../db';
import { ApiError } from '../errors';
import { resolveActiveClinicId } from '../clinic';
import { ActorContext, recordAudit } from '../audit';

export interface CreatePatientInput {
  name: string;
  phone?: string | null;
  email?: string | null;
  dni?: string | null;
}

export interface UpdatePatientInput {
  name?: string;
  phone?: string | null;
  email?: string | null;
  dni?: string | null;
  isActive?: boolean;
}

export interface ListPatientsOptions {
  q?: string;
  includeInactive?: boolean;
}

function snapshot(patient: Patient): Record<string, unknown> {
  return {
    id: patient.id,
    name: patient.name,
    phone: patient.phone,
    email: patient.email,
    dni: patient.dni,
    isActive: patient.isActive,
  };
}

function mapWriteError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    throw new ApiError(409, 'PATIENT_DNI_DUPLICATED', 'Ya existe un paciente con ese DNI en la clínica');
  }
  throw error;
}

export async function createPatient(input: CreatePatientInput, ctx: ActorContext = {}): Promise<Patient> {
  const clinicId = await resolveActiveClinicId();

  try {
    return await prisma.$transaction(async (tx) => {
      const patient = await tx.patient.create({
        data: {
          clinicId,
          name: input.name,
          phone: input.phone ?? null,
          email: input.email ?? null,
          dni: input.dni ?? null,
        },
      });
      await recordAudit(tx, {
        clinicId,
        entity: 'patient',
        entityId: patient.id,
        action: 'create',
        after: snapshot(patient),
        actor: ctx.actor,
        ip: ctx.ip,
      });
      return patient;
    });
  } catch (error) {
    mapWriteError(error);
  }
}

export async function getPatient(id: string): Promise<Patient> {
  const clinicId = await resolveActiveClinicId();
  const patient = await prisma.patient.findFirst({ where: { id, clinicId } });
  if (!patient) {
    throw new ApiError(404, 'PATIENT_NOT_FOUND', 'Paciente inexistente');
  }
  return patient;
}

export async function listPatients(options: ListPatientsOptions = {}): Promise<Patient[]> {
  const clinicId = await resolveActiveClinicId();
  const where: Prisma.PatientWhereInput = { clinicId };

  if (!options.includeInactive) {
    where.isActive = true;
  }

  const q = options.q?.trim();
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { dni: { contains: q, mode: 'insensitive' } },
      { phone: { contains: q, mode: 'insensitive' } },
    ];
  }

  return prisma.patient.findMany({
    where,
    orderBy: { name: 'asc' },
    take: 100,
  });
}

export async function updatePatient(
  id: string,
  input: UpdatePatientInput,
  ctx: ActorContext = {},
): Promise<Patient> {
  const clinicId = await resolveActiveClinicId();
  const existing = await prisma.patient.findFirst({ where: { id, clinicId } });
  if (!existing) {
    throw new ApiError(404, 'PATIENT_NOT_FOUND', 'Paciente inexistente');
  }

  const nextPhone = input.phone !== undefined ? input.phone : existing.phone;
  const nextEmail = input.email !== undefined ? input.email : existing.email;
  if (!nextPhone && !nextEmail) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'El paciente debe conservar teléfono o email (RN-PA-01)');
  }

  const data: Prisma.PatientUpdateInput = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.phone !== undefined) data.phone = input.phone;
  if (input.email !== undefined) data.email = input.email;
  if (input.dni !== undefined) data.dni = input.dni;
  if (input.isActive !== undefined) data.isActive = input.isActive;

  try {
    return await prisma.$transaction(async (tx) => {
      const patient = await tx.patient.update({ where: { id: existing.id }, data });
      await recordAudit(tx, {
        clinicId,
        entity: 'patient',
        entityId: patient.id,
        action: 'update',
        before: snapshot(existing),
        after: snapshot(patient),
        actor: ctx.actor,
        ip: ctx.ip,
      });
      return patient;
    });
  } catch (error) {
    mapWriteError(error);
  }
}
