# agenda/scheduling Specification

## Purpose
Garantiza que un turno nunca se superponga con otro del mismo profesional ni del mismo
sillón, con la restricción ejecutándose en la base de datos y no solo en la interfaz.

## Requirements

### Requirement: Crear un turno en un slot libre
El sistema SHALL crear un turno cuando el rango solicitado no se superponga con ningún
turno existente del mismo profesional ni del mismo sillón, derivando la duración de la
prestación elegida.

#### Scenario: Turno creado en slot libre (feliz)
- **GIVEN** el profesional "Dra. Pérez" y el sillón "Sillón 1" no tienen turnos el 2026-11-10
- **WHEN** la secretaria crea un turno de la prestación "Limpieza" (30 min) a las 10:00
  para el profesional "Dra. Pérez" en el sillón "Sillón 1"
- **THEN** el turno se persiste con inicio 10:00 y fin 10:30, y la API responde 201

#### Scenario: La duración la define la prestación, no quien agenda
- **GIVEN** la prestación "Limpieza" tiene duración por defecto 30 minutos
- **WHEN** se crea un turno de "Limpieza" a las 10:00 sin indicar fin
- **THEN** el turno termina a las 10:30 y cualquier fin enviado que lo contradiga es ignorado
  en favor de la duración de la prestación

### Requirement: Rechazar turnos superpuestos con HTTP 409
El sistema SHALL rechazar con HTTP 409 y un error de negocio tipado cualquier creación de
turno cuyo rango se superponga parcial o totalmente con un turno existente del mismo
profesional o del mismo sillón, sin persistir el registro.

#### Scenario: Mismo profesional, horario solapado (error de negocio)
- **GIVEN** existe un turno de "Dra. Pérez" de 10:00 a 11:00 en el sillón 1
- **WHEN** se intenta crear otro turno de "Dra. Pérez" de 10:30 a 11:30 en el sillón 2
- **THEN** la API responde 409 con código de error de solapamiento y no se crea ningún turno

#### Scenario: Mismo sillón, profesional distinto (error de negocio)
- **GIVEN** el sillón 1 tiene un turno de 10:00 a 11:00 del "Dr. Gómez"
- **WHEN** se intenta crear un turno en el sillón 1 de 10:45 a 11:15 para la "Dra. Pérez"
- **THEN** la API responde 409 con código de error de solapamiento y no se crea ningún turno

#### Scenario: Turno que empieza justo cuando termina otro (borde, válido)
- **GIVEN** existe un turno de 10:00 a 11:00 de "Dra. Pérez" en el sillón 1
- **WHEN** se crea un turno de 11:00 a 11:30 para "Dra. Pérez" en el sillón 1
- **THEN** el turno se crea con 201, porque los rangos se tocan pero no se superponen

### Requirement: La no superposición la garantiza la base de datos
El sistema SHALL imponer la no superposición mediante restricciones de integridad en
PostgreSQL, de modo que dos inserciones concurrentes que se superpongan no puedan
coexistir aunque la validación de la aplicación falle.

#### Scenario: Carrera de dos inserciones simultáneas
- **GIVEN** dos peticiones concurrentes piden el mismo rango para el mismo profesional
- **WHEN** ambas se ejecutan en transacciones paralelas
- **THEN** exactamente una se persiste y la otra recibe un error de conflicto; nunca
  quedan dos turnos superpuestos registrados
