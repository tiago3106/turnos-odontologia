import { execSync } from 'node:child_process';
import path from 'node:path';

const root = path.resolve(__dirname, '..', '..');
const port = 55433;

interface PgOptions {
  databaseDir: string;
  user: string;
  password: string;
  port: number;
  persistent: boolean;
}

interface PgInstance {
  initialise(): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  createDatabase(name: string): Promise<void>;
}

export default async function setup(): Promise<() => Promise<void>> {
  const module = (await import('embedded-postgres')) as unknown as {
    default: new (options: PgOptions) => PgInstance;
  };
  const EmbeddedPostgres = module.default;

  const pg = new EmbeddedPostgres({
    databaseDir: path.join(root, 'tests', '.pgdata'),
    user: 'postgres',
    password: 'turnos_test',
    port,
    persistent: false,
  });

  try {
    await pg.initialise();
  } catch {
    // Directorio de datos ya inicializado en una corrida previa.
  }
  await pg.start();
  try {
    await pg.createDatabase('turnos_test');
  } catch {
    // La base ya existe.
  }

  process.env.DATABASE_URL = `postgresql://postgres:turnos_test@localhost:${port}/turnos_test`;
  process.env.APP_ENV = 'test';

  execSync('npx prisma migrate deploy', {
    cwd: root,
    env: { ...process.env },
    stdio: 'inherit',
  });

  return async () => {
    await pg.stop();
  };
}
