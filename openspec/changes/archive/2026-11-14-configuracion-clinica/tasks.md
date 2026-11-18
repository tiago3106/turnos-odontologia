# Tasks — configuracion-clinica

> Cada task se verifica con un test automatizado (Vitest + Supertest) o `prisma validate`.
> Se ejecuta `npm run typecheck`, `npm run lint` y `npm test` antes de archivar.

## 1. Modelo y migración

- [x] 1.1 Extender `Procedure`, `Provider` y `OperatingUnit` y agregar `ProviderSchedule` en
      `prisma/schema.prisma`, y verificar con `npx prisma validate`
- [x] 1.2 Migración 0003 con columnas nuevas, `provider_schedule` y la restricción `EXCLUDE`,
      y verificar que `prisma migrate deploy` la aplica limpia
- [x] 1.3 Regenerar el cliente Prisma y verificar que `npm run typecheck` compila

## 2. Prestaciones

- [x] 2.1 Implementar alta/listado/edición con precio en centavos y verificar con test el alta (201),
      el código duplicado (409) y la duración inválida (400)
- [x] 2.2 Registrar auditoría en alta y edición y verificar con test el snapshot before/after
- [x] 2.3 Verificar con test que la baja lógica excluye del listado por defecto e incluye con
      `?includeInactive=true`

## 3. Profesionales y sillones

- [x] 3.1 Implementar alta/listado/edición de profesionales con validación de color y verificar
      con test el alta válida (201) y el color inválido (400)
- [x] 3.2 Implementar alta/listado/edición de sillones y verificar con test la baja lógica
- [x] 3.3 Exponer `GET /api/schedule/providers` y `GET /api/schedule/sills` y verificar con test
      que devuelven solo activos (con horarios en el caso de profesionales)

## 4. Horarios y anti-solape

- [x] 4.1 Implementar `POST /api/schedule/providers/{id}/schedules` con validación de rango y
      verificar con test el alta válida y el rango inválido (400)
- [x] 4.2 Verificar con test que un horario solapado responde 409 sin persistir y que los
      contiguos se aceptan
- [x] 4.3 Verificar con test la restricción de BD insertando directamente un solape
- [x] 4.4 Verificar con test el 404 para un profesional inexistente

## 5. Cierre

- [x] 5.1 Documentar los endpoints en `README.md` y el estado del change en `CHANGES.md`
- [x] 5.2 Ejecutar `spec-scenario-validator` y adjuntar el reporte en
      `docs/skills-mcp/evidencias/spec-scenario-configuracion-clinica.md`
- [x] 5.3 Suite completa `npm test`, `npm run typecheck` y `npm run lint` en verde
- [x] 5.4 Archivar con `openspec archive configuracion-clinica --yes`
