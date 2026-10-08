# Obra social, facturación y cumplimiento argentino

## Por qué importa

La facturación a **obras sociales es obligatoria** en consultorios odontológicos argentinos (facturación electrónica ARCA/AFIP). La competencia local lo usa como diferenciador (DentalCore: ARCA + MercadoPago + HL7 FHIR; DentalTec: integración SOAP con 15+ obras sociales).

## Lo que hace el sistema en v0.1

| Capacidad | Alcance | Regla |
|---|---|---|
| Catálogo de prestaciones propio | Sí, con `insurance_code` | RN-OS-01 |
| Cobertura % (s/ obra social, s/ plan) y copago | Sí (nomenclador local mínimo) | RN-OS-01 |
| Deuda por obra social por prestador/mes | Sí (planilla exportable) | RN-OS-02 |
| Facturación electrónica ARCA (A/B/C con CAE) | **Diferido a v2** (RF-24) | — |
| Validación en línea de obra social | **Diferido a v2** (RF-25, referencia SOAP DentalTec) | — |
| HL7 FHIR (interoperabilidad) | Opcional, P2 (RNF-16) | — |

## Cumplimiento (datos ficticios en este proyecto)

- Ley 25.326 (protección de datos personales) y Ley 26.529 (HCD): se exigen controles (acceso, trazabilidad RNF-13) pero **todos los datos usados en el proyecto son ficticios** (consigna; RN-PA-04).
- El AuditLog permite demostrar quién/cuándo/dónde sobre los registros → evidencia de cumplimiento y trazabilidad (diferencial del informe).

## Referencias de mercado (verificado 2026-10-07)

- `carestack.com/pricing`: 3000+ clínicas, orientación a facturación y pagos; USD 829–1.299/mes.
- `odontozen.com/precios`: backups diarios 90 días (apunta a retención/cumplimiento).
- `dentalcore.app`: HL7 FHIR + ARCA + MercadoPago, USD 50/mes (precio fundador USD 35).

## Priorización (recomendación del informe)

El MVP construye: **agenda por sillón + WhatsApp + MercadoPago + trazabilidad a precio accesible**, con nomenclador mixto (dador de privado + obra social) para no bloquear por ARCA. La facturación electrónica y la validación en línea de obras sociales quedan en el roadmap como hitos que suben el precio.