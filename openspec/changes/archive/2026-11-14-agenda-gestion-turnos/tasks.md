# Tasks — agenda-gestion-turnos

> Cada task se verifica con un test automatizado (Vitest + Supertest) o `prisma validate`.
> Se ejecuta `npm run typecheck`, `npm run lint` y `npm test` antes de archivar.

## 1. Modelo y migración

- [x] 1.1 Agregar `cancelledAt`, `cancelReason` y `updatedAt` a `Appointment` y verificar con
      `npx prisma validate`
- [x] 1.2 Migración 0004 con `CHECK` de estados e índices parciales que ignoran cancelados, y
      verificar que `prisma migrate deploy` la aplica limpia
- [x] 1.3 Regenerar el cliente Prisma y verificar que `npm run typecheck` compila

## 2. Consulta de agenda

- [x] 2.1 Implementar `GET /api/appointments` con `date` (UTC-3), `from`/`to`, `providerId`,
      `operatingUnitId`, `status` e `includeCancelled`, y verificar con test el filtro por día,
      por profesional y la exclusión de cancelados
- [x] 2.2 Implementar `GET /api/appointments/{id}` con relaciones y verificar con test 200 y 404
- [x] 2.3 Verificar con test el 400 para `date` con formato inválido

## 3. Reprogramación

- [x] 3.1 Implementar `PATCH /api/appointments/{id}` recalculando el fin y auditando, y verificar
      con test el movimiento válido
- [x] 3.2 Verificar con test el 409 por solape sin modificar el turno y el 409 sobre cancelado
- [x] 3.3 Verificar con test que cambiar la prestación recalcula la duración y el 400 sin campos

## 4. Cancelación y estados

- [x] 4.1 Implementar `POST /api/appointments/{id}/cancel` con motivo, timestamp y auditoría, y
      verificar con test la cancelación y la doble cancelación (409)
- [x] 4.2 Verificar con test que el slot cancelado se puede volver a reservar (borde)
- [x] 4.3 Implementar `POST /api/appointments/{id}/status` con transiciones válidas y verificar
      con test el flujo pendiente→confirmado→atendido, la transición inválida y el cancelado
- [x] 4.4 Aceptar `status` opcional en el alta y verificar con test el turno `pendiente`

## 5. Cierre

- [x] 5.1 Documentar los endpoints en `README.md` y el estado del change en `CHANGES.md`
- [x] 5.2 Ejecutar `spec-scenario-validator` y adjuntar el reporte en
      `docs/skills-mcp/evidencias/spec-scenario-agenda-gestion-turnos.md`
- [x] 5.3 Suite completa `npm test`, `npm run typecheck` y `npm run lint` en verde
- [x] 5.4 Archivar con `openspec archive agenda-gestion-turnos --yes`
