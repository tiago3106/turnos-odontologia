# Spec Delta — patients/crud

## Purpose

Define el alta, consulta, búsqueda y edición de pacientes con datos de contacto mínimos
(RN-PA-01) y trazabilidad de cada operación (RN-AU-01). El alcance no incluye autenticación ni
roles: la autorización por rol depende de C-03 y se declara fuera de este change.

## ADDED Requirements

### Requirement: Alta de paciente con datos de contacto mínimos
El sistema SHALL crear un paciente cuando reciba un nombre y al menos un canal de contacto
(teléfono o email), y SHALL rechazar el alta si faltan ambos (RN-PA-01). El alta SHALL quedar
registrada en `AuditLog` (RN-AU-01).

#### Scenario: Alta con nombre y teléfono (feliz)
- **GIVEN** la clínica activa existe
- **WHEN** se envía `POST /api/patients` con `name: "Paciente Ficticio A"` y `phone: "1100000001"`
- **THEN** la API responde 201 con el paciente persistido y `isActive: true`
- **AND** existe un `AuditLog` con `entity: "patient"`, `action: "create"` y `entityId` igual al id creado

#### Scenario: Alta sin teléfono ni email (error de negocio)
- **GIVEN** una solicitud con `name: "Paciente Ficticio B"` y sin `phone` ni `email`
- **WHEN** se envía `POST /api/patients`
- **THEN** la API responde 400 con `error: "VALIDATION_ERROR"`
- **AND** no se persiste el paciente ni se registra auditoría

#### Scenario: Alta solo con email (borde, válido)
- **GIVEN** una solicitud con `name: "Paciente Ficticio C"` y `email: "ficticio@example.com"`
- **WHEN** se envía `POST /api/patients`
- **THEN** la API responde 201 y el paciente queda persistido sin `phone`

#### Scenario: DNI duplicado en la misma clínica (error de negocio)
- **GIVEN** existe un paciente con `dni: "30111222"` en la clínica activa
- **WHEN** se envía `POST /api/patients` con el mismo `dni` y otro nombre
- **THEN** la API responde 409 con `error: "PATIENT_DNI_DUPLICATED"` y no se crea un segundo registro

### Requirement: Consulta y búsqueda de pacientes
El sistema SHALL devolver un paciente por id y SHALL listar pacientes filtrando por texto en
nombre, DNI o teléfono, con un máximo de 100 resultados. Por defecto SHALL listar solo
pacientes activos.

#### Scenario: Consulta por id existente (feliz)
- **GIVEN** existe un paciente ficticio creado
- **WHEN** se envía `GET /api/patients/{id}`
- **THEN** la API responde 200 con el paciente y sus datos de contacto

#### Scenario: Consulta de un id inexistente (error de negocio)
- **GIVEN** un id que no corresponde a ningún paciente
- **WHEN** se envía `GET /api/patients/{id}`
- **THEN** la API responde 404 con `error: "PATIENT_NOT_FOUND"`

#### Scenario: Búsqueda parcial insensible a mayúsculas (borde)
- **GIVEN** existe "Paciente Ficticio A" y otro paciente distinto
- **WHEN** se envía `GET /api/patients?q=ficticio`
- **THEN** la API responde 200 con los pacientes cuyo nombre contiene "ficticio", sin distinguir mayúsculas

### Requirement: Edición de paciente con trazabilidad
El sistema SHALL actualizar los datos de un paciente existente y SHALL registrar en
`AuditLog` el estado antes y después del cambio (RN-AU-01). Un paciente SHALL poder
desactivarse sin borrarse.

#### Scenario: Edición de teléfono (feliz)
- **GIVEN** un paciente ficticio existente con `phone: "1100000001"`
- **WHEN** se envía `PATCH /api/patients/{id}` con `phone: "1100000099"`
- **THEN** la API responde 200 con el teléfono actualizado
- **AND** existe un `AuditLog` con `action: "update"` cuyo `before.phone` es "1100000001" y `after.phone` es "1100000099"

#### Scenario: Edición que deja al paciente sin contacto (error de negocio)
- **GIVEN** un paciente que solo tiene `phone`
- **WHEN** se envía `PATCH /api/patients/{id}` con `phone: null` y sin email
- **THEN** la API responde 400 con `error: "VALIDATION_ERROR"` y el paciente conserva su teléfono

#### Scenario: Baja lógica y listado por defecto (borde)
- **GIVEN** un paciente activo
- **WHEN** se envía `PATCH /api/patients/{id}` con `isActive: false`
- **THEN** la API responde 200 con `isActive: false`
- **AND** `GET /api/patients` ya no lo incluye, pero `GET /api/patients?includeInactive=true` sí
