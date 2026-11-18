# Design — configuracion-clinica

## Context

Change de administración sobre los catálogos que ya consume la agenda. Ver `proposal.md`.
Referencias de la KB: `04_modelo_de_datos.md` §Organización y personal, §Procedure,
`05_reglas_de_negocio.md` RN-AG-03, RN-AU-01, RN-AU-02, `06_funcionalidades.md` Épicas 1 y 6.
Stack fijado por PA-01.

## Goals / Non-Goals

**Goals:**
- Administrar prestaciones con duración y precio en centavos (RN-AG-03, RN-OS-01).
- Administrar profesionales (especialidad, color) y sillones, con baja lógica.
- Definir horarios por profesional y día, sin solapes.
- Exponer lecturas internas para la agenda (`/schedule/providers`, `/schedule/sills`).
- Registrar altas y ediciones en `AuditLog` (RN-AU-01).

**Non-Goals:**
- RBAC (C-03): no se restringe por rol todavía; se documenta como dependencia.
- Motor de slots/disponibilidad (C-06): este change solo configura; no calcula turnos libres.
- Obras sociales (C-13) y precios por convenio.
- Interfaz gráfica.

## Decisions

### D1 — Precios en centavos (`priceCents`)
Se guarda un entero en centavos, nunca un float. *Por qué*: evita errores de redondeo en caja
y facturación (C-09/C-13). El borde HTTP también recibe centavos.

### D2 — Anti-solape de horarios en la base de datos
`ProviderSchedule` agrega una restricción `EXCLUDE USING gist (providerId =, dayOfWeek =,
int4range(startMinute, endMinute) &&)`. El servicio además valida antes de insertar para
devolver un `409 PROVIDER_SCHEDULE_OVERLAP` legible. *Por qué*: misma filosofía que RN-AG-01/02
y RN-GL-01; dos peticiones concurrentes no pueden dejar horarios superpuestos.

### D3 — Rangos semiabiertos `[start, end)`
Los horarios contiguos (fin == inicio siguiente) son válidos. *Por qué*: un profesional puede
atender 9:00–12:00 y 12:00–18:00 sin conflicto; solo el solape real se rechaza.

### D4 — Baja lógica en catálogos
`isActive=false` en lugar de borrar. Los listados por defecto muestran solo activos;
`?includeInactive=true` permite ver todo. *Por qué*: los turnos históricos referencian
prestaciones, profesionales y sillones; borrarlos rompería la trazabilidad.

### D5 — Código de prestación único por clínica
`@@unique([clinicId, code])`. *Por qué*: el código es la clave del nomenclador (RN-OS-01).

### D6 — Auditoría con actor desde `x-actor`
Cada alta/edición registra `entity`, `entityId`, `action` y snapshots. Sin JWT, el actor sale
de `x-actor` (fallback `sistema`). Al implementar C-03 se reemplaza por el `sub` del token.

## Risks / Trade-offs

- [R-01] Sin RBAC, cualquier cliente puede cambiar precios. *Mitigación*: documentado; C-03 es
  la dependencia real y el change no se presenta como completo en seguridad.
- [R-02] `int4range` requiere `btree_gist` (ya instalada en 0001). *Mitigación*: la migración
  asume la extensión existente; el setup de tests la crea.
- [R-03] El color es un formato `#RRGGBB`; no se valida contraste. *Mitigación*: la validación
  visual queda para la UI (fuera de alcance).

## Migration Plan

Migración 0003 aditiva. Rollback = `DROP TABLE provider_schedule` + `ALTER TABLE ... DROP COLUMN`
en un entorno descartable; no hay datos productivos.

## Open Questions

- Ninguna bloqueante. La autorización por rol se resuelve en C-03.
