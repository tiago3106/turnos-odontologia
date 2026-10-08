# Reglas de Negocio

Reglas codificadas con códigos Y/NN para trazabilidad. Dominios: AG (agenda), PA (pacientes/clínica), CO (cobros), OS (obra social), AU (auditoría).

## Dominio: Agenda (RN-AG)

- **RN-AG-01**: No se pueden superponer turnos en un mismo profesional (UNIQUE provider + ventana de tiempo). — Se garantiza a nivel de BD, no solo en UI.
- **RN-AG-02**: No se pueden superponer turnos en un mismo sillón (UNIQUE operating_unit + ventana de tiempo).
- **RN-AG-03**: La duración de un turno deriva de la prestación (`default_duration_min`), configurable por profesional/intervalo.
- **RN-AG-04**: Se permiten **bloqueos** por feriados/vacaciones/franjas reservadas; un bloqueo ocupa el slot como un turno no reservable.
- **RN-AG-05**: Los **sobreturnos** (urgentes) se permiten y respetan RN-AG-01/02: se asignan a un slot libre, no rompen la regla de solapamiento.
- **RN-AG-06**: Los recordatorios se envían en una ventana configurable por clínica (por defecto 24 h y 2 h antes).
- **RN-AG-07**: El paciente puede cancelar hasta el plazo configurable antes del turno; fuera de plazo requiere acción de la secretaria.
- **RN-AG-08**: La confirmación/cancelación del paciente por WhatsApp actualiza el estado del turno en la agenda.
- **RN-AG-09**: La disponibilidad online muestra solo slots libres reales (deriva de la misma fuente de verdad que la agenda interna).

## Dominio: Pacientes y ficha clínica (RN-PA)

- **RN-PA-01**: Todo paciente tiene al menos nombre y teléfono/email al momento del alta (mínimo para recordatorio).
- **RN-PA-02**: La ficha clínica es inmutable/historial: cada atención genera un nuevo registro encadenado (versionado), no sobrescribe el anterior.
- **RN-PA-03**: El odontograma registra estados por pieza (FDI) y superficie con fecha; permite re-visión (historial) sin borrar pasado.
- **RN-PA-04**: Datos de pacientes y fichas son sensibles (Ley 25.326 y Ley 26.529): en este proyecto se usan datos ficticios.

## Dominio: Cobros (RN-CO)

- **RN-CO-01**: Toda seña cobrada se registra en caja y va **a cuenta del tratamiento** (saldo resta del presupuesto/factura).
- **RN-CO-02**: Una seña se asocia a un turno o un tratamiento; no se puede eliminar, solo anular con trazabilidad.
- **RN-CO-03**: El cierre de caja devuelve turnos/señas por medio de pago (efectivo/tarjeta/MercadoPago) por profesional.

## Dominio: Obra social (RN-OS)

- **RN-OS-01**: El nomenclador usa prestaciones con código de práctica y cobertura % por obra social (copago).
- **RN-OS-02**: Las deudas por obra social se registran por prestador y mes (planilla mensual); la liquidación/validación en línea queda fuera de v0.1.

## Dominio: Auditoría (RN-AU)

- **RN-AU-01**: Toda acción de creación, modificación, anulación o cobro queda en `AuditLog` (usuario, entidad, timestamp, IP).
- **RN-AU-02**: Solo el director puede cerrar caja y configurar precios/prestaciones (RBAC).

## Excepciones globales

- **RN-GL-01**: En caso de conflicto de reglas, la integridad de la agenda (RN-AG-01/02) tiene prioridad sobre cualquier otra funcionalidad.
- **RN-GL-02**: Las reglas tienen trazabilidad hasta `docs/discovery/checklist-discovery.md` §7 (reglas validadas en Discovery).