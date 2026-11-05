# Spec Delta — agenda/staff-ui

## Purpose

Define la operación de la agenda del consultorio desde la app staff: vistas por profesional y
por sillón, lectura de estados (libre/ocupado/bloqueado/sobreturno), y acciones de agendar,
mover, cancelar y marcar estado. La UI **no decide** el anti-solape: lo delega en la API y
reconcilia el `409` sin dejar estado inconsistente (RN-AG-01/02, RN-GL-01).

## ADDED Requirements

### Requirement: Vistas conmutables por profesional y por sillón
El sistema SHALL mostrar la agenda en vista por profesional o por sillón, en escala día o
semana, y SHALL permitir conmutar sin perder la fecha seleccionada. La vista y la fecha SHALL
reflejarse en la URL para permitir deep-linking.

#### Scenario: Conmutar de profesional a sillón conservando la fecha (feliz)
- **GIVEN** la secretaria está en `/agenda?view=provider&date=2026-11-10`
- **WHEN** conmuta a `view=chair`
- **THEN** la grilla muestra los sillones para el 2026-11-10 y la URL conserva `date=2026-11-10`

#### Scenario: Odontólogo intenta ver la agenda de otro profesional (error de negocio)
- **GIVEN** un usuario con rol odontólogo autenticado
- **WHEN** abre `/agenda?view=provider&professional=<otro>`
- **THEN** la UI muestra solo su propia agenda y la API responde 403 si se consulta otro
  profesional, sin exponer turnos ajenos (matriz RBAC de `03_actores_y_roles.md`)

#### Scenario: Cambio de semana en el límite de mes (borde)
- **GIVEN** la vista semanal está en la semana del 2026-12-28
- **WHEN** la secretaria avanza a la semana siguiente
- **THEN** la grilla muestra la semana del 2027-01-04 con las fechas correctas, sin corrimiento
  por zona horaria

### Requirement: Distinguir slot libre, ocupado, bloqueado y sobreturno
El sistema SHALL renderizar cada slot con un estado visual inequívoco: libre, ocupado por
turno (con paciente, prestación y estado), bloqueado por feriado/vacaciones o sobreturno.
Los slots ocupados y bloqueados SHALL mostrarse en gris y no SHALL ofrecer la acción
"Agendar".

#### Scenario: Turno confirmado muestra sus datos (feliz)
- **GIVEN** existe un turno confirmado de "Limpieza" para "Paciente Ficticio A" a las 10:00
- **WHEN** la secretaria abre la agenda del día
- **THEN** el slot de 10:00 muestra una tarjeta con paciente, prestación y estado "confirmado"

#### Scenario: Slot bloqueado no ofrece agendar (error de negocio)
- **GIVEN** el 2026-11-10 está bloqueado por feriado en el consultorio
- **WHEN** la secretaria hace clic en un slot de ese día
- **THEN** la UI no ofrece "Agendar" y muestra el motivo del bloqueo (RN-AG-04)

#### Scenario: Bloqueo de media jornada junto a un turno adyacente (borde)
- **GIVEN** el sillón 1 tiene un bloqueo de 08:00 a 12:00 y un turno de 12:00 a 12:30
- **WHEN** se renderiza el día
- **THEN** el bloqueo ocupa 08:00–12:00 como no reservable y el turno se muestra en 12:00 sin
  solaparse visualmente

### Requirement: Agendar un turno desde un slot libre
El sistema SHALL permitir agendar desde un slot libre abriendo un formulario con paciente y
prestación, y SHALL derivar la duración de la prestación (RN-AG-03). Si la API responde
`409`, SHALL mostrar el conflicto y no SHALL crear la tarjeta.

#### Scenario: Agendar en slot libre (feliz)
- **GIVEN** el slot de 10:00 del profesional "Dra. Pérez" está libre
- **WHEN** la secretaria elige "Limpieza" (30 min) para "Paciente Ficticio A" y confirma
- **THEN** la API responde 201 y el slot 10:00–10:30 se muestra ocupado con la tarjeta

#### Scenario: Intento de agendar en slot bloqueado (error de negocio)
- **GIVEN** el slot de 15:00 está dentro de un bloqueo por vacaciones
- **WHEN** se intenta agendar un turno en ese slot
- **THEN** la acción está deshabilitada y, si se fuerza la petición, la API responde 409 y no
  se persiste el turno (RN-AG-04)

#### Scenario: La duración de la prestación excede el espacio disponible (borde)
- **GIVEN** el slot libre es de 10:00 a 10:30 y la prestación elegida dura 60 min
- **WHEN** la secretaria confirma el turno
- **THEN** la UI no crea el turno y sugiere el siguiente slot libre que contenga los 60 min
  (Flujo 2, RN-AG-03)

### Requirement: Mover un turno sin violar el anti-solape
El sistema SHALL permitir mover un turno a otro slot mediante arrastre o diálogo accesible.
Ante un `409`, SHALL revertir la tarjeta a su posición original y marcar el slot destino como
ocupado (RN-AG-01/02, RN-GL-01).

#### Scenario: Mover a un slot libre (feliz)
- **GIVEN** un turno de 10:00 a 10:30 en el sillón 1
- **WHEN** la secretaria lo arrastra al slot de 11:00 del mismo sillón
- **THEN** la API confirma el cambio y la tarjeta se muestra en 11:00–11:30

#### Scenario: Arrastrar sobre un slot ocupado (error de negocio)
- **GIVEN** el slot de 11:00 está ocupado por otro turno
- **WHEN** la secretaria suelta la tarjeta sobre ese slot
- **THEN** la API responde 409 `APPOINTMENT_OVERLAP`, la tarjeta vuelve a 10:00 y el slot
  destino se pinta gris con un aviso, sin duplicar ni perder el turno

#### Scenario: Mover a un slot que empieza cuando termina otro (borde)
- **GIVEN** existe un turno de 11:00 a 11:30
- **WHEN** se mueve otro turno para que termine exactamente a las 11:00
- **THEN** el movimiento se acepta, porque los rangos se tocan pero no se superponen

### Requirement: Cancelar y marcar estado de un turno
El sistema SHALL permitir cancelar un turno y marcarlo como asistido o no asistido, con
confirmación explícita y registro en auditoría (RN-AU-01). Las acciones SHALL respetar el rol
del usuario.

#### Scenario: Cancelar un turno futuro fuera del plazo del paciente (feliz)
- **GIVEN** un turno confirmado para mañana, ya fuera del plazo en que el paciente puede
  cancelar por su cuenta
- **WHEN** la secretaria lo cancela y confirma el diálogo
- **THEN** el turno pasa a "cancelado", el slot queda libre y la acción se registra en
  auditoría; la cancelación fuera de plazo la ejerce la secretaria (RN-AG-07, RN-AU-01)

#### Scenario: Odontólogo intenta cancelar un turno ajeno (error de negocio)
- **GIVEN** un odontólogo autenticado y un turno de otro profesional
- **WHEN** intenta cancelarlo
- **THEN** la API responde 403 y el turno no cambia de estado

#### Scenario: Cancelar un turno ya pasado (borde)
- **GIVEN** un turno cuya hora de inicio ya pasó
- **WHEN** la secretaria intenta cancelarlo
- **THEN** la UI exige confirmación adicional y, si se confirma, el turno queda cancelado con
  marca de auditoría; no se borra el registro

### Requirement: Registrar sobreturnos sin romper el anti-solape
El sistema SHALL permitir crear sobreturnos urgentes solo en slots libres, mostrarlos con una
marca visual y respetar RN-AG-01/02 (RN-AG-05).

#### Scenario: Sobreturno en slot libre (feliz)
- **GIVEN** el slot de 16:00 está libre para el profesional y el sillón
- **WHEN** la secretaria crea un sobreturno
- **THEN** el turno se persiste, se muestra con badge "sobreturno" y no se superpone con otro

#### Scenario: Sobreturno sobre slot ocupado (error de negocio)
- **GIVEN** el slot de 16:00 ya tiene un turno
- **WHEN** se intenta crear un sobreturno en ese slot
- **THEN** la API responde 409 y no se crea el sobreturno (RN-AG-05 no relaja RN-AG-01/02)

#### Scenario: Sobreturno sobre un bloqueo (borde)
- **GIVEN** el slot de 16:00 está dentro de un bloqueo por feriado
- **WHEN** se intenta crear un sobreturno
- **THEN** la acción se rechaza con 409 y la UI explica que el slot está bloqueado

### Requirement: Dashboard de hoy
El sistema SHALL mostrar en `/agenda/hoy` los próximos turnos del día ordenados por hora de
inicio, filtrados por el rol del usuario.

#### Scenario: Próximos turnos del día (feliz)
- **GIVEN** hoy hay tres turnos a las 09:00, 10:30 y 16:00
- **WHEN** la secretaria abre `/agenda/hoy`
- **THEN** ve los tres turnos ordenados por hora con paciente, prestación y estado

#### Scenario: Día sin turnos (borde)
- **GIVEN** hoy no hay turnos cargados
- **WHEN** se abre `/agenda/hoy`
- **THEN** se muestra un estado vacío explícito ("Sin turnos para hoy"), sin error

#### Scenario: Falla la API de agenda (error de negocio)
- **GIVEN** la API de agenda no responde
- **WHEN** se abre `/agenda/hoy`
- **THEN** se muestra un estado de error con acción "Reintentar" y no se muestra data stale
  como si fuera actual
