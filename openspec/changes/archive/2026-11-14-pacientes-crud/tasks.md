# Tasks — pacientes-crud

> Cada task se verifica con un test automatizado (Vitest + Supertest) o con `prisma validate`.
> Se ejecuta `npm run typecheck`, `npm run lint` y `npm test` antes de archivar.

## 1. Modelo y migración

- [x] 1.1 Agregar `Patient` y `AuditLog` a `prisma/schema.prisma` y verificar con `npx prisma validate`
- [x] 1.2 Migración 0002 (`patient`, `audit_log`, índices y FKs) y verificar que `prisma migrate deploy`
      la aplica limpia sobre la BD de test
- [x] 1.3 Regenerar el cliente Prisma y verificar que `npm run typecheck` compila los nuevos modelos

## 2. API de pacientes

- [x] 2.1 Implementar `createPatient` con validación de contacto (RN-PA-01) y DNI único por clínica,
      y verificar con test que el alta válida responde 201 y la inválida 400
- [x] 2.2 Implementar `GET /api/patients/{id}` y verificar con test el caso existente (200) e inexistente (404)
- [x] 2.3 Implementar `GET /api/patients?q=&includeInactive=` con límite 100 y verificar con test
      la búsqueda insensible a mayúsculas y el filtrado de inactivos
- [x] 2.4 Implementar `PATCH /api/patients/{id}` con validación de contacto resultante y verificar
      con test la edición válida, la inválida y la baja lógica

## 3. Auditoría

- [x] 3.1 Implementar `AuditLog` en alta y edición con snapshot antes/después (RN-AU-01) y verificar
      con test que el alta registra `create` y la edición registra `update` con los snapshots
- [x] 3.2 Verificar con test que una solicitud rechazada (400/404/409) no deja registros de auditoría

## 4. Tests de escenarios

- [x] 4.1 Escenarios felices del spec en verde con `npm test`
- [x] 4.2 Escenarios de error de negocio (validación, DNI duplicado, id inexistente) en verde
- [x] 4.3 Escenarios de borde (solo email, búsqueda parcial, baja lógica) en verde
- [x] 4.4 Suite completa `npm test` sin tests skipped; `npm run typecheck` y `npm run lint` sin errores

## 5. Documentación y cierre

- [x] 5.1 Documentar los endpoints en `README.md` y el estado del change en `CHANGES.md`
- [x] 5.2 Ejecutar `spec-scenario-validator` sobre la spec y adjuntar el reporte en
      `docs/skills-mcp/evidencias/spec-scenario-pacientes-crud.md`
- [x] 5.3 Archivar con `openspec archive pacientes-crud --yes` y verificar que `openspec list` no lo muestra activo
