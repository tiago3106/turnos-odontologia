# Design — agenda-gestion-turnos

## Context

El change archivado `crear-turno-sin-solapamientos` implementó el alta con anti-solape en la
base. Este change agrega el resto del ciclo de vida del turno. Ver `proposal.md` y
`knowledge-base/05_reglas_de_negocio.md` (RN-AG-01/02/03), `07_flujos_principales.md` (Flujo de
reprogramación y cancelación).

## Goals / Non-Goals

**Goals:**
- Consultar la agenda por día, profesional, sillón y estado.
- Reprogramar sin romper el anti-solape.
- Cancelar y liberar el slot.
- Modelar estados y transiciones válidas.
- Auditar cada cambio.

**Non-Goals:**
- Cálculo de disponibilidad/slots libres (lo consume la reserva online, C-06/C-08).
- RBAC (C-03).
- Recordatorios por WhatsApp (C-07).
- Señas/pagos (Change 4).
- Interfaz gráfica.

## Decisions

### D1 — Índices parciales que ignoran cancelados
Se reemplazan `appointment_provider_no_overlap`, `appointment_operating_unit_no_overlap` y las
ventanas únicas por versiones `... WHERE status <> 'cancelado'`. *Por qué*: RN-AG-01/02 aplican a
turnos vigentes; un turno cancelado no debe bloquear el horario. Liberar el slot es una decisión
de este change (D1), no una regla nueva de la KB.

### D2 — Filtro `date` con zona del consultorio
`date=YYYY-MM-DD` se interpreta en `America/Argentina/Buenos_Aires` (UTC-3 fijo, sin DST), de
00:00 a 24:00. *Por qué*: la agenda es local; usar UTC haría que un turno de 21:00 aparezca en
el día siguiente. También se aceptan `from`/`to` ISO para rangos explícitos.

### D3 — `end` se recalcula con la prestación
Al reprogramar o cambiar la prestación, `end = start + procedure.defaultDurationMin`. *Por qué*:
RN-AG-03; evita que un turno de 60 minutos quede con 30 al moverlo.

### D4 — Transiciones de estado explícitas
`pendiente → confirmado|ausente`, `confirmado → atendido|ausente`; `atendido`, `ausente` y
`cancelado` son terminales. *Por qué*: evita saltos imposibles (`pendiente → atendido`) y
permite auditar la recepción. `cancelado` solo se alcanza por `POST /cancel` para registrar
fecha y motivo.

### D5 — Cancelación con motivo y timestamp
`cancelledAt` y `cancelReason` quedan persistidos; cancelar dos veces devuelve 409. *Por qué*:
trazabilidad operativa y de caja (una seña puede depender del motivo, Change 4).

### D6 — Listado por defecto sin cancelados
`includeCancelled=true` los incluye. *Por qué*: la agenda diaria debe mostrar solo turnos
vigentes; el histórico se consulta aparte.

## Risks / Trade-offs

- [R-01] Reprogramar y cancelar sin RBAC (C-03 pendiente). *Mitigación*: auditoría con actor y
  dependencia documentada.
- [R-02] Cambiar a índices parciales requiere recrear constraints; la migración lo hace en una
  transacción. *Mitigación*: probado sobre el esquema completo en la BD de test.
- [R-03] `date` fija UTC-3: si el consultorio cambia de zona, hay que parametrizarlo.
  *Mitigación*: helper único `dayRange` para cambiarlo en un solo lugar.

## Migration Plan

Migración 0004: agrega columnas, `CHECK`, elimina constraints/índices globales y crea los
parciales. Rollback = recrear los globales y borrar columnas en un entorno descartable.

## Open Questions

- Ninguna bloqueante.
