# CHANGES — Secuencia de Implementación

> Índice canónico de todos los changes del proyecto **Gestión de Turnos y Agenda para Consultorios Odontológicos (Argentina)**.
> Cada change es atómico: un agente puede implementarlo en una sesión (~4-6 horas).
> **Leer este archivo antes de ejecutar cualquier `/opsx:propose`.**

---

## Cómo usar este documento

1. Identificar el change a implementar (verificar que sus dependencias están en `openspec/changes/archive/`).
2. Leer los docs de la knowledge-base indicados en "Leer antes".
3. Ejecutar `/opsx:propose <nombre-del-change>`.
4. Al terminar el change, archivarlo con `/opsx:archive <nombre-del-change>`.
5. Marcar el checkbox `[x]` en este archivo.

### Regla del árbol — una sola raíz

Al crear o modificar un change: el árbol de dependencias **nace de UN solo change**. Si al
graficarlo quedan **dos nodos de los que salen los demás** (dos raíces), hay que **elegir uno**
(o fusionarlos en uno solo) para que todo salga de una única raíz — en este proyecto la raíz es
`C-01 foundation-setup`. Un change sin dependencias que no sea la raíz es un error de diseño:
asignale su padre o metelo dentro de la raíz.

---

## Árbol de dependencias

```
C-01 foundation-setup
  └── C-02 core-models
        └── C-03 auth-rbac                    ← desbloquea roles y RBAC
              │
              ├── C-04 pacientes-crud         ← PRIMER FORK (2 paralelos)
              ├── C-05 configuracion-clinica  ← procedures, horarios, sillones
              │
              ├── (C-04 + C-05) → C-06 motor-agenda-antisolapamiento
              │     │
              │     ├── C-07 agenda-staff-ui              ← solo C-06
              │     ├── C-08 ficha-clinica-odontograma     ← C-04 + C-05
              │     ├── C-09 caja-y-senas                 ← C-04 + C-06
              │     ├── C-10 reserva-online               ← C-04 + C-06
              │     │     └── C-11 whatsapp-recordatorios ← + C-10
              │
              ├── C-13 obra-social-nomenclador   ← C-05 + C-08
              └── C-14 reportes-y-auditoria      ← C-09 + C-13
                    ├── C-15 arca-facturacion-electronica  ← C-09 + C-13 (P2, opcional)
                    └── C-16 google-calendar-sync          ← C-06 (P2, opcional)
```

### Paralelismo por fase

> Cada "gate" es un punto de sincronización. Los changes dentro de un grupo pueden ejecutarse en paralelo.

```
GATE 0: ninguna
  → C-01 foundation-setup (solo)

GATE 1: C-01 ✓
  → C-02 core-models (solo)

GATE 2: C-02 ✓
  → C-03 auth-rbac (solo)

GATE 3: C-03 ✓                     ← PRIMER FORK (2 paralelos)
  → C-04 pacientes-crud            [Agente A]
  → C-05 configuracion-clinica     [Agente B]

GATE 4: C-04 + C-05 ✓              ← FORK (3 paralelos)
  → C-06 motor-agenda-...          [Agente A]
  → C-08 ficha-clinica-...         [Agente B]
  → C-13 obra-social-...           [Agente C]

GATE 5: C-06 ✓                     ← FORK (3 paralelos)
  → C-07 agenda-staff-ui           [Agente C]
  → C-09 caja-y-senas              [Agente B]
  → C-10 reserva-online            [Agente A]

GATE 6: C-09 ✓
  → C-12 mercadopago-pagos         [Agente B]   ← opcional v0.1

GATE 7: C-10 ✓
  → C-11 whatsapp-recordatorios    [Agente A]

GATE 8: C-09 + C-13 ✓
  → C-14 reportes-y-auditoria      [Agente C]

GATE 9: C-14 ✓ (P2 — opcional)
  → C-15 arca-facturacion-...      [Agente B]
  → C-16 google-calendar-sync      [Agente A]
```

### Camino crítico (8 changes — mínimo irreducible)

```
C-01 → C-02 → C-03 → C-05 → C-06 → C-09 → C-10 → C-11
```

### Plan óptimo con 3 agentes

```
Paso │ Agente A (Backend Core)      │ Agente B (Backend Aux)     │ Agente C (Frontend)
─────┼──────────────────────────────┼────────────────────────────┼─────────────────────────
  1  │ C-01 foundation-setup        │            —               │            —
  2  │ C-02 core-models             │            —               │            —
  3  │ C-03 auth-rbac               │            —               │            —
  4  │ C-04 pacientes-crud          │ C-05 configuracion-clinica │            —
  5  │ C-06 motor-agenda-antisolap  │ C-08 ficha-clinica-...     │ C-13 obra-social-...
  6  │ C-10 reserva-online          │ C-09 caja-y-senas          │ C-07 agenda-staff-ui
  7  │ C-11 whatsapp-recordatorios  │ C-12 mercadopago-pagos     │ C-14 reportes-y-auditoria
  8  │ C-16 google-calendar-sync    │ C-15 arca-...              │            —
```

---

## FASE 0 — Cimientos

> Fases base. Nada puede proponerse antes de C-03 (auth), porque todo recurso protegido depende de roles.

### [C-01] `foundation-setup`
- **Estado**: `[ ]` pendiente
- **Scope**: Scaffolding completo del monorepo + infraestructura base
  - Estructura de directorios: `backend/`, `frontend/`, `docs/`, `knowledge-base/`, `openspec/`
  - `backend/`: API mínima con health check `/api/health`, settings, logger, db session, manejo de errores; ORM (SQLAlchemy/Prisma) inicializado
  - `frontend/`: SPA + portal público (Vite+React/Next) scaffolding, router, cliente API, estado global
  - `.env.example` en cada sub-proyecto + variable de entorno `APP_ENV` (dev/staging/prod) — sin valores sensibles hardcodeados
  - CI básico (GitHub Actions): lint + build para backend y frontend
  - Docker-compose para desarrollo (Postgres local)
- **Dependencias**: ninguna
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/01_vision_y_objetivos.md` (qué es el sistema y por qué existe)
  - `knowledge-base/02_descripcion_general.md` §Stack y §Arquitectura general
  - `knowledge-base/08_arquitectura_propuesta.md` §Estructura de directorios y §Variables de entorno

---

### [C-02] `core-models`
- **Estado**: `[ ]` pendiente
- **Scope**: Modelos base + migraciones iniciales + seed mínimo
  - Modelos: `Clinic`, `Provider`, `OperatingUnit`, `Patient`, `User+Role+UserRole`, `Procedure`, `AuditLog` (entidades raíz de `04_modelo_de_datos.md`)
  - Mixins: `TimestampsMixin` (`created_at`, `updated_at`), `is_active`
  - `BaseRepository[T]` + `UnitOfWork` (patrón definido en `08_arquitectura_propuesta.md`)
  - Migración 001: tablas core + índices básicos
  - Seed: 1 clínica ficticia, 2 profesionales, 3 sillones, usuarios demo (secretaria/odontólogo/director, contraseñas ficticias dev-only), presupuesto de prestaciones básicas
- **Dependencias**: C-01
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Entidades
  - `knowledge-base/08_arquitectura_propuesta.md` §Patrones y §Seguridad
  - `knowledge-base/09_decisiones_y_supuestos.md` (decisiones de modelado DD-01/05)

---

## FASE 1 — Autenticación y roles

### [C-03] `auth-rbac`
- **Estado**: `[ ]` pendiente
- **Scope**: Sistema completo de autenticación JWT con RBAC
  - `POST /api/auth/login` — JWT access + refresh, rate limiting 5/60s por IP+email
  - `POST /api/auth/refresh` — rotación de refresh token, blacklist del anterior
  - `POST /api/auth/logout` — invalidación del access token
  - `GET /api/auth/me` — info del usuario actual
  - `PermissionContext`: `require_role()`, `require_admin()` — roles secretaria/odontólogo/director/paciente
  - Campos JWT: `sub`, `clinic_id`, `roles`, `email`, `jti`, `type`, `iat`, `exp`
  - Refresh token en cookie HttpOnly (secure, samesite=lax)
  - Migración 002: tablas auth
  - Tests: login correcto, token expirado, rate limit, refresh rotation, 403 por rol
- **Dependencias**: C-02
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/03_actores_y_roles.md` §RBAC (matriz de permisos completa)
  - `knowledge-base/07_flujos_principales.md` §Flujo 1 (autenticación)
  - `knowledge-base/05_reglas_de_negocio.md` (RN-AU-02)

---

## FASE 2 — Dominio core: pacientes y configuración

> C-04 y C-05 son independientes entre sí (solo necesitan auth). Ambos deben estar archivados antes de C-06.

### [C-04] `pacientes-crud`
- **Estado**: `[ ]` pendiente
- **Scope**: CRUD de pacientes con trazabilidad
  - Modelos: `Patient` (name, phone, email, dni, obra social), validación de datos de contacto
  - Endpoints: `POST/GET/PATCH /api/patients`, `GET /api/patients/{id}` — RBAC (secretaria/director)
  - Alta mínima: al menos nombre + teléfono/email (RN-PA-01)
  - AuditLog en crear/editar (RN-AU-01)
  - Migración 003: extensión tabla patient
  - Exportación CSV básica (director)
  - Tests: CRUD, validación de contacto, autorización por rol, aislamiento por clínica
- **Dependencias**: C-03
- **Governance**: ALTO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Pacientes
  - `knowledge-base/05_reglas_de_negocio.md` §Pacientes y ficha clínica
  - `knowledge-base/06_funcionalidades.md` Épica 3 (US-007)

---

### [C-05] `configuracion-clinica`
- **Estado**: `[ ]` pendiente
- **Scope**: Configuración del consultorio: prestaciones, horarios, sillones
  - Modelos: `Procedure` (code, nombre, `default_duration_min`, price, insurance_code), `ProviderSchedule` (día, start, end, interval), `OperatingUnit` (sillón)
  - Endpoints admin (director): CRUD prestaciones, horarios por profesional, sillones
  - Endpoints internos de lectura para agenda: `GET /api/schedule/providers`, `GET /api/schedule/sills`
  - Precios en centavos (evita errores de redondeo)
  - Migración 004: tablas de configuración
  - Tests: CRUD, solapamiento de horarios de profesional, RBAC director
- **Dependencias**: C-03
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Organización y personal, §Procedures
  - `knowledge-base/02_descripcion_general.md` §API REST
  - `knowledge-base/06_funcionalidades.md` Épica 1 y Épica 6

---

## FASE 3 — Motor de agenda (núcleo del producto)

> El change más importante del proyecto: la regla de no solapamiento por profesional Y por sillón se garantiza en la base de datos, no en la UI.

### [C-06] `motor-agenda-antisolapamiento`
- **Estado**: `[ ]` pendiente
- **Scope**: Motor de agenda con anti-solapamiento garantizado
  - Modelos: `Appointment` con estados `pendiente|confirmado|cancelado|asistido|no_asistido|sobreturno`, `source` (secretaria|online|whatsapp), `hold_expires_at`
  - Migración 005: tabla appointments + constraints `UNIQUE (provider_id, start, end)` y `UNIQUE (operating_unit_id, start, end)` → solapamiento imposible a nivel de BD (RN-AG-01/02)
  - Endpoints: `POST /api/appointments` (validación de choques → 409), `GET /api/appointments?date=&provider=`, `PATCH /api/appointments/{id}` (mover/reprogramar), cancelar
  - Duración derivada de la prestación (RN-AG-03); bloqueos por feriado/vacaciones (RN-AG-04); sobreturnos como tipo de turno que respeta restricciones (RN-AG-05)
  - Transacciones + manejo de concurrencia (reserva online + secretaria simultáneas, RN-GL-01)
  - Tests: inserción sobre slot ocupado → 409; carrera de concurrencia; bloqueos; sobreturnos; aislamiento por clínica
- **Dependencias**: C-04, C-05
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Agenda (constraints e índices)
  - `knowledge-base/05_reglas_de_negocio.md` §Agenda (RN-AG-01..09)
  - `knowledge-base/07_flujos_principales.md` §Flujo 2 (agendar sin choques)
  - `knowledge-base/09_decisiones_y_supuestos.md` DD-01 (por qué doble UNIQUE)

---

## FASE 4 — UI del staff

### [C-07] `agenda-staff-ui`
- **Estado**: `[ ]` pendiente
- **Scope**: Vistas de agenda del equipo del consultorio
  - Vistas: agenda por profesional (día/semana) y por sillón — conmutables
  - Componentes: grid de slots, tarjetas de turno (paciente, prestación, estado), blocker (feriado/vacaciones), sobreturno
  - Acciones: agendar, mover, cancelar, marcar asistido/no_asistido
  - Reglas de UI: slots ocupados/bloqueados en gris; confirmación visual de 409 al arrastrar sobre ocupado
  - Dashboard de hoy con próximos turnos
  - Tests e2e: agendar, bloqueo de slot ocupado, cambio de vista
- **Dependencias**: C-06
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/07_flujos_principales.md` §Flujo 2 (vista de agenda)
  - `knowledge-base/08_arquitectura_propuesta.md` §Estructura de directorios (frontend)
  - `knowledge-base/03_actores_y_roles.md` §Actores (qué ve cada rol)

---

## FASE 5 — Ficha clínica

### [C-08] `ficha-clinica-odontograma`
- **Estado**: `[ ]` pendiente
- **Scope**: Historia clínica digital con odontograma
  - Modelos: `ClinicalRecord` (versionado, no sobrescribe: cada atención genera un registro — RN-PA-02), `ToothState` (pieza FDI, superficie, estado sano/caries/obturado/ausente — RN-PA-03)
  - Endpoints: `GET/POST /api/clinical-records/{patientId}`, `GET /api/clinical-records/{patientId}/history`, `POST /api/clinical-records/{id}/teeth`
  - Odontograma: vista visual por pieza (diagrama 32 dientes) con selección de superficie (mesial/oclusal/distal/vestibular/lingual)
  - Historial encadenado por fecha; solo odontólogo edita, director/secretaria ven
  - Migración 006: tablas ficha clínica
  - Tests: versionado, registro de pieza/superficie, RBAC (odontólogo vs director)
- **Dependencias**: C-04, C-05
- **Governance**: ALTO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Ficha clínica y ToothState
  - `knowledge-base/06_funcionalidades.md` Épica 3 (US-007/008)
  - `knowledge-base/05_reglas_de_negocio.md` §Pacientes y ficha clínica (RN-PA-02/03)

---

## FASE 6 — Cobros y caja

### [C-09] `caja-y-senas`
- **Estado**: `[ ]` pendiente
- **Scope**: Cobro de turnos y señas con cierre de caja
  - Modelos: `Payment` (amount, type turno|seña, method efectivo|tarjeta|mercadopago, status, external_id, created_by), vínculo a appointment/tratamiento
  - Endpoints: `POST /api/payments` (cobro/seña), `GET /api/payments?patient=`, anular con trazabilidad (no eliminar — RN-CO-02)
  - Cierre de caja: total por medio de pago y por profesional (RN-CO-03), solo director
  - Regla: la seña va a cuenta del tratamiento (RN-CO-01)
  - Migración 007: tablas de pagos (backend); vista de caja (frontend) con registro y cierre
  - Tests: seña descuenta tratamiento, anulación trazada, cierre de caja, RBAC director
- **Dependencias**: C-04, C-06
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Cobros
  - `knowledge-base/05_reglas_de_negocio.md` §Cobros (RN-CO-01..03)
  - `knowledge-base/07_flujos_principales.md` §Flujo 4 (cobro de turno y seña)

---

## FASE 7 — Paciente digital: reserva online y WhatsApp

> Habilita el MVP diferencial del informe: agenda por sillón + WhatsApp + MercadoPago a precio accesible.

### [C-10] `reserva-online`
- **Estado**: `[ ]` pendiente
- **Scope**: Reserva online 24/7 con slots reales
  - Portal público: `GET /api/schedule/availability?provider=&start=&end=` → slots libres reales (RN-AG-09), sin auth
  - Alta mínima de paciente desde el portal (README: link/QR por clínica)
  - `POST /api/appointments` con `source=online` y `hold_expires_at` (reserva en hold breve)
  - Cancelación online respetando plazo configurable (RN-AG-07)
  - Página pública estática de reserva (frontend) consumiendo la disponibilidad
  - Tests: never muestra slot ocupado/bloqueado, hold expira, cancelación por plazo
- **Dependencias**: C-04, C-06
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/07_flujos_principales.md` §Flujo 3 (reserva online 24/7)
  - `knowledge-base/03_actores_y_roles.md` §Rutas públicas
  - `knowledge-base/06_funcionalidades.md` Épica 2 (US-005/006)

---

### [C-11] `whatsapp-recordatorios`
- **Estado**: `[ ]` pendiente
- **Scope**: Recordatorio y confirmación por WhatsApp (v0.1 manual + confirmación 1-tap)
  - Envío en la ventana configurada (RN-AG-06; defaults 24 h y 2 h antes)
  - Canal v0.1: enlace WhatsApp (`wa.me`) con texto de recordatorio + acción **CONFIRMO** / **CANCELO** (1-tap) — costo casi nulo
  - Webhook `POST /api/webhooks/whatsapp` (token firmado): procesa respuesta y actualiza estado del turno (RN-AG-08) en < 5 s
  - Config por clínica: telefono de respaldo, ventanas, plantilla de mensaje
  - Reintentos de envío + logs de entrega
  - Tests: confirmación actualiza agenda, cancelación respeta plazo, webhook con firma inválida → rechazado
- **Dependencias**: C-10
- **Governance**: ALTO
- **Leer antes**:
  - `knowledge-base/11_whatsapp_recordatorios_y_confirmaciones.md` (plan del MVP)
  - `knowledge-base/05_reglas_de_negocio.md` §Agenda (RN-AG-06/07/08)
  - `knowledge-base/07_flujos_principales.md` §Flujo 3 (confirmación) — como referencia de R2 automático

---

## FASE 8 — Integraciones (v0.1 opcional y P2)

### [C-12] `mercadopago-pagos`
- **Estado**: `[ ]` pendiente
- **Scope**: Cobro de señas/turnos online por MercadoPago
  - Integración: link de pago / checkout (HTTP redirect) con API oficial + SDK
  - Webhook `POST /api/webhooks/mercadopago` con firma verificada → actualiza status del `Payment` (RNF-08)
  - Botón "pagar seña" en ficha/factura desde caja (frontend)
  - Reintentos de consulta de estado hasta confirmación
  - Tests: webhook válido/inválido, conciliación con caja (external_id), refund con trazabilidad
- **Dependencias**: C-09
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/12_pagos_y_senas_mercadopago.md`
  - `knowledge-base/05_reglas_de_negocio.md` §Cobros (RN-CO-02)
  - `knowledge-base/08_arquitectura_propuesta.md` §Seguridad (webhooks firmados)

---

### [C-13] `obra-social-nomenclador`
- **Estado**: `[ ]` pendiente
- **Scope**: Nomenclador y gestión de deuda por obra social (v0.1, sin ARCA)
  - Modelos: `Insurance`, `InsuranceCover` (obra social → prestación → coverage % + copay), `Debt` (por obra social/prestador/mes)
  - Endpoints: `GET /api/insurance/procedures`, `POST /api/insurance/covers` (director), `GET /api/insurance/debts?provider=&month=`
  - Vista de deuda mensual exportable (CSV) por prestador
  - Reglas: nomenclador con código de práctica y cobertura (RN-OS-01); registro de deuda/facturación mensual (RN-OS-02)
  - Migración 008: tablas obra social
  - Tests: cálculo de copago, planilla de deuda mensual, RBAC director
- **Dependencias**: C-05, C-08
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/13_obra_social_facturacion_y_cumplimiento.md`
  - `knowledge-base/05_reglas_de_negocio.md` §Obra social (RN-OS-01/02)
  - `knowledge-base/08_arquitectura_propuesta.md` §Seguridad (datos ficticios obligatorios)

---

## FASE 9 — Reportes y evolución

### [C-14] `reportes-y-auditoria`
- **Estado**: `[ ]` pendiente
- **Scope**: Reportes del director + trazabilidad
  - Endpoints: `GET /api/reports/occupancy?from=&to=`, `GET /api/reports/cash?from=&to=&provider=`, `GET /api/reports/no-shows`
  - Vista de auditoría: `GET /api/audit?entity=&user=&date=` (AuditLog: quién, cuándo, qué, IP, before/after)
  - Exportaciones CSV/PDF (RNF-15)
  - Dashboard de director (frontend) con ocupación, ausencias y comisiones
  - Tests: agregaciones correctas, filtros, RBAC director, exportación
- **Dependencias**: C-09, C-13
- **Governance**: ALTO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` Épica 6 (US-013)
  - `knowledge-base/07_flujos_principales.md` §Flujo 7 (auditoría)
  - `knowledge-base/05_reglas_de_negocio.md` §Auditoría (RN-AU-01) y §Excepciones globales

---

### [C-15] `arca-facturacion-electronica` [P2]
- **Estado**: `[ ]` pendiente
- **Scope**: Facturación electrónica ARCA (ex AFIP) — diferida de forma explícita a v2
  - Integración con servicios web ARCA (comprobantes A/B/C con CAE) obteniendo CAE por comprobante
  - Timbrado de factura asociada a `Payment`/tratamiento
  - Configuración de emisor (certificado X.509, punto de venta), ambiente dev/testing
  - Este change está **diferido** (RF-24): no bloquea v0.1. Se recomienda proponerlo cuando caja y obra social estén estabilizados.
  - Tests: CAE simulado, manejo de rechazos, regrabación de comprobante
- **Dependencias**: C-09, C-13
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/13_obra_social_facturacion_y_cumplimiento.md`
  - `knowledge-base/10_preguntas_abiertas.md` (PA-05)

---

### [C-16] `google-calendar-sync` [P2]
- **Estado**: `[ ]` pendiente
- **Scope**: Sincronización de disponibilidad con Google Calendar — diferida a v2
  - OAuth para profesionales; export (sync de lectura) de disponibilidad desde la agenda interna
  - GCal **no es fuente de verdad** de la agenda (DD-02, RN-GL-01) — solo espejo de disponibilidad
  - Endpoints: `GET /api/calendar/status`, `POST /api/calendar/sync` (job manual), revocación de OAuth
  - Este change está **diferido** (RF-27/PA-08): no bloquea v0.1.
  - Tests: sync parcial, revocación, conflicto de recurso (sillón como recurso opcional)
- **Dependencias**: C-06
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-02
  - `knowledge-base/07_flujos_principales.md` §Flujo 2 (como referencia)