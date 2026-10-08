# Descripción General

## Stack tecnológico

> **Stack definitivo (PA-01 resuelta el 2026-10-08): Node.js 20+ / TypeScript + React (Vite) + PostgreSQL 15+ + Prisma.**
> La tabla de abajo queda actualizada con esa decisión; las alternativas Python/FastAPI quedaron descartadas.

| Capa | Tecnologías | Versión mínima |
|---|---|---|
| Frontend web | React (SPA) + Vite + TypeScript | Vite 5+ / React 18 |
| Backend API | Node.js + Express/Fastify + TypeScript | Node 20+ |
| Base de datos | PostgreSQL (relacional, concurrencia de agenda) | 15+ |
| ORM | Prisma (migraciones versionadas) | latest |
| Autenticación | JWT + bcrypt (referencia local: DentalTec) | — |
| WhatsApp | API oficial de Meta (recordatorios) o canal manual vía enlace-whatsapp | — |
| Pagos | MercadoPago (checkout/link de pago para señas) | — |
| Calendar | API Google Calendar (sync por profesional) | — |
| Infra | Docker + deploy en la nube (nube multi-tenant; 100% web) | — |

**Stack observado en el mercado** (fuente: `docs/discovery/sources/`): el 100 % de los competidores locales es SaaS 100 % web; los de seguridad destacada usan JWT/bcrypt + Helmet/CORS y cifrado TLS/AES-256 (DentalTec, DentalPro, DentalCore).

## Arquitectura general

```
Paciente ──► [Web pública: reserva 24/7]  ──► API ──► DB (PostgreSQL)
Secretaria ─► [App web staff: agenda, caja, pacientes]
Odontólogo ─► [App web staff: agenda, ficha clínica, odontograma]
Director ────► [App web staff: reportes, obras sociales]

WhatsApp ──► API Meta / enlace ──► notificaciones y confirmaciones (actualizan agenda)
MercadoPago ► checkout/link ─────► cobro de turnos y señas → caja
Google Calendar ► sync de agenda por profesional
```

Principios: (1) **la agenda es la fuente de verdad** (bloqueo de solapamiento a nivel de base de datos); (2) cliente delgado — toda la lógica de negocio vive en la API; (3) multi-rol con RBAC desde el día 1 (secretaria/odontólogo/director/paciente).

## Integraciones externas

| Servicio | Propósito | Tipo |
|---|---|---|
| WhatsApp (API Meta) | Recordatorios, confirmación/cancelación que actualiza la agenda | API REST (costo por mensaje ~USD 0,02–0,03) |
| WhatsApp (enlace) | Envío manual inicial + confirmación | Link (HTTP) |
| MercadoPago | Cobro de turnos y señas (link de pago/checkout) | API REST (SDK) |
| Google Calendar | Sync de disponibilidad por profesional | API REST + OAuth |
| ARCA (ex AFIP) | Facturación electrónica (v2) | API/SERVICIOS (diferido) |
| Obras sociales / prepagas | Nomenclador y registro de deuda; validación (DentalTec vía SOAP, 15+ entidades como referencia) | SOAP/REST (v2) |

## API REST (resumen propuesto)

- `POST /api/patients`, `GET /api/patients/{id}`, `PATCH /api/patients/{id}`
- `POST /api/appointments`, `GET /api/appointments?date=&provider=`, `PATCH /api/appointments/{id}` (confirmar/cancelar/reprogramar)
- `POST /api/appointments/{id}/confirm` (desde WhatsApp/paciente)
- `GET /api/schedule/providers`, `GET /api/schedule/availability?provider=&start=&end=`
- `POST /api/payments` (turno/seña), `GET /api/payments?patient=`
- `GET /api/insurance/procedures` (nomenclador), `GET /api/insurance/debts?provider=`
- `POST /api/clinical-records`, `GET /api/clinical-records/{patientId}` (ficha + odontograma)
- `GET /api/reports/{type}?from=&to=` (ocupación, cobros, obras sociales) — rol director