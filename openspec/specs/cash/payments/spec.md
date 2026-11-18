# cash/payments Specification

## Purpose
Define el registro de cobros de turno y señas, su consulta, la anulación con trazabilidad y el
cierre de caja por medio de pago y profesional (RN-CO-01, RN-CO-02, RN-CO-03, RN-AU-01). No
incluye la integración real con MercadoPago (C-12) ni auth/RBAC (C-03).

## Requirements

### Requirement: Registrar un cobro de turno o seña
El sistema SHALL registrar un cobro con tipo, medio de pago, monto positivo en centavos y una
referencia a turno o paciente. Una seña SHALL exigir un turno asociado. El cobro SHALL quedar
auditado con el actor.

#### Scenario: Cobrar un turno en efectivo (feliz)
- **GIVEN** un turno vigente
- **WHEN** se envía `POST /api/payments` con `type: "turno"`, `method: "efectivo"` y `amountCents: 500000`
- **THEN** la API responde 201 con `status: "registrado"`
- **AND** registra un `AuditLog` con `entity: "payment"` y `action: "create"`

#### Scenario: Cobrar una seña por MercadoPago (feliz)
- **GIVEN** un turno vigente
- **WHEN** se envía `POST /api/payments` con `type: "sena"`, `method: "mercadopago"` y un `externalId`
- **THEN** la API responde 201 con el cobro registrado

#### Scenario: Monto no positivo (error de negocio)
- **GIVEN** una solicitud con `amountCents: 0`
- **WHEN** se envía `POST /api/payments`
- **THEN** la API responde 400 con `error: "VALIDATION_ERROR"` y no persiste el cobro

#### Scenario: Seña sin turno (error de negocio)
- **GIVEN** una solicitud de seña solo con `patientId`
- **WHEN** se envía `POST /api/payments`
- **THEN** la API responde 400 y no persiste el cobro

#### Scenario: Referencia inexistente (error de negocio)
- **GIVEN** un `appointmentId` que no existe en la clínica
- **WHEN** se envía `POST /api/payments`
- **THEN** la API responde 404 con `error: "APPOINTMENT_NOT_FOUND"`

### Requirement: Consultar cobros
El sistema SHALL listar cobros filtrados por día, turno, paciente, tipo, medio y estado, y por
defecto SHALL excluir los anulados.

#### Scenario: Filtrar por turno (feliz)
- **GIVEN** dos cobros, uno asociado a un turno y otro solo a un paciente
- **WHEN** se envía `GET /api/payments?appointmentId={id}`
- **THEN** la API responde 200 solo con el cobro de ese turno

#### Scenario: Anulados fuera del listado por defecto (borde)
- **GIVEN** un cobro anulado
- **WHEN** se envía `GET /api/payments` sin `includeAnnulled`
- **THEN** la API no lo incluye; con `includeAnnulled=true` sí lo incluye

### Requirement: Anular un cobro con trazabilidad
El sistema SHALL anular un cobro registrado guardando fecha y motivo, sin eliminarlo, y SHALL
rechazar una segunda anulación.

#### Scenario: Anular un cobro (feliz)
- **GIVEN** un cobro registrado
- **WHEN** se envía `POST /api/payments/{id}/annul` con un motivo
- **THEN** la API responde 200 con `status: "anulado"`, `annulledAt` y `annulReason`
- **AND** registra un `AuditLog` con el estado anterior y posterior

#### Scenario: Anular dos veces (error de negocio)
- **GIVEN** un cobro ya anulado
- **WHEN** se repite `POST /api/payments/{id}/annul`
- **THEN** la API responde 409 con `error: "PAYMENT_ALREADY_ANNULLED"`

### Requirement: Cierre de caja diario
El sistema SHALL devolver el cierre de caja de un día del consultorio con el total general, el
total por medio de pago y el total por profesional, contando solo cobros registrados.

#### Scenario: Cierre con cobros de varios medios (feliz)
- **GIVEN** un cobro en efectivo y una seña por MercadoPago del mismo día
- **WHEN** se envía `GET /api/cash/close?date={día}`
- **THEN** la API responde 200 con el total general y un grupo por cada medio
- **AND** el grupo por profesional usa el profesional del turno

#### Scenario: Anulados no suman al cierre (borde)
- **GIVEN** un cobro anulado del día
- **WHEN** se envía `GET /api/cash/close?date={día}`
- **THEN** el total y los grupos no incluyen el monto anulado

#### Scenario: Día sin cobros (borde)
- **GIVEN** una fecha sin cobros
- **WHEN** se envía `GET /api/cash/close?date={fecha}`
- **THEN** la API responde 200 con `totalCents: 0` y `count: 0`

#### Scenario: Fecha inválida (error de negocio)
- **GIVEN** `date=2026/11/02`
- **WHEN** se envía `GET /api/cash/close`
- **THEN** la API responde 400 con `error: "VALIDATION_ERROR"`
