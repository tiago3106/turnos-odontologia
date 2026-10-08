# Actores y Roles

## Actores del sistema

| Actor | Descripción | Cómo interactúa |
|---|---|---|
| Secretaria / recepcionista | Administra la agenda del consultorio: agenda, confirma, cobra señas, da alta a pacientes | App web staff |
| Odontólogo | Ve su propia agenda y registra la prestación en la ficha clínica/odontograma | App web staff |
| Director / dueño de la clínica | Controla ocupación, cobros, comisiones, deudas por obra social y reportes | App web staff |
| Paciente (registrado) | Reserva/cancela turnos online, recibe recordatorios, completa ficha previa | Web pública + WhatsApp |
| Paciente (sin login) | Reserva mediante link 24/7 con alta mínima (nombre + teléfono/email) | Web pública |

**Soporte multi-profesional y por sillón desde la v0.1** (1 clínica, varios profesionales y sillones).

## RBAC — Matriz de permisos

| Recurso | Secretaria | Odontólogo | Director | Paciente |
|---|---|---|---|---|
| Agenda (ver) | Todo el consultorio | Solo propia | Todo el consultorio | Disponibilidad pública |
| Agenda (crear/mover/bloquear) | Sí (con control de choques) | Propia (y bloques) | Sí | Crear/cancelar propio |
| Pacientes (CRUD) | CRUD | Ver + ficha clínica | CRUD + reportes | Ver su propia ficha |
| Ficha clínica / odontograma | Ver | Editar (prestación) | Ver | Ver (si se expone) |
| Obra social / deuda | Registrar | Ver | Gestión + reportes | Ver |
| Caja / señas | Cobrar y registrar | No | Todo (cierre) | Pagar su turno |
| Reportes | No | No | Sí | No |
| Configuración precios/prestaciones | No | No | Sí | No |

## Rutas públicas

- `GET /` y `GET /book` — página pública de reserva 24/7 (link por clínica).
- `GET /api/schedule/availability` — slots disponibles (sin autenticación).
- `POST /api/appointments` + `POST /api/patients` — autogestión del paciente (alta mínima).
- `POST /api/appointments/{id}/confirm|cancel` — confirmación/cancelación desde WhatsApp (token efímero en el mensaje).
- Callbacks: `POST /api/webhooks/mercadopago` (pago/seña), `POST /api/webhooks/whatsapp` (respuesta del paciente).