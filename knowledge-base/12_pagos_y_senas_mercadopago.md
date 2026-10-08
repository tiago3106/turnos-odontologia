# Pagos y señas — MercadoPago

## Rol en el MVP

Segundo pilar del MVP: la cobranza de turnos y en particular las **señas** (adelanto de tratamiento) es práctica habitual en odontología argentina. MercadoPago es el medio digital más usado del país y aparece como integración destacada en la competencia local (DentalCore, DentalSaaS, Odonthia).

## Modelo

| Concepto | Definición | Regla |
|---|---|---|
| Seña | Adelanto de un tratamiento que descuenta del total | RN-CO-01 |
| Turno | Cobro del turno en sí | RN-CO-02 |
| Medio de pago | efectivo, tarjeta (POS/online), **MercadoPago** | RN-CO-03 |

## Integración MercadoPago

- **Enfoque:** link de pago / checkout (HTTP redirect) → menor superficie PCI que card token propio. Se usa API REST oficial (SDK) y webhook verificado de estado de pago.
- **Registro:** cada `Payment` con `external_id` de MercadoPago, `status`, `method=mercadopago`, `created_by` y referencia al paciente/turno → siempre conciliable con caja.
- **Firma/secreto:** el webhook valida firma (RNF-08); se reintenta hasta confirmación de estado.
- **Reversiones:** anulación con trazabilidad (RN-CO-02), nunca borrado físico.

## Contexto de precio del mercado (verificado 2026-10-07)

- `simplesdental.com`: cobranza online vía MercadoPago (BR).
- `dentally.co` (Colombia): pago recolección en clínicas, incluye MercadoPago regionalmente.
- `odontozen.com`: pagos online; PRECIO USD 19,99/39,99/79,99 + IVA (prueba 15 días) — gama de entrada.
- `dentalcore.app`: USD 50/mes (2 usuarios) + USD 10/usuario extra; precio fundador USD 35 hasta 31/12/2026.
- Conclusión del informe: el espacio está en **plan accesible + señas vía MercadoPago + WhatsApp**; ningún plan gratuito real local cubre el core (agenda + cobros + WhatsApp) sin upgrade.