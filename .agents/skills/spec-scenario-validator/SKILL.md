---
name: spec-scenario-validator
description: "Audita una spec delta de OpenSpec (proposal/design/specs/tasks) contra las reglas de negocio de la knowledge-base y valida que haya al menos un escenario feliz, uno de error de negocio y uno de borde, todos verificables, antes de implementar. Usar al preparar o revisar un change de OpenSpec, cuando el usuario pide 'validar escenarios', 'revisar la spec' o antes de /opsx:apply."
---

Audita la calidad y cobertura de una **spec delta de OpenSpec** antes de escribir código.

## Cuándo activarse

- Se está preparando o revisando `openspec/changes/<change>/` (proposal, design, specs, tasks).
- El usuario pide "validar escenarios", "revisar la spec", "¿faltan casos?".
- Antes de ejecutar `/opsx:apply` o de archivar un change.

## Entradas

1. Nombre del change (ej. `agenda-staff-ui`).
2. Rutas de la spec delta: `openspec/changes/<change>/specs/**/spec.md`.
3. `openspec/changes/<change>/proposal.md`, `design.md` y `tasks.md` (si existen).
4. Reglas de negocio: `knowledge-base/05_reglas_de_negocio.md` y el doc de dominio que cite el change.
5. Spec vigente afectada: `openspec/specs/**/spec.md`.

Si falta el change o la spec delta, pedirlos y detenerse.

## Procedimiento

1. **Leer primero la KB y la spec vigente.** No inferir reglas del código ni del sentido común.
2. **Construir matriz regla → escenario.** Para cada `RN-*` aplicable, buscar al menos un escenario que la ejercite. Marcar `cubierta`, `faltante` o `ambigua`.
3. **Clasificar cada escenario** como `feliz`, `error de negocio` o `borde`.
4. **Verificar forma y verificabilidad.** Cada escenario debe:
   - usar `#### Scenario: <descripción> (feliz|error de negocio|borde)`;
   - tener `GIVEN`/`WHEN`/`THEN` concretos y deterministas (sin "quizás", "rápido", "adecuado");
   - declarar un resultado observable (estado, HTTP/error, registro en BD, mensaje);
   - no depender de servicios externos reales ni de datos de pacientes reales.
5. **Detectar ambigüedades** que bloqueen la implementación: límites numéricos sin definir, precedencia entre reglas, husos horarios, bordes de rango (fin==inicio), concurrencia, expiración de holds, plazos de cancelación, permisos por rol.
6. **Revisar `tasks.md`.** Cada escenario debe tener al menos una task de verificación (test unitario/integación/e2e). Si no, reportarlo.
7. **Emitir veredicto** `PASS` o `FAIL` con brechas accionables.

## Salida

Escribir un reporte en `docs/skills-mcp/evidencias/spec-scenario-<change>.md` con:

```markdown
# Validación de escenarios — <change>

## Veredicto: PASS | FAIL

## Matriz regla → escenario
| Regla | Escenario(s) | Tipo | Estado |
|-------|--------------|------|--------|

## Brechas
- [RN-XX] falta escenario de <tipo>: <qué probar>

## Ambigüedades
- [RN-XX] <término/límite> no definido → <decisión necesaria>

## Escenarios sugeridos
#### Scenario: <nombre> (error de negocio)
- **GIVEN** ...
- **WHEN** ...
- **THEN** ...

## Tasks sin verificación
- <task> → agregar test <tipo>
```

Si el usuario pide solo el análisis, entregar el reporte en el chat y no escribir archivo.

## Criterios de revisión (autochequeo)

- Toda `RN-*` aplicable tiene al menos un escenario; las no aplicables están justificadas.
- Existen los tres tipos: feliz, error de negocio y borde (mínimo 3 escenarios).
- Cada escenario es determinista y verificable de punta a punta.
- `tasks.md` verifica cada escenario.
- Cada decisión de dominio cita un `RN-*` de la KB.

## Reglas duras de la skill

- NUNCA inventar reglas de negocio → citar `RN-*` de `knowledge-base/`.
- NUNCA usar datos reales de pacientes u obras sociales → solo datos ficticios.
- NUNCA modificar la spec sin pedido explícito → proponer escenarios y esperar confirmación.
- NUNCA aprobar (`PASS`) con una regla aplicable sin escenario.
- NUNCA marcar `PASS` si un escenario no tiene verificación en `tasks.md`.
