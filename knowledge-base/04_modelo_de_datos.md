# Modelo de Datos

## Dominios

1. **Organización y personal** — clínica, profesionales, sillones, horarios.
2. **Agenda y turnos** — disponibilidad, turnos, estados, bloques, sobreturnos.
3. **Pacientes y ficha clínica** — paciente, ficha, odontograma, prestaciones.
4. **Cobros** — turno/seña en caja, medios de pago (efectivo, tarjeta, MercadoPago).
5. **Obra social** — nomenclador, cobertura, deudas por obra social.
6. **Auditoría** — trazabilidad de acciones por usuario (quién/cuándo/dónde).

## ERD (relaciones principales)

```
Clinic 1─* Provider 1─* Slot
   │          │
   │          └─* Appointment ─* Payment
   │                │  *
   │                │── Patient 1─* ClinicalRecord ─* ToothState(odontograma)
   │                └─── InsuranceCovers  (Provider─* Procedure ─* Insurance)
   │
  1└─* OperatingUnit(sillón) ─* Appointment(sillón asignado)
```

## Entidades

### Clinic
- `id`, `name`, `settings` (JSON: ventanas de recordatorio, plazo de cancelación), `created_at`
- 1—* Provider, 1—* OperatingUnit

### Provider (Profesional)
- `id`, `clinic_id`, `name`, `specialty`, `color`, `active`
- 1—* ProviderSchedule (día/hora/intervalos), 1—* Appointment

### OperatingUnit (Sillón)
- `id`, `clinic_id`, `name`
- 1—* Appointment (un turno activo por sillón al mismo tiempo)

### ProviderSchedule
- `provider_id`, `day_of_week`, `start`, `end`, `interval_min`
- Regla: los turnos se generan entre start y end con duración según prestación.

### Appointment (Turno)
- `id`, `clinic_id`, `provider_id`, `operating_unit_id`, `patient_id`, `procedure_id`
- `start`, `end` (duración derivada de la prestación), `status` (pendiente|confirmado|cancelado|asistido|no_asistido|sobreturno)
- `source` (secretaria|online|whatsapp), `hold_expires_at` (opcional, reserva online)
- **Constraints**: UNIQUE `(provider_id, start, end)` y UNIQUE `(operating_unit_id, start, end)` → solapamiento imposible a nivel de BD.
- Índices: `(provider_id, start)`, `(operating_unit_id, start)`, `(patient_id, start)`, `(status, start)`.

### Patient
- `id`, `clinic_id`, `name`, `phone`, `email`, `dni`, `insurance_id`, `created_at`
- 1—* Appointment, 1—* ClinicalRecord

### ClinicalRecord (Ficha clínica)
- `patient_id`, `provider_id`, `visit_at`, `notes`, `procedure_id`, `materials`
- 1—* ToothState

### ToothState (Estados por pieza del odontograma)
- `clinical_record_id`, `tooth_fdi`, `surface`, `state` (sano|caries|obturado|ausente|...)
- Índice: UNIQUE `(clinical_record_id, tooth_fdi, surface)`

### Procedure (Prestación)
- `id`, `clinic_id`, `name`, `code`, `default_duration_min`, `price`, `insurance_code`
- Base del nomenclador y de la duración de los turnos.

### Payment (Cobro / Seña)
- `id`, `appointment_id` (nullable), `patient_id`, `amount`, `type` (turno|seña), `method` (efectivo|tarjeta|mercadopago), `status`, `external_id` (MercadoPago), `created_by`
- 1 payment = 1 registro de caja; la seña va a cuenta del tratamiento.

### Insurance / InsuranceCover
- `Insurance`: `id`, `name`, `plan`
- `InsuranceCover`: `insurance_id`, `procedure_id`, `coverage_pct`, `copay`
- `Debt`: `insurance_id`, `provider_id`, `month`, `amount_debited`, `amount_collected` (para la planilla mensual).

### AuditLog
- `id`, `user_id`, `entity`, `entity_id`, `action`, `before`/`after` (JSON), `ip`, `created_at`
- Trazabilidad completa (apunta al diferencial "auditoría" del informe).

## Seed data inicial

- 1 clínica demo (ficticia) con 2 profesionales y 3 sillones.
- Catálogo mínimo de prestaciones (consulta, limpieza, endodoncia, extracción, ortodoncia) con duración y precio.
- Nomenclador de ejemplo de obra social (cobertura 50 %/80 % según prestación).
- Usuarios demo: secretaria, odontólogo, director (contraseñas ficticias, solo dev).