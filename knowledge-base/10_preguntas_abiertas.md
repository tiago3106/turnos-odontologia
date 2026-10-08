# Preguntas Abiertas

Preguntas que las fuentes de Discovery no resolvieron y que requieren decisión (usuario/product owner) o investigación antes de codificar. Todas quedan consultadas/trazadas hasta el informe de Discovery.

## Inconsistencias detectadas

### IN-01 — "Plan gratuito" vs. precio real del core
**Discovery A dice**: hay planes Gratis en el mercado (DentalSoft "Gratis 6 meses", DentalCore "precio fundador").
**Discovery B dice**: ninguno cubre el core (agenda + cobros + WhatsApp) gratis — el Gratis de DentalSoft limita a 50 turnos/mes y 1 odontólogo; DentalCore es pago con precio fundador.
**Impacto**: decidir la estrategia de pricing del producto (no se puede asumir que un competidor ofrece lo mismo gratis sin verificar al detalle).
**Resolución propuesta**: posicionarse en el plan de entrada accesible (USD ~25-70/mes) con agenda por sillón + WhatsApp + trazabilidad, tal como concluye el informe (sección C); NO competir en "gratis".

### IN-02 — "Auto" vs. "manual" en recordatorios de WhatsApp
**Discovery A dice**: la automatización de WhatsApp por API Meta está en planes "superiores" o costos extra (DentalSoft USD 30→60k/mes; Simples Dental lo cobra aparte).
**Discovery B dice**: CareStack incluye teleconfirmación por WhatsApp en planes pago (USD 829-1299/mes, gama alta).
**Impacto**: en v0.1 el MVP usa envío manual + confirmación 1-tap (costo casi nulo); la automatización queda en R2. Si esto se maldecide el precio del producto malestima.
**Resolución propuesta**: ya refrendada en DD-03 (v0.1 manual + confirmación; R2 automático).

### IN-03 — Google Calendar como fuente de verdad vs. propio scheduling
**Discovery A dice**: integración con Google Calendar (sync de horarios).
**Discovery B dice**: la agenda debe ser la fuente de verdad y anti-solapamiento en BD.
**Impacto**: si se hace a GCal solo como "storage", se pierde el diferencial por sillón y la regla dura de solapamiento.
**Resolución propuesta**: GCal solo como sync de lectura/disponibilidad (export), NUNCA como fuente de verdad (DD-02, RN-GL-01).

## Preguntas abiertas (priorizadas)

### P0 — Bloqueantes para v0.1

| Prioridad | Pregunta | Bloquea | Decisor |
|---|---|---|---|
| ~~Alta~~ | ~~PA-01 Definir el **stack final** (¿Node+React/PostgreSQL o Python/FastAPI?)~~ → **RESUELTA 2026-10-08: Node 20+ / React / PostgreSQL + Prisma** | Implementación | Product owner |
| Alta | PA-02 ¿Recordatorios en v0.1: manual + confirmación con enlace (casi nulo) o automático con API Meta (USD 0,02–0,03/msg)? | RF-15 | Product owner |
| Alta | PA-03 ¿Reserva online con identificación previa (name + phone/email + hold breve) o cuenta completa? | UC-02 / RF-14 | Product owner |

## P1 — Acciones del roadmap (no bloqueantes v0.1)

| ID | Pregunta | Contexto |
|---|---|---|
| PA-04 | ¿Las **señas** deben cubrir un % fijo del tratamiento o un valor libre por el consultorio? | Modelo de cobros; impacto en caja (RN-CO-01). |
| PA-05 | ¿La deuda de obra social se concilia manualmente con la facturación ARCA en v2 o se separa el módulo? | Evolución a ARCA puede re-diseñar liquidación. |
| PA-06 | ¿Multi-sucursal entra como tenant separado o como clínica >1 sede dentro de un mismo tenant? | El modelo de datos ya lo soporta; requiere decisión de modelo. |
| PA-07 | ¿Se quiere HL7 FHIR (export/import) ya en P1 o queda P2? | DentalCore (referencia alta) lo ofrece; suma costo de desarrollo. |
| PA-08 | ¿Google Calendar sync que incluye **recursos (sillones)** además de profesionales? | Define si el sillón es "recurso" en GCal o solo interno. |
| PA-09 | ¿Se exponen términos notariales/legales (consentimientos) al paciente online? | Ley 26.529; afecta UC-02. |
| PA-10 | ¿El cierre de caja debe emitir comprobante/depósito o comienza solo con reporte de director? | Simplifica RN-CO-03 en v0.1. |

## Decisiones ya tomadas (para no re-preguntar)

- **PA-01 — Stack final (2026-10-08)**: **Node.js 20+ / TypeScript + React (Vite) + PostgreSQL 15+ + Prisma**. Cerró el camino rápido del roadmap (C-01 sin bifurcación Python) y coincide con las skills instaladas (`prisma-postgres`, `nodejs-backend-patterns`). Descarta Python/FastAPI como candidato.
- **Datos ficticios** (consigna del trabajo de integración): no se maneja información real de pacientes ni obras sociales reales.
- **MVP recomendado por informe:** agenda por sillón + WhatsApp + MercadoPago + ARCA + trazabilidad/Ley 25.326 a precio accesible.
- **Fachada API REST** con scheduling propio (no GCal como fuente de verdad para la agenda).

## Notas de inferencia (Mode A)

```
[DISCOVERY] `stack` no pudo inferirse con confianza desde los docs fuente.
Los docs 02/08 proponen candidatos (Node+React+Postgres o Python/FastAPI) pero lo marcan
explícitamente como "Suposición" dejada al change técnico OpenSpec/OPSX.
Confirme antes de codificar: https://github.com/... (PA-01).
```
`system_type`, `domain` y `scale` se infirieron con alta confianza (SaaS web multi-tenant, dominio odontología, público+staff); `needs_infra` = true (WhatsApp/MercadoPago/DB/jobs de recordatorios).