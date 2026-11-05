import { ApiError } from './errors';

function loadEnvFile(): void {
  try {
    process.loadEnvFile();
  } catch {
    // Sin .env: se usan variables de entorno del sistema (tests, CI).
  }
}

loadEnvFile();

export const config = {
  appEnv: process.env.APP_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL,
};

export function requireDatabaseUrl(): string {
  if (!config.databaseUrl) {
    throw new ApiError(500, 'DATABASE_NOT_CONFIGURED', 'Falta DATABASE_URL');
  }
  return config.databaseUrl;
}
