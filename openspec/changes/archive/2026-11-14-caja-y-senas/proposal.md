# Proposal — caja-y-senas

## Why

La agenda ya registra turnos, pero el consultorio también cobra: el turno y, sobre todo, la
**seña** que reserva el horario. Sin un registro de caja no hay forma de saber cuánto entró, por
qué medio ni a qué profesional corresponde, y las señas no se pueden anular con trazabilidad.
Este change implementa el registro de cobros y el cierre de caja diario (RN-CO-01/02/03).

## What Changes

- Modelo `Payment`: monto en centavos, tipo (`turno` | `sena`), medio (`efectivo` | `tarjeta` |
  `mercadopago`), estado (`registrado` | `anulado`), referencia externa y vínculo a turno y/o
  paciente.
- `POST /api/payments` para registrar un cobro; una seña exige turno asociado.
- `GET /api/payments` con filtros por día, turno, paciente, tipo, medio y estado; por defecto
  excluye anulados.
- `POST /api/payments/:id/annul` con motivo: nunca se borra, solo se anula (RN-CO-02).
- `GET /api/cash/close?date=YYYY-MM-DD`: cierre por medio de pago y por profesional, sin contar
  anulados (RN-CO-03).
- Migración 0005 con `CHECK` de monto, tipo, medio, estado y referencia.
- Auditoría (`AuditLog`) en alta y anulación.

## Capabilities

### New Capabilities
- `cash/payments`: registro, consulta, anulación y cierre de caja de cobros de turno y señas.

### Modified Capabilities
<!-- Ninguna: no cambia el comportamiento de agenda ni de configuración. -->

## Impact

- **Código**: `src/payments/**`, `tests/caja.test.ts`, `src/dates.ts` (helper de día compartido).
- **Base de datos**: migración 0005 (`payment` con FK a `appointment`, `patient`, `clinic`).
- **Dependencias**: C-01/C-02 (fundación) y `agenda-gestion-turnos` (turnos sobre los que se
  cobra); C-03 (auth) y C-12 (MercadoPago real) pendientes.
- **Sistemas externos**: MercadoPago es solo una referencia ficticia (`externalId`); no hay
  integración real ni webhook en este change.
- **Datos**: solo ficticios.
- **Tests**: integración con Vitest + Supertest, incluido el cierre de caja.
