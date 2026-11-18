# Validación de escenarios — agenda-gestion-turnos

## Veredicto: PASS

## Matriz regla → escenario

| Regla | Escenario(s) | Tipo | Estado |
|-------|--------------|------|--------|
| RN-AG-01 | Solape del profesional al crear y al reprogramar devuelve 409 sin persistir | error de negocio | cubierta |
| RN-AG-02 | Solape del sillón cubierto por las mismas restricciones de BD (EXCLUDE parcial) | error de negocio | cubierta |
| RN-AG-03 | El fin se recalcula con `defaultDurationMin` al mover o cambiar prestación | feliz / borde | cubierta |
| RN-GL-01 | La agenda es fuente de verdad: la restricción de BD rechaza el solape aunque se saltee el servicio | error de negocio | cubierta |
| RN-AU-01 | Reprogramar, cancelar y cambiar estado registran `AuditLog` con actor y snapshots | feliz | cubierta |
| RN-AG-07 | No aplicable: cancelación del paciente por plazo/WhatsApp es C-11 | — | justificada |
| RN-AG-08 | No aplicable: webhook de WhatsApp es C-11 | — | justificada |
| RN-AU-02 | No aplicable: RBAC depende de C-03 | — | justificada |

Tipos presentes: feliz, error de negocio y borde (rango de día, cancelado fuera del listado,
slot liberado y reutilizado, transición inválida, doble cancelación).

## Brechas

Ninguna bloqueante.

## Ambigüedades

- [RN-AG-01/02] La KB no dice explícitamente que un turno cancelado libera el slot. Se resuelve
  como decisión D1 (los índices parciales ignoran `status='cancelado'`) y se documenta; no se
  inventa una regla nueva.
- [RN-AG-07] No hay plazo de cancelación configurable en este alcance; la cancelación es de
  staff. Queda para C-11.
- [RN-AU-02] Sin RBAC hasta C-03; el actor llega por `x-actor`.
- Zona horaria: el filtro `date` usa UTC-3 fijo (Argentina sin DST); queda centralizado en
  `dayRange` para parametrizar si cambia.

## Escenarios sugeridos

Ninguno.

## Tasks sin verificación

Ninguna. 1.1–4.4 tienen test o `prisma validate`; 5.1–5.4 son documentación, evidencia,
suite y archivado.
