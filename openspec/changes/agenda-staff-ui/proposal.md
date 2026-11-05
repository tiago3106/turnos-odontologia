# Proposal — agenda-staff-ui

> Change **preparado, no implementado**. Depende de C-06 (motor de agenda) y de que sus
> predecesores estén archivados; hasta entonces este change no puede aplicarse.

## Why

C-07 es la primera pantalla que usa el staff para operar la agenda. Sin ella el motor de
agenda existe pero no se puede usar: la secretaria necesita ver los slots por profesional
y por sillón, reconocer de un vistazo qué está ocupado o bloqueado, y agendar/mover/cancelar
sin romper las reglas duras. El riesgo de este change no es de dominio sino de **fidelidad de
la UI a las reglas**: si la grilla permite arrastrar sobre un slot ocupado o no reconcilia
el `409` del backend, el usuario cree que agendó algo que no existe (RN-GL-01).

El change es verificable con e2e deterministas (agendar, choque de slot, cambio de vista) y
no introduce lógica de negocio nueva: consume la API de los changes anteriores.

## What Changes

- Se agrega la feature de frontend `agenda` bajo `frontend/src/features/agenda/`.
- Rutas staff: `/agenda` (día/semana, conmutable por profesional o sillón) y `/agenda/hoy`
  (dashboard de próximos turnos).
- Componentes: `AgendaGrid` (slots de 15 min), `AppointmentCard`, `BlockerCard`,
  `OverbookBadge`, `AppointmentForm`, `MoveAppointmentDialog`.
- Estado de vista en la URL (`?view=provider|chair&date=YYYY-MM-DD`) para deep-linking y
  para que el refresco tras un `409` no pierda contexto.
- Acciones: agendar, mover (drag & drop + alternativa por teclado), cancelar, marcar
  asistido/no_asistido.
- Manejo explícito de `409 APPOINTMENT_OVERLAP`: la tarjeta vuelve a su origen, el slot se
  pinta gris y se muestra un aviso; no se aplica ningún cambio optimista.
- Filtrado por rol: odontólogo solo ve su propia agenda; secretaria/director ven todo el
  consultorio (RN-AU-02, matriz RBAC).
- **Sin cambios de backend**: solo consume endpoints de agenda ya definidos por C-05/C-06.

## Capabilities

### New Capabilities
- `agenda/staff-ui`: operación de la agenda del consultorio desde la app staff, con vistas
  por profesional y sillón, bloqueos, sobreturnos y reconciliación de conflictos.

### Modified Capabilities
<!-- Ninguna: este change no modifica specs de dominio; solo agrega la capa de UI. -->

## Impact

- **Código nuevo**: `frontend/src/features/agenda/**`, `frontend/src/pages/agenda/**`,
  tests e2e en `frontend/e2e/agenda/**`.
- **API consumida**: `GET /api/schedule/availability`, `GET /api/appointments`,
  `POST /api/appointments`, `PATCH /api/appointments/{id}`, `POST /api/appointments/{id}/cancel`,
  `POST /api/appointments/{id}/status`. Deben existir (C-05/C-06).
- **Dependencias**: C-06 archivado; C-03 (auth/RBAC) para el guard de rol.
- **Base de datos**: ninguna migración.
- **Sistemas externos**: ninguno (sin WhatsApp/MercadoPago).
- **Datos**: solo seed ficticio; prohibido usar datos reales de pacientes (regla dura).
- **Tests**: Playwright e2e contra API + DB de test, reloj fijo y datos reproducibles.
