import { prisma } from './db';
import { ApiError } from './errors';

export async function resolveActiveClinicId(): Promise<string> {
  const clinic = await prisma.clinic.findFirst({ where: { isActive: true } });
  if (!clinic) {
    throw new ApiError(500, 'CLINIC_NOT_CONFIGURED', 'No hay una clínica activa (ejecutar seed)');
  }
  return clinic.id;
}
