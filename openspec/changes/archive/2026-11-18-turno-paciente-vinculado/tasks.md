# Tasks — turno-paciente-vinculado (completas)

- [x] Agregar `patientId` y la relación en `Appointment` y `Patient` (schema.prisma).
- [x] Migración `0006_turno_paciente` con columna, FK e índice `(patientId, start)`.
- [x] Validar `patientId` opcional en `createAppointmentSchema` y `moveAppointmentSchema`.
- [x] Resolver paciente por clínica/activo en el servicio; derivar `patientName`.
- [x] Incluir `patientId` y `patient` en la respuesta y en el snapshot de auditoría.
- [x] Test: alta vinculada deriva el nombre y devuelve `patient`.
- [x] Test: `patientId` inexistente responde 404.
- [x] Verificar: `npm test` → 69/69; `npm run typecheck`; `npm run lint`.
