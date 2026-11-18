-- Migración 0005 — caja y señas (change caja-y-senas)
-- Un Payment = un registro de caja (RN-CO-01). No se elimina: se anula con trazabilidad
-- (RN-CO-02). Todos los datos son ficticios.

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "appointmentId" TEXT,
    "patientId" TEXT,
    "type" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'registrado',
    "externalId" TEXT,
    "createdBy" TEXT NOT NULL DEFAULT 'sistema',
    "annulledAt" TIMESTAMPTZ,
    "annulReason" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "payment_clinicId_createdAt_idx" ON "payment"("clinicId", "createdAt");
CREATE INDEX "payment_appointmentId_idx" ON "payment"("appointmentId");
CREATE INDEX "payment_patientId_idx" ON "payment"("patientId");

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payment" ADD CONSTRAINT "payment_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payment" ADD CONSTRAINT "payment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Reglas de cobros (RN-CO-01/02)
ALTER TABLE "payment" ADD CONSTRAINT "payment_amount_positive" CHECK ("amountCents" > 0);
ALTER TABLE "payment" ADD CONSTRAINT "payment_type_valid" CHECK ("type" IN ('turno', 'sena'));
ALTER TABLE "payment" ADD CONSTRAINT "payment_method_valid"
    CHECK ("method" IN ('efectivo', 'tarjeta', 'mercadopago'));
ALTER TABLE "payment" ADD CONSTRAINT "payment_status_valid"
    CHECK ("status" IN ('registrado', 'anulado'));
ALTER TABLE "payment" ADD CONSTRAINT "payment_has_reference"
    CHECK ("appointmentId" IS NOT NULL OR "patientId" IS NOT NULL);
