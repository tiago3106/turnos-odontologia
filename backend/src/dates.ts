import { ApiError } from './errors';

/**
 * Rango de un día calendario del consultorio.
 * Argentina usa UTC-3 fijo (sin horario de verano).
 */
export function dayRange(date: string): { start: Date; end: Date } {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new ApiError(400, 'INVALID_DATE', 'date debe tener formato YYYY-MM-DD');
  }
  const start = new Date(`${date}T00:00:00-03:00`);
  if (Number.isNaN(start.getTime())) {
    throw new ApiError(400, 'INVALID_DATE', 'date no es una fecha válida');
  }
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}
