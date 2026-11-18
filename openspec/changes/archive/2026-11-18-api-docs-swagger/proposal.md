# Proposal — api-docs-swagger (C-01.1)

## Why

La consigna del TPI exige que el README permita reproducir el alcance y que la demostración del
backend muestre Swagger abierto con solicitudes reales. El backend funcionaba, pero no exponía
documentación ejecutable: había que reconstruir los endpoints desde el README.

## What Changes

- `GET /api/openapi.json`: documento OpenAPI 3.0.3 con todos los endpoints implementados.
- `GET /api/docs/`: Swagger UI servido localmente por `swagger-ui-express`.
- Dependencias: `swagger-ui-express` y sus tipos. Sin credenciales ni servicios externos.

## Capabilities

### New Capabilities
- `api/docs`: documentación ejecutable y explorable del backend.

### Modified Capabilities
<!-- Ninguna: solo se agrega superficie de lectura; los endpoints existentes no cambian. -->

## Impact

- **Código**: `backend/src/openapi.ts`, `backend/src/app.ts`, `backend/package.json`.
- **Dependencias**: C-01 (backend existente). Sin cambios en BD ni en reglas de negocio.
- **Verificación**: `GET /api/docs/` y `GET /api/openapi.json` responden 200 con el servidor
  levantado; la suite sigue en 69 tests.
