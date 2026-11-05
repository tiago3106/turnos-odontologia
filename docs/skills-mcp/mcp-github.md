# GitHub MCP en `turnos-odontologia`

Servidor MCP remoto de GitHub para leer el repo real (specs, historial de commits, PRs) y repos públicos como `anthropics/skills`, sin clonar ni usar credenciales en el repo.

## Configuración (ya versionada en `opencode.json`)

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

`opencode.json` no contiene el token: se resuelve en runtime desde la variable de entorno.

## Autenticación

### Opción A — PAT por variable de entorno (la versionada)

1. Crear un **fine-grained PAT** de solo lectura: `repo:read` (o `public_repo` si solo se leen repos públicos) y `read:org`.
2. Exportarlo en la sesión (PowerShell):

```powershell
$env:GITHUB_PERSONAL_ACCESS_TOKEN = "ghp_..."   # solo en la terminal, no en archivos
```

3. Reiniciar opencode desde la carpeta del repo.

**Atajo (sin pegar el token):** el repo incluye `scripts/opencode-with-github.ps1`, que lee la
credencial de GitHub desde Git Credential Manager, setea la variable solo para el proceso y
lanza opencode. Uso:

```powershell
.\scripts\opencode-with-github.ps1
# o con argumentos:
.\scripts\opencode-with-github.ps1 run --auto "listá los últimos commits del repo"
```

El script nunca imprime ni escribe el token en disco.

### Opción B — OAuth de opencode (sin secreto)

Quitar `"oauth": false` del bloque `github` y ejecutar:

```powershell
opencode mcp auth github
```

## Verificación

```powershell
opencode mcp list
opencode mcp debug github
```

Luego, en una **sesión nueva** (las tools MCP no aparecen en la sesión ya abierta), invocar una tool de lectura, por ejemplo listar repos o leer un archivo del repo. Evidencia en `docs/skills-mcp/evidencias/`.

**Verificado el 2026-11-05:** `opencode mcp list` muestra `github` en estado `connected` y una
sesión nueva invocó `github_list_commits` sobre `tiago3106/turnos-odontologia`. Transcripción en
`docs/skills-mcp/evidencias/mcp-github-live.txt`.

## Límites de seguridad

- Solo lectura sobre `tiago3106/turnos-odontologia` y repos públicos.
- Prohibido escribir issues, PRs, commits o workflows desde el agente.
- Nunca commitear el PAT ni pegarlo en `opencode.json`, docs o capturas.
- Sin datos de pacientes: el repo no los contiene y no deben introducirse.

## Troubleshooting

| Síntoma | Causa probable | Solución |
|---|---|---|
| `github` no aparece en `opencode mcp list` | Config no cargada | Reiniciar opencode desde `turnos-odontologia/` |
| Error 401 | Token ausente/expirado | Reexportar `GITHUB_PERSONAL_ACCESS_TOKEN` |
| Tools MCP ausentes en la sesión | Config se carga al inicio | Abrir sesión nueva tras reiniciar |
| `oauth` ignorado | `oauth:false` presente | Quitarlo para usar `opencode mcp auth` |

## Fuentes

- https://github.com/github/github-mcp-server — consultado 2026-11-05.
- https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-opencode.md — consultado 2026-11-05.
- https://opencode.ai/docs/mcp-servers/ — consultado 2026-11-05.
