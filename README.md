## Instalar, configurar y correr

- Requisitos: Node 20+, PostgreSQL 15+ (no necesario localmente: usa `embedded-postgres`).
- Instalar: `npm install`
- Datos de dev: crear `.env` basado en `.env.example` o usar el script de BD embebida.
- Base de datos: `npm run db:start` (inicia Postgres embebido). `npm run db:deploy` aplica migraciones. `npm run db:seed` carga datos ficticios.
- Desarrollo: `npm run dev`
- Tests: `npm test`
- Verificaciones: `npm run typecheck` / `npm run lint`

## Comportamiento relevante
- POST `/api/appointments`: valida, calcula `end = start + defaultDurationMin`, y devuelve `409 { error: "APPOINTMENT_OVERLAP" }` ante solape (RN-AG-01/02). Los turnos contiguos se permiten (CA-2).
- GET `/api/health`: respuesta básica para verificación.

## Notas
- Usa datos ficticios exclusivamente. Los scripts de `embedded-postgres` fueron aprobados con `npm install-scripts approve`.
