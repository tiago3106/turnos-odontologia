# Flujos Principales

Cada flujo se documenta extremo a extremo, mostrando interacciones entre componentes.

## Flujo 1: Autenticación y acceso por roles

**Disparador**: usuario (secretaria/odontólogo/director) abre la app staff
**Actor**: usuario staff

**Pasos**:
1. [Login] se autentica con email + contraseña (JWT + bcrypt).
2. [API] valida credenciales y emite token con claims de rol.
3. [Frontend] construye la UI según el rol (RBAC).
4. [API] cada endpoint vuelve a validar el rol (RNF-05).

**Diagrama de secuencia**:
```
Usuaria → Login → API → DB
                   ← token JWT (claims: role)
Usuaria → API (Recurso) → middleware RBAC → respuesta o 403
```

**Casos de error**:
- Credencial inválida → 401 y mensaje genérico
- Rol sin permiso → 403

**Reglas**: RN-AU-02, RNF-04, RNF-05

## Flujo 2: Agendar turno (anti-solapamiento)

**Disparador**: la secretaria elige profesional/sillón y hora (vista de agenda)
**Actor**: secretaria

**Pasos**:
1. [Frontend] pide disponible por profesional y sillón.
2. [API] computa slots libres (turnos + bloques + sobreturnos).
3. [Secretaria] selecciona slot y prestación.
4. [API] INSERT con UNIQUE (provider, start, end) y (operating_unit, start, end) en transacción.
5. [DB] si viola constraint → 409; si no, commit y Refresh de la vista.

**Diagrama de secuencia**:
```
Secretaria → Frontend → API → DB
   ← slots libres          INSERT (tx)
   ← 200 / 409          ← resultado
```

**Casos de error**:
- Slot ocupado por otro justo antes → 409, la UI bloquea el slot en todas las vistas (RN-GL-01)
- Duración excede el bloque → se sugiere otro slot

**Reglas**: RN-AG-01, RN-AG-02, RN-AG-03

## Flujo 3: Reserva online 24/7

**Disparador**: el paciente abre el link público con QR/link
**Actor**: paciente

**Pasos**:
1. [Público] resuelve disponibilidad real (RN-AG-09).
2. [Paciente] alta mínima (nombre + teléfono/email) o login.
3. [API] reserva con hold breve (interna: `pending` con `source=online`).
4. [WhatsApp] se programa recordatorio de confirmación (v0.1: manual + enlace; R2: automático).
5. [API] confirmación/cancelación del paciente cambia el estado del turno.

**Diagrama de secuencia**:
```
Paciente → Portal público → API → DB (hold)
   ← slots libres
Paciente → WhatsApp (CONFIRMO) → Webhook → API → DB(status=confirmado)
```

**Casos de error**:
- Paciente no confirma en el plazo → la secretaria gestiona (RN-AG-07)
- Webhook sin firma válida → rechazado (RNF-08)

**Reglas**: RN-AG-06, RN-AG-07, RN-AG-08, RN-AG-09

## Flujo 4: Cobro de turno y seña

**Disparador**: la secretaria recibe el pago del paciente
**Actor**: secretaria → director

**Pasos**:
1. [Secretaria] selecciona paciente y turno/tratamiento.
2. [API] registra `Payment` (turno o seña) con medio de pago.
3. [MercadoPago] si aplica: link de pago; webhook verificado actualiza estado.
4. [API] la seña descuenta del tratamiento (RN-CO-01).
5. [Director] cierra caja por medio/profesional y exporta (RN-CO-03).

**Casos de error**:
- Pago pendiente en MercadoPago → reintento/consulta de estado (RNF-08)
- Anulación → queda trazada en AuditLog (RN-CO-02)

**Reglas**: RN-CO-01, RN-CO-02, RN-CO-03

## Flujo 5: Atención y ficha clínica

**Disparador**: el odontólogo selecciona al paciente del turno
**Actor**: odontólogo

**Pasos**:
1. [Odontólogo] abre la ficha del paciente.
2. Registra prestación, notas y estados del odontograma (pieza FDI/superficie).
3. [API] crea `ClinicalRecord` versionado + `ToothState` (historial, RN-PA-02/03).
4. [Director] puede ver (no editar) y consultar historial.

**Casos de error**:
- Odontólogo sin rol de edición → 403

**Reglas**: RN-PA-02, RN-PA-03, RN-AU-02

## Flujo 6: Obra social y deuda

**Disparador**: el director configura/presta obra social
**Actor**: director

**Pasos**:
1. Configura obra social y cobertura % por prestación (RN-OS-01).
2. Se registra la prestación con código de práctica y copago.
3. Cada prestación genera deuda por obra social/prestador/mes (RN-OS-02).
4. Planilla mensual exportable (CSV/PDF).

**Reglas**: RN-OS-01, RN-OS-02, RN-AU-02

## Flujo 7: Auditoría y trazabilidad

**Disparador**: cualquier acción de creación/modificación/anulación/cobro
**Actor**: sistema (automático) + director (consulta)

**Pasos**:
1. [API] escribe `AuditLog` (usuario, entidad, acción, before/after, IP, timestamp) (RNF-13).
2. [Director] consulta filtrando por entidad/usuario/fecha.

**Casos de error**:
- Escritura de log falla → se rechaza la operación (trazabilidad garantizada)

**Reglas**: RN-AU-01, RNF-13