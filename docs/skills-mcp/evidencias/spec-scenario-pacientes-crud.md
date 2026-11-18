# Validación de escenarios — pacientes-crud

## Veredicto: PASS

## Matriz regla → escenario

| Regla | Escenario(s) | Tipo | Estado |
|-------|--------------|------|--------|
| RN-PA-01 | Alta con nombre y teléfono; alta sin teléfono ni email; alta solo con email | feliz / error de negocio / borde | cubierta |
| RN-PA-04 | Datos ficticios en todos los tests (`Paciente Ficticio`, DNI ficticio) | borde | cubierta |
| RN-AU-01 | Alta audita `create`; edición audita `update` con before/after; rechazo no audita | feliz / borde | cubierta |
| RN-PA-02 | No aplicable: este change no crea historia clínica (C-08) | — | justificada |
| RN-PA-03 | No aplicable: no hay odontograma (C-08) | — | justificada |
| RN-AU-02 | No aplicable: no hay auth/RBAC (C-03) | — | justificada |

Tipos presentes: feliz, error de negocio y borde. Todos los escenarios son deterministas y
declaran un resultado observable (HTTP 201/400/404/409 y presencia/ausencia de `AuditLog`).

## Brechas

Ninguna bloqueante.

## Ambigüedades

- [RN-PA-01] El DNI es opcional y único por clínica; la KB no exige DNI, por lo que se mantiene
  nullable. Decisión no bloqueante, documentada en `design.md`.
- [RN-AU-02] La autorización por rol queda fuera del change hasta C-03; hoy el actor llega por
  `x-actor`. No bloquea la implementación.

## Escenarios sugeridos

Ninguno.

## Tasks sin verificación

Ninguna. Las tareas 1.1–4.4 tienen test o `prisma validate`; 5.1–5.3 son de documentación,
evidencia y archivado.
