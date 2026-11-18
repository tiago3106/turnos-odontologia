# Validación de escenarios — configuracion-clinica

## Veredicto: PASS

## Matriz regla → escenario

| Regla | Escenario(s) | Tipo | Estado |
|-------|--------------|------|--------|
| RN-AG-03 | El alta/edición de prestación fija `defaultDurationMin` que usa la agenda | feliz | cubierta |
| RN-OS-01 | Código de prestación único por clínica; duplicado devuelve 409 | error de negocio | cubierta |
| RN-AU-01 | Alta de prestación, perfil y horario deja `AuditLog`; edición guarda before/after | feliz | cubierta |
| RN-AG-01/02 | Horarios del profesional sin solape (aplicación del principio de agenda a la disponibilidad; decisión D2) | feliz / error de negocio / borde | cubierta |
| RN-AU-02 | No aplicable: RBAC de director depende de C-03 | — | justificada |
| RN-CO-01..03 | No aplicable: no hay cobros en este change | — | justificada |

Tipos presentes: feliz, error de negocio y borde (código duplicado, color inválido, rango
inválido, horarios contiguos, baja lógica, solape rechazado por la BD).

## Brechas

Ninguna bloqueante.

## Ambigüedades

- [RN-OS-01] La KB nombra el código de práctica pero no define formato/longitud; se fija
  1..20 caracteres como validación de borde. No bloqueante.
- [RN-AG-01/02] La KB no habla de horarios de disponibilidad; se aplica el mismo principio de
  no-solape por decisión D2, con la garantía en PostgreSQL (`EXCLUDE`). No se inventa una regla
  nueva: se documenta como decisión del change.
- [RN-AU-02] Sin RBAC hasta C-03; el actor llega por `x-actor`. No bloqueante.

## Escenarios sugeridos

Ninguno.

## Tasks sin verificación

Ninguna. 1.1–4.4 tienen test o `prisma validate`; 5.1–5.4 son documentación, evidencia,
suite y archivado.
