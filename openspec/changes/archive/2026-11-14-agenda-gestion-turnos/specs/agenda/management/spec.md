# Spec Delta — agenda/management

## Purpose

Define el ciclo de vida del turno después del alta: consulta de agenda, reprogramación,
cancelación con liberación de slot y cambio de estado con transiciones válidas, manteniendo el
anti-solape de profesional y sillón en la base de datos (RN-AG-01/02/03). No incluye auth/RBAC
(C-03) ni cálculo de disponibilidad (C-06/C-08).

## ADDED Requirements

### Requirement: Consultar la agenda
El sistema SHALL listar turnos de la clínica filtrados por día del consultorio, rango,
profesional, sillón o estado, ordenados por inicio. Por defecto SHALL excluir los cancelados.

#### Scenario: Listar los turnos del día (feliz)
- **GIVEN** hay un turno el 2026-11-02 a las 07:00 (UTC-3) y otro el 2026-11-03
- **WHEN** se envía `GET /api/appointments?date=2026-11-02`
- **THEN** la API responde 200 con un solo turno, ordenado por `start`

#### Scenario: Filtro por profesional (feliz)
- **GIVEN** hay turnos de dos profesionales
- **WHEN** se envía `GET /api/appointments?providerId={id}`
- **THEN** la API responde 200 solo con los turnos de ese profesional

#### Scenario: Cancelados fuera del listado por defecto (borde)
- **GIVEN** un turno cancelado
- **WHEN** se envía `GET /api/appointments` sin `includeCancelled`
- **THEN** la API no lo incluye; con `includeCancelled=true` sí lo incluye

#### Scenario: Día con formato inválido (error de negocio)
- **GIVEN** `date=02/11/2026`
- **WHEN** se envía `GET /api/appointments`
- **THEN** la API responde 400 con `error: "VALIDATION_ERROR"`

### Requirement: Reprogramar un turno
El sistema SHALL permitir mover un turno vigente cambiando inicio, profesional, sillón,
prestación o paciente, recalculando el fin según la duración de la prestación y respetando el
anti-solape.

#### Scenario: Reprogramar a un horario libre (feliz)
- **GIVEN** un turno de 30 minutos
- **WHEN** se envía `PATCH /api/appointments/{id}` con un nuevo `start`
- **THEN** la API responde 200 con el nuevo `start` y `end = start + 30 min`
- **AND** registra un `AuditLog` de la entidad `appointment`

#### Scenario: Reprogramar a un horario solapado (error de negocio)
- **GIVEN** existe otro turno del mismo profesional de 10:00 a 10:30
- **WHEN** se intenta mover un turno a las 10:15
- **THEN** la API responde 409 con `error: "APPOINTMENT_OVERLAP"`
- **AND** el turno original queda intacto

#### Scenario: Cambiar la prestación recalcula el fin (borde)
- **GIVEN** un turno de 30 minutos
- **WHEN** se envía `PATCH` con una prestación de 60 minutos
- **THEN** el turno resultante dura 60 minutos

#### Scenario: Reprogramar un turno cancelado (error de negocio)
- **GIVEN** un turno cancelado
- **WHEN** se envía `PATCH /api/appointments/{id}`
- **THEN** la API responde 409 con `error: "APPOINTMENT_CANCELLED"`

### Requirement: Cancelar un turno y liberar el slot
El sistema SHALL cancelar un turno vigente registrando fecha y motivo, y SHALL liberar el
horario para que otro turno pueda ocuparlo. Cancelar dos veces SHALL rechazarse.

#### Scenario: Cancelar un turno (feliz)
- **GIVEN** un turno vigente
- **WHEN** se envía `POST /api/appointments/{id}/cancel` con un motivo
- **THEN** la API responde 200 con `status: "cancelado"`, `cancelledAt` y `cancelReason`
- **AND** se registra auditoría con el actor

#### Scenario: Reservar el slot liberado (borde)
- **GIVEN** un turno cancelado en un horario
- **WHEN** se crea otro turno en el mismo profesional, sillón y horario
- **THEN** la API responde 201, porque el cancelado ya no ocupa el slot

#### Scenario: Cancelar dos veces (error de negocio)
- **GIVEN** un turno ya cancelado
- **WHEN** se repite `POST /api/appointments/{id}/cancel`
- **THEN** la API responde 409 con `error: "APPOINTMENT_ALREADY_CANCELLED"`

### Requirement: Cambiar el estado del turno con transiciones válidas
El sistema SHALL permitir `pendiente → confirmado|ausente` y `confirmado → atendido|ausente`,
rechazando transiciones inválidas o cambios sobre turnos cancelados.

#### Scenario: Confirmar y marcar atendido (feliz)
- **GIVEN** un turno `pendiente`
- **WHEN** se envía `POST /api/appointments/{id}/status` con `confirmado` y luego con `atendido`
- **THEN** la API responde 200 en ambos pasos con el estado correspondiente

#### Scenario: Transición inválida (error de negocio)
- **GIVEN** un turno `pendiente`
- **WHEN** se envía `POST /api/appointments/{id}/status` con `atendido`
- **THEN** la API responde 409 con `error: "INVALID_STATUS_TRANSITION"`

#### Scenario: Cambiar estado de un cancelado (borde)
- **GIVEN** un turno cancelado
- **WHEN** se envía `POST /api/appointments/{id}/status`
- **THEN** la API responde 409 con `error: "APPOINTMENT_CANCELLED"`
