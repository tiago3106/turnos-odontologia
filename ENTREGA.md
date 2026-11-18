# ENTREGA — TP Skills + MCP

## Integrantes

- **Guillot, Tiago** — investigación, skill propia, integración del MCP, change SDD y documentación.

## Datos de la entrega

- **Repositorio**: https://github.com/tiago3106/turnos-odontologia
- **Commit de entrega**: `ff79943`
- **Video explicativo**: https://youtu.be/Y1wzXT_QxCY
- **ZIP**: `TP-Skills-MCP-Guillot.zip`

## Documentos

- Ficha de investigación (≤2 págs): [`docs/skills-mcp/investigacion.md`](docs/skills-mcp/investigacion.md)
- Informe de aplicación (≤2 págs): [`docs/skills-mcp/aplicacion.md`](docs/skills-mcp/aplicacion.md)
- Evidencias: [`docs/skills-mcp/evidencias/`](docs/skills-mcp/evidencias/)
- Guía del MCP: [`docs/skills-mcp/mcp-github.md`](docs/skills-mcp/mcp-github.md)

## Artefactos

- Skill propia: `agent/skills/spec-scenario-validator/SKILL.md` (+ espejos `.claude/`, `.agents/`).
- Registro e instrucciones: `.atl/skill-registry.md`, `AGENTS.md`, `CLAUDE.md`.
- Config MCP reproducible: `opencode.json` + `scripts/opencode-with-github.ps1`.
- Change preparado: `openspec/changes/agenda-staff-ui/` (sin implementar).

## Reproducción rápida

```powershell
Get-Content -Raw opencode.json | ConvertFrom-Json
openspec validate agenda-staff-ui --strict
.\scripts\opencode-with-github.ps1 mcp list
.\scripts\opencode-with-github.ps1 run --auto "listá los últimos commits del repo"
```

## Checklist de la consigna

- [x] Ficha de investigación con fuentes verificables, comparación y elección.
- [x] Skill propia documentada, integrada y usada con evidencia.
- [x] MCP documentado y operativo (tool real invocada).
- [x] Change preparado con SDD y validado (`openspec validate --strict`).
- [x] Sin secretos ni datos reales de pacientes.
- [x] Commit de entrega pusheado al repositorio.
- [x] Avance TPI pusheado en `6738dc2` (7 changes archivados, Swagger y vínculo turno→paciente).
