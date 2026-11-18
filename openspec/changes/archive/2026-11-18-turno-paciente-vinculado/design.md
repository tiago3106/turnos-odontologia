# Design — turno-paciente-vinculado

- La columna nueva es nullable: los turnos anteriores y las pruebas existentes siguen válidos.
- `patientId` se resuelve con `clinicId` + `isActive: true`; un paciente de otra clínica o dado de
  baja se trata como inexistente (`404 PATIENT_NOT_FOUND`) para no romper el aislamiento multi-clínica.
- Al enviar `patientId`, `patientName` se sobrescribe con `patient.name`: evita nombres
  desincronizados entre el turno y la ficha del paciente.
- En `PATCH`, si no se envía `patientId` se conserva el vínculo anterior; no hay forma de
  desvincularlo (fuera de alcance).
- La FK usa `ON DELETE SET NULL`; en el sistema se da de baja lógicamente, no se borra.
- El índice `(patientId, start)` habilita la futura vista "agenda del paciente" (C-08).

## Decisiones rechazadas

- Hacer `patientId` obligatorio en `POST`: habría invalidado los changes archivados y sus specs.
- Guardar solo `patientName`: ya demostró ser insuficiente para la trazabilidad clínica.
