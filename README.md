# Turnos Odontología — API

Sistema de gestión de turnos y agenda para consultorios odontológicos. **Estado: TPI 2026-11-18.**
Todo el dominio usa **datos ficticios**; no hay credenciales ni tokens en el repositorio.

> **Video explicativo del TPI (Metodología I)**: https://youtu.be/Y1wzXT_QxCY

> Los comandos de abajo se ejecutan **dentro de `backend/`** (el `package.json` vive ahí, no en la raíz).

## Requisitos

- Node.js 20+
- PostgreSQL 15+ (no hace falta instalarlo: `db:start` levanta una BD embebida)
- Sin servicios pagos ni APIs externas

## Instalación, configuración y arranque

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run db:start
npm run db:deploy
npm run db:seed
npm run dev
```

- `.env.example` incluye `APP_ENV`, `PORT` y un `DATABASE_URL` ficticio de desarrollo. Nunca commitear `.env`.
- Si `npm` bloquea los scripts de PostGIS/embedded-postgres, aprobarlos con `npm install-scripts approve`.
- `db:seed` carga la clínica ficticia, 2 profesionales, 2 sillones y 3 prestaciones.
- El servidor queda en `http://localhost:3000`.

## Swagger y verificación rápida

- **Swagger UI:** <http://localhost:3000/api/docs/>
- **OpenAPI JSON:** <http://localhost:3000/api/openapi.json>
- **Health check:** <http://localhost:3000/api/health> → `{ "status": "ok" }`

Desde Swagger se pueden ejecutar los flujos reales: alta de paciente, alta de turno, consulta de
agenda, reprogramación, cancelación y cierre de caja. Un solape devuelve `409 APPOINTMENT_OVERLAP`.

## Tests y verificaciones

```powershell
cd backend
npm test
npm run typecheck
npm run lint
```

Suite: **69 tests en verde** (Vitest + Supertest + Postgres embebido). Incluye anti-solape por
profesional y sillón a nivel de base de datos, cancelación que libera el slot, DNI único por
clínica, señas, cierre de caja y el vínculo turno→paciente.

## Cambios completos (archivados en `openspec/changes/archive/`)

| Change | Aporte |
|---|---|
| `crear-turno-sin-solapamientos` | Alta de turno; constraints `EXCLUDE` en PostgreSQL |
| `pacientes-crud` | Alta/consulta/edición, DNI único, baja lógica, auditoría |
| `configuracion-clinica` | Prestaciones, profesionales, sillones y horarios sin solape |
| `agenda-gestion-turnos` | Consulta, reprogramación, cancelación y estados |
| `caja-y-senas` | Cobros, señas, anulación trazada y cierre de caja |
| `api-docs-swagger` | OpenAPI 3.0.3 + Swagger UI local |
| `turno-paciente-vinculado` | `patientId` en el turno, índice y validación |

El mínimo del TPI para 1 integrante es 2 changes; se presentan 7.

## Pendiente (no presentado como completo)

- **C-01/C-02/C-03** siguen pendientes en `CHANGES.md`: hay configuración y modelos ejecutables,
  pero **no hay JWT/RBAC**; el actor de auditoría se toma de `x-actor` (fallback `sistema`).
- **C-07 `agenda-staff-ui`**: spec preparada y validada, sin implementar. No hay frontend.
- C-08 en adelante (ficha clínica, reserva online, WhatsApp, pagos, reportes) siguen en el roadmap.
- El vínculo turno→paciente es opcional para conservar compatibilidad; hacerlo obligatorio
  corresponde a reserva online (C-10).

## Trazabilidad

- `CHANGES.md`: roadmap actualizado con estados reales y notas de alcance reducido.
- `openspec/changes/archive/`: propuesta, diseño, specs, tareas y resultados de cada change.
- `knowledge-base/`: fuente de verdad del dominio y reglas `RN-*`.
- `docs/skills-mcp/`: skill propia `spec-scenario-validator`, MCP GitHub y evidencias de uso.
- `ENTREGA.md`: instrucciones y evidencias del TP de Skills + MCP.

## Migraciones

`0001_init`, `0002_pacientes_crud`, `0003_configuracion_clinica`,
`0004_agenda_gestion_turnos`, `0005_caja_y_senas`, `0006_turno_paciente`.
