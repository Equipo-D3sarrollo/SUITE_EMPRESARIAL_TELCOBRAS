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
La documentación OpenAPI queda en `http://localhost:3000/api/v1/docs`. Mailpit, para revisar
enlaces de verificación, queda en `http://localhost:8025`.

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
