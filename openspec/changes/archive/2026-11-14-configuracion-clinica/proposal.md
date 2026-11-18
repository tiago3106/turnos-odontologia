# Proposal — configuracion-clinica

## Why

El motor de agenda ya usa `Procedure`, `Provider` y `OperatingUnit`, pero no hay forma de
administrarlos: el seed crea unos pocos y no se pueden consultar ni modificar por API. Sin
configuración clínica no se puede operar el consultorio real (cambiar precios, agregar
profesionales o sillones, definir horarios de atención) ni construir la UI de agenda o la
reserva online. Este change agrega la configuración mínima con validaciones de dominio y
trazabilidad.

Es acotado y verificable: CRUD de prestaciones, profesionales y sillones, horarios por
profesional con anti-solape en la base de datos, y lecturas internas para la agenda.

## What Changes

- Se extiende `Procedure` con `priceCents` (precios en centavos, sin redondeo) e `isActive`.
- Se extiende `Provider` con `specialty`, `color` e `isActive`; `OperatingUnit` con `isActive`.
- Se agrega `ProviderSchedule` (día de semana, minutos de inicio/fin, intervalo) con
  restricción de exclusión en PostgreSQL: no se solapan dos horarios del mismo profesional y día.
- Endpoints de administración: `POST/GET/PATCH /api/procedures`, `/api/providers`,
  `/api/operating-units`.
- Endpoints de lectura interna para la agenda: `GET /api/schedule/providers` (con horarios),
  `GET /api/schedule/sills`, `GET /api/schedule/providers/{id}/schedules`.
- `POST /api/schedule/providers/{id}/schedules` con validación de rango y anti-solape.
- Migración 0003 aditiva.
- **Sin auth/RBAC**: la restricción de que solo el director configura (RN-AU-02) depende de
  C-03; en este alcance se registra auditoría en `AuditLog` (RN-AU-01) y el actor viene de
  `x-actor`.

## Capabilities

### New Capabilities
- `clinic/config`: administración de prestaciones, profesionales, sillones y horarios de
  atención, con precios en centavos y horarios sin solape.

### Modified Capabilities
<!-- Ninguna: no se cambia el comportamiento de agenda/scheduling. -->

## Impact

- **Código nuevo**: `src/catalog/**`, `tests/configuracion.test.ts`.
- **Base de datos**: migración 0003 (`provider`, `operating_unit`, `procedure` + `provider_schedule`).
- **Dependencias**: C-01/C-02/C-06 (fundación, modelos y agenda) ya archivados; C-03 (auth/RBAC)
  pendiente para restringir la administración al director.
- **Sistemas externos**: ninguno.
- **Datos**: solo ficticios.
- **Tests**: integración con Vitest + Supertest, incluida la restricción de BD.
