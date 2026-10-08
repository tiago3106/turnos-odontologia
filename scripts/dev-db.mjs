import EmbeddedPostgres from 'embedded-postgres';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const pg = new EmbeddedPostgres({
  databaseDir: path.join(root, '.pgdata-dev'),
  user: 'postgres',
  password: 'turnos_dev',
  port: 55432,
  persistent: true,
});

const command = process.argv[2] ?? 'start';

async function main(): Promise<void> {
  if (command === 'init') {
    await pg.initialise();
    return;
  }
  if (command === 'start') {
    try {
      await pg.initialise();
    } catch {
      // Ya inicializado.
    }
    await pg.start();
    try {
      await pg.createDatabase('turnos_dev');
    } catch {
      // Ya existe.
    }
    console.log('PostgreSQL embebido listo en localhost:55432 (db turnos_dev, user postgres/turnos_dev)');
    return;
  }
  if (command === 'stop') {
    await pg.stop();
    console.log('PostgreSQL embebido detenido');
    return;
  }
  console.log('Uso: node scripts/dev-db.mjs [start|stop|init]');
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
