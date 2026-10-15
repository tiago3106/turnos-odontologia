# Tasks

## 1. Setup del módulo

- [x] 1.1 Scaffold del backend TypeScript (`package.json`, `tsconfig` estricto, `vitest`,
      `.env.example` sin valores sensibles) y verificar que `npm run typecheck` y
      `npm run lint` terminan sin errores
- [x] 1.2 Levantar PostgreSQL de desarrollo (docker-compose) y verificar que
      `SELECT version()` responde desde la app

## 2. Modelo y migración (garantía en BD)

- [x] 2.1 Definir el Prisma schema con `Provider`, `OperatingUnit`, `Procedure`,
      `Appointment` y `Clinic`, y verificar con `prisma validate`
- [x] 2.2 Migración 001 con `btree_gist` + `EXCLUDE` por `provider_id` y por
      `operating_unit_id` + `UNIQUE` de ventana, y verificar que `prisma migrate deploy`
      la aplica limpia en una BD nueva
- [x] 2.3 Test de la restricción a nivel de BD: insertar dos turnos solapados directo en
      SQL (sin pasar por la API) y verificar que el segundo falla con `23P01`

## 3. API de creación de turnos

- [x] 3.1 Endpoint `POST /api/appointments` con validación de payload (Zod) y cálculo de
      `end` a partir de `start + procedure.default_duration_min`, y verificar con test de
      integración que el turno responde 201 con la duración de la prestación
- [x] 3.2 Traducción de `23P01`/`23505` a `409 { code: "APPOINTMENT_OVERLAP" }` y
      verificar con test que el intento solapado responde 409 y no persiste el registro
- [x] 3.3 Normalización de horarios a UTC (`timestamptz`) en la capa de entrada y verificar
      con test que una misma hora con offset distinto no evade la restricción

## 4. Tests de cada escenario del spec

- [x] 4.1 Escenario feliz (slot libre → 201 con 10:00–10:30) y verificar con
      `npm test` en verde
- [x] 4.2 Escenario "duración la define la prestación" (fin contradictorio ignorado) y
      verificar con `npm test` en verde
- [x] 4.3 Escenarios de error de negocio: solape por profesional y solape por sillón →
      409 sin persistir, y verificar con `npm test` en verde
- [x] 4.4 Escenario borde: turno que empieza justo cuando termina otro → 201, y verificar
      con `npm test` en verde
- [x] 4.5 Escenario de carrera: dos inserciones concurrentes del mismo rango → exactamente
      una persistida, y verificar con `npm test` en verde

## 5. Documentación y verificación final

- [x] 5.1 `README.md` con pasos de instalación, levantado de BD, migraciones y cómo correr
      los tests, y verificar siguiendo sus pasos desde un clon limpio
- [x] 5.2 Seed de datos ficticios (1 clínica, 2 profesionales, 2 sillones, 3 prestaciones)
      y verificar que el seed es reproducible y no contiene datos reales
- [x] 5.3 Suite completa `npm test` + health check `GET /api/health` en verde, sin tests
      rotos ni skipped

## Workflow follow-up

- Archivar el change con `/opsx:archive crear-turno-sin-solapamientos` y verificar que
  `openspec list --json` queda sin cambios activos.
- Marcar el checkbox del change en `CHANGES.md`.
