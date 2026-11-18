# Design — pacientes-crud

## Context

Change de dominio sobre la fundación ya archivada (`crear-turno-sin-solapamientos`). Ver
`proposal.md`. Referencias de la KB: `04_modelo_de_datos.md` §Patient y §AuditLog,
`05_reglas_de_negocio.md` RN-PA-01 y RN-AU-01, `06_funcionalidades.md` Épica 3 (US-007).
Stack fijado por PA-01: Node 20 + TypeScript estricto + PostgreSQL + Prisma.

## Goals / Non-Goals

**Goals:**
- Persistir pacientes con los datos mínimos de contacto (RN-PA-01).
- Permitir alta, consulta por id, búsqueda por nombre/DNI/teléfono y edición.
- Registrar cada alta y edición en `AuditLog` con snapshot antes/después (RN-AU-01).
- Baja lógica: nunca borrar el registro.
- Tests de escenario feliz, error de negocio y borde.

**Non-Goals:**
- Auth/RBAC (C-03): no hay login ni roles en este change.
- Ficha clínica/odontograma (C-08), obra social (C-13), reserva online (C-10).
- Vínculo `Appointment.patientId`: la agenda sigue usando `patientName` hasta C-06 ampliado.
- Interfaz gráfica.

## Decisions

### D1 — `Patient` con `clinicId` y resolución de clínica activa
`Patient` se relaciona con `Clinic`; en v0.1 el backend resuelve la única clínica activa
(igual que `createAppointment`). *Por qué*: mantiene multi-tenant en el modelo sin introducir
selección de tenant antes de C-03.

### D2 — Validación de contacto en el borde (Zod)
`name` de 1–120 caracteres y al menos uno de `phone` o `email` (RN-PA-01). `email` válido y
`dni` numérico de 7–8 dígitos cuando se informa. *Por qué*: rechazar temprano evita pacientes
sin canal de recordatorio (RN-AG-06).

### D3 — `AuditLog` genérico con snapshots JSON
`entity`, `entityId`, `action` (`create|update`), `before`, `after`, `actor`, `ip`, `createdAt`.
El actor sale de `x-actor` (fallback `sistema`) porque todavía no hay JWT; al cerrar C-03 se
cambia por el `sub` del token. *Por qué*: RN-AU-01 exige quién/cuándo, y el campo `actor`
permite migrar sin cambiar la tabla.

### D4 — Baja lógica (`isActive`)
`PATCH` puede desactivar; el listado por defecto devuelve solo activos (`?includeInactive=true`
para ver todos). *Por qué*: la historia clínica y la caja referencian al paciente; borrar
rompería trazabilidad.

### D5 — Búsqueda `contains` insensible a mayúsculas
`GET /api/patients?q=` busca en `name`, `dni` y `phone` con `mode: "insensitive"`, y devuelve
como máximo 100 resultados. *Por qué*: uso real de secretaría; evita respuestas sin límite.

### D6 — DNI único por clínica cuando está presente
`@@unique([clinicId, dni])`: Postgres permite múltiples `NULL`, así que el DNI es opcional
pero no se duplica dentro de la clínica. Un DNI repetido devuelve `409 PATIENT_DNI_DUPLICATED`.

## Risks / Trade-offs

- [R-01] Sin auth, cualquiera con acceso a la API puede crear/editar pacientes. *Mitigación*:
  alcance declarado; C-03 es el siguiente change del camino crítico.
- [R-02] `Appointment.patientName` y `Patient` conviven sin FK. *Mitigación*: documentado como
  deuda hasta que C-06 se amplíe; no se rompe la agenda existente.
- [R-03] Búsqueda con `contains` sin índice trigram puede ser lenta con muchos datos.
  *Mitigación*: límite de 100 y datos ficticios de escala de cátedra; índice en `name`.

## Migration Plan

Migración 0002 aditiva (`patient`, `audit_log`). Rollback = `DROP TABLE audit_log, patient`
en un entorno descartable; no hay datos productivos.

## Open Questions

- Ninguna bloqueante. La forma de tomar el actor se confirma al implementar C-03.
