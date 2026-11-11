# Servicios Docker Compose

| Archivo o subcarpeta | Propósito |
|---|---|
| `docker-compose.yml` | Define los servicios de desarrollo local invocados por `infra:up`/`infra:down` y `pnpm local`. El puerto de PostgreSQL en el host se ajusta con `POSTGRES_PORT` en `.env`. |
| `docker-compose.prod.yml` | Variante de servicios para el despliegue de producción. |
| `postgres/` | Inicialización SQL asociada a PostgreSQL. |

