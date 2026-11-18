# Tasks — caja-y-senas

> Cada task se verifica con un test automatizado (Vitest + Supertest) o `prisma validate`.
> Se ejecuta `npm run typecheck`, `npm run lint` y `npm test` antes de archivar.

## 1. Modelo y migración

- [x] 1.1 Agregar `Payment` y sus relaciones a `Clinic`, `Appointment` y `Patient`, y verificar
      con `npx prisma validate`
- [x] 1.2 Migración 0005 con FKs y `CHECK` de monto, tipo, medio, estado y referencia, y
      verificar que `prisma migrate deploy` la aplica limpia
- [x] 1.3 Regenerar el cliente Prisma y verificar que `npm run typecheck` compila

## 2. Registro y consulta

- [x] 2.1 Implementar `POST /api/payments` con validación de referencias y auditoría, y
      verificar con test el cobro de turno, la seña por MercadoPago y la seña sin turno (400)
- [x] 2.2 Verificar con test el monto no positivo (400) y las referencias inexistentes (404)
- [x] 2.3 Implementar `GET /api/payments` con filtros y `includeAnnulled`, y verificar con test
      el filtro por turno, el día del consultorio y la exclusión de anulados

## 3. Anulación

- [x] 3.1 Implementar `POST /api/payments/{id}/annul` con motivo, timestamp y auditoría, y
      verificar con test la anulación y la doble anulación (409)

## 4. Cierre de caja

- [x] 4.1 Implementar `GET /api/cash/close` con totales por medio y por profesional, y verificar
      con test el cierre con varios medios
- [x] 4.2 Verificar con test que los anulados no suman y que un día sin cobros devuelve total 0
- [x] 4.3 Verificar con test el 400 para una fecha inválida

## 5. Cierre

- [x] 5.1 Documentar los endpoints en `README.md` y el estado del change en `CHANGES.md`
- [x] 5.2 Ejecutar `spec-scenario-validator` y adjuntar el reporte en
      `docs/skills-mcp/evidencias/spec-scenario-caja-y-senas.md`
- [x] 5.3 Suite completa `npm test`, `npm run typecheck` y `npm run lint` en verde
- [x] 5.4 Archivar con `openspec archive caja-y-senas --yes`
