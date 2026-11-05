export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

type ErrorLike = {
  code?: unknown;
  message?: unknown;
  meta?: { code?: unknown; constraint?: unknown; message?: unknown };
  originalCode?: unknown;
  cause?: unknown;
};

function textOf(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/**
 * El bloqueo vive en la BD (design D1): la exclusión devuelve SQLSTATE 23P01 y la
 * ventana única 23505. Cualquiera de los dos significa "turno solapado" (RN-AG-01/02).
 */
export function isOverlapError(error: unknown): boolean {
  if (error === null || typeof error !== 'object') return false;
  const e = error as ErrorLike;
  const haystack = [
    textOf(e.code),
    textOf(e.originalCode),
    textOf(e.message),
    textOf(e.meta?.code),
    textOf(e.meta?.constraint),
    textOf(e.meta?.message),
    textOf(e.cause instanceof Error ? e.cause.message : undefined),
  ].join(' ');

  return (
    haystack.includes('23P01') ||
    haystack.includes('23505') ||
    haystack.includes('appointment_provider_no_overlap') ||
    haystack.includes('appointment_operating_unit_no_overlap') ||
    haystack.includes('appointment_provider_window_key') ||
    haystack.includes('appointment_operating_unit_window_key')
  );
}
