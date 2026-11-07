@echo off
REM Script para iniciar Docker Desktop y configurar el proyecto automáticamente
REM Este archivo se puede hacer doble-click desde el Explorador

color 0A
title Suite Telcobras - Docker Setup

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  Suite Empresarial Telcobras - Docker Setup                   ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Verifica si Docker Desktop está instalado
set "DOCKER_EXE=%LOCALAPPDATA%\Programs\DockerDesktop\Docker Desktop.exe"
if not exist "%DOCKER_EXE%" (
    color 0C
    echo ERROR: Docker Desktop no se encuentra en la ubicación esperada
    echo Instala Docker Desktop desde: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Inicia Docker Desktop
color 0E
echo [*] Iniciando Docker Desktop...
start "" "%DOCKER_EXE%"

echo [*] Esperando que Docker esté completamente listo...
echo     (Esto puede tomar 30-60 segundos la primera vez)
echo.

REM Espera a que Docker esté listo
set timeout=0
:wait_docker
timeout /t 2 /nobreak
docker info >nul 2>&1
if errorlevel 1 (
    set /a timeout+=1
    if %timeout% lss 60 (
        echo.    Intento %timeout%/60 esperando Docker...
        goto wait_docker
    ) else (
        color 0C
        echo [!] Timeout esperando Docker. Verifica que Docker Desktop esté corriendo.
        pause
        exit /b 1
    )
)

color 0A
echo [✓] Docker está listo!
echo.

REM Ejecuta el script de PowerShell de setup
echo [*] Ejecutando configuración del proyecto...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "& '.\setup-project.ps1'"

if errorlevel 1 (
    color 0C
    echo [ERROR] El setup falló. Por favor revisa los errores arriba.
) else (
    color 0A
    echo.
    echo ╔════════════════════════════════════════════════════════════════╗
    echo ║  ✓ PROYECTO LISTO PARA USAR                                   ║
    echo ╚════════════════════════════════════════════════════════════════╝
    echo.
    echo Servicios disponibles:
    echo   Web:      http://localhost:5173
    echo   API:      http://localhost:3000/api/v1
    echo   Mailpit:  http://localhost:8025
    echo.
    echo Para iniciar el servidor:
    echo   pnpm dev
    echo.
)

pause
