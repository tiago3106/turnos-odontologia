# Proposal — agenda-gestion-turnos

## Why

El motor de agenda solo permite **crear** un turno. En el consultorio real hace falta ver la
agenda del día, reprogramar, cancelar y marcar asistencia. Sin esto no se puede operar la
recepción ni liberar horarios cancelados: hoy un turno cancelado seguiría bloqueando el
profesional y el sillón. Este change cierra el ciclo de vida del turno.

## What Changes

- `GET /api/appointments` con filtros `date` (día del consultorio, UTC-3), `from`/`to`,
  `providerId`, `operatingUnitId`, `status`, `includeCancelled` y `limit`.
- `GET /api/appointments/{id}` con relaciones (profesional, sillón, prestación).
- `PATCH /api/appointments/{id}` para reprogramar (inicio, profesional, sillón, prestación o
  paciente); recalcula el fin según la duración de la prestación.
- `POST /api/appointments/{id}/cancel` con motivo; registra `cancelledAt` y **libera el slot**.
- `POST /api/appointments/{id}/status` con transiciones válidas (`pendiente → confirmado →
  atendido/ausente`).
- `POST /api/appointments` acepta `status` opcional (`pendiente` | `confirmado`).
- Migración 0004: columnas de cancelación, `CHECK` de estados y reemplazo de las restricciones
  de no-solape por índices parciales que ignoran turnos cancelados.
- Auditoría (`AuditLog`) en reprogramación, cancelación y cambio de estado.

## Capabilities

### New Capabilities
- `agenda/management`: consulta, reprogramación, cancelación y cambio de estado de turnos,
  respetando el anti-solape del profesional y del sillón.

### Modified Capabilities
<!-- El alta de turnos (agenda/scheduling) se mantiene; solo se agrega el estado inicial opcional. -->

## Impact

- **Código**: `src/appointments/service.ts`, `src/appointments/router.ts`, `tests/agenda.test.ts`.
- **Base de datos**: migración 0004 con índices parciales (los turnos cancelados no ocupan slot).
- **Dependencias**: C-06 archivado; Change 2 (`configuracion-clinica`) aporta profesionales y
  sillones activos; C-03 (auth) pendiente para restringir quién reprograma/cancela.
- **Datos**: solo ficticios.
- **Tests**: integración con Vitest + Supertest, incluida la liberación del slot al cancelar.
