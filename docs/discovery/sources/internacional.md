# Discovery — Sistemas internacionales de gestión odontológica / agenda

**Fecha de consulta de todas las fuentes:** 2026-10-07
**Alcance:** 8 sistemas de EE.UU., Reino Unido y mercados angloparlantes, evaluados como referencia para un producto argentino de turnos y agenda para consultorios odontológicos.

**Metodología y reglas de evidencia**
- Cada afirmación está etiquetada como **[Comprobado]** (verificado en una página oficial o de documentación abierta con la fecha indicada), **[Afirmación comercial]** (claim de marketing del proveedor, sin verificación independiente) o **[No evidenciado]** (no se encontró evidencia en fuentes abiertas; no implica que no exista).
- Las URLs de la sección *Fuentes* de cada sistema son páginas que **fueron abiertas** el 2026-10-07. URLs que devolvieron error 403 (bloqueo de scraping) se listan aparte como *fuentes inaccesibles* y **no** se usan como respaldo.
- Reclamos de usuarios (Capterra, Software Advice, G2) **no** pudieron verificarse por apertura (403); se reportan solo como observación de índice de búsqueda, marcados como no verificados.

**Nota de descarte:** *Dentlytics* (UK) existe pero es un startup en fase MVP de **analytics operativo** (tiempos de espera, dashboard) — no es un sistema de agenda/gestión odontológica; queda fuera de alcance. Lo mismo aplica a "Dentlytic" como supuesto sistema de turnos.

---

# 1. Open Dental

1. **Nombre / proveedor / país / URL oficial:** Open Dental — Open Dental Software, Inc. — EE.UU. — https://www.opendental.com/ **[Comprobado]**
2. **Segmento principal:** consultorios dentales individuales; soporta múltiples ubicaciones (tarifa reducida por ubicación adicional) **[Comprobado — página de precios]**
3. **Modalidad de despliegue:** software instalado en servidor/red local; acceso remoto documentado vía "Middle Tier" sobre HTTPS con certificado de seguridad **[Comprobado — página HIPAA]**. Despliegue 100% cloud **[No evidenciado]**
4. **Gestión de agenda:** módulo Appointments con: citas, lista de recall, "pinboard" (agendado flexible), visualización y gestión de citas **[Comprobado — manual de usuario]**
5. **Turnos digitales (agendado online):** familia de módulos **Web Sched**: Web Sched New Patient (pacientes nuevos), Web Sched Recall (recall), Web Sched ASAP (lista "lo antes posible") **[Comprobado — página oficial de Web Sched]**
6. **Automatización:** recall automatizado vía Web Sched Recall **[Comprobado]**; recordatorios SMS/email masivos, IA, lista de espera automática **[No evidenciado]**
7. **Gestión de la práctica odontológica (clínica):** **[No evidenciado en fuentes abiertas de esta investigación]** (esta investigación solo abrió fuentes de agenda, precios y seguridad)
8. **Administración / facturación:** **[No evidenciado en fuentes abiertas]**
9. **Integraciones:** eServices de Open Dental (módulos de terceros/propios como Web Sched) con fees adicionales **[Comprobado — página de precios]**
10. **Operación multi-sede / multi-profesional:** multi-ubicación con precio reducido por ubicación adicional **[Comprobado]**
11. **Seguridad / cumplimiento:** página HIPAA completa: la responsabilidad HIPAA es del consultorio, Open Dental es una herramienta de apoyo; BAA (Business Associate Agreement) descargable, actualizado febrero 2026; cifrado de datos en reposo y en tránsito; perfiles de usuario/grupos para audit trail; guía de Security Risk Analysis **[Comprobado — página HIPAA]**
12. **Modelo comercial:** US$199/mes por ubicación (plan estándar); US$149/mes ubicación reducida (reduced); Canadá CA$164/mes; **contrato mínimo 12 meses**; eServices/Web Sched con fees adicionales **[Comprobado — página de tarifas]**
13. **Fortalezas / limitaciones / diferencias:**
    - Fortaleza: **precios públicos y transparentes** (único del grupo con tarifas publicadas en USD) **[Comprobado]**; soporte HIPAA documentado con BAA público **[Comprobado]**.
    - Diferencia: arquitectura instalada (no cloud) frente al resto de la muestra **[Comprobado]**.
    - Limitaciones: **[No evidenciado]** desde fuentes oficiales (las reseñas de usuarios no pudieron abrirse).
14. **Evidencia de adopción:** "We have thousands of customers" (afirmación en su propia página HIPAA) **[Comprobado como afirmación del proveedor]**; calificación Capterra ~4.6 (87-89 reseñas) **[No verificado — Capterra devolvió 403]**

**Fuentes**
- `https://www.opendental.com/` · sitio oficial · consultada el 2026-10-07
- `https://www.opendental.com/site/fees.html` · página de precios · consultada el 2026-10-07
- `https://opendental.com/site/websched.html` · página de producto (turnos online) · consultada el 2026-10-07
- `https://www.opendental.com/manual/appointments.html` · manual de usuario · consultada el 2026-10-07
- `https://www.opendental.com/site/hipaa.html` · página de seguridad/HIPAA · consultada el 2026-10-07

---

# 2. Dentrix Ascend

1. **Nombre / proveedor / país / URL oficial:** Dentrix Ascend — Henry Schein One — EE.UU. (American Fork, Utah) — https://www.dentrixascend.com/ **[Comprobado]**
2. **Segmento principal:** consultorios privados y **DSOs / organizaciones multi-ubicación** ("your practice or DSO") **[Comprobado]**
3. **Modalidad de despliegue:** **cloud-native** ("one cloud-native practice management software"), datos centralizados en la nube **[Comprobado]**
4. **Gestión de agenda:** Calendar con vistas Día/Semana por proveedor; **scheduling templates** compuestos por *time blocks* por operatorio y día de la semana (proveedor, color, tipo de cita); horarios de trabajo por proveedor; control de doble booking; eventos/ausencias; excepciones de disponibilidad para agendado online (vacaciones del higienista, etc.) **[Comprobado — guías de ayuda oficiales]**
5. **Turnos digitales:** **reserva online 24/7** desde el sitio del consultorio o desde Google; por cada time block se configura qué se puede reservar online (Recare / New Patients / Existing Patients) y los *appointment reasons* que el paciente puede elegir; los cambios de plantilla tardan hasta 24 h en reflejarse online (o sync manual) **[Comprobado — guías de ayuda + página de producto]**
6. **Automatización:** recordatorios automatizados, formularios digitales ("Digital Forms" que cargan datos al historial antes de la visita), verificación de elegibilidad automática (Eligibility Pro), dictado clínico con IA (Voice Notes), control de calidad de radiografías con IA (Image Verify) **[Comprobado — página de packages; los beneficios cuantitativos son Afirmación comercial]**
7. **Gestión de la práctica odontológica:** charting, imaging en la nube, IA clínica embebida, documentación estructurada **[Comprobado — página de packages]**
8. **Administración / facturación:** seguros, billing, cobranzas, claims, dashboards de KPI y rentabilidad multi-ubicación **[Comprobado — página de packages]**
9. **Integraciones:** **Ascend API Exchange** para conectar software de terceros de forma segura **[Comprobado]**
10. **Operación multi-sede / multi-profesional:** **usuarios ilimitados en todos los paquetes**, datos centralizados, soporte 24/7 incluido, dashboards multi-ubicación **[Comprobado]**
11. **Seguridad / cumplimiento:** **[No evidenciado en fuentes abiertas]** — el sitio enlaza a una "Comprehensive Compliance Program and Declaration" de Henry Schein One, pero la página no pudo abrirse en esta investigación.
12. **Modelo comercial:** paquetes y suites personalizables (Essentials/Pro/Accelerate según índice de búsqueda, no verificado); **precios no publicados** (sin montos en USD en las páginas abiertas); todos los paquetes incluyen usuarios ilimitados + soporte 24/7 **[Comprobado]**
13. **Fortalezas / limitaciones / diferencias:**
    - Fortaleza: IA embebida en todas las capas (clínica, revenue, marketing) y agendado online nativo y configurable por bloque **[Comprobado]**.
    - Limitación documentada: **no se pueden crear excepciones de disponibilidad para varios proveedores en un solo evento** (hay que crear uno por proveedor) y hasta 24 h de latencia en sincronización de plantillas online **[Comprobado — guías de ayuda]**.
    - Precios opacos (a pedido) **[Comprobado]**.
14. **Evidencia de adopción:** se auto describe como "the world's leading dental software" **[Afirmación comercial]**; números de clientes **[No evidenciado]**

**Fuentes**
- `https://www.dentrixascend.com/` · sitio oficial · consultada el 2026-10-07
- `https://www.dentrixascend.com/dental-solutions/dentrix-ascend-packages-and-suites/` · página de producto/pricing · consultada el 2026-10-07
- `https://www.dentrixascend.com/dental-solutions/marketing-and-patient-experience/simplify-patient-booking/` · página de producto (turnos online) · consultada el 2026-10-07
- `https://www.dentrixascend.com/about-us/why-dentrix-ascend/` · página institucional · consultada el 2026-10-07
- `https://hsps.pro/DentrixAscend/Help/Adding_time_blocks_for_a_scheduling_template.htm` · guía de ayuda oficial (agenda) · consultada el 2026-10-07
- `https://hsps.pro/DentrixAscend/Help/Blocking_time_slots_from_online_booking_availability.htm` · guía de ayuda oficial (excepciones de agenda) · consultada el 2026-10-07

---

# 3. Eaglesoft

1. **Nombre / proveedor / país / URL oficial:** Eaglesoft — Patterson Dental (Patterson Companies) — EE.UU. — https://www.pattersondental.com/cp/software/dental-practice-management-software/eaglesoft
   ⚠️ El sitio de producto **bloqueó la apertura (HTTP 403)** el 2026-10-07; la evidencia de este sistema proviene de su **base de conocimiento de soporte** (abierta) y del índice de búsqueda.
2. **Segmento principal:** consultorios dentales **[Comprobado — documentación de soporte]**; "private practices / ~30.000 usuarios / 55+ integraciones" **[No verificado — página oficial inaccesible]**
3. **Modalidad de despliegue:** servidor local (server-based) **[No verificado en fuente abierta — proviene del índice de búsqueda de la página oficial bloqueada]**
4. **Gestión de agenda (módulo OnSchedule):** agendado para **múltiples proveedores en múltiples operatorias**; tipos de cita con colores; plantillas de día ("day templates"); vistas Día / Semana / Mes de un vistazo; **Quick Fill List** (pacientes que quieren turno antes, "sooner if possible"); **Appointment Queue** con turnos familiares y *Unscheduled Appointments* (captura la cita sin comprometer fecha/silla/hora) con drag & drop; **Custom Hours** por silla o por proveedor; **Patient Arrival Tracking** (llegada tardía, tiempo de espera, tiempo en silla); indicadores en el bloque de cita (alertas de paciente, HIPAA, estado de cita, "Sooner if Possible") **[Comprobado — FAQ de soporte Patterson]**
5. **Turnos digitales:** **[No evidenciado]** en fuente abierta (la "Online scheduling" aparece solo en la página oficial bloqueada); **eReminders**: recordatorios por llamada, email y/o texto que actualizan confirmaciones en la agenda **[Comprobado — FAQ de soporte]**
6. **Automatización:** eReminders (recordatorios/confirmaciones) **[Comprobado]**; recall automatizado y AI receptionist **[No verificado — página oficial bloqueada]**
7. **Gestión de la práctica odontológica:** **[No evidenciado en fuentes abiertas]**
8. **Administración / facturación:** **[No evidenciado en fuentes abiertas]**
9. **Integraciones:** **[No evidenciado en fuentes abiertas]** (el "Patterson Innovation Connection" con 55+ eServices aparece solo en el índice de búsqueda)
10. **Operación multi-sede / multi-profesional:** multi-proveedor/multi-operatorio en agenda **[Comprobado]**; multi-sede **[No evidenciado]**
11. **Seguridad / cumplimiento:** la información del bloque de cita es personalizable "making HIPAA compliance a snap"; existe indicador HIPAA en la agenda **[Comprobado como afirmación de la doc. de soporte]**; BAA/políticas **[No evidenciado]**
12. **Modelo comercial:** **[No evidenciado en fuente abierta]** — vende vía "Eaglesoft Service Club" (planes mensuales con licencia incluida), según índice de búsqueda de la página oficial **[No verificado]**
13. **Fortalezas / limitaciones / diferencias:**
    - Fortaleza: agenda (OnSchedule) muy madura y detallada — colas, espera, tracking de puntualidad, quick fill **[Comprobado]**.
    - Diferencia: producto tradicional on-premise, venta por distribuidor (Patterson) con representantes **[parcialmente no verificado]**.
    - Limitaciones: **[No evidenciado]** desde fuentes abiertas.
14. **Evidencia de adopción:** **[No evidenciado en fuente abierta]** ("~30.000 usuarios" proviene del índice de búsqueda de la página oficial bloqueada; Capterra UK ~4.1/157 reseñas visto solo en índice, no verificado)

**Fuentes**
- `https://pattersonsupport.custhelp.com/app/answers/detail/a_id/11343/~/use-onschedule` · base de conocimiento oficial de soporte (OnSchedule) · consultada el 2026-10-07

**Fuentes inaccesibles (403, no citadas como evidencia)**
- `https://www.pattersondental.com/cp/software/dental-practice-management-software/eaglesoft` · sitio oficial de producto · intentada el 2026-10-07 (HTTP 403)
- `https://www.capterra.co.uk/software/60064/eaglesoft-13-00` · reseñas · intentada el 2026-10-07 (HTTP 403)

---

# 4. CareStack

1. **Nombre / proveedor / país / URL oficial:** CareStack — Good Methods Global Inc. — EE.UU. (sitios con versiones US / UK / Australia) — https://carestack.com/ **[Comprobado]**
2. **Segmento principal:** consultorios de un sitio, **multi-sitio, DSOs**, prácticas "squat" (de nueva apertura), NHS & privadas, y especialidades (implantología, ortodoncia, endodoncia, etc.) **[Comprobado]**
3. **Modalidad de despliegue:** **cloud/SaaS** (app móvil "CS Mobile App" para gestionar agenda, pacientes, recetas y comunicaciones; sitio多versiones por país) **[Comprobado]**
4. **Gestión de agenda:** **Online Scheduling**, **Diary Management**, **Appointment Confirmations**, **Recall Management** **[Comprobado — índice oficial de funcionalidades]**
5. **Turnos digitales:** agendado online propio; **2-Way SMS**; Patient Portal, Patient Kiosk, Online Forms **[Comprobado — índice oficial de funcionalidades]**; flujo/detalle UX del booking **[No evidenciado — no se abrió la guía]**
6. **Automatización:** Patient Notifications, Appointment Confirmations, Communications Hub, Patient Chat, VoiceStack (agente de voz) **[Comprobado — índice de funcionalidades; VoiceStack solo como producto listado]**
7. **Gestión de la práctica odontológica:** Treatment Planning, Treatment Charting, Clinical Notes, Perio Charting, Prescription Management, **Integrated Imaging / Digital Radiographs** (imaging nativo, sin bridge externo) **[Comprobado]**
8. **Administración / facturación:** Online Payments, Pay-By-Text, Payment Plans, Multi-Payor Management, Membership, Practice Analytics, Scorecards, Clinician Payroll, **NHS Claims/Reporting** **[Comprobado]**
9. **Integraciones:** página oficial de Integrations + Developer hub **[Comprobado como existencia]**; detalle del catálogo **[No evidenciado]**
10. **Operación multi-sede / multi-profesional:** multi-sitio y DSO como segmento explícito; CS Mobile App **[Comprobado]**
11. **Seguridad / cumplimiento:** **ISO/IEC 27001:2022**, **SOC 2 Type II**, **NHS Data Security and Protection Toolkit (DSPT)**, **DCB0129 Clinical Risk Management**, Trust Centre público **[Comprobado — página de certificaciones]**; "fully compliant with HIPAA" **[Afirmación comercial — carestack.com]**
12. **Modelo comercial:** Essentials **US$829/mes**; Intelligence **US$1.299/mes**; planes multi-sitio a medida (custom) **[Comprobado — página de precios]**
13. **Fortalezas / limitaciones / diferencias:**
    - Fortaleza: **certificaciones de seguridad verificables** (ISO 27001, SOC 2 Type II) — el único de la muestra con esto comprobado **[Comprobado]**; ALL-IN-ONE (agenda + clínica + revenue + NHS) con precios públicos en USD **[Comprobado]**.
    - Diferencia: foco también en UK/Australia/NHS además de EE.UU. **[Comprobado]**.
    - Limitaciones: precio de entrada alto para consultorio chico (US$829/mes) **[Comprobado — inferencia directa del precio publicado]**; detalle de UX de agenda **[No evidenciado]**
14. **Evidencia de adopción:** "**Trusted by 300+ Dental Practices**" con logos de prácticas UK en su página de certificaciones **[Comprobado como afirmación del proveedor con logos visibles]**; case studies existentes en el sitio **[Comprobado como existencia]**

**Fuentes**
- `https://carestack.com/` · sitio oficial · consultada el 2026-10-07
- `https://carestack.com/pricing` · página de precios · consultada el 2026-10-07
- `https://carestack.com/en-GB/dental-software/certifications` · página de certificaciones/seguridad · consultada el 2026-10-07

---

# 5. Curve Dental

1. **Nombre / proveedor / país / URL oficial:** Curve Dental — CD Newco, LLC (EE.UU., según pie de copyright de su help center) — https://www.curvedental.com/ **[Comprobado]**
2. **Segmento principal:** consultorios independientes, **DSOs** y startups dentales (categorías de su sitio) **[Comprobado]**
3. **Modalidad de despliegue:** **cloud** (accesible desde web y desde la app móvil **Curve Mobile**) **[Comprobado]**
4. **Gestión de agenda:** **master schedule** totalmente personalizable con colores por tipo de cita; incrementos de tiempo configurables; **Smart Fill** para llenar cancelaciones de último minuto; **Sidekick** (barra lateral con acceso a datos del paciente); gestión de hogares (turnos familiares); permisos de agendado online por tipo de paciente **[Comprobado — página de scheduling]**
5. **Turnos digitales:** **Patient Self-Scheduling** (plataforma propia en `dental4.me/<clinica>`): alta de paciente nuevo y existente, selección de proveedor, primera disponible u otras opciones (mañana/tarde/noche), **código de verificación SMS de 6 dígitos**, y **verificación manual del turno online** por el staff en el scheduler; **requiere el módulo Curve GRO** (no está incluido en el plan base) **[Comprobado — guías oficiales del help center]**
6. **Automatización:** configuración granular del booking online por: seguro (aseguradoras visibles), disponibilidad de proveedor, disponibilidad de operatorio, tipos de cita (nuevo/existente), tags, duración exacta de la cita, días/horarios permitidos, **antelación mínima** (ej. 24 h); **Block List** (bloqueo de números de teléfono que no pueden agendar online); Smart Action List de Curve GRO **[Comprobado]**
7. **Gestión de la práctica odontológica:** Charting, Imaging, Treatment Planning, Perio Charting, ePrescribe, Smart Forms **[Comprobado — índice de funcionalidades del sitio]**
8. **Administración / facturación:** **Curve Pay**, Membership Plans, Analytics **[Comprobado — índice de funcionalidades]**
9. **Integraciones:** **[No evidenciado]** (no se localizó/abrió página de marketplace de integraciones)
10. **Operación multi-sede / multi-profesional:** multi-clínica (la plataforma online lista varias clínicas del grupo) **[Comprobado]**
11. **Seguridad / cumplimiento:** **[No evidenciado]** — no se encontró página de seguridad/HIPAA/SOC2 abierta en esta investigación
12. **Modelo comercial:** **precios a pedido (quote)** — sin montos publicados **[Comprobado — página de precios abierta]**; Self-Scheduling **depende de Curve GRO** (módulo adicional) **[Comprobado]**
13. **Fortalezas / limitaciones / diferencias:**
    - Fortaleza: control total del agendado online (seguro/proveedor/operatorio/tipo/antelación/bloqueo de números) **[Comprobado]**.
    - Limitaciones: self-scheduling requiere Curve GRO **[Comprobado]**; precios no publicados **[Comprobado]**; seguridad/cumplimiento **[No evidenciado]**
14. **Evidencia de adopción:** testimonios publicados de office managers (ej. Tracey L.) **[Comprobado como testimonio]**; ~4.5/285 reseñas Capterra vistas en índice de búsqueda **[No verificado — Capterra 403]**

**Fuentes**
- `https://www.curvedental.com/` · sitio oficial · consultada el 2026-10-07
- `https://www.curvedental.com/pricing` · página de precios · consultada el 2026-10-07
- `https://www.curvedental.com/dental-scheduling-software` · página de producto (agenda) · consultada el 2026-10-07
- `https://curvedental.zendesk.com/hc/en-us/articles/50239303700883-Setting-Up-Self-Scheduling-to-Maximize-Your-Practice` · guía oficial del help center (self-scheduling) · consultada el 2026-10-07
- `https://curvedental.zendesk.com/hc/en-us/articles/50239233556115-Understanding-the-Patient-Self-Scheduling-Platform` · guía oficial del help center (plataforma de reserva) · consultada el 2026-10-07

---

# 6. Dentally

1. **Nombre / proveedor / país / URL oficial:** Dentally — Henry Schein One UK Ltd (registrada en Kent, Reino Unido) — Reino Unido — https://www.dentally.com/ **[Comprobado]**
2. **Segmento principal:** consultorios de un sitio, **multi-sitio/grupos**, prácticas **NHS y HSC** (Inglaterra, Gales, Escocia, Irlanda del Norte), nuevas prácticas **[Comprobado]**
3. **Modalidad de despliegue:** **cloud** ("in the cloud"), sin instalación; accesible desde web **[Comprobado]**
4. **Gestión de agenda:** **diary management**, **waitlists** (listas de espera), **short notice appointment filler** (llenado de huecos de última hora), herramientas de "chair time utilisation" **[Comprobado — homepage/soluciones]**
5. **Turnos digitales:** **online appointment booking** + **digital form filling** + "seamless arrivals" vía **Dentally Portal** (portal del paciente) **[Comprobado]**
6. **Automatización:** **automated messaging**, recordatorios y confirmaciones automatizados para reducir "fail to attend" (faltas), **short notice filler** **[Comprobado]**
7. **Gestión de la práctica odontológica:** charting, **AI clinical notes**, imaging avanzado con detección asistida por IA **[Comprobado — homepage]**
8. **Administración / facturación:** reporting en tiempo real, integración NHS (claims/reporting NHS en el índice de funcionalidades) **[Comprobado]**
9. **Integraciones:** **partner marketplace** (pagos, feedback, etc.) + **Developer Hub** público **[Comprobado]**
10. **Operación multi-sede / multi-profesional:** multi-sitio con visibilidad de grupo; **usuarios ilimitados** en todos los planes **[Comprobado]**
11. **Seguridad / cumplimiento:** existe página/policy de seguridad ("Security and Dentally") **[Comprobado como existencia]**; controles específicos (cifrado, GDPR, certificaciones) **[No evidenciado]** — la página de seguridad abierta no expuso detalles en el contenido recuperado.
12. **Modelo comercial:** Starter **£265/mes + IVA**, Essentials **£380/mes + IVA**, Pro **£510/mes + IVA**; usuarios ilimitados, storage ilimitado, integración NHS; **sin plan gratuito** **[Comprobado — página de precios]**
13. **Fortalezas / limitaciones / diferencias:**
    - Fortaleza: diario con waitlist + rellenado de huecos + booking online en un solo producto; fuerte integración NHS **[Comprobado]**.
    - Limitación clave para LatAm/Argentina: **mercados disponibles: UK, Australia, Canadá, Irlanda, Nueva Zelanda — sin sitio ni soporte para EE.UU./LatAm/España** (selector de idiomas del sitio) **[Comprobado]**.
    - Reseñas de usuarios recientes son negativas tras una actualización (Capterra UK 3.6/18) **[No verificado — 403]**
14. **Evidencia de adopción:** "trusted by over 50,000 dental practitioners worldwide" **[Afirmación comercial — descripción del proveedor en Capterra; no verificada por apertura]**; sin número en el sitio oficial abierto **[No evidenciado]**

**Fuentes**
- `https://www.dentally.com/` · sitio oficial · consultada el 2026-10-07
- `https://www.dentally.com/en-gb/pricing` · página de precios · consultada el 2026-10-07
- `https://www.dentally.com/en-gb/dental-software-features/practice-admin` · página de funcionalidades · consultada el 2026-10-07
- `https://www.dentally.com/en-gb/security` · página de seguridad · consultada el 2026-10-07

---

# 7. Solutionreach

1. **Nombre / proveedor / país / URL oficial:** Solutionreach — Solutionreach, Inc. — EE.UU. — https://www.solutionreach.com/ **[Comprobado]**
2. **Segmento principal:** consultorios dentales (y de otras especialidades de salud) — **comunicación y engagement con pacientes**, no PMS clínico **[Comprobado — página de pricing]**
3. **Modalidad de despliegue:** SaaS en la nube **[Comprobado — se infiere de ser una plataforma web de comunicaciones; label: comportamiento cloud]**
4. **Gestión de agenda:** **Online Scheduling** (el paciente agenda por sí mismo) **[Comprobado — página dedicada]**
5. **Turnos digitales:** agendado online del paciente integrado a las comunicaciones **[Comprobado]**
6. **Automatización:** recordatorios de citas, **two-way texting** (SMS bidireccional), **AI Receptionist** (recepcionista de IA, producto nuevo), patient check-in **[Comprobado — página de plataforma]**
7. **Gestión de la práctica odontológica:** **No aplica** — no es un PMS clínico: no tiene odontograma/charting **[Comprobado por ausencia en su arquitectura de producto; label: No aplica]**
8. **Administración / facturación:** **[No evidenciado]**
9. **Integraciones:** se integra con PMS dentales (Dentrix, Eaglesoft, Open Dental, etc.) **[No evidenciado en fuente abierta — no se abrió página de integraciones]**
10. **Operación multi-sede:** plan **Enterprise** para grupos **[Comprobado — página de pricing]**
11. **Seguridad / cumplimiento:** **[No evidenciado]** en fuentes abiertas
12. **Modelo comercial:** planes **Patient Connect** y **Enterprise**; **contratos anuales**; precios **a pedido**; onboarding con "success coach" **[Comprobado — página de pricing]**
13. **Fortalezas / limitaciones / diferencias:**
    - Diferencia: es un **complemento de engagement/comunicaciones**, no un sistema de agenda de consultorio completo — referencia útil para la capa de recordatorios/SMS/IA **[Comprobado]**.
    - Limitaciones: sin precios públicos, contrato anual **[Comprobado]**
14. **Evidencia de adopción:** **[No evidenciado]** en fuentes abiertas (sin números de clientes verificados)

**Fuentes**
- `https://www.solutionreach.com/` · sitio oficial · consultada el 2026-10-07
- `https://www.solutionreach.com/pricing` · página de precios · consultada el 2026-10-07
- `https://www.solutionreach.com/platform/solutions-overview/online-scheduling` · página de producto (turnos online) · consultada el 2026-10-07

---

# 8. Cloud 9 (Planet DDS) — incluido por la vertical de ortodoncia

1. **Nombre / proveedor / país / URL oficial:** Cloud 9 Orthodontic Practice Management — Planet DDS — EE.UU. — https://www.planetdds.com/cloud9/ **[Comprobado]**
2. **Segmento principal:** **ortodoncia** y OSOs (Orthodontic Support Organizations / grupos) **[Comprobado]**
3. **Modalidad de despliegue:** **cloud** **[Comprobado]**
4. **Gestión de agenda:** agenda de turnos + "financial arrangements" en la misma plataforma **[Comprobado]**
5. **Turnos digitales:** **[No evidenciado]** en la página abierta
6. **Automatización:** **[No evidenciado]**
7. **Gestión de la práctica odontológica:** flujo clínico de ortodoncia (el detalle clínico no se abrió) **[Parcialmente no evidenciado]**
8. **Administración / facturación:** ledger, claims, contratos/consentimientos con firma digital paperless **[Comprobado]**
9. **Integraciones:** Planet DDS ofrece además Denticon (PMS general), Apteryx (imaging) y Payments+ en el mismo ecosistema **[Comprobado — sitio Planet DDS]**
10. **Operación multi-sede / multi-profesional:** multi-ubicación para OSOs **[Comprobado]**
11. **Seguridad / cumplimiento:** **[No evidenciado]**
12. **Modelo comercial:** **[No evidenciado]** — sin precios publicados
13. **Fortalezas / limitaciones / diferencias:**
    - Diferencia: **vertical de ortodoncia** (el resto de la muestra es odontología general); útil como referencia si el producto apunta también a ortodoncistas **[Comprobado]**
    - Limitaciones: alcance acotado a ortodoncia; precios opacos **[Comprobado]**
14. **Evidencia de adopción:** **[No evidenciado]** (números de clientes no verificados en la página abierta)

**Fuentes**
- `https://www.planetdds.com/cloud9/` · sitio oficial de producto · consultada el 2026-10-07

---

# Resumen comparativo rápido

| Sistema | País | Cloud | Turnos online | Agenda (detalle) | Precio público | Cumplimiento verificado |
|---|---|---|---|---|---|---|
| Open Dental | EE.UU. | No (instalado) | Web Sched (módulo pago) | Media (manual) | **Sí (US$199/mes)** | HIPAA doc. + BAA |
| Dentrix Ascend | EE.UU. | Sí | Nativo 24/7 configurable | Alta (templates/bloques) | No | No evidenciado |
| Eaglesoft | EE.UU. | No evid. | No evid. (eReminders sí) | **Alta (OnSchedule)** | No (Service Club) | HIPAA parcial (soporte) |
| CareStack | EE.UU. | Sí | Sí | Media (índice) | **Sí (US$829+)** | **ISO 27001 + SOC 2 Type II + NHS DSPT** |
| Curve Dental | EE.UU. | Sí | Sí (requiere Curve GRO) | Alta | No (a pedido) | No evidenciado |
| Dentally | Reino Unido | Sí | Sí (Dentally Portal) | Media-Alta (waitlist/filler) | **Sí (£265+)** | Existencia de policy, detalle no evid. |
| Solutionreach | EE.UU. | Sí | Sí | Baja (es complemento) | No (a pedido) | No evidenciado |
| Cloud 9 | EE.UU. | Sí | No evid. | Básica (ortodoncia) | No | No evidenciado |

---

# Advertencias generales

1. **Bloqueos de fuentes (HTTP 403):** pattersondental.com (Eaglesoft oficial), capterra.* (todas las variantes), softwareadvice.com. Por eso **las calificaciones de reseñas no están citadas como evidencia**: el índice de búsqueda mostró Open Dental 4.6 (~87-89 reseñas), Curve 4.5 (285), Eaglesoft 4.1 (157), Dentally 3.6 (18) — **todos datos NO verificados por apertura**.
2. **Precios "a pedido":** Curve, Dentrix Ascend, Solutionreach y Cloud 9 no publican montos; solo Open Dental, CareStack y Dentally tienen precios públicos verificados. Los precios pueden variar por país, número de sillones y promociones.
3. **Discrepancia detectada:** fuentes de terceros (no abiertas) indican planes de Dentally desde £125-£320/mes, versus £265-£510/mes en la página oficial abierta — prevalece lo oficial; verificar vigencia antes de usar en benchmarking.
4. **"Comprobado" ≠ funcionalidad profunda:** para varios sistemas, lo comprobado corresponde al índice de funcionalidades del sitio; el detalle fino de UX de agenda solo se verificó a fondo en Open Dental, Dentrix Ascend, Eaglesoft (soporte), Curve y Dentally.
5. **Dentlytics** (UK) descartado: es analytics operativo en MVP, no sistema de agenda.
6. Ningún sistema de la muestra evidenció disponibilidad para **Argentina/LatAm en español** (Dentally explícitamente solo UK/AU/CA/IE/NZ; CareStack con sitio UK/US/AU). Esto es una **ventaja de oportunidad** para un producto local.
