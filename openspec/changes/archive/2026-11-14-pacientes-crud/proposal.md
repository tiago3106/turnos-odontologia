# Proposal — pacientes-crud

## Why

Hasta ahora la agenda guarda el paciente como texto libre (`patientName`) dentro del turno:
no hay entidad `Patient`, no se puede buscar por DNI ni teléfono, y no queda trazabilidad de
quién creó o editó el dato. Sin pacientes no se puede construir la ficha clínica (C-08), la
caja por paciente (C-09) ni la reserva online (C-10). Este change crea la base del dominio de
pacientes con el mínimo que exige la regla dura RN-PA-01 (nombre + teléfono o email) y deja
auditoría de cada alta y edición (RN-AU-01).

Es un change acotado y verificable: modelo + migración + CRUD + auditoría + tests. No incluye
ficha clínica, obra social ni interfaz gráfica.

## What Changes

- Se agrega el modelo `Patient` (nombre, teléfono, email, DNI, activo) ligado a la clínica.
- Se agrega el modelo genérico `AuditLog` (entidad, entidadId, acción, snapshot antes/después,
  actor, IP, fecha) para registrar altas y ediciones (RN-AU-01).
- Se agregan endpoints `POST/GET/PATCH /api/patients` y `GET /api/patients/{id}`.
- Validación de borde con Zod: nombre obligatorio y al menos teléfono **o** email (RN-PA-01).
- Baja lógica (`isActive=false`): no se elimina ningún registro (trazabilidad).
- Migración 0002 con `patient` + `audit_log` e índices de búsqueda.
- **Sin auth/RBAC**: la autorización por rol depende de C-03 (`auth-rbac`) y queda fuera de
  este alcance. El actor se toma de `x-actor` (si falta, `sistema`); cuando exista C-03 se
  reemplaza por el usuario del JWT.

## Capabilities

### New Capabilities
- `patients/crud`: alta, consulta, búsqueda y edición de pacientes con datos de contacto
  mínimos y trazabilidad de las operaciones.

### Modified Capabilities
<!-- Ninguna: no se modifica la agenda; el turno sigue guardando patientName en este alcance. -->

## Impact

- **Código nuevo**: `src/patients/**`, `src/audit.ts`, `tests/patients.test.ts`.
- **Base de datos**: migración 0002 (`patient`, `audit_log`).
- **Dependencias**: C-01/C-02 (fundación y modelos base) ya archivados; C-03 (auth) pendiente
  para RBAC, no bloqueante para este alcance.
- **Sistemas externos**: ninguno.
- **Datos**: solo ficticios; prohibido PHI real (regla dura del AGENTS.md).
- **Tests**: integración contra la BD de test con datos ficticios.
