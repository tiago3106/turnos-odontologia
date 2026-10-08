# Design — crear-turno-sin-solapamientos

## Context

Repo sin código previo (`src/`, `tests/` inexistentes; cero commits). Ver `proposal.md`
(motivación) y `docs/exploracion/2026-10-08-crear-turno-sin-solapamientos.md` (relevamiento).
Stack fijado por PA-01: Node 20+ / TypeScript + PostgreSQL 15+ + Prisma. La no
superposición es regla dura (RN-AG-01/02) y decisión de diseño DD-01: doble bloqueo,
profesional **y** sillón, con la garantía en la base de datos (CA-2, RN-GL-01).

## Goals / Non-Goals

**Goals:**
- Que sea imposible, a nivel de PostgreSQL, tener dos turnos superpuestos del mismo
  profesional o del mismo sillón, incluso con dos peticiones concurrentes.
- Duración derivada de la prestación (`default_duration_min`).
- Respuesta HTTP 409 tipada ante conflicto, sin persistir el registro.
- Suite de tests automatizados que cubra cada escenario del spec.

**Non-Goals:**
- Autenticación/RBAC, frontend, bloqueos por feriado, sobreturnos, reserva online,
  WhatsApp, caja, ficha clínica (pertenecen a otros changes del `CHANGES.md`).
- Multi-clínica real: se modela `clinic_id` para no romper el ERD futuro, con una clínica
  ficticia de seed.

## Decisions

### D1 — Restricción `EXCLUDE USING gist`, no solo `UNIQUE`
Se crea `CREATE EXTENSION IF NOT EXISTS btree_gist` y dos restricciones de exclusión:
`EXCLUDE USING gist (provider_id WITH =, timerange WITH &&)` y
`EXCLUDE USING gist (operating_unit_id WITH =, timerange WITH &&)`.
- *Por qué*: `UNIQUE (provider_id, start, end)` solo detecta choques con **idéntico inicio y
  fin**; no cubre 10:00–11:00 vs 10:30–11:30 (solape parcial) — el escenario de error del
  spec fallaría. El `EXCLUDE` compara rangos con `&&` (se solapan) y es exactamente la
  regla de negocio.
- *Alternativas descartadas*: (a) solo `UNIQUE` de la KB — insuficiente para solapes
  parciales, se conserva además como red de seguridad; (b) validación en la aplicación —
  no resiste carreras (R-02), viola CA-2.

### D2 — Duración calculada en el servidor
El cliente envía `start` + `procedure_id`; el servidor calcula `end = start +
default_duration_min`. Ignora cualquier `end` enviado (escenario "la duración la define la
prestación").
- *Por qué*: evita que la UI mande duraciones arbitrarias y mantiene RN-AG-03 en un solo
  lugar.

### D3 — Prisma + migración SQL cruda
Prisma modela las tablas e índices; las restricciones `EXCLUDE` se aplican en una
migración SQL escrita a mano (Prisma no tiene DSL para ellas).
- *Por qué*: Prisma da tipos y migraciones versionadas; el SQL crudo da la restricción que
  Prisma no puede expresar. Alternativa descartada: SQL puro — perdería el tipado y el
  flujo de `prisma migrate`.

### D4 — API fina: `POST /api/appointments` con traducción de conflicto a 409
Express + validación de payload con schema (Zod). El error de violación de la restricción
se intercepta (código `23P01` de exclusión / `23505` de unique) y se traduce a
`409 { "code": "APPOINTMENT_OVERLAP", "message": ... }`.
- *Por qué*: la fuente de verdad es la BD (RN-GL-01); la capa de aplicación solo traduce
  errores, no decide. Alternativa descartada: chequeo previo `SELECT` — carrera clásica.

### D5 — Tests de integración contra PostgreSQL real
Los tests del spec corren contra una base Postgres real (contenedor local / DB de test),
no con mocks: la restricción vive en la BD y mockearla probaría un mock, no la regla.
- *Por qué*: coherente con la skill `tdd` (testear por interfaces públicas, sin mocks de
  internals) y con CA-2. Alternativa descartada: SQLite en memoria — no soporta `EXCLUDE`.

### D6 — Sin auth en este change
El endpoint queda interno (sin RBAC) porque `C-03 auth-rbac` no está archivado. Queda
documentado en tasks como deuda a conectar en ese change.

## Risks / Trade-offs

- [R-01] Restricciones `EXCLUDE` sin índice gist → full scan por inserción.
  *Mitigación*: la propia cláusula `USING gist` crea el índice; verificar con `EXPLAIN` en
  los tests.
- [R-02] Carrera entre dos inserciones simultáneas. *Mitigación*: la restricción se evalúa
  dentro de la transacción; la perdedora recibe 23P01 → 409 (escenario "carrera").
- [R-03] Zonas horarias mezcladas (start en local vs UTC) generan solapes no detectados.
  *Mitigación*: almacenar `timestamptz` en UTC y normalizar en la capa de entrada.
- [R-04] `btree_gist` requiere extensión habilitada en la BD. *Mitigación*: la migración
  la crea con `IF NOT EXISTS`; documentado en README.
- [Trade-off] Se duplica la regla (EXCLUDE + UNIQUE): más índice, más garantía. Aceptado.

## Migration Plan

1. `CREATE EXTENSION btree_gist` + tablas mínimas + restricciones (migración 001).
2. Seed ficticio: 1 clínica, 2 profesionales, 2 sillones, 3 prestaciones.
3. Deploy = `prisma migrate deploy`. Rollback = revert de la migración (no hay datos
   productivos: todo es ficticio por consigna).

## Open Questions

- Ninguna bloqueante. La ventana de duración mínima/máxima de turno (si alguna prestación
  excede el horario del profesional) queda para `C-06 motor-agenda`, fuera de este change.
