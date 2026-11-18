-- Vincula el turno al paciente (KB 04_modelo_de_datos.md §Appointment).
-- Opcional para conservar compatibilidad con los turnos creados antes de C-06.2.
ALTER TABLE "appointment" ADD COLUMN "patientId" TEXT;

CREATE INDEX "appointment_patientId_start_idx" ON "appointment"("patientId", "start");

ALTER TABLE "appointment" ADD CONSTRAINT "appointment_patientId_fkey"
    FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
