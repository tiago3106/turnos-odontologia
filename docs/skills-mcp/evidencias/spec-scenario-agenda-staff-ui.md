# Validación de escenarios — agenda-staff-ui

> Ejecutada durante la preparación del change (2026-11-05) con la skill
> `spec-scenario-validator`. Entrada: `openspec/changes/agenda-staff-ui/`.

## Veredicto: PASS

La spec delta cubre todas las reglas de negocio aplicables, tiene mínimo un escenario feliz,
uno de error de negocio y uno de borde por requirement, y cada escenario declara un resultado
observable. Quedan ambigüedades no bloqueantes (ver abajo) que conviene cerrar al iniciar C-06.

## Matriz regla → escenario

| Regla | Escenario(s) | Tipo | Estado |
|-------|--------------|------|--------|
| RN-AG-01/02 (anti-solape) | Agendar, Mover, 409 al arrastrar, Sobreturno | feliz/error/borde | cubierta |
| RN-AG-03 (duración por prestación) | Agendar en slot libre; duración excede espacio | feliz/borde | cubierta |
| RN-AG-04 (bloqueos) | Slot bloqueado no agenda; bloqueo + turno adyacente; sobreturno sobre bloqueo | error/borde | cubierta |
| RN-AG-05 (sobreturnos) | Sobreturno en slot libre / sobre ocupado / sobre bloqueo | feliz/error/borde | cubierta |
| RN-AG-07 (plazo de cancelación) | Cancelar turno fuera del plazo del paciente | feliz | cubierta |
| RN-AU-01 (auditoría) | Cancelar turno registra auditoría | feliz | cubierta |
| RN-GL-01 (prioridad de integridad) | Rollback ante 409 en mover/agendar | error | cubierta |
| RN-AU-02 (solo director configura/caja) | — | — | no aplica: fuera de C-07 |
| RN-AG-06/08/09 (WhatsApp / reserva online) | — | — | no aplica: C-10/C-11 |
| RN-PA-04 (datos ficticios) | Tasks 0.2 y 4.6 | — | cubierta en tasks |

## Brechas

- Ninguna brecha bloqueante: toda regla aplicable tiene al menos un escenario y los tres tipos
  están presentes (21 escenarios en 7 requirements).

## Ambigüedades (no bloqueantes)

- **`/agenda/hoy` — "próximos turnos"**: no define ventana. ¿Todo el día ordenado o solo desde
  la hora actual? → Definir: mostrar todo el día, atenuando los ya pasados, o filtrar desde ahora.
- **Cancelar un turno pasado**: la spec exige confirmación adicional, pero no define si es una
  operación válida de negocio o si debe rechazarse. → Decidir con el dueño del producto.
- **Contrato de `PATCH /api/appointments/{id}`**: forma del payload pendiente de C-06.
- **Código de error de slot bloqueado**: la spec asume `409`, pero no define si usa
  `APPOINTMENT_OVERLAP` u otro código (`SLOT_BLOCKED`). → Confirmar con C-06.
- **RBAC en dos capas**: si la UI oculta la agenda ajena, el 403 de la API no se ejerce en el
  flujo normal. → Mantener validación server-side como defensa en profundidad y testearla aparte.
- **Criterio de "sobreturno urgente"**: RN-AG-05 no define urgencia ni límite de cantidad. → Fuera
  de alcance de C-07; anotar para C-06.

## Escenarios sugeridos (opcionales)

```markdown
#### Scenario: Dashboard distingue turnos pasados de próximos (borde)
- **GIVEN** hoy hay un turno a las 09:00 y otro a las 16:00, y son las 12:00
- **WHEN** se abre `/agenda/hoy`
- **THEN** el turno de 16:00 se muestra como próximo y el de 09:00 se muestra atenuado como pasado

#### Scenario: Cancelación de un turno pasado rechazada (error de negocio)
- **GIVEN** un turno cuya hora de inicio ya pasó
- **WHEN** la secretaria intenta cancelarlo
- **THEN** la API responde 409/422 con un código de "turno ya ocurrido" y no cambia el estado
```

## Tasks sin verificación

- Ninguna: cada escenario tiene al menos una task de test en `tasks.md` (secciones 2–4).

## Autochequeo

- [x] Toda regla aplicable tiene escenario; las no aplicables están justificadas.
- [x] Existen los tres tipos de escenario.
- [x] GIVEN/WHEN/THEN deterministas y con resultado observable.
- [x] Cada escenario tiene verificación en `tasks.md`.
- [x] Las decisiones de dominio citan `RN-*` de la KB.
