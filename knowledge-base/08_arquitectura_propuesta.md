# Arquitectura Propuesta

## Patrones aplicados

| Patrón | Dónde se usa | Por qué |
|---|---|---|
| Cliente delgado / backend API | Toda la lógica de negocio en la API | Una sola fuente de verdad (agenda) |
| Capas (domain/application/infrastructure) | Backend | Separar reglas de negocio de tecnología |
| Transactions + DB constraints | Agenda (agregar turno) | Anti-solapamiento garantizado en BD, no solo UI (RNF-03) |
| RBAC server-side | Todos los endpoints | Autorización controlada por la API (RNF-05) |
| Webhooks verificado | MercadoPago, WhatsApp | Estados parciales/temporalmente desconocidos con reintentos (RNF-08) |
| REST/JSON | Comunicación interna | Simplicidad y compatibilidad con frontend web |
| Multi-tenant | Un tenant por clínica | 100 % SaaS web, mercado observado (RNF-10) |

## Estructura de directorios (propuesta)

```
proyecto/
├── backend/
│   └── app/
│       ├── domain/            # reglas de negocio (agenda, cobros, obra social, ficha clínica)
│       ├── infrastructure/    # Postgres, WhatsApp, MercadoPago, Google Calendar, auth
│       └── application/       # casos de uso, DTOs, integración (ORQUESTA)
├── frontend/
│   └── src/
│       ├── features/          # agenda, pacientes, caja, reserva online, ficha clínica
│       ├── shared/            # componentes, auth, api client
│       └── pages/             # app staff SPA + portal publico 24/7
├── spec/                      # OpenSpec (SDD) — cambios canónicos
└── knowledge-base/            # esta KB canónica
```

## Seguridad

- **Autenticación**: JWT + bcrypt (referencia: DentalTec, DentalPro).
- **Autorización**: RBAC server-side en cada endpoint (RNF-05).
- **Validación de input**: OWASP top-10 (inyección, XSS, CSRF); validación de schemas en la API.
- **Secrets management**: variables de entorno / secret manager; nunca en el repo (los payloads de webhooks se verifican con firma/secreto).
- **Transporte**: 100 % TLS/HTTPS; cifrado AES-256 en reposo (RNF-06).
- **Datos personales**: proyecto con **datos ficticios** (consigna). Controles de acceso + trazabilidad para cumplimiento 25.326/26.529 (RN-PA-04).

## Escalabilidad y disponibilidad (RNF)

- **RNF-01/02 Performance**: agenda < 1 s; disponibilidad online < 500 ms.
- **RNF-03** Concurrencia: transacciones + `UNIQUE` para agenda.
- **RNF-09** Alta disponibilidad en producción (multi-instancia + backups programados).
- **RNF-11** Nube/containers; Postgres administrado con backups automáticos.
- **RNF-12** Env dev/staging/prod; migraciones versionadas (SDD/OpenSpec).
- **RNF-13/14** AuditLog síncrono (< 1 s); logs estructurados + métricas.
- **RNF-15** Exportación CSV/PDF encriptada.

## Variables de entorno

| Variable | Descripción | Ejemplo | Sensible (Y/N) |
|---|---|---|---|
| `DATABASE_URL` | Conexión a Postgres | `postgres://user:pass@host/db` | Y |
| `JWT_SECRET` | Firma de tokens | `cambiar-por-secreto-largo` | Y |
| `WHATSAPP_TOKEN` / `WHATSAPP_PHONE_ID` | API Meta | `EAA...` | Y |
| `MERCADOPAGO_ACCESS_TOKEN` | API MercadoPago | `TEST-...` | Y |
| `MERCADOPAGO_WEBHOOK_SECRET` | Firma webhook | `mpprod_secret` | Y |
| `GOOGLE_CLIENT_ID` / `_SECRET` | OAuth Google Calendar | `xxxx.apps.googleusercontent.com` | Y |
| `APP_ENV` | dev/staging/prod | `dev` | N |
| `APP_URL` | Base pública | `https://app.misitio.com` | N |

> **Stack definitivo (PA-01, 2026-10-08): Node/TypeScript + Express/Fastify + React + PostgreSQL + Prisma.** La estructura de abajo es la plantilla aplicada a ese stack.