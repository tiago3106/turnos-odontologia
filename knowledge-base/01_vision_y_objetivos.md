# Visión y Objetivos

## Propósito del sistema

Reducir ausencias y liberar a la administración del ida y vuelta manual de confirmar turnos, cobrar señas y controlar la agenda de los consultorios odontológicos argentinos.

El sistema es una herramienta web de agenda y gestión de turnos: agenda anti-solapamiento por profesional y por sillón, reserva online 24/7, recordatorios por WhatsApp con confirmación, ficha clínica con odontograma, cobro de turnos y señas con caja, y soporte de obra social con nomenclador argentino.

## Objetivos por actor

| Actor | Objetivo principal | Objetivos secundarios |
|---|---|---|
| Secretaria / recepcionista | Agendar sin choques y confirmar turnos | Cobrar señas, gestionar recordatorios, alta de pacientes |
| Odontólogo | Ver su agenda y registrar la prestación | Generar presupuestos, consultar historial del paciente |
| Director / dueño | Controlar ocupación y cobros | Ver deudas por obra social, comisiones, reportes |
| Paciente | Reservar/cancelar online | Recibir recordatorios, completar ficha previa |

## Alcance v0.1

- Agenda anti-solapamiento por profesional **y por sillón** (regla dura, sin doble reserva).
- Calendar con vistas día/semana; bloqueos por feriados/vacaciones; sobreturnos.
- Duración configurable por prestación y horarios por profesional.
- Alta de pacientes (manual o por QR/link con ficha previa).
- Ficha clínica digital + odontograma con historial.
- Registro de agenda y turnos en caja; cobro de turno y **señas** (efectivo, tarjeta, MercadoPago).
- Roles: secretaria / odontólogo / director.
- Reserva online 24/7 con slots reales y cancelación.
- Recordatorios por WhatsApp con confirmación que actualiza la agenda (envío inicial manual + confirmación; envío automático como add-on).
- Obra social con nomenclador argentino y registro de deuda por obra social.
- Exportación de datos (CSV/PDF) y trazabilidad de acciones.
- Datos ficticios (consigna del trabajo de integración).

## Fuera de alcance

- Facturación electrónica ARCA (A/B/C con CAE) — difiere a v2.
- Asistente IA de agenda/WhatsApp — posterior.
- Periodontograma y módulo de ortodoncia — posterior.
- Multi-sucursal y redes de clínicas — posterior.
- Teleconsulta, campañas de recall y mailing — posterior.
- API pública para terceros — posterior.
- Validación en línea de obras sociales contra prestadores — posterior (solo nomenclador y registro de deuda).

## Métricas de éxito

- Reducción de ausencias (no-shows) respecto del manejo manual/WhatsApp.
- Tiempo de la secretaria por turno gestionado (objetivo: agendar en < 30 s).
- % de turnos confirmados por el paciente vía recordatorio.
- % de señas cobradas antes de la prestación.
- Cero superposiciones reportadas en agenda de profesional/sillón.