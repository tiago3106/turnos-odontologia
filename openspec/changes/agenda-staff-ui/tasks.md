# Tasks — agenda-staff-ui

> Change **preparado, no implementado**. La validación de la spec delta ya se ejecutó con la
> skill `spec-scenario-validator` (ver `docs/skills-mcp/evidencias/spec-scenario-agenda-staff-ui.md`).
> Las tasks de implementación quedan pendientes y no deben marcarse hasta ejecutarlas.

## 0. Precondiciones (bloqueantes)

- [ ] 0.1 Verificar que C-03 (auth/RBAC), C-05 y C-06 están en
      `openspec/changes/archive/` y que existen los endpoints de agenda que consume la UI
- [ ] 0.2 Verificar Playwright configurado en `frontend/` y seed ficticio reproducible
      (1 clínica, 2 profesionales, 2 sillones, turnos y bloqueos de prueba, sin datos reales)

## 1. Scaffold de la feature

- [ ] 1.1 Crear `frontend/src/features/agenda/` y `frontend/src/pages/agenda/`, registrar las
      rutas `/agenda` y `/agenda/hoy`, y verificar con `npm run typecheck` y `npm run lint`
- [ ] 1.2 Implementar el guard de rol (odontólogo solo su agenda; secretaria/director todo) y
      verificar con test que un odontólogo no accede a la agenda de otro
- [ ] 1.3 Cliente API tipado con Zod para availability, appointments, move, cancel y status, y
      verificar con test que un payload inválido se rechaza antes de salir

## 2. Vistas y render

- [ ] 2.1 Implementar `AgendaGrid` con slots de 15 min en escala día/semana, y verificar con
      test de componente que un turno de 30 min ocupa dos slots
- [ ] 2.2 Implementar el toggle profesional/sillón con estado en la URL
      (`?view=provider|chair&date=YYYY-MM-DD`) y verificar con test que conmutar conserva la fecha
- [ ] 2.3 Renderizar estados libre/ocupado/bloqueado/sobreturno (gris para ocupado y bloqueado,
      badge para sobreturno), y verificar con test de componente que el slot bloqueado no ofrece
      "Agendar"

## 3. Acciones

- [ ] 3.1 Agendar desde slot libre: formulario paciente + prestación, duración derivada, y
      verificar con test de integración que responde 201 y pinta la tarjeta en el rango correcto
- [ ] 3.2 Mover con drag & drop + diálogo accesible; ante `409` revertir tarjeta y marcar el
      slot destino, y verificar con test que no se duplica ni pierde el turno
- [ ] 3.3 Cancelar y marcar asistido/no_asistido con confirmación y auditoría, y verificar con
      test que un odontólogo recibe 403 al cancelar un turno ajeno
- [ ] 3.4 Crear sobreturno solo en slot libre, con badge y manejo de `409`, y verificar con test
      que no se permite sobre slot ocupado ni bloqueado
- [ ] 3.5 Dashboard `/agenda/hoy`: próximos turnos ordenados, estado vacío y estado de error con
      reintento, y verificar con test de componente los tres casos

## 4. Tests e2e (Playwright)

- [ ] 4.1 Flujo feliz: agendar un turno end-to-end y verlo en la grilla y en el dashboard
- [ ] 4.2 Error de negocio: arrastrar sobre slot ocupado → 409, rollback y aviso, sin duplicar
- [ ] 4.3 Borde: mover un turno para que empiece justo cuando termina otro → aceptado
- [ ] 4.4 Cambio de vista profesional↔sillón conserva fecha y turnos visibles
- [ ] 4.5 RBAC: odontólogo solo ve su agenda; secretaria ve todo el consultorio
- [ ] 4.6 Suite completa `npm run test:e2e` en verde, sin tests skipped y con datos ficticios

## 5. Documentación y cierre

- [ ] 5.1 Documentar la feature en `docs/skills-mcp/aplicacion.md` con captura/evidencia de los
      e2e y referencia a las reglas RN-AG-* cubiertas
- [ ] 5.2 Re-ejecutar `spec-scenario-validator` sobre la spec implementada y adjuntar el reporte
      en `docs/skills-mcp/evidencias/`
- [ ] 5.3 Marcar C-07 en `CHANGES.md` y archivar con `/opsx:archive agenda-staff-ui`
