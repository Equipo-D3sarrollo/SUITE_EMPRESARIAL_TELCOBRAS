@echo off
REM Doble clic para levantar el proyecto en local. Equivale a ejecutar "pnpm local" en la raiz.
REM Inicia Docker Desktop si hace falta, levanta la infraestructura, migra, siembra y arranca web/API.
title OrveX.IA - Entorno local
cd /d "%~dp0"
call pnpm local
if errorlevel 1 pause
