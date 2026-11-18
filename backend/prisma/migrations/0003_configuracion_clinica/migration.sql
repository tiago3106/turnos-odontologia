-- Migración 0003 — configuración clínica (change configuracion-clinica)
-- Aditiva sobre las tablas existentes. No modifica turnos ni pacientes.

-- AlterTable provider
ALTER TABLE "provider" ADD COLUMN "specialty" TEXT;
ALTER TABLE "provider" ADD COLUMN "color" TEXT;
ALTER TABLE "provider" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable operating_unit
ALTER TABLE "operating_unit" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable procedure
ALTER TABLE "procedure" ADD COLUMN "priceCents" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "procedure" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "provider_schedule" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startMinute" INTEGER NOT NULL,
    "endMinute" INTEGER NOT NULL,
    "intervalMin" INTEGER NOT NULL DEFAULT 15,

    CONSTRAINT "provider_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "provider_schedule_providerId_dayOfWeek_idx" ON "provider_schedule"("providerId", "dayOfWeek");

-- AddForeignKey
ALTER TABLE "provider_schedule" ADD CONSTRAINT "provider_schedule_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ---------------------------------------------------------------------------
-- Reglas de configuración: horarios válidos y sin solape por profesional/día.
-- La garantía vive en la BD (misma filosofía que la agenda, RN-GL-01).
-- ---------------------------------------------------------------------------
ALTER TABLE "provider_schedule" ADD CONSTRAINT "provider_schedule_valid_range"
    CHECK ("startMinute" >= 0 AND "endMinute" <= 1440 AND "startMinute" < "endMinute");

ALTER TABLE "provider_schedule" ADD CONSTRAINT "provider_schedule_no_overlap"
    EXCLUDE USING gist (
        "providerId" WITH =,
        "dayOfWeek" WITH =,
        int4range("startMinute", "endMinute") WITH &&
    );
