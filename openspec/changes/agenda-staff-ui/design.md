# Design — agenda-staff-ui

## Context

Change de UI sobre el motor de agenda de C-05/C-06. Ver `proposal.md`. Referencias de la KB:
`07_flujos_principales.md` §Flujo 2, `08_arquitectura_propuesta.md` §Estructura de
directorios, `03_actores_y_roles.md` §RBAC, `05_reglas_de_negocio.md` (RN-AG-01/02/03/04/05,
RN-AU-01/02, RN-GL-01). Stack fijado por PA-01: React (Vite) + TypeScript estricto.

## Goals / Non-Goals

**Goals:**
- Ver la agenda por profesional y por sillón, en día/semana, y alternar sin perder contexto.
- Distinguir visualmente slot libre, ocupado, bloqueado y sobreturno.
- Agendar, mover, cancelar y marcar estado sin violar RN-AG-01/02: la UI **nunca** decide
  el solape; solo muestra y reconcilia la respuesta del backend.
- Manejar `409 APPOINTMENT_OVERLAP` sin dejar estado optimista inconsistente.
- Respetar RBAC: odontólogo solo su agenda; secretaria/director todo el consultorio.
- Dashboard de hoy con próximos turnos.

**Non-Goals:**
- Motor de slots, validación anti-solape y persistencia (C-05/C-06).
- Reserva online pública (C-10), caja (C-09), ficha clínica (C-08).
- Edición de bloqueos/servicios (C-05 configuración).
- Notificaciones/WhatsApp.

## Decisions

### D1 — Módulo por feature y ruteo con estado en URL
`frontend/src/features/agenda/` con páginas en `frontend/src/pages/agenda/`. La vista y la
fecha viven en la query string (`?view=provider|chair&date=YYYY-MM-DD`).
- *Por qué*: cumple la estructura de la KB, permite deep-link y hace que un refresco tras un
  `409` recargue exactamente el mismo contexto.
- *Alternativa descartada*: estado global en memoria — se pierde al refrescar y complica el
  test e2e.

### D2 — El backend es la única fuente de verdad del solape
La UI no calcula solapes ni bloquea por su cuenta más allá de deshabilitar visualmente
slots marcados como ocupados/bloqueados. Al mover/agendar, envía la intención y espera la
respuesta; si es `409`, revierte y muestra el conflicto.
- *Por qué*: RN-GL-01 y RNF-03 exigen que la garantía viva en la DB; una decisión de UI
  podría contradecir un cambio concurrente.
- *Alternativa descartada*: validación optimista con rollback silencioso — oculta el
  conflicto y deja al usuario sin explicación.

### D3 — Reconciliación ante `409` con rollback explícito
`AppointmentCard` conserva su posición original; el drag se cancela y el slot destino queda
marcado como ocupado. Se muestra un aviso no bloqueante con la acción "ver slot".
- *Por qué*: el escenario de error de negocio del spec exige que no quede un turno duplicado
  ni una tarjeta "fantasma".

### D4 — Drag & drop con alternativa accesible
Además del arrastre, cada tarjeta ofrece "Mover" en un menú que abre un diálogo con slots
válidos. Teclado y lectores de pantalla usan esa vía.
- *Por qué*: accesibilidad y soporte táctil; el drag puro no es accesible ni confiable en
  móvil.

### D5 — Grilla de 15 minutos y virtualización por franja
Slots de 15 min; la duración de la prestación pinta el turno sobre los slots que ocupa.
Solo se renderiza la franja visible (día/semana) para mantener < 1 s (RNF-01).
- *Por qué*: la duración deriva de la prestación (RN-AG-03) y puede no ser múltiplo exacto;
  la tarjeta ocupa los slots necesarios.

### D6 — RBAC en dos capas
Guard de ruta + ocultamiento de acciones por rol en la UI, y confianza en el 403 de la API.
El odontólogo solo ve su agenda; secretaria/director ven todo.
- *Por qué*: la matriz RBAC es server-side (RN-AU-02); la UI solo evita ofrecer acciones que
  la API rechazará.

### D7 — E2E con Playwright, reloj fijo y seed ficticio
Los escenarios del spec se prueban contra la app real + API + DB de test, con fecha fija y
seed reproducible.
- *Por qué*: testear la reconciliación del `409` y el cambio de vista requiere el flujo
  completo; mockear la API probaría un mock.

## Risks / Trade-offs

- [R-01] Dependencia C-06 no archivada → no hay endpoints. *Mitigación*: task 1 bloqueante;
  no se implementa hasta que C-03/C-05/C-06 estén archivados.
- [R-02] Condición de carrera: otro usuario ocupa el slot entre el render y el drop.
  *Mitigación*: D2/D3 (409 → rollback + aviso), escenario de error cubierto.
- [R-03] Zonas horarias: la grilla muestra hora local y la API usa UTC. *Mitigación*:
  convertir solo en el borde y testear con fecha fija.
- [R-04] Agenda semanal densa degrada el render. *Mitigación*: D5 (virtualización por franja).
- [R-05] Drag & drop en touch. *Mitigación*: D4 (diálogo "Mover" como vía principal en móvil).
- [Trade-off] Duplicar el estado de la vista en URL agrega ruido, pero habilita deep-link y
  tests deterministas. Aceptado.

## Migration Plan

No hay migración de datos. Deploy = build del frontend + variables de entorno de API. Rollback
= revertir el feature flag de la ruta `/agenda` (no hay cambios de backend).

## Open Questions

- Ninguna bloqueante para preparar el change. La forma exacta del payload de
  `PATCH /api/appointments/{id}` se confirma al cerrar C-06.
