# Validación de escenarios — caja-y-senas

## Veredicto: PASS

## Matriz regla → escenario

| Regla | Escenario(s) | Tipo | Estado |
|-------|--------------|------|--------|
| RN-CO-01 | La seña se registra como `Payment` y suma en el cierre de caja del día | feliz | cubierta |
| RN-CO-02 | No se borra: se anula con motivo y timestamp; doble anulación devuelve 409; seña exige referencia | feliz / error de negocio | cubierta |
| RN-CO-03 | El cierre agrupa por medio de pago y por profesional del turno, sin contar anulados | feliz / borde | cubierta |
| RN-AU-01 | Alta y anulación dejan `AuditLog` con actor y before/after | feliz | cubierta |
| RN-AU-02 | No aplicable: RBAC de director depende de C-03 | — | justificada |
| RN-PA-04 | Datos ficticios (`Paciente Ficticio`, `mp-ficticio-001`) en todos los tests | borde | cubierta |

Tipos presentes: feliz, error de negocio y borde (monto 0, seña sin turno, referencia
inexistente, anulados fuera del cierre, día sin cobros, fecha inválida).

## Brechas

Ninguna bloqueante.

## Ambigüedades

- [RN-CO-01] La seña "va a cuenta del tratamiento", pero no existe aún `Treatment`/presupuesto
  (C-13). Se registra la seña vinculada al turno y se documenta la deuda para C-13. No bloquea.
- [PA-04] ¿Seña con % fijo o monto libre? Se acepta monto libre en centavos, que cubre ambos
  escenarios sin cerrar la pregunta abierta.
- [RN-AU-02] Sin RBAC hasta C-03; el actor llega por `x-actor`.
- MercadoPago es solo `externalId` ficticio; la integración y el webhook firmado son C-12.

## Escenarios sugeridos

Ninguno.

## Tasks sin verificación

Ninguna. 1.1–4.3 tienen test o `prisma validate`; 5.1–5.4 son documentación, evidencia,
suite y archivado.
