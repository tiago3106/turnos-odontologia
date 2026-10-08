# Turnos Odontología — Instrucciones para Agentes

> Este archivo (y su copia `CLAUDE.md`) es lo PRIMERO que todo agente lee al entrar al repo.
> Generado a partir de `knowledge-base/` y `CHANGES.md`. No editar a mano sin re-sincronizar ambos archivos.

---

## Stack Tecnológico

> **Stack definitivo (PA-01 resuelta 2026-10-08): Node.js 20+ / TypeScript + React (Vite) + PostgreSQL 15+ + Prisma.** Detalle en `knowledge-base/02_descripcion_general.md`.

| Capa | Tecnología | Versión mínima |
|------|------------|---------|
| Frontend web | React (SPA) + Vite + TypeScript | Vite 5+ / React 18 |
| Backend API | Node.js + Express/Fastify + TypeScript | Node 20+ |
| Base de datos | PostgreSQL (relacional, concurrencia de agenda) | 15+ |
| ORM | Prisma (migraciones versionadas) | latest |
| Autenticación | JWT + bcrypt | — |
| WhatsApp | API oficial de Meta (recordatorios) o enlace manual | — |
| Pagos | MercadoPago (checkout/link de pago para señas) | — |
| Calendar | Google Calendar (solo sync de lectura) | — |
| Infra | Docker + deploy en la nube (multi-tenant, 100% web) | — |

Detalle completo: [knowledge-base/02_descripcion_general.md](knowledge-base/02_descripcion_general.md)

---

## Base de Conocimiento

La fuente de verdad del dominio vive en `knowledge-base/`. **Leé el archivo relevante ANTES de implementar.**

| Archivo | Cuándo leerlo |
|---------|---------------|
| [01_vision_y_objetivos.md](knowledge-base/01_vision_y_objetivos.md) | Entender propósito, objetivos por actor y alcance v0.1 |
| [03_actores_y_roles.md](knowledge-base/03_actores_y_roles.md) | Auth, RBAC, matriz de permisos |
| [04_modelo_de_datos.md](knowledge-base/04_modelo_de_datos.md) | Entidades, ERD, constraints de agenda, seed |
| [05_reglas_de_negocio.md](knowledge-base/05_reglas_de_negocio.md) | Reglas codificadas (RN-*) con trazabilidad |
| [06_funcionalidades.md](knowledge-base/06_funcionalidades.md) | Épicas + historias de usuario (US-001..013) |
| [07_flujos_principales.md](knowledge-base/07_flujos_principales.md) | Flujos E2E (7 flujos) |
| [08_arquitectura_propuesta.md](knowledge-base/08_arquitectura_propuesta.md) | Patrones, estructura de directorios, env vars |
| [09_decisiones_y_supuestos.md](knowledge-base/09_decisiones_y_supuestos.md) | Decisiones DD-01..05 + supuestos SU-01..03 |
| [10_preguntas_abiertas.md](knowledge-base/10_preguntas_abiertas.md) | ⚠️ Inconsistencias IN-01..03 y P0 a resolver ANTES de codear |
| [11_whatsapp_recordatorios_y_confirmaciones.md](knowledge-base/11_whatsapp_recordatorios_y_confirmaciones.md) | Ventana de recordatorios, confirmación/cancelación |
| [12_pagos_y_senas_mercadopago.md](knowledge-base/12_pagos_y_senas_mercadopago.md) | Señas, caja, MercadoPago |
| [13_obra_social_facturacion_y_cumplimiento.md](knowledge-base/13_obra_social_facturacion_y_cumplimiento.md) | Nomenclador, ARCA, Leyes 25.326/26.529 |

> ⚠️ ~~PA-01 (stack final)~~ **resuelta: Node + React + PostgreSQL + Prisma**. Quedan abiertas PA-02 y PA-03 (ver `10_preguntas_abiertas.md`) — resolverlas antes de los changes que dependan de ellas.

---

## Skills Disponibles

Fuente de verdad: `.atl/skill-registry.md` (generado por `skill-registry`).

| Agente | Rol | Skills que carga |
|--------|-----|------------------|
| **Backend Core** | Motor de agenda, modelos, auth, anti-solapamiento | `tdd`, `codebase-design`, `supabase-postgres-best-practices`, `prisma-postgres`, `nodejs-backend-patterns` |
| **Backend Aux** | Integraciones (WhatsApp, MercadoPago), seguridad, API | `api-and-interface-design`, `security-and-hardening`, `nestjs-best-practices` |
| **Frontend** | SPA staff + portal de reserva 24/7 | `frontend-design`, `vercel-react-best-practices`, `webapp-testing` |
| **Calidad / Docs** | Revisión, hooks, documentación y ADRs | `code-review`, `setup-pre-commit`, `documentation-and-adrs` |
| **Orquestación** | SDD / OPSX | `active-orchestrator`, `kb-creator`, `roadmap-generator`, `agents-md-generator`, `skill-registry` |

Cargá la skill correspondiente al contexto ANTES de escribir código.

> Los compact rules de cada skill los resuelve el orquestador desde `.atl/skill-registry.md` (generado por `skill-registry`; no versionado — no está en el repo). Esta tabla solo mapea skill→rol.

---

## Roadmap de Changes

El plan completo está en [CHANGES.md](CHANGES.md). Resumen:

- **Total**: 16 changes en 10 fases (FASE 0 Cimientos → FASE 9 Reportes y evolución).
- **Camino crítico** (8): `C-01 → C-02 → C-03 → C-05 → C-06 → C-09 → C-10 → C-11`.
- **Primer change**: `C-01` (`foundation-setup`).
- **Primer fork** (GATE 3): `C-04 pacientes-crud` ∥ `C-05 configuracion-clinica`.

**Antes de cualquier `/opsx:propose`**: leé [CHANGES.md](CHANGES.md), verificá que las dependencias estén en `openspec/changes/archive/` y leé los docs de "Leer antes".

---

## Reglas Duras (específicas del proyecto)

No hay `~/.claude/CLAUDE.md` global instalado, así que este archivo carga también las reglas de gobernanza. Son contrato; romperlas es un defecto. Formato `NUNCA X → hacer Y`:

- **Datos ficticios**: NUNCA usar datos reales de pacientes u obras sociales → solo seeds/datos ficticios (consigna del trabajo; nada de PHI real en el repo).
- **Anti-solape en BD**: NUNCA validar el solapamiento solo en la API → el bloqueo vive en la base de datos (constraint `UNIQUE`/`EXCLUDE` por profesional+sillón+franja); la agenda es la fuente de verdad.
- **GCal solo lectura**: NUNCA usar Google Calendar como fuente de verdad de la agenda → solo sync de lectura/disponibilidad (DD-02, RN-GL-01).
- **TypeScript estricto**: NUNCA usar `any` → `tsconfig` en modo strict; componentes React en `PascalCase`; validar inputs en los bordes con schema (Zod/valibot).
- **Sin secrets en repo**: NUNCA commitear `.env`, claves ni tokens → solo `.env.example` sin valores sensibles; secrets en el gestor de entorno del deploy.
- **Firmar webhooks**: NUNCA confiar en callbacks de MercadoPago/WhatsApp sin verificar la firma → validar la signature antes de procesar el payload.
- **Trazabilidad clínica**: NUNCA persistir historia clínica sin registrar quién/cuándo → auditoría de accesos y cifrado de datos sensibles bajo Ley 25.326 y Ley 26.529.
- **Migraciones**: NUNCA tocar el schema a mano → migraciones versionadas, idempotentes y commiteadas.
- **No commitear sin pedido**: NUNCA buildear/commitear/pushear sin que el usuario lo pida explícitamente → conventional commits, sin co-autoría IA.
- **Tests de reglas duras**: NUNCA cerrar un change sin tests de las reglas anti-solapamiento y de caja → cubrir con TDD antes de tocar el código.
- **PA-01 bloqueante**: NUNCA arrancar un change con el stack afectado sin definir → PA-01 resuelta (Node+React+Postgres+Prisma, 2026-10-08); resolver las demás P0 de `10_preguntas_abiertas.md` antes del change que dependa de ellas.

---

## Flujo de Trabajo

```
1. Leer la KB relevante (knowledge-base/)        → entender el dominio
2. Identificar el change en CHANGES.md           → respetar dependencias
3. /opsx:propose C-NN-nombre                     → proposal + design + specs + tasks
4. Implementar las tasks (cargando skills)       → respetando las reglas duras
5. /opsx:archive C-NN-nombre + marcar [x]        → cerrar el change
```

Aplicar TODAS las reglas duras en cada paso. Ante conflicto entre la KB y este archivo, las reglas duras prevalecen.
