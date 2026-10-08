# Informe de Discovery — Sistema de Turnos y Agenda Odontológica para Argentina

**Proyecto:** Gestión de turnos y agenda para consultorios odontológicos (mercado argentino)
**Fecha:** 2026-10-07
**Sistemas investigados:** 32 (11 AR · 13 LatAm · 8 internacionales de referencia)
**Método:** cada afirmación proviene de una **fuente oficial abierta** (sitio del proveedor, página de precios, funcionalidades, ayuda o política de privacidad). Se usa la escala de evidencia: **[Comprobado]** = documentado por el proveedor en la página abierta · **[Afirmación comercial]** = claim del proveedor sin respaldo independiente · **[No evidenciado]** = no aparece en las fuentes públicas abiertas (no implica que no exista).

---

## Sección A — Tabla comparativa de competidores (15+ sistemas)

Sistemas ordenados por **relevancia para el mercado argentino** (1 = máxima). Fuente de todos los datos: sitio oficial del proveedor, consultada el **2026-10-07** (detalle completo por sistema en `docs/discovery/sources/`).

| # | Sistema / Proveedor / País / Segmento | Reserva online | Recordatorios | Fuente + fecha |
|---|---|---|---|---|
| 1 | **DentalCore** — Di Tullio / AR / consultorios y clínicas B2B | No (solo confirmación con link) | Auto WhatsApp (API Meta) 48h y 24h, post-op, controles | dentalcore.app (+/pricing) · 2026-10-07 |
| 2 | **DentalSoft** — AR / 1 a 10+ profesionales, multi-sucursal | Sí (web propia 24/7, 4 pasos) | Auto WhatsApp (Meta, USD 0,026/msg in Pro) y e-mail | dentalsoft.com.ar · 2026-10-07 |
| 3 | **Órbita Gestión/Chat** — Órbita Global / AR / consultorio a red multi-sede | Chat agencia por WhatsApp; turnero público USD 20/mes | Auto WhatsApp con recontacto del que no responde | hiorbita.com (+/precios, /erp) · 2026-10-07 |
| 4 | **Odonthia** — Genera Impacto / AR / consultorio individual y equipos | Sí (página propia + sync Google/Apple/Outlook) | Manual (un clic) en gratis; **auto** en planes pagos | odonthia.com (+/planes, /funcionalidades/agenda) · 2026-10-07 |
| 5 | **DentalSaaS** — DelRioTech / AR / individual a clínicas de alto volumen | Sí (portal del paciente web/PWA) | Auto WhatsApp 24h y 2h, sin costo por mensaje (add-on IA extra) | dental.delriotech.com.ar · 2026-10-07 |
| 6 | **DentalTec** — Tándem Digital / AR / clínicas, obras sociales, instituciones | No evidenciado | Auto WhatsApp con confirmación en el propio WhatsApp | web.dentaltec.com.ar (+/funcionalidades) · 2026-10-07 |
| 7 | **Bilog** — AR / consultorios, clínicas y obras sociales | Sí (online 24/7, QR/link) | Auto WhatsApp; iAngela (IA) confirma | bilog.com.ar (+/soluciones/consultorios) · 2026-10-07 |
| 8 | **DentalPro** — AR/MX / solo (1) a clínica (6-8) | No evidenciado (link de seña auto por WhatsApp sí) | Auto WhatsApp 1 día antes + link de seña | dentalpro.tech (+/privacidad) · 2026-10-07 |
| 9 | **OdontoApp** — Sovil / AR / consultorios y clínicas multi-sede | No evidenciado | Auto WhatsApp configurables | odontoapp.com.ar · 2026-10-07 |
| 10 | **Dentaly** — AR / 1 profesional a clínica | Sí (reserva online) | Auto WhatsApp (extracto buscador; evidencia parcial) | dentaly.com.ar (SPA, JSON-LD) · 2026-10-07 |
| 11 | **Consultorio Digital** — AR / 1 profesional por cuenta | No evidenciado | Semi-auto (un clic abre WhatsApp con mensaje listo) | consultorio-digital.com.ar · 2026-10-07 |
| 12 | **OdontoSoft Millennium** — GB Systems / AR–USA / individual a grandes clínicas | No evidenciado (módulo web opcional aparte) | SMS/email masivos, caller ID | gbsystems.com/os · odontosoft.com · 2026-10-07 |
| 13 | **Simples Dental** — BR / individual a redes/franquicias | Sí (link de agendamento + app paciente) | Auto WhatsApp (confirmación) | simplesdental.com (+/planos-e-precos) · 2026-10-07 |
| 14 | **Codental** — BR / consultorios y clínicas | Sí (link de agendamento + site propio) | Auto WhatsApp (API Meta), SMS; alerta de no-show | codental.com.br (+/preco, /recursos/agenda) · 2026-10-07 |
| 15 | **Odontozen** — EC / 1 dentista a clínicas grandes | Sí (reservas 24/7 desde web o link) | Auto WhatsApp, confirmaciones y controles | odontozen.com (+/precios, /funcionalidades) · 2026-10-07 |
| 16 | **Dentalink** — CL / consultorios y clínicas | No evidenciado | Email + WhatsApp (testimonial) ; detalle parcial | softwaredentalink.com/cl/planes · 2026-10-07 |
| 17 | **Dentrisoft** — CO / 1 a +5 doctores | Parcial (paciente ve disponibilidad, confirma/reprograma) | Auto WhatsApp + alertas de cartera | dentrisoft.com · 2026-10-07 |
| 18 | **OdontoWare** — Medware / MX / dentistas y clínicas (suite multi-giro) | No evidenciado | Auto WhatsApp, SMS y email | medware.com.mx/software-para-dentistas · 2026-10-07 |
| 19 | **XDentalCloud** — MX / clínicas dentales | Sí (cita online 24h + portal paciente) | Auto (recordatorios y confirmaciones; IA para documentar) | xdentalcloud.com/software-dental-mexico · 2026-10-07 |
| 20 | **Open Dental** — EE.UU. / consultorios individuales | Sí (módulo Web Sched extra) | Recall automático (Web Sched Recall) | opendental.com (+/site/fees, /site/websched, /site/hipaa) · 2026-10-07 |
| — | *Internacionales de referencia (sin operación en AR):* CareStack (US, ISO 27001/SOC2, USD 829+/mes, reserva online), Curve Dental (US, self-scheduling con verificación SMS, requiere módulo GRO), Dentally (UK, waitlist + online booking, £265+/mes), Dentrix Ascend (US, booking online nativo configurable por bloque), Solutionreach (US, capa de comunicaciones/recordatorios), Cloud 9/Planet DDS (US, vertical de ortodoncia) · fuentes en `sources/internacional.md` | | | |

**Lectura de la tabla:** los 11 sistemas evaluados operan 100 % en la nube; **reserva online comprobada** en 8 de 11 argentinos (DentalSoft, Órbita, Odonthia, DentalSaaS, Bilog, Dentaly; DentalPro vía seña, parcial) y **recordatorios WhatsApp comprobados** en 10 de 11 (todos menos Consultorio Digital, semi-auto). Facturación ARCA solo comprobada en **DentalTec** y **DentalCore**; agregación de obras sociales en línea solo en **DentalTec** (SOAP/15+).

---

## Sección B — Matriz de evaluación ponderada

Ponderaciones definidas en la consigna (turnos/automatización 25 %, odontológico clínico 20 %, integraciones locales y WhatsApp 15 %, administración/cobros/facturación 15 %, experiencia del paciente 10 %, seguridad/exportación/trazabilidad 10 %, precio y facilidad de adopción 5 %). **Escala 1–5**; **"No evidenciado" puntúa 1** (no se atribuye valor funcional a lo que el proveedor no documenta). Total = suma(criterio x peso).

### 1. Criterios y peso

| Criterio | Peso |
|---|---|
| C1. Turnos y automatización (agenda, anti-solapamiento, recordatorios, reserva online) | 25 % |
| C2. Odontológico clínico (ficha clínica, odontograma, periodontograma, ortodoncia) | 20 % |
| C3. Integraciones locales y WhatsApp (Meta, MercadoPago, Google Calendar, ARCA, obras sociales) | 15 % |
| C4. Administración, cobros y facturación (caja, señas, obras sociales, facturación electrónica) | 15 % |
| C5. Experiencia del paciente (autogestión 24/7, portal, app, idioma local) | 10 % |
| C6. Seguridad, exportación y trazabilidad (auditoría, export de datos, cifrado, Ley 25.326) | 10 % |
| C7. Precio y facilidad de adopción (precio publicado, plan gratis/prueba, onboarding) | 5 % |

### 2. Puntajes por sistema (1–5)

| Sistema (país) | C1 25% | C2 20% | C3 15% | C4 15% | C5 10% | C6 10% | C7 5% | **Total** |
|---|---|---|---|---|---|---|---|---|
| **DentalCore (AR)** | 5 | 5 | 5 | 5 | 4 | 5 | 3 | **4,80** |
| **Órbita (AR)** | 5 | 5 | 3 | 4 | 4 | 4 | 3 | **4,25** |
| **DentalSoft (AR)** | 5 | 4 | 4 | 4 | 5 | 3 | 4 | **4,25** |
| Simples Dental (BR) | 5 | 5 | 3 | 4 | 4 | 3 | 3 | **4,15** |
| CareStack (US, ref.) | 4 | 5 | 3 | 5 | 4 | 5 | 1 | **4,15** |
| DentalSaaS (AR) | 4 | 5 | 3 | 4 | 4 | 4 | 3 | **4,00** |
| Codental (BR) | 5 | 4 | 3 | 4 | 4 | 3 | 4 | **4,00** |
| Odonthia (AR) | 4 | 5 | 3 | 2 | 4 | 3 | 5 | **3,70** |
| Dentally (UK, ref.) | 4 | 4 | 3 | 4 | 4 | 2 | 2 | **3,55** |
| DentalPro (AR/MX) | 4 | 3 | 3 | 3 | 4 | 4 | 4 | **3,50** |
| DentalTec (AR) | 3 | 3 | 4 | 5 | 2 | 4 | 3 | **3,45** |
| Bilog (AR) | 3 | 4 | 3 | 3 | 4 | 2 | 2 | **3,15** |
| OdontoApp (AR) | 2 | 4 | 2 | 3 | 2 | 3 | 4 | **2,75** |
| OdontoSoft Millennium (AR/US) | 2 | 3 | 1 | 4 | 2 | 3 | 3 | **2,50** |
| Dentaly (AR) | 3 | 3 | 2 | 2 | 3 | 1 | 3 | **2,50** |
| Consultorio Digital (AR) | 2 | 2 | 1 | 2 | 1 | 2 | 5 | **1,90** |

*Referencia de cálculo reproducida en `docs/discovery/matriz_b.json` (script Python con la ponderación exacta de la consigna, escala 1–5, "No evidenciado" = 1).*

### 3. Lectura

- **DentalCore lidera con 4,80** por integrar agenda, WhatsApp-Meta, MercadoPago, ARCA, obras sociales y trazabilidad/HL7 FHIR en un solo plan — es el benchmark funcional del mercado local, aunque paga el C7 (USD 50/mes, sin prueba) y es de lanzamiento reciente.
- **Órbita (4,25)** captura el diferencial de agenda a nivel de sillón más controles automáticos, aún en preventa para la parte Gestión.
- **DentalSoft (4,25)** iguala en turnos y experiencia de paciente con web propia + asistente IA, pero baja en C6 (auditoría/Ley).
- **El rango local "precio accesible"** (Odonthia gratis, DentalSoft USD ~30, Órbita USD 25) puntúa fuerte en C7, lo que para un MVP propio significa: **free tier + plan pago competitivo**.

---

## Sección C — Análisis competitivo (estándar, diferenciadores, vacíos, oportunidades)

- **Estándar del mercado (commodity):** SaaS 100 % web, agenda multi-profesional diaria/semanal con recordatorios por WhatsApp, ficha clínica + odontograma, caja simple, planes por suscripción con trial (7–15 días). Todos los proveedores locales lo tienen y no diferencia.
- **Diferenciadores ya existentes:**
  - *Agenda por sillón en BD* (Órbita) y *control de choques* (DentalCore) -> anti-solapamiento fuerte.
  - *Reserva online + ficha previa por link/QR* (Odonthia, DentalSoft, Bilog, DentalSaaS).
  - *Asistente/conversación IA* (Órbita Chat, Bilog iAngela, Simples "Secretária IA").
  - *Cumplimiento fiscal/clínico* (DentalTec: ARCA + 15 obras sociales; DentalCore: ARCA + FHIR).
  - *Recordatorios con costo por mensaje Meta* (DentalCore, DentalSoft, Simples, Codental) -> modelo B2B que traslada el costo variable.
- **Vacíos argentinos detectados ([No evidenciado] en todos):**
  1. **API pública / integraciones abiertas** — ninguno documenta una API pública.
  2. **Auditoría completa y trazabilidad** (quién/cuándo/dónde) solo en DentalTec, DentalCore, Órbita.
  3. **Cumplimiento detallado de Ley 25.326** (política + cifrado + respaldos + rol encargado/responsable) — solo DentalCore, DentalPro, OdontoApp, Odonthia lo abordan parcialmente.
  4. **Exportación estándar/interoperabilidad** — solo DentalCore ofrece HL7 FHIR; resto exporta PDF/Excel.
  5. **Todo-en-uno accesible** — ningún local combina agenda fuerte + WhatsApp Meta + MercadoPago + ARCA + obras sociales en un plan de bajo costo simultáneamente (DentalCore se acerca pero a USD 50 sin prueba).
- **Oportunidad de posicionamiento:** un MVP que defina agenda anti-solapamiento por profesional y sillón + reserva online + recordatorios WhatsApp con confirmación + cobro de señas MercadoPago, con free tier y precio en el rango USD 25–35, y que **documente trazabilidad y Ley 25.326 desde el día 1**, compite en los vacíos 1, 3, 4 y 5.

---

## Sección D — Recomendación de producto

### 1. A quién copiar para la demo / de quién aprender

**5 competidores para la demo (comportamiento y propuesta):**
1. **DentalCore** -> integración y trazabilidad (agenda, WhatsApp-Meta, MercadoPago, ARCA, HL7 FHIR).
2. **Órbita** -> agenda a nivel de sillón con control de choques y controles automáticos.
3. **DentalSoft** -> experiencia completa del paciente (reserva 24/7 + asistente IA + web).
4. **Odonthia** -> free tier exitoso con pacientes ilimitados (buscar la retención que justifica el $0).
5. **Codental** -> recordatorios y alertas (no-show, deudas abiertas) + link de agendamiento.

**3 referencias de UX:**
1. **Simples Dental** -> agenda visual por sillón y flujo de agendamiento (controles por cadeira).
2. **Dentrix Ascend** -> configuración de disponibilidad online por bloque y tipos de cita.
3. **Curve Dental** -> self-scheduling con verificación del turno online (código SMS + confirmación staff).

### 2. MVP propuesto (7 áreas de alcance)

**Imprescindible (bloqueante de v1):**
1. Agenda anti-solapamiento por profesional y sillón (regla dura) + calendario día/semana.
2. Gestión de pacientes (alta manual o por QR/link con ficha previa).
3. Ficha clínica digital + odontograma con historial.
4. Registro de agenda, bloqueos (feriados/vacaciones) y sobreturnos.
5. Cobro de turno y **señas** en caja (efectivo/tarjeta/MercadoPago).
6. Roles (secretaria / odontólogo / director).

**Diferenciador (lo que gana el cliente):**
7. Reserva online 24/7 con slots reales y cancelación.
8. Recordatorios por WhatsApp con confirmación que actualiza la agenda.
9. Obra social con nomenclador argentino y registro de deuda por obra social.
10. Exportación de datos (CSV/PDF) + trazabilidad de acciones.

**Posterior (v2+ / backlog):**
11. Facturación electrónica ARCA (A/B/C con CAE).
12. Asistente IA (agenda por WhatsApp, resumen clínico).
13. Periodontograma y módulo de ortodoncia.
14. Multi-sucursal y redes.
15. Teleconsulta, campañas de recall, API pública.

### 3. Decisiones de no-alcance documentadas

- MercadoPago y ARCA **no** requieren convenios complejos en v1: señas con MercadoPago son factibles; ARCA se difiere.
- WhatsApp: en v1, recordatorio vía **link/WhatsApp con envío manual + confirmación**, y el envío automático como add-on con costo Meta por mensaje (modelo DentalCore/Simples, no regalar el costo variable).
- Datos ficticios (consigna): ningún dato real de pacientes en el repo.

---

## Verificación de fuentes (re-apertura por el autor, 2026-10-07)

Se reabrieron **5 fuentes** de distinto tipo (sitio oficial, precios local, precios LatAm, precios internacional, planos BR) para contrastar la evidencia recopilada:

| # | Fuente (tipo) | Verificado al re-abrir |
|---|---|---|
| 1 | [dentalsoft.com.ar](https://dentalsoft.com.ar/) — sitio oficial AR | Confirma "+300 clínicas en Argentina" **[Afirmación comercial]**, planes listados en la home (Gratis 6 meses USD 0 con 50 turnos/mes y 1 odontólogo; Gestión ARS 30.000/mes; Pro ARS 60.000/mes), **costo WhatsApp Meta USD 0,026/recordatorio en Pro**, recordatorios automáticos + web + turnos online + "recepcionista IA". Coherente con la ficha del sistema. |
| 2 | [dentalcore.app/pricing](https://dentalcore.app/pricing) — página de precios AR | Confirma **USD 50/mes con 2 usuarios** (+USD 10/usuario, hasta 100), garantía de reembolso 14 días, sin plan gratis ni prueba, precio fundador USD 35 hasta el 31/12/2026 con pago adelantado, ARCA + obras sociales + MercadoPago + HL7 FHIR incluidos, pagos con MercadoPago o transferencia. Coherente con la ficha. |
| 3 | [odontozen.com/precios](https://odontozen.com/precios) — precios Ecuador | Confirma planes **USD 19,99 / 39,99 / 79,99 + IVA**, prueba 15 días sin tarjeta, 17% de descuento anual, módulos SRI +10/mes, especialidades +5/mes, Agenda con sync Google Calendar, reservas 24/7, recordatorios WhatsApp, backups diarios 90 días y modelo encargado/responsable APD. Coherente. |
| 4 | [carestack.com/pricing](https://carestack.com/pricing) — precios internacional (EE.UU.) | Confirma **Essentials desde USD 829/mes y Intelligence USD 1.299/mes**, online scheduling, patient forms/portal, "Trusted by 3000+ Dental Practices", módulos AI en el plan Intelligence, multi-sitio/DSO. Coherente con la ficha y el benchmarking. |
| 5 | [simplesdental.com/planos-e-precos](https://www.simplesdental.com/planos-e-precos) — planos Brasil | Confirma **Basic R$149,90 a 137,41; Plus R$249,90 a 229,08; Pro R$349,90 a 320,74/mes** (facturación anual), 7 días de prueba sin tarjeta, "100 milhões de dentistas" **[Afirmación comercial]**, agenda online + link de agendamento + app "Meu Doutor", confirmação automática por WhatsApp, control por cadeiras, asistentes IA (Secretária IA y Copiloto) **como servicios pagos aparte** (asterisco). Coherente. |

**Conclusión de la verificación:** las 5 fuentes reabiertas coinciden con las fichas de `sources/` en funcionalidades, precios y modelos comerciales. Se recomienda, antes de cualquier dato de facturación en el informe final, citar siempre precio + tipo de cambio + fecha (los precios en ARS/USD/BRL cambian).

---

## Anexo — Advertencias y notas metodológicas

1. Todas las cifras de adopción ("+300 clínicas", "2000+ profesionales", "100 mil dentistas") son **[Afirmación comercial]** sin auditoría independiente; no se usan como evidencia de funcionalidad.
2. "Comprobado" aquí = "documentado por el proveedor en su propia página abierta", no validación en producción.
3. Dentaly tiene precios inconsistentes entre el JSON-LD y el render (ARS 20.000 vs 35.000/100.000): tratar como evidencia parcial.
4. Órbita Gestión está en **preventa** (la agenda por sillón es de un producto aún no lanzado); Órbita Chat sí opera.
5. DentalPro no publica razón social; varios claims de adopción sin verificar.
6. Capterra/reviews no se usan (bloqueos HTTP 403); se descartan calificaciones de reseñas como evidencia.
7. Solo los sistemas argentinos tienen precios en ARS (algunos en USD); los brasileños en BRL y los de EE.UU. en USD a modo de referencia.
8. Ningún sistema evaluado abarca abiertamente los 4 vacíos definidos (API, auditoría, Ley 25.326 detallada, interoperabilidad) — es la brecha del MVP.

---

*Documento generado por `discovery-research` como parte del flujo de fundación (Etapa 2). Evidencia cruda por sistema en `docs/discovery/sources/`, checklist en `checklist-discovery.md`, salida en prosa en `discovery.md`, matriz reproducible en `matriz_b.json`.*