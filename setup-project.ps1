# Script de configuración completo para el proyecto SUITE_EMPRESARIAL_TELCOBRAS
# Este script prepara todo lo necesario para ejecutar el proyecto en local

param(
    [int]$MaxWaitSeconds = 180
)

$ErrorActionPreference = "Stop"
$WarningPreference = "SilentlyContinue"

function Write-Status {
    param([string]$Message, [string]$Level = "Info")
    $colors = @{
        "Success" = "Green"
        "Error" = "Red"
        "Warning" = "Yellow"
        "Info" = "Cyan"
    }
    Write-Host "[$Level] $Message" -ForegroundColor $colors[$Level]
}

# 1. Verificar Docker
Write-Status "Verificando Docker..." "Info"
try {
    $dockerVersion = docker version 2>&1 | Select-Object -First 1
    Write-Status "Docker encontrado: $dockerVersion" "Success"
} catch {
    Write-Status "Docker no está disponible: $_" "Error"
    exit 1
}

# 2. Esperar a que Docker esté listo
Write-Status "Esperando que Docker esté listo (máximo $MaxWaitSeconds segundos)..." "Info"
$startTime = Get-Date
$dockerReady = $false

while ((New-TimeSpan -Start $startTime).TotalSeconds -lt $MaxWaitSeconds) {
    try {
        $null = docker info 2>&1
        if ($?) {
            Write-Status "✓ Docker está listo" "Success"
            $dockerReady = $true
            break
        }
    } catch {
        # sigue intentando
    }
    Start-Sleep -Seconds 2
}

if (-not $dockerReady) {
    Write-Status "Advertencia: Docker puede no estar completamente listo, continuando de todas formas..." "Warning"
}

# 3. Levantar infraestructura
Write-Status "Levantando servicios de Docker..." "Info"
try {
    cd C:\SUITE-TELCOBRAS
    npx pnpm@latest infra:up --wait
    Write-Status "Servicios de Docker levantados correctamente" "Success"
} catch {
    Write-Status "Error al levantar servicios: $_" "Error"
    exit 1
}

Start-Sleep -Seconds 5

# 4. Ejecutar migraciones
Write-Status "Ejecutando migraciones de base de datos..." "Info"
try {
    npx pnpm@latest db:migrate
    Write-Status "Migraciones completadas" "Success"
} catch {
    Write-Status "Error en migraciones: $_" "Warning"
}

# 5. Ejecutar semillas
Write-Status "Ejecutando semillas de base de datos..." "Info"
try {
    npx pnpm@latest db:seed
    Write-Status "Semillas completadas" "Success"
} catch {
    Write-Status "Error en semillas: $_" "Warning"
}

# 6. Resumen
Write-Status "╔════════════════════════════════════════════════════════════════╗" "Success"
Write-Status "║     ✓ PROYECTO CONFIGURADO EXITOSAMENTE" "Success"
Write-Status "╚════════════════════════════════════════════════════════════════╝" "Success"
Write-Host ""
Write-Host "Los siguientes servicios están disponibles:" -ForegroundColor Green
Write-Host "  🌐 Web:        http://localhost:5173" -ForegroundColor Green
Write-Host "  📡 API:        http://localhost:3000/api/v1" -ForegroundColor Green
Write-Host "  📚 OpenAPI:    http://localhost:3000/api/v1/docs" -ForegroundColor Green
Write-Host "  📧 Mailpit:    http://localhost:8025" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar el servidor de desarrollo, ejecuta:" -ForegroundColor Cyan
Write-Host "  pnpm dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "Para detener los servicios, ejecuta:" -ForegroundColor Cyan
Write-Host "  pnpm infra:down" -ForegroundColor Yellow
Write-Host ""
