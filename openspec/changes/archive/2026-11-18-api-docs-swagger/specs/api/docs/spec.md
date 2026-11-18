## ADDED Requirements

### Requirement: Documentación ejecutable del backend
El sistema DEBE exponer un documento OpenAPI y una interfaz Swagger UI accesibles sin autenticación.

#### Scenario: Swagger UI disponible (feliz)
- **GIVEN** el backend en ejecución
- **WHEN** se solicita `GET /api/docs/`
- **THEN** responde 200 y sirve la interfaz Swagger UI con los tags Salud, Turnos, Pacientes,
  Configuración y Cobros

#### Scenario: Documento OpenAPI disponible (feliz)
- **GIVEN** el backend en ejecución
- **WHEN** se solicita `GET /api/openapi.json`
- **THEN** responde 200 con `openapi = "3.0.3"` y Paths para `/api/appointments`, `/api/patients`,
  `/api/payments` y `/api/cash/close`

#### Scenario: Sin dependencia externa (borde)
- **GIVEN** una máquina sin acceso a internet
- **WHEN** se abre `/api/docs/`
- **THEN** la interfaz carga sus assets desde el servidor local
