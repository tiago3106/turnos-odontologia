# Proposal — crear-turno-sin-solapamientos

## Why

Es la regla dura que sostiene todo el producto: sin ella el sistema no aporta nada por
sobre el papel o las planillas. Pertenece al **MVP recomendado en la sección D del informe
de Discovery** (agenda por sillón es el diferencial que ningún competidor local ofrecía en
el rango de precio accesible) y está elegido porque es verificable con tests: RN-AG-01,
RN-AG-02, RN-AG-03 y las condiciones de aceptación CA-1/CA-2 de la US-001 se pueden probar
de forma automática y determinística. Es chico y terminable: una sola funcionalidad (crear
un turno), no un módulo de agenda completo.

## What Changes

- Se introduce el modelo `Appointment` con su catálogo mínimo de soporte (`Provider`,
  `OperatingUnit` sillón, `Procedure` con `default_duration_min`).
- Se agrega el endpoint `POST /api/appointments` que crea un turno validando choque por
  **profesional** y por **sillón**.
- La garantía de no solapamiento se implementa **en la base de datos** (PostgreSQL), no en
  la capa de aplicación: restricción de exclusión de rangos solapados por `provider_id` y
  por `operating_unit_id`, más `UNIQUE` de ventana completa como red de seguridad.
- La duración del turno se deriva de la prestación seleccionada (RN-AG-03), no la elige
  quien agenda.
- Un intento de solape se traduce a **HTTP 409** con error de negocio tipado (CA-1);
  nunca se crea el registro (CA-2).
- Sin interfaz gráfica: alcance de dominio + API, tal como permite la consigna.

## Capabilities

### New Capabilities
- `agenda/scheduling`: creación de turnos en la agenda respetando la no superposición por
  profesional y por sillón, con duración derivada de la prestación.

### Modified Capabilities
<!-- sin specs vigentes: openspec list --specs → No specs found. No hay nada que modificar. -->

## Impact

- **Código nuevo**: `src/` (módulo de dominio + API mínima), `tests/` (escenarios del spec).
- **Base de datos**: una migración inicial con las tablas mínimas y las restricciones de
  solapamiento (`EXCLUDE USING gist` + `UNIQUE`); requiere la extensión `btree_gist`.
- **Dependencias**: Node 20+, TypeScript, PostgreSQL 15+, Prisma (PA-01, resuelta).
- **Sistemas externos**: ninguno — no toca WhatsApp, MercadoPago, auth ni frontend.
- **Comportamiento existente**: ninguno afectado (no hay código previo ni specs vigentes).
- **Restricción de repo**: usa datos ficticios exclusivamente (regla dura del AGENTS.md).
