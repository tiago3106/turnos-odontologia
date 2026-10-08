import { Appointment, Prisma } from '@prisma/client';
import { prisma } from '../db';
import { ApiError, isOverlapError } from '../errors';

export interface CreateAppointmentInput {
  providerId: string;
  operatingUnitId: string;
  procedureId: string;
  patientName: string;
  start: string;
}

async function resolveClinicId(): Promise<string> {
  const clinic = await prisma.clinic.findFirst({ where: { isActive: true } });
  if (!clinic) {
    throw new ApiError(500, 'CLINIC_NOT_CONFIGURED', 'No hay una clínica activa (ejecutar seed)');
  }
  return clinic.id;
}

export async function createAppointment(input: CreateAppointmentInput): Promise<Appointment> {
  const start = new Date(input.start);
  if (Number.isNaN(start.getTime())) {
    throw new ApiError(400, 'INVALID_START', 'start debe ser una fecha ISO-8601 válida');
  }

  const clinicId = await resolveClinicId();

  const procedure = await prisma.procedure.findUnique({ where: { id: input.procedureId } });
  if (!procedure || procedure.clinicId !== clinicId) {
    throw new ApiError(404, 'PROCEDURE_NOT_FOUND', 'procedureId inexistente');
  }

  const provider = await prisma.provider.findUnique({ where: { id: input.providerId } });
  if (!provider || provider.clinicId !== clinicId) {
    throw new ApiError(404, 'PROVIDER_NOT_FOUND', 'providerId inexistente');
  }

  const unit = await prisma.operatingUnit.findUnique({ where: { id: input.operatingUnitId } });
  if (!unit || unit.clinicId !== clinicId) {
    throw new ApiError(404, 'OPERATING_UNIT_NOT_FOUND', 'operatingUnitId inexistente');
  }

  const end = new Date(start.getTime() + procedure.defaultDurationMin * 60_000);

  try {
    return await prisma.appointment.create({
      data: {
        clinicId,
        providerId: input.providerId,
        operatingUnitId: input.operatingUnitId,
        procedureId: input.procedureId,
        patientName: input.patientName,
        start,
        end,
      },
    });
  } catch (error) {
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
}
