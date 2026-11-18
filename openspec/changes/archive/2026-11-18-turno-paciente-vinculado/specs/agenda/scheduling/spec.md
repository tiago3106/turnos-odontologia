## ADDED Requirements

### Requirement: Vínculo turno-paciente
El sistema DEBE permitir crear y reprogramar un turno con `patientId` opcional y devolver el
paciente vinculado en la respuesta.

#### Scenario: alta vinculada (feliz)
- **GIVEN** un paciente activo de la clínica con nombre "Paciente Ficticio"
- **WHEN** se envía `POST /api/appointments` con `patientId` y `patientName` distinto
- **THEN** responde 201 con `patientId` igual al enviado, `patient.name = "Paciente Ficticio"` y
  `patientName` derivado del paciente

#### Scenario: referencia inexistente (error de negocio)
- **GIVEN** un `patientId` que no existe en la clínica
- **WHEN** se envía `POST /api/appointments`
- **THEN** responde 404 con `error = "PATIENT_NOT_FOUND"` y no se crea el turno

#### Scenario: turno sin vínculo (borde)
- **GIVEN** un payload sin `patientId`
- **WHEN** se crea el turno
- **THEN** responde 201 con `patientId = null` y conserva el `patientName` enviado
