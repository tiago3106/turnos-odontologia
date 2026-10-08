# Etapa 0 - Preparación del entorno

Fecha de ejecución: 2026-10-07

## Herramientas previas

| Herramienta | Versión |
|-------------|---------|
| Go | 1.26.6 (windows/amd64) |
| Git | 2.51.2.windows.1 |
| Node.js | 24.19.0 |
| npm | 12.2.0 |
| Agente de código | OpenCode |

## Instalación de Active Stack (modo Full)

1. Clonado de `github.com/Group-Active-IA/active-stack`.
2. Build ejecutado con `build.bat`:

```
== Windows amd64 ==
== Linux amd64 ==
Listo. Binarios en la raiz del repo:
active-stack_linux_amd64
active-stack_windows_amd64.exe
```

3. Instalación ejecutada desde el repositorio `turnos-odontologia`:

```
active-stack install --mode full --agent opencode -y --lang es
```

Salida del instalador (verificación sin errores):

```
  → snapshot running...             ✓ snapshot
  → skill:agent-instruction         ✓
  → external:context7               ✓
  → external:engram                 ✓
  → skill:find-skill                ✓
  → skill:kb-creator                ✓
  → external:openspec               ✓
  → skill:active-orchestrator       ✓
  → permissions:permissions         ✓
  → skill:roadmap-generator         ✓
  → config:sdd-orchestrator         ✓
  → skill:skill-creator             ✓
  → skill:skill-registry            ✓
  → command:starter-add-command     ✓
  → skill:web-scraper               ✓
  → skill:discovery-research        ✓
  → self-install                    ✓
  → verify-hook                     ✓
Verification checks: 0 passed, 0 failed, 0 warnings, 0 skipped
Installation verified. You're ready to start building.
```

## Lista de harnesses instalados

| Harness | Tipo | Rol en el proyecto |
|---------|------|--------------------|
| active-orchestrator | skill | Orquestador de la fundación del proyecto |
| discovery-research | skill | Investigación de mercado (Discovery) |
| kb-creator | skill | Base de conocimiento canónica |
| roadmap-generator | skill | Genera CHANGES.md |
| find-skill | skill | Recomienda skills |
| skill-registry | skill | Registro de skills (.atl/skill-registry.md) |
| skill-creator | skill | Creación de skills |
| agent-instruction | skill | Genera AGENTS.md / CLAUDE.md |
| web-scraper | skill | Investigación de fuentes web |
| openspec | external | CLI de Spec-Driven Development (v1.14.1) |
| sdd-orchestrator | config | Orquestador OPSX (explore/propose/apply/verify/archive) |
| permissions | config | Permisos security-first |
| engram | external | Memoria persistente (v1.20.0) |
| context7 | external | Documentación al día vía MCP |

## Ubicación de la instalación

| Componente | Destino |
|------------|---------|
| Binarios (active-stack, engram, openspec) | PATH (`AppData\Local\active-stack\bin`, npm global) |
| Skills | `~/.config/opencode/skills/` |
| MCP servers (context7, engram) y agente sdd-orchestrator | `~/.config/opencode/opencode.json` |
| Reglas de permisos | `~/.config/opencode/opencode.json` |

## Repositorio del trabajo

- Repositorio `turnos-odontologia` inicializado con `git init` (rama `main`), vacío (sin código previo).