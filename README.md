# Suite Empresarial Telcobras

Plataforma SaaS multiempresa. La fuente de alcance, arquitectura y decisiones es el
[documento madre](docs/DOCUMENTO_MADRE_SUITE_TELCOBRAS.md); el plan de construcción está en
[PLAN_IMPLEMENTACION_INICIAL.md](docs/PLAN_IMPLEMENTACION_INICIAL.md).

## Estado

El proyecto está en la **Etapa 1: Fundaciones**. El monorepo, la infraestructura local, el núcleo
de identidad, el alta de organizaciones, RBAC inicial, RLS, invitaciones por correo y el shell web
están en construcción. Siguen pendientes la administración de miembros y roles desde la interfaz,
el flujo E2E autenticado y las verificaciones de salida. La Etapa 2 (CRM, documentos y
notificaciones) está especificada, pero comienza al cumplir el criterio de salida de la Etapa 1.
Los pendientes conocidos se registran en [PENDIENTES.md](docs/PENDIENTES.md).

## Requisitos

- Node.js 24 o superior.
- pnpm 12.16.1.
- Docker Desktop con Docker Compose.

## Inicio local

Desde la raíz del repositorio:

```powershell
Copy-Item .env.example .env
pnpm install
pnpm infra:up
pnpm db:migrate
pnpm db:seed
pnpm dev
```

La aplicación web queda en `http://localhost:5173`; la API en `http://localhost:3000/api/v1`.
La documentación OpenAPI queda en `http://localhost:3000/api/v1/docs`. Mailpit, para leer
los códigos de acceso y las invitaciones, queda en `http://localhost:8025`. Para entrar en
local, escribe tu correo en `/registro` o en `/iniciar-sesion` y copia el código de 6 dígitos que
llega a Mailpit; vence a los 10 minutos.

Los valores de `.env.example` son únicamente para desarrollo local. La configuración de Google es
opcional; SMTP local usa Mailpit. No uses las credenciales de ejemplo en otros entornos.

## Comprobaciones

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Las pruebas de API requieren los servicios de Compose encendidos y migrados. `pnpm infra:down`
detiene los servicios locales sin borrar sus volúmenes.

## Mapa del repositorio

### Archivos de la raíz

- `README.md`: presentación, estado, inicio local, comprobaciones y este mapa del repositorio.
- `package.json`: comandos del monorepo, herramientas compartidas y requisitos de Node.js/pnpm.
- `pnpm-workspace.yaml` y `pnpm-lock.yaml`: paquetes del workspace, catálogo de versiones y resolución reproducible de dependencias.
- `tsconfig.base.json`: opciones TypeScript compartidas.
- `biome.json` y `knip.json`: formato/lint y detección de dependencias o exports sin uso.
- `.editorconfig`, `.gitattributes`, `.gitignore`, `.npmrc` y `.nvmrc`: convenciones del editor, Git, pnpm y versión de Node.js.
- `.env.example`: plantilla de variables locales; `.env` contiene configuración local y no se debe compartir.
- `BITACORA_AGENTES_IA.md` y `CLAUDE.md`: bitácora y contexto de trabajo para agentes de desarrollo.
- `LICENSE`: términos de licencia del repositorio.
- `setup-project.ps1`, `SETUP_COMPLETE.md`, `SETUP_DOCKER.md` y `start-docker-and-setup.bat`: automatización e instrucciones auxiliares de instalación local en Windows.

### Carpetas

- `.github/`: configuración de automatización y acciones de CI.
- `.vscode/`: preferencias de este workspace para Visual Studio Code.
- `apps/`: aplicaciones ejecutables; `api/` contiene el backend NestJS y `web/` la SPA React.
- `packages/`: bibliotecas internas compartidas (`contracts/` para contratos y esquemas, `ui/` para componentes visuales).
- `docs/`: documento rector, plan, pendientes, arquitectura y decisiones de diseño.
- `infra/`: definiciones de Docker Compose, inicialización de PostgreSQL e imágenes de despliegue.
- `poc/`: pruebas de concepto independientes; `rls/` demuestra el aislamiento multiempresa mediante Row-Level Security.
- `tools/`: comprobaciones auxiliares de paleta y tamaño del bundle.
- `Background_effects/`: kit auxiliar de fondos interactivos, sus demostraciones y componentes; no forma parte de las aplicaciones del workspace.

Las carpetas de dependencias instaladas y los artefactos de compilación, cobertura o caché se omiten de este mapa.
