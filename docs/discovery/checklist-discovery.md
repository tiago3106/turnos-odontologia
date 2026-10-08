# Checklist de Discovery — Sistema de Turnos y Agenda Odontológica (Argentina)

**Fecha de consulta de fuentes:** 2026-10-07
**Sistemas investigados:** 32 (11 Argentina · 13 Latinoamérica · 8 internacionales)
**Estado:** CONFIRMADO por el usuario el 2026-10-07 (gate de Discovery — Etapa 2)
**Evidencia de cada afirmación:** etiquetas `[Comprobado]`, `[Afirmación comercial]`, `[No evidenciado]` según la fuente oficial abierta.

---

## 1. Problema que resuelve

Los consultorios odontológicos argentinos (1 a 10+ profesionales) coordinan turnos por WhatsApp, planillas o papel y gestionan la ficha del paciente de forma fragmentada. El 82% de las ausencias declaradas en el mercado local muestra el costo de los no-shows. A esto se suman tareas que hoy se hacen a mano: recordatorios, cobro de señas, verificación de cobertura de obras sociales y facturación ante ARCA.

> **Formulación:** "Reducir ausencias y liberar a la secretaria del ida y vuelta de confirmar turnos, cobrar señas y administrar la agenda, con una herramienta web simple pensada para el consultorio argentino (WhatsApp, MercadoPago, obras sociales, ARCA)."

## 2. Usuarios / roles

| Rol | Verbo principal |
|---|---|
| **Secretaria / recepcionista** | agenda, confirma, cobra señas, gestiona recordatorios |
| **Odontólogo** | ve su agenda, registra atención en ficha, genera presupuestos |
| **Director / dueño de la clínica** | controla ocupación, cobros, comisiones y reportes |
| **Paciente** | reserva/cancela turno online, recibe recordatorios, completa ficha previa |

## 3. Casos de uso (priorizados para MVP)

1. Como secretaria, quiero agendar un turno sin que se solape con otro profesional o sillón para no tener que resolver choques después.
2. Como paciente, quiero reservar y cancelar mi turno online (o recibir un recordatorio por WhatsApp con confirmación) para reducir ausencias.
3. Como odontólogo, quiero registrar la prestación en la ficha clínica con odontograma para tener historial de cada pieza.
4. Como secretaria, quiero cobrar un turno o una seña (efectivo/tarjeta/MercadoPago) y dejarlo registrado en caja.
5. Como director, quiero ver reportes de ocupación, cobros y deudas por obra social para tomar decisiones.

## 4. Competidores / soluciones existentes

32 sistemas investigados con fuente oficial abierta (ver `informe-discovery.md`, sección A):

- **Argentina (11):** DentalSoft, DentalSaaS (DelRioTech), DentalTec (Tándem Digital), Órbita (Órbita Global), Bilog, Consultorio Digital, Odonthia (Genera Impacto), OdontoApp (Sovil), DentalCore, Dentaly, DentalPro (AR/MX).
- **Latinoamérica (13):** Dentalink (CL), OdontoSoft Millennium (GB Systems, AR/US), OdontSoft (CO), Dentrisoft (CO), DentalSoft (EC), Odontozen (EC), SIT-DENTAL (PE), Adiasoft (PE), OdontoWare (MX), XDentalCloud (MX), Simples Dental (BR), Codental (BR), Odontomy (UY).
- **Internacionales de referencia (8):** Open Dental, Dentrix Ascend, Eaglesoft, CareStack, Curve Dental, Dentally (Reino Unido), Solutionreach, Cloud 9 (Planet DDS).
- **Descartados/reservados:** ImedSoft, DentiSoft (PY), OdontoDraw, Dentarium, MundoDental, Odontis, Dienty, ClinicaPro, OdontoSuite, ZYRA (403), Odonogest/Gendu/BestoSys (sin fuente abierta), entre otros.

## 5. Funcionalidades necesarias (MVP)

- Agenda anti-solapamiento por profesional **y por sillón** (bloqueo a nivel de base de datos).
- Duración configurable por prestación y horarios por profesional.
- Bloqueos por feriados/vacaciones y **sobreturnos**.
- Reserva online 24/7 (link propio) + alta de paciente con ficha previa por QR/link.
- Recordatorios automáticos por WhatsApp con confirmación/cancelación que actualizan la agenda.
- Ficha clínica digital + **odontograma** con historial por pieza.
- Cobro de turnos y **señas** (efectivo, tarjeta, MercadoPago) con registro en caja.
- Cobertura y **obra social** con nomenclador argentino (sin validación en línea obligatoria en v1).
- Roles: secretaria / odontólogo / director; exportación de datos.

## 6. Funcionalidades opcionales

- Periodontograma y módulo de ortodoncia (alineadores/controles).
- Asistente IA (agenda por WhatsApp, resumen de pacientes, notas clínicas).
- Teleconsulta / videollamada integrada.
- Campañas de recall/controles automáticos y mailing.
- Multi-sucursal / redes de clínicas.
- Facturación electrónica ARCA (factura A/B/C con CAE) en v1 madura o v2.

## 7. Reglas de negocio

- No se pueden superponer turnos en un mismo profesional y sillón.
- La duración de un turno depende de la prestación (configurable).
- Hay que poder bloquear franjas (feriados, vacaciones, otros) y crear sobreturnos (urgentes) que no rompan la regla de solapamiento.
- Una seña cobrada va a cuenta del tratamiento/factura; registra el saldo.
- Los recordatorios se envían dentro de una ventana configurable (ej. 24 h y 2 h antes).
- Los datos de pacientes y fichas son sensibles: se tratan bajo Ley 25.326 (datos personales) y Ley 26.529 (historia clínica).

## 8. Integraciones

| Integración | Para qué | Evidencia de mercado |
|---|---|---|
| WhatsApp (API oficial de Meta o canal) | recordatorios y confirmaciones; costo por mensaje típico USD 0,02–0,03 | DentalCore (API Meta), DentalSoft (costo USD 0,026/msg) |
| MercadoPago | cobros y señas online | DentalCore, DentalPro, DentalSaaS, Odonthia |
| Google Calendar | sincronización de agenda por profesional | DentalSoft, Odonthia, DentalPro, Odontozen |
| ARCA (ex AFIP) | facturación electrónica | DentalTec, DentalCore |
| Obras sociales / prepagas | validación y liquidación | DentalTec (15+ por SOAP), DentalCore |

## 9. Restricciones

- **Cumplimiento:** Ley 25.326 (datos personales) y Ley 26.529 + decreto reglamentario (historia clínica); ámbito argentino.
- **Presupuesto/mercado:** los competidores locales validados cobran entre USD 25 y 70/mes equivalentes (Órbita Gestión USD 25/mes; DentalSoft ARS 30.000/mes). El precio debe ser competitivo en ese rango, o free tier con límites.
- **Datos:** es un trabajo de integración: usar **datos ficticios**, sin pacientes reales.
- **Stack/material:** se define en Etapa 3 (kb-creator); consigna pide evidenciar cada criterio y decisión.

## 10. Riesgos

- **Inventos del agente/supuestos sin probar:** adoptar funcionalidades "estándar" sin fuente (mitigación: etiquetas de evidencia).
- **Complejidad ARCA y obras sociales:** facturación electrónica y validación en línea son difíciles — por eso van en v2 o como regla no bloqueante.
- **Costo de mensajería WhatsApp:** el modelo gratis con muchos recordatorios puede no ser viable (competidores cobran USD 0,026/msg).
- **Free tiers engañosos:** varios competidores "gratis" tienen topes durísimos (Consultorio Digital 1 profesional; OdontoApp 10 pacientes).
- **Migración:** el barrer de datos desde Excel/otro sistema es un factor de adopción real (los proveedores lo ofrecen).
- **[No evidenciado en el mercado]:** ningún competidor evaluado documenta API pública, auditoría completa, respaldos cifrados ni cumplimiento detallado de Ley 25.326.

## 11. Preguntas abiertas

- ¿API pública / integraciones a terceros desde el día 1 o más adelante?
- ¿Auditoría completa (quién/cuándo/dónde) es requisito o diferencial?
- ¿Multi-sucursal es alcance o queda fuera del MVP?
- Detalle de cumplimiento: ¿qué nivel de trazabilidad y respaldo exige la cátedra para el informe?
- Definición de "web propia del consultorio" (DentalSoft/Simples incluyen sitio) como módulo o integración.

---

*Generado por `discovery-research` (Etapa 2 del flujo de fundación). Los insumos crudos por sistema están en `docs/discovery/` (fuentes) y la matriz ponderada en `informe-discovery.md` (sección B).*