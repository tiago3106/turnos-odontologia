# Exploración — `crear-turno-sin-solapamientos`

Fecha: 2026-10-08 · Fase **Explore** del ciclo OPSX (Etapа 6.2 de la consigna).
Relevamiento previo a proponer nada. Solo lectura.

## 1. Estado del código

| Elemento | Estado |
|---|---|
| `openspec/` | inicializado (root resuelto), `changes: []`, `specs: []` — sin cambios ni specs vigentes |
| `src/`, `tests/` | **no existen** — el change parte de cero |
| Commits en `main` | **0** (repo inicializado, sin historial) |
| Stack | resuelto (PA-01, 2026-10-08): Node 20+ / TypeScript + PostgreSQL 15+ + Prisma |
| Dependencias del change | ninguna archivada; el change se declara **autocontenido** (ver §4) |

## 2. Problema a resolver

Los consultorios agendan por WhatsApp/planilla/papel: dobles reservas del mismo sillón y
del mismo profesional, y tiempo perdido confirmando a mano. La regla dura del producto es
que **la agenda no se puede superponer nunca** — y que esa garantía viva en la base de
datos, no en la interfaz (RN-AG-01/02, DD-01, RN-GL-01).

## 3. Reglas de negocio que el change debe hacer verificables

| Regla | Enunciado | Fuente |
|---|---|---|
| RN-AG-01 | No se superponen turnos de un mismo **profesional** | `05_reglas_de_negocio.md` |
| RN-AG-02 | No se superponen turnos de un mismo **sillón** | `05_reglas_de_negocio.md` |
| RN-AG-03 | La duración deriva de la prestación (`default_duration_min`) | `05_reglas_de_negocio.md` |
| RN-GL-01 | La integridad de la agenda tiene prioridad sobre cualquier otra regla | `05_reglas_de_negocio.md` |
| CA-1 (US-001) | Slot ocupado → la API responde **409**, no solo la UI lo pinta | `06_funcionalidades.md` |
| CA-2 (US-001) | El bloqueo es **de base de datos** (UNIQUE), no solo de UI | `06_funcionalidades.md` |

Decisión de modelado asociada: **DD-01** — doble `UNIQUE` (`provider_id, start, end`) y
(`operating_unit_id, start, end`); alternativas "solo profesional" y "solo sillón" ya
descartadas.

## 4. Alcance acotado del change (una funcionalidad, no un módulo)

**Sí**:
- Mínimo modelo de dominio: `Appointment` (+ catálogo mínimo `Provider`, `OperatingUnit`,
  `Procedure` con `default_duration_min`) sobre PostgreSQL.
- Crear un turno validando choque por profesional Y por sillón, con el bloqueo en BD
  (constraint) y traducción del error de BD a **HTTP 409**.
- Duración derivada de la prestación (RN-AG-03).
- Tests automatizados por escenario del spec (feliz / error de negocio / borde).

**No** (queda para otros changes del roadmap): auth/RBAC, frontend/UI de agenda, bloqueos
por feriado, sobreturnos, reserva online, WhatsApp, caja, ficha clínica, multi-clínica real.

## 5. Riesgos y supuestos

- **Supuesto S-01**: el change autocontenido crea su scaffolding mínimo (`src/`, `tests/`)
  porque `C-01 foundation-setup` y `C-02 core-models` todavía no están archivados; se
  justifica en `proposal.md` y no rompe la regla de raíz única del `CHANGES.md` (sigue
  saliendo todo de `C-01` en el árbol del roadmap).
- **Riesgo R-01**: `UNIQUE (start, end)` no detecta solapes parciales (10:00–11:00 vs
  10:30–11:30). Se resuelve con un `EXCLUDE ... USING gist` de rangos solapados
  (`tsrange` + `btree_gist`) manteniendo el doble UNIQUE como red de seguridad — decisión
  de diseño a confirmar en `design.md`.
- **Riesgo R-02**: dos inserciones simultáneas (carrera) — la garantía la da la restricción
  de BD dentro de transacción, no el código.

## 6. Decisiones tomadas en la exploración

1. Change elegido: **`crear-turno-sin-solapamientos`** (ejemplo recomendado por la consigna,
   pertenece al MVP de la sección D del informe de Discovery).
2. Stack: **Node + TypeScript + PostgreSQL + Prisma** (cierra PA-01).
3. Alcanza con un módulo de dominio + API mínima; **no hace falta interfaz gráfica**
   (la consigna lo permite explícitamente).
4. Fuente de verdad: la BD; la API solo traduce el conflicto a 409 (RN-GL-01).
