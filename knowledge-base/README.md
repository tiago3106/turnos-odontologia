# Knowledge Base — Sistema de Gestión de Turnos y Agenda Odontológica (Argentina)

Base de conocimiento canónica del proyecto. Generada por el harness **kb-creator** en **Mode A (ingest)** a partir de:
- `docs/discovery/*` (Discovery: checklist, discovery.md, informe, fuentes de los 32 competidores)
- `docs/entorno/etapa-0-entorno.md`
- Sección `state.discovery` del `.active-orchestrator-state.json`

## Índice

| # | Archivo | Contenido |
|---|---|---|
| 01 | [01_vision_y_objetivos.md](01_vision_y_objetivos.md) | Propósito, objetivos por actor, alcance v0.1, métricas |
| 02 | [02_descripcion_general.md](02_descripcion_general.md) | Stack propuesto, arquitectura, integraciones, API |
| 03 | [03_actores_y_roles.md](03_actores_y_roles.md) | Actores y matriz RBAC |
| 04 | [04_modelo_de_datos.md](04_modelo_de_datos.md) | ERD, entidades, constraints de agenda, seed |
| 05 | [05_reglas_de_negocio.md](05_reglas_de_negocio.md) | Reglas codificadas RN-* con trazabilidad |
| 06 | [06_funcionalidades.md](06_funcionalidades.md) | Épicas + historias de usuario (US-001..013) |
| 07 | [07_flujos_principales.md](07_flujos_principales.md) | Flujos extremo a extremo (7 flujos) |
| 08 | [08_arquitectura_propuesta.md](08_arquitectura_propuesta.md) | Patrones, estructura de directorios, seguridad, env vars |
| 09 | [09_decisiones_y_supuestos.md](09_decisiones_y_supuestos.md) | Decisiones DD-01..05 + supuestos SU-01..03 |
| 10 | [10_preguntas_abiertas.md](10_preguntas_abiertas.md) | Preguntas abiertas P0/P1 + decisiones tomadas |
| 11 | [11_whatsapp_recordatorios_y_confirmaciones.md](11_whatsapp_recordatorios_y_confirmaciones.md) | **Extra dominio:** WhatsApp (recordatorios + confirmación) |
| 12 | [12_pagos_y_senas_mercadopago.md](12_pagos_y_senas_mercadopago.md) | **Extra dominio:** pagos y señas vía MercadoPago |
| 13 | [13_obra_social_facturacion_y_cumplimiento.md](13_obra_social_facturacion_y_cumplimiento.md) | **Extra dominio:** obra social, ARCA, Leyes 25.326/26.529 |

## Fuentes ingeridas

- `docs/discovery/checklist-discovery.md`
- `docs/discovery/discovery.md`
- `docs/discovery/informe-discovery.md`
- `docs/discovery/matriz_b.json` (informe)
- `docs/discovery/sources/{argentina,latam,internacional}.md`
- `docs/entorno/etapa-0-entorno.md`
- `state.discovery` (`.active-orchestrator-state.json`)

## Cómo se usa

- Es la fuente única de verdad del proyecto (SDD/OpenSpec) para desambiguar decisiones.
- La consume el agente de implementación y los harnesses posteriores (roadmap, OPSX).
- Traza todo hasta las fuentes de Discovery (§ refs a RN-*, RF-*, UC-*, PA-*, RNF-*).