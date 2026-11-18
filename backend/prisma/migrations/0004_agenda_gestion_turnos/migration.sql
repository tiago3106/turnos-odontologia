-- Migración 0004 — gestión de turnos (change agenda-gestion-turnos)
-- Agrega estado de cancelación y hace que los turnos cancelados liberen el slot.
-- La garantía de no-solape sigue viviendo en la BD, ahora con índices parciales.

-- AlterTable appointment
ALTER TABLE "appointment" ADD COLUMN "cancelledAt" TIMESTAMPTZ;
ALTER TABLE "appointment" ADD COLUMN "cancelReason" TEXT;
ALTER TABLE "appointment" ADD COLUMN "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Estados permitidos del ciclo de vida del turno (decisión del change)
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_status_valid"
    CHECK ("status" IN ('pendiente', 'confirmado', 'atendido', 'ausente', 'cancelado'));

-- Reemplazar las restricciones globales por versiones parciales:
-- un turno cancelado ya no ocupa el profesional ni el sillón (RN-AG-01/02).
ALTER TABLE "appointment" DROP CONSTRAINT "appointment_provider_no_overlap";
ALTER TABLE "appointment" DROP CONSTRAINT "appointment_operating_unit_no_overlap";
DROP INDEX "appointment_provider_window_key";
DROP INDEX "appointment_operating_unit_window_key";

ALTER TABLE "appointment" ADD CONSTRAINT "appointment_provider_no_overlap"
    EXCLUDE USING gist ("providerId" WITH =, tstzrange("start", "end") WITH &&)
    WHERE ("status" <> 'cancelado');

ALTER TABLE "appointment" ADD CONSTRAINT "appointment_operating_unit_no_overlap"
    EXCLUDE USING gist ("operatingUnitId" WITH =, tstzrange("start", "end") WITH &&)
    WHERE ("status" <> 'cancelado');

CREATE UNIQUE INDEX "appointment_provider_window_key"
    ON "appointment"("providerId", "start", "end")
    WHERE ("status" <> 'cancelado');

CREATE UNIQUE INDEX "appointment_operating_unit_window_key"
    ON "appointment"("operatingUnitId", "start", "end")
    WHERE ("status" <> 'cancelado');

-- Búsquedas por estado dentro de la agenda
CREATE INDEX "appointment_clinicId_status_start_idx" ON "appointment"("clinicId", "status", "start");
