# Investigación: skill propia + servidor MCP en `turnos-odontologia`

> Fecha de consulta de fuentes: **2026-11-05**. Proyecto: `turnos-odontologia` (agenda odontológica, stack OpenSpec/OPSX).

## 1. Necesidad real del proyecto

El próximo change del roadmap es **C-07 `agenda-staff-ui`**, que expone la agenda en una UI operable por staff (vista por profesional y por sillón, grilla de slots, tarjetas de turno, bloqueos, sobreturnos y acciones agendar/mover/cancelar/marcar). Su riesgo no es de infraestructura sino de **specs incompletas**: la UI puede implementarse con escenarios solo "felices" y dejar afuera errores de negocio y bordes ya normados.

Reglas de negocio que C-07 debe respetar (KB `05_reglas_de_negocio.md`): `RN-AG-01`/`02` anti-solape y transiciones de estado, `RN-AG-03` duración por prestación, `RN-AG-04` bloqueos, `RN-AG-05` sobreturnos, `RN-AG-07` cancelación. Cada una necesita al menos un escenario verificable en la spec delta.

Por eso se eligen dos integraciones complementarias:

1. **Skill propia `spec-scenario-validator`** — audita una spec delta de OpenSpec contra la KB y exige cobertura feliz + error de negocio + borde antes de implementar.
2. **GitHub MCP** — permite leer el repo real (spec vigente, historial de commits, PRs) y el repo fuente de la skill creadora, para fundamentar la preparación de C-07 sin inventar contexto.

## 2. Skill creadora investigada

| Ítem | Hallazgo |
|---|---|
| Fuente | `github.com/anthropics/skills` → skill `skill-creator` |
| Catálogo | https://www.skills.sh/anthropics/skills/skill-creator |
| Instalación CLI | `npx skills add https://github.com/anthropics/skills --skill skill-creator` |
| Estado local | Ya disponible en `~/.config/opencode/skills/skill-creator` y listada por el agente; no requiere reinstalación |
| Formato que produce | `SKILL.md` con frontmatter YAML (`name`, `description`) + cuerpo procedimental; compatible con opencode y Claude Code |
| Verificación de compatibilidad | El agente descubre skills por `SKILL.md` en `.opencode/skills/`, `.claude/skills/`, `.agents/skills/` y global; el proyecto ya usa ese patrón |

**Skill propia resultante:** `spec-scenario-validator`.
- Entradas: nombre del change, sus `specs/**/spec.md`, `tasks.md` y la KB.
- Procedimiento: matriz regla→escenario; clasificación feliz/error/borde; verificación GIVEN/WHEN/THEN determinista; detección de ambigüedades; chequeo de que `tasks.md` verifica cada escenario.
- Salida: reporte PASS/FAIL con brechas y escenarios sugeridos, en `docs/skills-mcp/evidencias/`.
- Límites: no modifica la spec sin pedido, no inventa reglas, cita IDs `RN-AG-*`.

## 3. Servidores MCP comparados

| Criterio | Context7 | GitHub MCP |
|---|---|---|
| Propósito | Documentación actualizada de librerías/frameworks | Leer repos, código, commits, issues y PRs; automatizar workflows |
| Tools principales | `resolve-library-id`, `query-docs` | Toolsets `context`, `repos`, `issues`, `pull_requests`, `users`, `actions`, etc. |
| Transporte en opencode | Remoto (ya configurado en la config global) | Remoto `https://api.githubcopilot.com/mcp/` (local requiere Docker, no disponible) |
| Requisitos | Ninguno obligatorio (API key opcional para más rate limit) | Cuenta GitHub + PAT (o flujo OAuth de opencode) |
| Permisos | Solo lectura de documentación pública | PAT con scopes; puede leer/escribir datos del repo → **riesgo si no se limita** |
| Credenciales | API key opcional | PAT obligatorio si `oauth:false`; puede ir por env, nunca en el repo |
| Costo | Gratuito (tier con límites) | Gratuito, sujeto a rate limits de la API de GitHub |
| Aporte a C-07 | Consultar docs de las libs del frontend | Leer la spec vigente y el historial real del repo; verificar el repo fuente de `skill-creator` |

**Elección: GitHub MCP.** Razón: C-07 se prepara sobre un repo con remoto GitHub; el servidor permite contrastar la spec delta con la spec vigente y el historial de commits/PRs, y auditar el origen de la skill creadora. Context7 queda como complemento ya conectado para dudas de librerías, pero no aporta contexto del proyecto.

**Límites de uso definidos (seguridad):**
- Solo lectura y solo sobre `tiago3106/turnos-odontologia` y repos públicos (`anthropics/skills`).
- Prohibido escribir issues/PRs/commits desde el agente.
- PAT *fine-grained* de solo lectura, inyectado por variable de entorno (`GITHUB_PERSONAL_ACCESS_TOKEN`); nunca commiteado.
- Preferir OAuth de opencode (`opencode mcp auth github`) para no almacenar secreto; PAT solo como fallback.
- Sin datos de pacientes: el repo no los contiene y el agente no debe introducirlos.

## 4. Instalación / configuración prevista

**Skill:** copiar `spec-scenario-validator/SKILL.md` a `agent/skills/` y espejos `.claude/skills/` y `.agents/skills/` (patrón existente del repo), y registrarla en `.atl/skill-registry.md`.

**MCP (config de proyecto, sin secretos):**

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "github": {
      "type": "remote",
      "url": "https://api.githubcopilot.com/mcp/",
      "enabled": true,
      "oauth": false,
      "headers": { "Authorization": "Bearer {env:GITHUB_PERSONAL_ACCESS_TOKEN}" }
    }
  }
}
```

Verificación: `opencode mcp list` y `opencode mcp debug github`; luego invocar una tool de lectura en sesión nueva (las tools no aparecen en la sesión ya abierta). Alternativa sin secreto: quitar `oauth:false` y ejecutar `opencode mcp auth github`.

## 5. Archivos de fundación a actualizar

- `docs/skills-mcp/investigacion.md` y `aplicacion.md` (entregables).
- `docs/skills-mcp/evidencias/` (reportes de la skill y pruebas del MCP).
- `agent/skills/spec-scenario-validator/` + `.claude/skills/` + `.agents/skills/`.
- `.atl/skill-registry.md` (registrar la skill).
- `AGENTS.md` / `CLAUDE.md` (sección skills + MCP, sin secretos).
- `README.md` o `docs/skills-mcp/mcp-github.md` (setup reproducible).
- `CHANGES.md` (marcar C-07 como "preparado, pendiente de implementar").
- `openspec/changes/agenda-staff-ui/` (proposal/design/specs/tasks del change pendiente).

## 6. Fuentes

- https://www.skills.sh/anthropics/skills/skill-creator — consultado 2026-11-05.
- https://github.com/anthropics/skills — consultado 2026-11-05.
- https://github.com/github/github-mcp-server — consultado 2026-11-05.
- https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-opencode.md — consultado 2026-11-05.
- https://opencode.ai/docs/mcp-servers/ — consultado 2026-11-05.
- https://opencode.ai/docs/skills/ — consultado 2026-11-05.
- https://github.com/upstash/context7 — consultado 2026-11-05.
- Repo local: `CHANGES.md`, `knowledge-base/05_reglas_de_negocio.md`, `openspec/specs/agenda/scheduling/spec.md`.
