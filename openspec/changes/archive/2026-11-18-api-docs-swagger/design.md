# Design — api-docs-swagger

- El documento OpenAPI se construye en TypeScript (`src/openapi.ts`) y se sirve como JSON;
  Swagger UI consume ese mismo objeto, evitando dos fuentes de verdad.
- Se monta en `/api/docs` con `swaggerUi.serve` + `swaggerUi.setup`, antes del middleware 404.
- No se agrega autenticación: la documentación es pública en desarrollo, como el health check.
- No se usa CDN: los assets de Swagger UI se sirven desde `node_modules`, funciona sin internet.
- Las respuestas documentadas son ejemplos representativos; los códigos de error son los reales
  que devuelve `ApiError`.

## Decisiones rechazadas

- Generar el spec automáticamente desde Zod: más acoplamiento para un alcance acotado.
- Usar un CDN de Swagger UI: rompería la demo sin conexión.
