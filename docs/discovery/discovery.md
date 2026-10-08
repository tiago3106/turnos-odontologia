# Discovery — Sistema de Turnos y Agenda Odontológica (Argentina)

**Fecha**: 2026-10-07
**Fuentes investigadas**: 32 sistemas (ver `sources/argentina.md`, `sources/latam.md`, `sources/internacional.md`; cada afirmación con etiqueta Comprobado / Afirmación comercial / No evidenciado y fecha de consulta).

## 1. Problema que resuelve

Los consultorios odontológicos argentinos gestionan turnos, fichas y cobros con WhatsApp, planillas o papel, lo que genera ausencias (no-shows), dobles reservas y tiempo perdido confirmando manualmente cada turno. El problema no se resuelve comprando software "de clínica" genérico: en el mercado local los competidores cobran entre USD 25 y 70/mes equivalentes y el 100% opera en la nube, pero ninguno documenta a la vez agenda anti-solapamiento por sillón, recordatorios por WhatsApp, cobro de señas con MercadoPago y facturación ARCA.

## 2. Usuarios / roles

- **Secretaria / recepcionista**: agenda, confirma, cobra señas, gestiona recordatorios.
- **Odontólogo**: ve su agenda, registra la prestación en la ficha, arma presupuestos.
- **Director / dueño de la clínica**: controla ocupación, cobros, comisiones y reportes.
- **Paciente**: reserva y cancela turno online, recibe recordatorios, completa ficha previa.

## 3. Casos de uso

1. Como secretaria, quiero agendar un turno sin que se solape con otro profesional o sillón para no tener que resolver choques después.
2. Como paciente, quiero reservar o cancelar mi turno online con recordatorio por WhatsApp para no olvidarlo.
3. Como odontólogo, quiero registrar la prestación en la ficha con odontograma para tener historial por pieza.
4. Como secretaria, quiero cobrar un turno o una seña (efectivo/tarjeta/MercadoPago) y registrarlo en caja.
5. Como director, quiero ver ocupación, cobros y deudas por obra social para decidir.

## 4. Competidores / soluciones existentes

Investigados 32 sistemas con fuente oficial abierta: **11 argentinos** (DentalSoft, DentalSaaS, DentalTec, Órbita, Bilog, Consultorio Digital, Odonthia, OdontoApp, DentalCore, Dentaly, DentalPro), **13 de Latinoamérica** (Dentalink CL, OdontoSoft Millennium AR/US, OdontSoft CO, Dentrisoft CO, DentalSoft EC, Odontozen EC, SIT-DENTAL PE, Adiasoft PE, OdontoWare MX, XDentalCloud MX, Simples Dental BR, Codental BR, Odontomy UY) y **8 internacionales de referencia** (Open Dental, Dentrix Ascend, Eaglesoft, CareStack, Curve, Dentally UK, Solutionreach, Cloud 9). Descartados: ImedSoft, DentiSoft PY, OdontoDraw, OD/Cloud sin país, ClinicaPro, ZYRA (403), entre otros.

**Notas**: DentalCore es el único que combina agenda con control de choques, WhatsApp oficial de Meta, ARCA, MercadoPago y HL7 FHIR; Órbita gestiona la agenda **a nivel de sillón en base de datos** (producto en preventa); Codental y Simples Dental (BR) tienen la agenda y la reserva online más maduras del listado; ningún sistema documenta API pública ni cumplimiento detallado de Ley 25.326.

## 5. Funcionalidades necesarias

- Agenda anti-solapamiento por profesional **y por sillón**.
- Duración configurable por prestación; horarios por profesional; bloqueos y sobreturnos.
- Reserva online 24/7 + alta de paciente con ficha previa por QR/link.
- Recordatorios automáticos por WhatsApp con confirmación/cancelación interactiva.
- Ficha clínica digital + odontograma con historial.
- Cobro de turnos y señas (efectivo/tarjeta/MercadoPago) con caja.
- Cobertura y obra social con nomenclador argentino.
- Roles (secretaria / odontólogo / director) y exportación de datos.

## 6. Funcionalidades opcionales

- Periodontograma y módulo de ortodoncia.
- Asistente IA (agenda por WhatsApp, resumen de pacientes, notas clínicas).
- Teleconsulta / videollamada.
- Campañas de recall/controles y mailing.
- Multi-sucursal / redes de clínicas.
- Facturación ARCA (A/B/C con CAE) en v2.

## 7. Reglas de negocio

- No se pueden superponer turnos en un mismo profesional y sillón.
- La duración de un turno depende de la prestación (configurable).
- Se pueden bloquear franjas (feriados, vacaciones) y crear sobreturnos que no rompan la regla de solapamiento.
- Una seña cobrada va a cuenta del tratamiento; registra el saldo.
- Los recordatorios se envían en una ventana configurable (ej. 24 h y 2 h antes).
- Los datos de pacientes y fichas son sensibles (Ley 25.326 y Ley 26.529).

## 8. Integraciones

- **WhatsApp** (API oficial de Meta o canal): recordatorios y confirmaciones; costo por mensaje típico USD 0,02–0,03 (DentalCore, DentalSoft `[Comprobado]`).
- **MercadoPago**: cobros y señas online (`[Comprobado]` en DentalCore, DentalPro, DentalSaaS, Odonthia).
- **Google Calendar**: sync de agenda por profesional (`[Comprobado]` en DentalSoft, Odonthia, DentalPro, Odontozen).
- **ARCA (ex AFIP)**: facturación electrónica (`[Comprobado]` en DentalTec y DentalCore).
- **Obras sociales / prepagas**: validación y liquidación (`[Comprobado]` en DentalTec vía SOAP con 15+ entidades).

## 9. Restricciones

- Cumplimiento: Ley 25.326 (datos personales) y Ley 26.529 + reglamentación (historia clínica); ámbito argentino.
- Rango de precio del mercado local comprobado: USD 25–70/mes equivalentes (Órbita Gestión USD 25/mes; DentalSoft ARS 30.000/mes; DentalCore USD 50/mes).
- Es un trabajo de integración: usar datos ficticios, sin pacientes reales.
- Stack y arquitectura: a definir en Etapa 3 (kb-creator).

## 10. Riesgos

- **Inventos del agente / supuestos sin probar**: asumir funcionalidades "estándar" sin fuente — mitigado con etiquetas de evidencia.
- **Complejidad ARCA y obras sociales**: máxima dificultad técnica; se pospone a v2 o se implementa como regla no bloqueante.
- **Costo de mensajería WhatsApp**: inviable un modelo muy gratuito con muchos recordatorios (competidores cobran hasta USD 0,026/msg).
- **Free tiers engañosos**: "gratis" con topes duros (Consultorio Digital 1 profesional; OdontoApp 10 pacientes).
- **Migración**: el import desde Excel/otro sistema es factor real de adopción.

## 11. Preguntas abiertas

- ¿API pública / integraciones a terceros desde el día 1?
- ¿Auditoría completa (quién/cuándo/dónde) es requisito o diferencial?
- ¿Multi-sucursal entra en el MVP o queda fuera?
- Nivel de trazabilidad/respaldo exigido por la cátedra.
- ¿Incluir "web propia del consultorio" como módulo o como integración?

---

*Documento de salida de `discovery-research` (Etapa 2). Consultar `checklist-discovery.md` para el detalle de los 11 puntos y `informe-discovery.md` para el análisis competitivo, la matriz ponderada y el plan de producto.*