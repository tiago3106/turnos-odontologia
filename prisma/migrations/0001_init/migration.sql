-- Migración 0001 — esquema base del change crear-turno-sin-solapamientos
-- Generado con `prisma migrate diff --from-empty --to-schema-datamodel` y ampliado
-- con las restricciones de dominio (design.md D1).

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "clinic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "clinic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operating_unit" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "operating_unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procedure" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "defaultDurationMin" INTEGER NOT NULL,

    CONSTRAINT "procedure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointment" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "operatingUnitId" TEXT NOT NULL,
    "procedureId" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "start" TIMESTAMPTZ NOT NULL,
    "end" TIMESTAMPTZ NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirmado',
    "source" TEXT NOT NULL DEFAULT 'secretaria',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "provider_clinicId_idx" ON "provider"("clinicId");

-- CreateIndex
CREATE INDEX "operating_unit_clinicId_idx" ON "operating_unit"("clinicId");

-- CreateIndex
CREATE UNIQUE INDEX "procedure_clinicId_code_key" ON "procedure"("clinicId", "code");

-- CreateIndex
CREATE INDEX "appointment_providerId_start_idx" ON "appointment"("providerId", "start");

-- CreateIndex
CREATE INDEX "appointment_operatingUnitId_start_idx" ON "appointment"("operatingUnitId", "start");

-- CreateIndex
CREATE INDEX "appointment_clinicId_start_idx" ON "appointment"("clinicId", "start");

-- AddForeignKey
ALTER TABLE "provider" ADD CONSTRAINT "provider_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_unit" ADD CONSTRAINT "operating_unit_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedure" ADD CONSTRAINT "procedure_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_operatingUnitId_fkey" FOREIGN KEY ("operatingUnitId") REFERENCES "operating_unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "procedure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ---------------------------------------------------------------------------
-- Reglas de negocio de agenda (RN-AG-01, RN-AG-02, CA-2) — design.md D1
-- La garantía de no superposición vive en la base de datos, no en la aplicación.
-- ---------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Un turno siempre termina después de empezar (base de rangos válidos).
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_start_before_end"
    CHECK ("start" < "end");

-- RN-AG-01: dos turnos del mismo profesional nunca se solapan.
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_provider_no_overlap"
    EXCLUDE USING gist ("providerId" WITH =, tstzrange("start", "end") WITH &&);

-- RN-AG-02: dos turnos del mismo sillón nunca se solapan.
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_operating_unit_no_overlap"
    EXCLUDE USING gist ("operatingUnitId" WITH =, tstzrange("start", "end") WITH &&);

-- Red de seguridad (knowledge-base/04): la ventana idéntica tampoco se repite.
CREATE UNIQUE INDEX "appointment_provider_window_key"
    ON "appointment"("providerId", "start", "end");
CREATE UNIQUE INDEX "appointment_operating_unit_window_key"
    ON "appointment"("operatingUnitId", "start", "end");
