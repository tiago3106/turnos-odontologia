# clinic/config Specification

## Purpose
Define la administración de prestaciones, profesionales, sillones y horarios de atención del
consultorio, con precios en centavos, baja lógica y horarios sin solape por profesional y día
(RN-AG-03, RN-AU-01, RN-OS-01). No incluye autenticación ni RBAC: la restricción al rol
director (RN-AU-02) depende de C-03 y queda fuera de este change.

## Requirements

### Requirement: Administrar prestaciones con duración y precio
El sistema SHALL permitir crear, listar y editar prestaciones con código, nombre, duración por
defecto y precio en centavos. El código SHALL ser único dentro de la clínica y la duración
SHALL ser positiva.

#### Scenario: Crear una prestación (feliz)
- **GIVEN** la clínica activa existe
- **WHEN** se envía `POST /api/procedures` con `code: "CONS"`, `defaultDurationMin: 30` y `priceCents: 150000`
- **THEN** la API responde 201 con `priceCents: 150000`
- **AND** existe un `AuditLog` con `entity: "procedure"` y `action: "create"`

#### Scenario: Código de prestación duplicado (error de negocio)
- **GIVEN** existe una prestación con `code: "CONS"` en la clínica
- **WHEN** se envía `POST /api/procedures` con el mismo `code`
- **THEN** la API responde 409 con `error: "PROCEDURE_CODE_DUPLICATED"` y no crea otra prestación

#### Scenario: Baja lógica de una prestación (borde)
- **GIVEN** una prestación activa
- **WHEN** se envía `PATCH /api/procedures/{id}` con `isActive: false`
- **THEN** `GET /api/procedures` ya no la incluye, pero `GET /api/procedures?includeInactive=true` sí
- **AND** los turnos históricos que la referencian siguen existiendo

### Requirement: Administrar profesionales y sillones
El sistema SHALL permitir crear, listar y editar profesionales (nombre, especialidad, color) y
sillones (nombre), con baja lógica. El color, si se informa, SHALL tener formato `#RRGGBB`.

#### Scenario: Crear un profesional con color válido (feliz)
- **GIVEN** la clínica activa existe
- **WHEN** se envía `POST /api/providers` con `name: "Dr. Luis Inventado"` y `color: "#22AA66"`
- **THEN** la API responde 201 con el profesional persistido

#### Scenario: Color de profesional inválido (error de negocio)
- **GIVEN** una solicitud con `color: "verde"`
- **WHEN** se envía `POST /api/providers`
- **THEN** la API responde 400 con `error: "VALIDATION_ERROR"` y no persiste el profesional

#### Scenario: Sillón inactivo fuera del listado por defecto (borde)
- **GIVEN** un sillón activo
- **WHEN** se lo desactiva con `PATCH /api/operating-units/{id}`
- **THEN** `GET /api/operating-units` no lo muestra y `?includeInactive=true` sí

### Requirement: Horarios del profesional sin solape
El sistema SHALL permitir registrar horarios de atención por profesional, día de semana y
rango de minutos, y SHALL rechazar cualquier horario que se superponga con otro del mismo
profesional y día. La garantía SHALL imponerse en la base de datos además de la validación de
servicio.

#### Scenario: Alta de horario válido (feliz)
- **GIVEN** el profesional no tiene horarios el día lunes
- **WHEN** se envía `POST /api/schedule/providers/{id}/schedules` con `dayOfWeek: 1`, `startMinute: 540` y `endMinute: 720`
- **THEN** la API responde 201 y el horario aparece en `GET /api/schedule/providers/{id}/schedules`

#### Scenario: Horario solapado del mismo profesional y día (error de negocio)
- **GIVEN** existe un horario de lunes de 540 a 720
- **WHEN** se envía otro horario de lunes de 600 a 780
- **THEN** la API responde 409 con `error: "PROVIDER_SCHEDULE_OVERLAP"` y no persiste el segundo horario

#### Scenario: Horarios contiguos (borde, válido)
- **GIVEN** existe un horario de lunes de 540 a 720
- **WHEN** se envía otro horario de lunes de 720 a 900
- **THEN** la API responde 201, porque los rangos se tocan pero no se superponen

#### Scenario: La base de datos rechaza el solape aunque se saltee el servicio (error de negocio)
- **GIVEN** existe un horario de martes de 540 a 720
- **WHEN** se inserta directamente en `provider_schedule` otro de martes de 600 a 780
- **THEN** PostgreSQL rechaza la inserción por la restricción de exclusión y queda un solo horario

### Requirement: Consulta interna de configuración para la agenda
El sistema SHALL exponer los profesionales activos con sus horarios y los sillones activos para
que la agenda y la reserva online consuman una única fuente de verdad.

#### Scenario: Lectura de profesionales con horarios (feliz)
- **GIVEN** un profesional activo con un horario cargado
- **WHEN** se envía `GET /api/schedule/providers`
- **THEN** la API responde 200 con el profesional y su arreglo `schedules`

#### Scenario: Horarios de un profesional inexistente (error de negocio)
- **GIVEN** un id que no corresponde a ningún profesional
- **WHEN** se envía `GET /api/schedule/providers/{id}/schedules`
- **THEN** la API responde 404 con `error: "PROVIDER_NOT_FOUND"`

#### Scenario: Lectura de sillones (borde)
- **GIVEN** existen dos sillones activos y uno inactivo
- **WHEN** se envía `GET /api/schedule/sills`
- **THEN** la API responde 200 solo con los dos sillones activos
