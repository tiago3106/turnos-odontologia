# Proposal — turno-paciente-vinculado (C-06.2)

## Why

La KB (`04_modelo_de_datos.md` §Appointment) define `patient_id` e índice `(patient_id, start)`,
pero el turno implementado guardaba solo un `patientName` libre. Sin el vínculo no se puede
consultar la agenda de un paciente ni llegar a su ficha clínica desde el turno.

## What Changes

- `Appointment.patientId` opcional con FK a `Patient` e índice `(patientId, start)` (migración 0006).
- `POST /api/appointments` y `PATCH /api/appointments/{id}` aceptan `patientId` opcional;
  al enviarlo se valida que el paciente exista y esté activo en la clínica (`404 PATIENT_NOT_FOUND`).
- El nombre del turno se deriva del paciente vinculado, si se envía `patientId`.
- La respuesta incluye `patientId` y el objeto `patient` (`id`, `name`).

## Capabilities

### New Capabilities
- `agenda/patient-link`: vínculo opcional y verificable entre turno y paciente.

### Modified Capabilities
- `agenda/scheduling`: el alta y la reprogramación aceptan el nuevo campo opcional.

## Impact

- **Código**: `backend/prisma/schema.prisma`, `backend/src/appointments/{service,router}.ts`.
- **Base de datos**: migración `0006_turno_paciente`.
- **Dependencias**: C-06 y C-04 archivados; no modifica el anti-solape.
- **Alcance**: opcional para conservar compatibilidad con turnos ya creados; hacerlo obligatorio
  queda para `reserva-online` (C-10), donde el paciente siempre existe.
- **Datos**: solo pacientes ficticios.
- **Tests**: 2 nuevos (vinculación + referencia inexistente); suite total 69 en verde.
