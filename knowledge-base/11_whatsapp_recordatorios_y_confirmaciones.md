# WhatsApp: recordatorios y confirmaciones

## Rol en el MVP

Es uno de los tres pilares del **MVP recomendado** (agenda por sillón + WhatsApp + MercadoPago + ARCA). Evita los no-shows y quirúrgicos costos de captación: el recordatorio con confirmación actualiza la agenda sola.

## Modelo de operación v0.1

| Canal | Uso | Costo | Rol |
|---|---|---|---|
| **Enlace WhatsApp** (`wa.me`) | Envío manual inicial de recordatorios + confirmación 1-tap | Casi nulo (sin API) | Plan "ideal" de informe: WhatsApp accesible desde el día 1 |
| **API oficial Meta** | Envío automático programado | USD 0,026/mensaje (verificado 2026-10-07, fuente dentalsoft.com.ar) | Evolución en R2 |

## Flujos soportados

1. **Recordatorio:** se genera en la ventana configurada (RN-AG-06, por defecto 24 h y 2 h antes).
2. **Confirmación:** el paciente responde **CONFIRMO** / **CANCELO** → webhook → estado del turno cambia en la agenda (< 5 s, RN-AG-08).
3. **Cancelación:** respeta el plazo configurado (RN-AG-07); fuera de plazo va a la secretaria.

## Referencias de costo verificadas (2026-10-07)

- `dentalsoft.com.ar/pricing`: plan con recordatorios automáticos por WhatsApp; costo Meta ~USD 0,026/msg.
- `simplesdental.com/planos-e-precos`: WhatsApp **no incluido** en ninguno de sus planes (pago aparte, valor verificado).
- `carestack.com/pricing`: teleconfirmación por WhatsApp/texto incluida en sus planes pagos (USD 829–1.299/mes, alta gama).

## Implicación de negocio

- Diferenciador: plan local "accesible" con agenda por sillón + WhatsApp; los competidores locales posicionan la automatización por WhatsApp en planes superiores o como costo extra (DentalSoft seña USD 30→60k/mes).
- Al no existir plan gratis local real en el rango, el espacio del mercado está en **plan de entrada barato + WhatsApp + trazabilidad** (Ley 25.326) — conclusión del informe, Matriz B, sección C.