# Design — caja-y-senas

## Context

Change de cobros sobre la agenda y los pacientes ya existentes. Ver `proposal.md` y
`knowledge-base/12_pagos_y_senas_mercadopago.md`, `04_modelo_de_datos.md` §Payment,
`05_reglas_de_negocio.md` RN-CO-01..03.

## Goals / Non-Goals

**Goals:**
- Registrar cobros de turno y señas con medio de pago y trazabilidad.
- Consultar cobros por día, turno, paciente, tipo, medio y estado.
- Anular sin borrar (RN-CO-02).
- Cerrar caja por medio y por profesional (RN-CO-03).
- Auditar altas y anulaciones (RN-AU-01).

**Non-Goals:**
- Integración real con MercadoPago ni webhook firmado (C-12).
- Descuento automático de la seña sobre un presupuesto/factura: no existe aún el modelo
  `Treatment`/`Budget`; se registra la seña y queda disponible para C-13.
- RBAC de cierre de caja (C-03); se audita el actor.
- Interfaz gráfica.

## Decisions

### D1 — Monto en centavos
`amountCents Int` con `CHECK > 0`. *Por qué*: misma decisión que prestaciones; evita redondeo
en caja y facturación.

### D2 — Un cobro siempre referencia algo
`CHECK (appointmentId IS NOT NULL OR patientId IS NOT NULL)`; una seña exige `appointmentId`.
*Por qué*: RN-CO-02 — la seña se asocia a un turno o tratamiento. Al no existir `Treatment` en
v0.1, la seña se ancla al turno.

### D3 — Anulación lógica e inmutable
No hay `DELETE`. `status='anulado'` + `annulledAt` + `annulReason`, con auditoría. *Por qué*:
RN-CO-02; el cierre de caja debe poder explicar por qué un cobro no suma.

### D4 — Cierre por medio y por profesional
El cierre agrupa los cobros `registrado` del día por `method` y, si el cobro tiene turno, por
`appointment.provider`; los cobros sin turno caen en "Sin profesional". *Por qué*: RN-CO-03.

### D5 — Día del consultorio (UTC-3)
El cierre y los filtros por fecha usan `dayRange` (helper compartido con agenda). *Por qué*: la
caja es local y un cobro de las 21:00 debe caer en el día correcto.

### D6 — `externalId` opcional
Guarda la referencia de MercadoPago cuando exista, sin integrar la API todavía. *Por qué*:
deja el modelo conciliable (DD-04) sin acoplar este change a la integración real.

## Risks / Trade-offs

- [R-01] Sin RBAC, cualquiera puede cobrar o anular (C-03). *Mitigación*: auditoría con actor.
- [R-02] La seña no descuenta automáticamente del tratamiento porque no hay modelo de
  presupuesto. *Mitigación*: documentado; C-13 lo consume.
- [R-03] `externalId` no se valida contra MercadoPago. *Mitigación*: integración real en C-12.
- [R-04] Cierre calculado en la app (no SQL) con hasta 500 filas por consulta; el volumen diario
  es bajo. *Mitigación*: índices por `clinicId, createdAt`.

## Migration Plan

Migración 0005 aditiva (`payment` y FKs). Rollback = `DROP TABLE payment` en entorno
descartable; no hay datos productivos.

## Open Questions

- PA-04 (¿seña con % fijo o valor libre?) sigue abierta en la KB; este change acepta un monto
  libre en centavos, que cubre ambos casos.
