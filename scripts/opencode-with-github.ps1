#requires -Version 5.1
# Lanza opencode con GITHUB_PERSONAL_ACCESS_TOKEN resuelto desde Git Credential Manager.
# El token nunca se imprime ni se escribe en disco.

$env:GIT_TERMINAL_PROMPT = "0"
$env:GCM_INTERACTIVE = "never"

$cred = ("protocol=https`nhost=github.com`n`n" | git credential fill 2>$null)
$token = ($cred | Where-Object { $_ -match '^password=' }) -replace '^password=', ''

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Error "No hay credencial de GitHub en Git Credential Manager. Crea un PAT fine-grained de solo lectura y expórtalo como GITHUB_PERSONAL_ACCESS_TOKEN."
    exit 1
}

$env:GITHUB_PERSONAL_ACCESS_TOKEN = $token
& opencode @args
