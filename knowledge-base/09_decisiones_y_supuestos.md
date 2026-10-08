# Decisiones y Supuestos

## Decisiones documentadas

### DD-01 — Agenda por profesional Y por sillón como regla dura
**Decisión**: la agenda bloquea solapamientos tanto por `provider` como por `operating_unit` (doble `UNIQUE` en BD).
**Contexto**: el análisis de mercado mostró que NADIE cubre bien la agenda por sillón en el rango de precio accesible (solo Simples Dental tiene control por cadeiras, pero en Brasil). Es el diferencial del MVP.
**Alternativas consideradas**: (a) solo por profesional — se descarta, vuelve a la agenda de soporte tradicional; (b) solo por sillón — se descarta por pérdida de visión del profesional.
**Justificación**: info de `docs/discovery/sources/simplesdental.com/planos-e-precos` (control por cadeiras) y conclusión del informe (C/D).
**Trade-offs aceptados**: más complejidad de modelado y validación; usuario debe indicar profesional + sillón.

### DD-02 — Lógica de negocio en la API (cliente delgado)
**Decisión**: la agenda es la fuente de verdad; el frontend no duplica reglas.
**Contexto**: solapamiento y estados de turnos se validan en BD; UI solo marca slots.
**Alternativas consideradas**: validación solo en frontend — descartada por riesgo de carrera entre secretaria y reserva online simultánea.
**Justificación**: RN-GL-01 (integridad de la agenda prioritaria).
**Trade-offs aceptados**: requerimiento de API robusta con transacciones; menos flexibilidad offline.

### DD-03 — Recordatorios manuales + confirmación en v0.1 (y automático en R2)
**Decisión**: en v0.1 se envían recordatorios mediante enlace/API con confirmación 1-tap; el envío automático programado llega en R2.
**Contexto**: el costo Meta (~USD 0,026/msg, verificado 2026-10-07 en dentalsoft.com.ar) y la complejidad de jobs trade a favor de un arranque barato y rentable.
**Alternativas consideradas**: programar jobs desde el día 1 — descartado por costo y scope; no hacer WhatsApp — descartado porque es el pilar del MVP (informe C).
**Justificación**: referencia de producto (Simples Dental cobra WhatsApp aparte; DentalSoft lo ubica en planes superiores) — un plan accesible con WhatsApp es el hueco del mercado.
**Trade-offs aceptados**: el "envío manual" inicial no escala igual; se compensa en R2.

### DD-04 — Pagos y señas por MercadoPago (link de pago)
**Decisión**: las señas/turnos se cobran con efectivo/tarjeta/MercadoPago, con `Payment` siempre conciliable.
**Contexto**: la seña es práctica habitual; MercadoPago es el medio digital dominante.
**Alternativas consideradas**: token de tarjeta propio — descartado por superficie PCI; solo efectivo — descartado por ausencia de datos.
**Justificación**: integraciones de DentalCore/DentalSaaS/Odonthia + RN-CO-01/02.
**Trade-offs aceptados**: dependencia de terceros (webhooks, comisiones).

### DD-05 — Obra social solo nomenclador/deuda en v0.1 (ARCA y validación a v2)
**Decisión**: v0.1 registra nomenclador, cobertura % y deuda por obra social por prestador/mes; facturación electrónica ARCA (CAE) y validación en línea quedan P2.
**Contexto**: cumplir ARCA no es bloqueante del flujo de agenda/cobros/WhatsApp en el MVP académico con datos ficticios.
**Alternativas consideradas**: implementar ARCA desde el día 1 — descartado por scope y por ser un proyecto académico (consigna prohíbe datos/producto reales).
**Justificación**: RF-24/25 marcados como P2 y RN-OS-02.
**Trade-offs aceptados**: el PVPS operativo de un consultorio real requeriría más; el MVP se enfoca en la cadena de valor.

## Supuestos inferidos

### SU-01 — Stack definitivo a fijar en el cambio OpenSpec/OPSX
**Supuesto**: Node/frontend con API REST y Postgres (u otra combinación razonable) será definida en el change técnico del roadmap.
**Origen**: `knowledge-base/02` y `08`; consigna "stack a definir en Etapa 3+" (state.discovery.restricciones).
**Riesgo si es falso**: la plantilla de arquitectura puede necesitar ajuste al elegir framework.
**Cómo validar**: en la Etapa de roadmap generamos el cambio técnico y confirmamos stack con el usuario.

### SU-02 — GitHub Actions/docker para CI/CD "de facto"
**Supuesto**: deploy contenedorizado en nube con entornos separados.
**Origen**: RNF-11/12; práctica estándar de SaaS web.
**Riesgo si es falso**: solo afecta tiempo de despliegue, no el modelo de datos.
**Cómo validar**: al armar el environment del proyecto en el primer change.

### SU-03 — Datos 100 % ficticios
**Supuesto**: ninguna obra social/clínica real, sin información sanitaria real.
**Origen**: consigna del trabajo de integración (restricciones).
**Riesgo si es falso**: N/A (es obligatorio académico).
**Cómo validar**: regla RN-PA-04 fija en la KB; revisión en revisión de código.