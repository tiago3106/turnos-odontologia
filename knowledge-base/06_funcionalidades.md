# Funcionalidades

Organizadas por **épica** y luego por **historia de usuario** (formato US-NNN).

## Épica 1: Agenda y disponibilidad

### US-001 — Agendar turno sin choques
**Como** secretaria
**Quiero** agendar un turno que nunca se superponga con otro del mismo profesional o silón
**Para** administrar la agenda del consultorio sin conflictos

**Criterios de aceptación**:
- [ ] CA-1: al agendar sobre un slot ocupado (mismo profesional o misma sillón), la API responde 409 y la UI bloquea el slot
- [ ] CA-2: el bloqueo funciona a nivel de base de datos (UNIQUE), no solo en UI
- [ ] CA-3: la duración del turno deriva de la prestación

**Reglas relacionadas**: RN-AG-01, RN-AG-02, RN-AG-03

### US-002 — Turnos por profesional y por sillón (vistas)
**Como** secretaria/director
**Quiero** ver la agenda por profesional (día/semana) y por sillón
**Para** planificar personal y capacidad de forma separada

**Criterios de aceptación**:
- [ ] CA-1: carga de la vista < 1 s en el 95 % de los casos (RNF-01)
- [ ] CA-2: cambio de vista sin recargar

**Reglas relacionadas**: RN-AG-01, RN-AG-02

### US-003 — Bloques y sobreturnos
**Como** secretaria
**Quiero** crear bloques de no-disponibilidad (feriados/vacaciones) y registrar sobreturnos urgentes
**Para** reflejar la realidad operativa

**Criterios de aceptación**:
- [ ] CA-1: los bloques ocupan el slot como no reservable (RN-AG-04)
- [ ] CA-2: los sobreturnos respetan las reglas de solapamiento (RN-AG-05)

**Reglas relacionadas**: RN-AG-04, RN-AG-05

### US-004 — Cancelar y reprogramar
**Como** secretaria
**Quiero** cancelar/reprogramar turnos respetando los plazos del paciente
**Para** gestionar la operación diaria

**Criterios de aceptación**:
- [ ] CA-1: cancelación del paciente por WhatsApp respeta el plazo configurado (RN-AG-07)
- [ ] CA-2: reprogramar vuelve a validar solapamiento

**Reglas relacionadas**: RN-AG-07, RN-AG-08

## Épica 2: Reserva online 24/7

### US-005 — Reserva online con slots reales
**Como** paciente
**Quiero** reservar/cancelar un turno por web en cualquier momento
**Para** evitar llamadas y reducir ausencias

**Criterios de aceptación**:
- [ ] CA-1: la disponibilidad online nunca muestra slots ocupados/bloqueados (RN-AG-09)
- [ ] CA-2: reservas en hold breve hasta confirmación (UC-02)

**Reglas relacionadas**: RN-AG-09

### US-006 — Ficha previa vía link/QR
**Como** paciente
**Quiero** completar mis datos previos desde el link de reserva
**Para** que la secretaria no tenga que cargarlos de nuevo

**Criterios de aceptación**:
- [ ] CA-1: alta mínima (nombre + teléfono/email) sin login (RN-PA-01)

**Reglas relacionadas**: RN-PA-01

## Épica 3: Pacientes y ficha clínica

### US-007 — Alta y ficha clínica versionada
**Como** secretaria/odontólogo
**Quiero** registrar pacientes y su historia clínica con historial encadenado
**Para** atender con contexto

**Criterios de aceptación**:
- [ ] CA-1: cada atención genera un nuevo registro, no sobrescribe (RN-PA-02)
- [ ] CA-2: acceso según RBAC (RN-AU-02)

**Reglas relacionadas**: RN-PA-02, RN-PA-03

### US-008 — Odontograma por pieza
**Como** odontólogo
**Quiero** registrar estados por pieza (FDI) y superficie
**Para** documentar el plan de tratamiento

**Criterios de aceptación**:
- [ ] CA-1: permite re-visión con historial sin borrar pasado (RN-PA-03)

**Reglas relacionadas**: RN-PA-03

## Épica 4: Cobros y señas

### US-009 — Cobrar turno y seña
**Como** secretaria
**Quiero** registrar cobros de turno y señas (efectivo/tarjeta/MercadoPago)
**Para** administrar la caja

**Criterios de aceptación**:
- [ ] CA-1: la seña va a cuenta del tratamiento (RN-CO-01)
- [ ] CA-2: el pago queda registrado con trazabilidad (RN-CO-02)

**Reglas relacionadas**: RN-CO-01, RN-CO-02

### US-010 — Cierre de caja y reportes
**Como** director
**Quiero** cerrar caja (por medio de pago/profesional) y ver reportes
**Para** controlar ingresos y deudas

**Criterios de aceptación**:
- [ ] CA-1: cierre de caja por medio y profesional (RN-CO-03)
- [ ] CA-2: exportación CSV/PDF (RF-19)

**Reglas relacionadas**: RN-CO-03, RN-AU-02

## Épica 5: WhatsApp y CRM

### US-011 — Recordatorio + confirmación por WhatsApp
**Como** paciente
**Quiero** recibir recordatorios y confirmar/cancelar desde el chat
**Para** no olvidar turnos con mínimo esfuerzo

**Criterios de aceptación**:
- [ ] CA-1: el webhook actualiza el estado del turno en < 5 s (RN-AG-08)
- [ ] CA-2: respeta la ventana configurable (RN-AG-06)

**Reglas relacionadas**: RN-AG-06, RN-AG-08, RN-OS-01

## Épica 6: Obra social y cumplimiento

### US-012 — Nomenclador y deudas por obra social
**Como** director
**Quiero** configurar cobertura % y registrar deuda por obra social
**Para** facturar y liquidar planillas mensuales

**Criterios de aceptación**:
- [ ] CA-1: nomenclador con código de práctica y cobertura/copago (RN-OS-01)
- [ ] CA-2: planilla de deuda por prestador/mes exportable (RN-OS-02)

**Reglas relacionadas**: RN-OS-01, RN-OS-02

### US-013 — Auditoría de acciones
**Como** director
**Quiero** poder ver quién/cuándo hizo cada cambio
**Para** asegurar integridad y cumplimiento (Leyes 25.326/26.529)

**Criterios de aceptación**:
- [ ] CA-1: toda creación/modificación/anulación/cobro queda en AuditLog (RN-AU-01)
- [ ] CA-2: datos ficticios en todo el proyecto (RN-PA-04)

**Reglas relacionadas**: RN-AU-01, RN-AU-02, RN-PA-04