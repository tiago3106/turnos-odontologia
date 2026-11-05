# Aplicación: skill propia + GitHub MCP en `turnos-odontologia`

> Fecha: **2026-11-05**. Change preparado (no implementado): `agenda-staff-ui` (C-07).

## 1. Skill propia: `spec-scenario-validator`

Creada con `skill-creator` (`github.com/anthropics/skills`, disponible en
`~/.config/opencode/skills/skill-creator`). Audita una spec delta de OpenSpec contra
`knowledge-base/05_reglas_de_negocio.md` y exige, por regla aplicable, escenarios feliz, de
error de negocio y de borde, deterministas y verificables; además chequea que `tasks.md` los
verifique.

Integrada con el patrón de espejos del repo: `agent/skills/`, `.claude/skills/` y
`.agents/skills/`; registrada en `.atl/skill-registry.md`, `AGENTS.md` y `CLAUDE.md`.

**Uso real.** Sobre `agenda-staff-ui` produjo
`docs/skills-mcp/evidencias/spec-scenario-agenda-staff-ui.md`: **PASS**, 7 requirements, 21
escenarios, 0 brechas bloqueantes, 6 ambigüedades no bloqueantes. Cubre RN-AG-01/02/03/04/05/07,
RN-AU-01 y RN-GL-01; justifica las no aplicables (RN-AG-06/08/09, RN-AU-02). Descubrimiento
verificado en sesión nueva: `evidencias/skill-discovery.txt`.

## 2. Servidor MCP: GitHub MCP

Config versionada en `opencode.json` (remoto `https://api.githubcopilot.com/mcp/`, solo lectura).
El token **no** está en el repo: se inyecta con `{env:GITHUB_PERSONAL_ACCESS_TOKEN}`. Guía
reproducible: `docs/skills-mcp/mcp-github.md`. Atajo sin pegar el token:
`scripts/opencode-with-github.ps1` (lee la credencial de Git Credential Manager y la setea solo
para el proceso).

**Verificación en vivo (2026-11-05).**

| Paso | Resultado |
|---|---|
| `opencode mcp list` | `github connected` (`evidencias/mcp-github-list.txt`) |
| `opencode mcp debug github` | conecta; OAuth deshabilitado a propósito (PAT) |
| Tool invocada en sesión nueva | `github_list_commits` sobre `tiago3106/turnos-odontologia` → 3 commits reales (`evidencias/mcp-github-live.txt`) |

Límites: solo lectura sobre el repo propio y repos públicos; prohibido escribir issues/PRs/commits;
sin datos de pacientes.

## 3. Change preparado con SDD

`openspec/changes/agenda-staff-ui/` (`proposal.md`, `design.md`, `specs/agenda/staff-ui/spec.md`,
`tasks.md`, `.openspec.yaml`). Alcance: vistas por profesional/sillón, grid, tarjetas, bloqueos,
sobreturnos, agendar/mover/cancelar/marcar, dashboard y RBAC; **sin implementar** (22 tasks `[ ]`).

```text
$ openspec validate agenda-staff-ui --strict
Change 'agenda-staff-ui' is valid
```

`CHANGES.md` marca C-07 como **preparado (pendiente de implementar)**.

## 4. Archivos modificados y motivo

| Archivo | Motivo |
|---|---|
| `opencode.json` | Alta del MCP GitHub remoto, sin secretos (token por env) |
| `agent/skills/spec-scenario-validator/SKILL.md` | Skill propia (fuente) |
| `.claude/skills/…`, `.agents/skills/…` | Espejos para discovery de opencode |
| `.atl/skill-registry.md` | Registrar la skill y sus compact rules |
| `AGENTS.md`, `CLAUDE.md` | Documentar skill y MCP para los agentes |
| `docs/skills-mcp/investigacion.md` | Ficha de investigación (≤2 págs) |
| `docs/skills-mcp/aplicacion.md` | Este informe (≤2 págs) |
| `docs/skills-mcp/mcp-github.md` | Instrucciones reproducibles del MCP |
| `docs/skills-mcp/evidencias/*` | Reporte de la skill y pruebas del MCP |
| `openspec/changes/agenda-staff-ui/**` | Change C-07 preparado con SDD |
| `CHANGES.md` | Estado de C-07: preparado, pendiente |
| `scripts/opencode-with-github.ps1` | Lanzar opencode con el token desde GCM sin exponerlo |

## 5. Revisión crítica

- **Fortalezas**: la skill es específica del dominio, cita reglas `RN-*` y deja evidencia
  reproducible; el MCP quedó operativo y verificado con una tool real; no hay secretos en el repo;
  el change pasa `openspec validate --strict`.
- **Debilidades**: la validación de escenarios es asistida por LLM, no determinista; el MCP depende
  de un PAT/GCM y del servicio externo de GitHub; el helper de GCM no es portable a otra máquina;
  C-07 aún no se implementó, así que no hay evidencia de ejecución de la UI.
- **Mejoras**: agregar un lint de specs en CI, fijar toolsets read-only en la config, y cerrar las
  6 ambigüedades del reporte al iniciar C-06.

## 6. Limitaciones

- C-07 requiere C-03/C-05/C-06 archivados; hoy solo está preparado.
- El test en vivo usó la credencial de GitHub ya guardada en GCM; en otro equipo hay que proveer
  PAT u OAuth.
- GitHub MCP es solo lectura y está sujeto a rate limits de GitHub.
- Entrega: `TP-Skills-MCP-Guillot.zip` con `ENTREGA.md`, esta ficha y el informe.

## 7. Verificación reproducible

```powershell
Get-Content -Raw opencode.json | ConvertFrom-Json
openspec validate agenda-staff-ui --strict
.\scripts\opencode-with-github.ps1 mcp list
.\scripts\opencode-with-github.ps1 run --auto "listá los últimos commits del repo"
```
