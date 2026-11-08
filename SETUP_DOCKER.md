# 🐳 Configuración de Docker para SUITE_EMPRESARIAL_TELCOBRAS

## Estado Actual ✓

El proyecto ha sido clonado e instalado completamente:

- ✅ Repositorio clonado desde GitHub
- ✅ Dependencias instaladas (985 paquetes)
- ✅ Archivo `.env` creado desde `.env.example`
- ✅ Script de configuración creado: `setup-project.ps1`

## Lo Que Falta: Iniciar Docker Desktop ⚠️

Docker Desktop está instalado en tu sistema pero **no está corriendo**. Necesitas iniciarlo:

### Opción 1: Desde el Menú Inicio (Recomendado)
1. Abre el menú Inicio
2. Busca "Docker Desktop"
3. Haz clic para iniciar

### Opción 2: Desde la Línea de Comandos
Ejecuta en PowerShell como Administrador:
```powershell
Start-Process -FilePath "C:\Program Files\Docker\Docker\docker.exe" -WindowStyle Hidden
```

O usa este comando si está en la ubicación de DockerDesktop:
```bash
'/c/Program Files/Docker/Docker/Docker Desktop.exe'
```

## Una Vez Docker Esté Corriendo 🚀

Cuando Docker Desktop esté completamente iniciado (verás el ícono en la bandeja del sistema), 
ejecuta uno de estos comandos desde la carpeta del proyecto:

### Opción A: Script Automático (Recomendado)
```powershell
# Ejecuta todo automáticamente
.\setup-project.ps1
```

### Opción B: Paso a Paso
```powershell
# 1. Levanta la infraestructura (PostgreSQL, Valkey, SeaweedFS, Mailpit)
docker compose -f infra/compose/docker-compose.yml -f infra/compose/docker-compose.override.yml up -d --wait

# 2. Ejecuta las migraciones de base de datos
pnpm db:migrate

# 3. Carga datos iniciales (semillas)
pnpm db:seed

# 4. Inicia el servidor de desarrollo
pnpm dev
```

## Servicios Disponibles 🌐

Una vez que todo esté corriendo, accede a:

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Aplicación Web** | http://localhost:5173 | Frontend React de la plataforma |
| **API REST** | http://localhost:3000/api/v1 | Backend de la aplicación |
| **API Docs (OpenAPI)** | http://localhost:3000/api/v1/docs | Documentación interactiva de la API |
| **Mailpit** | http://localhost:8025 | Bandeja de entrada para emails de desarrollo |
| **PostgreSQL** | localhost:5432 | Base de datos (usuario: app_user, ver .env) |
| **Valkey (Redis)** | localhost:6379 | Caché y sesiones |
| **SeaweedFS (S3)** | http://localhost:8333 | Almacenamiento de objetos |

## Credenciales de Desarrollo 🔑

Las siguientes credenciales están en `.env` y son **SOLO PARA DESARROLLO LOCAL**:

```
API_PORT=3000
WEB_ORIGIN=http://localhost:5173
DATABASE_URL=postgres://app_user:app_user_dev@localhost:5432/telcobras
VALKEY_URL=redis://localhost:6379
S3_ENDPOINT=http://localhost:8333
SMTP_HOST=localhost
SMTP_PORT=1025
```

## Diagrama de Servicios 🏗️

```
┌─────────────────────────────────────────────────────┐
│              SUITE_EMPRESARIAL_TELCOBRAS             │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────────┐         ┌──────────────┐          │
│  │ Web Browser  │◄────────│  React App   │          │
│  │  :5173       │         │  (localhost) │          │
│  └──────────────┘         └──────┬───────┘          │
│                                  │                   │
│                           ┌──────▼─────┐            │
│                           │ NestJS API  │            │
│                           │  :3000      │            │
│                           └──────┬──────┘            │
│                                  │                   │
│        ┌─────────────────────────┼──────────────┐   │
│        │                         │              │   │
│   ┌────▼─────┐  ┌────────────┐  ┌──────────┐  ┌───▼───┐
│   │PostgreSQL│  │   Valkey   │  │ SeaweedFS│  │Mailpit│
│   │  :5432   │  │   :6379    │  │  :8333   │  │ :8025 │
│   │          │  │            │  │          │  │ :1025 │
│   └──────────┘  └────────────┘  └──────────┘  └───────┘
│     (DB)       (Cache/Session) (S3 Storage)  (Email)
│                                                       │
└─────────────────────────────────────────────────────┘
```

## Controlando la Infraestructura 🎛️

```powershell
# Ver estado de los servicios
docker compose -f infra/compose/docker-compose.yml ps

# Ver logs de un servicio específico
docker compose -f infra/compose/docker-compose.yml logs postgres
docker compose -f infra/compose/docker-compose.yml logs -f api

# Detener servicios (conserva volúmenes)
pnpm infra:down

# Limpiar completamente (elimina volúmenes)
docker compose -f infra/compose/docker-compose.yml down -v

# Reiniciar todos los servicios
pnpm infra:down && pnpm infra:up
```

## Flujo de Desarrollo Local 📝

1. **Inicia Docker Desktop** desde el Menú Inicio
2. **Espera 30-60 segundos** a que Docker esté completamente listo
3. **Ejecuta el script**: `.\setup-project.ps1`
4. **Abre tu navegador** en http://localhost:5173
5. **Para registrarte**: Usa cualquier email de prueba (ej: test@example.com)
6. **Verifica el código**: Ve a http://localhost:8025 (Mailpit)
7. **Copia el código de 6 dígitos** y vuelve a la app para completar el registro

## Solución de Problemas 🔧

### "Docker daemon is not running"
- Inicia Docker Desktop desde el Menú Inicio
- Espera 30-60 segundos a que esté completamente listo
- Verifica que veas el ícono de Docker en la bandeja del sistema

### "Error connecting to socket"
- Asegúrate de que Docker Desktop está completamente iniciado
- Ejecuta `docker info` en PowerShell para verificar que Docker responde

### "Port already in use"
- Verifica qué otros servicios están usando los puertos:
  ```powershell
  Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
  Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
  ```
- Mata los procesos conflictivos o cambia los puertos en `.env`

### "Database connection refused"
- Verifica que el contenedor de PostgreSQL está corriendo:
  ```powershell
  docker ps | findstr postgres
  ```
- Espera a que pase el healthcheck (puede tardar hasta 30 segundos)

### "Cannot find pnpm"
- Usa `npx pnpm@latest` en lugar de `pnpm`:
  ```powershell
  npx pnpm@latest dev
  ```

## Próximos Pasos 🎯

1. ✅ **Inicia Docker Desktop**
2. ✅ **Ejecuta**: `.\setup-project.ps1` (o los comandos paso a paso)
3. ✅ **Abre**: http://localhost:5173
4. ✅ **Registra una cuenta**: test@example.com (o cualquier email)
5. ✅ **Lee el código en**: http://localhost:8025 (Mailpit)
6. ✅ **¡Listo a desarrollar!**

## Referencias 📚

- [README.md](README.md) - Información general del proyecto
- [PLAN_IMPLEMENTACION_INICIAL.md](docs/PLAN_IMPLEMENTACION_INICIAL.md) - Arquitectura y plan de construcción
- [PENDIENTES.md](docs/PENDIENTES.md) - Tareas pendientes
- [.env.example](.env.example) - Variables de entorno disponibles

---

**¿Necesitas ayuda?** Revisa los logs con:
```powershell
docker compose -f infra/compose/docker-compose.yml logs -f
```
