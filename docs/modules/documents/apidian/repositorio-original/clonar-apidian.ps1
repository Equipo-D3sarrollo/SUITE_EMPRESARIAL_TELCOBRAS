# Clona (o actualiza) el repositorio original de APIDIAN dentro de esta carpeta.
#
# El repositorio es privado: Git pedira usuario y contrasena (o token de acceso personal) de
# git.buho.la en una ventana de inicio de sesion. Ejecutar desde PowerShell:
#
#   .\docs\modules\documents\apidian\repositorio-original\clonar-apidian.ps1
#
# Para clonar otro repositorio (por ejemplo, el del extractor):
#
#   .\clonar-apidian.ps1 -Url https://git.buho.la/<ruta>.git -Carpeta extractor
#
# El codigo clonado NO se versiona en la suite: esta en .gitignore (licencia por confirmar).

param(
    [string]$Url = 'https://git.buho.la/facturalatam/apidian/co-apidian2026.git',
    [string]$Carpeta = 'co-apidian2026'
)

$ErrorActionPreference = 'Stop'
$destino = Join-Path $PSScriptRoot $Carpeta

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error 'Git no esta instalado o no esta en el PATH.'
}

if (Test-Path (Join-Path $destino '.git')) {
    Write-Host "Ya existe $destino. Actualizando..."
    git -C $destino pull --ff-only
} else {
    Write-Host "Clonando $Url en $destino ..."
    git clone $Url $destino
}
if ($LASTEXITCODE -ne 0) {
    Write-Error 'Git fallo. Revise que su cuenta de git.buho.la tenga acceso al repositorio.'
}

$commit = git -C $destino rev-parse HEAD
$rama = git -C $destino rev-parse --abbrev-ref HEAD
$fecha = Get-Date -Format 'yyyy-MM-dd HH:mm'
$licencias = Get-ChildItem $destino -File | Where-Object { $_.Name -match '^(LICEN[CS]E|COPYING)' } | ForEach-Object { $_.Name }

$origen = @"
Repositorio: $Url
Carpeta:     $Carpeta
Rama:        $rama
Commit:      $commit
Clonado:     $fecha
Licencia:    $(if ($licencias) { $licencias -join ', ' } else { 'NO SE ENCONTRO ARCHIVO DE LICENCIA' })
"@
Set-Content -Path (Join-Path $PSScriptRoot "ORIGEN-$Carpeta.txt") -Value $origen -Encoding utf8

Write-Host ''
Write-Host $origen
if (-not $licencias) {
    Write-Warning 'El repositorio no trae archivo de licencia. Confirmela con FacturaLatam antes de reutilizar su codigo.'
}
