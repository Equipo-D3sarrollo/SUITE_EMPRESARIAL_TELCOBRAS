# Código fuente de la API

| Archivo o subcarpeta | Propósito |
|---|---|
| `main.ts` | Punto de arranque del proceso NestJS. |
| `app.ts` | Ensambla la aplicación HTTP y configura su comportamiento transversal. |
| `app.module.ts` | Módulo raíz y composición de módulos de NestJS. |
| `openapi.ts` | Configura la documentación OpenAPI de la API. |
| `openapi-export.ts` | Exporta el documento OpenAPI a los contratos del monorepo. |
| `telemetry.ts` | Inicializa o configura telemetría de la aplicación. |
| `auth/` | Módulo de autenticación y protección de sesiones. |
| `common/` | Infraestructura transversal de HTTP, validación, registro y contexto de solicitud. |
| `config/` | Carga y validación de configuración y variables de entorno. |
| `database/` | Conexión, esquema, migraciones, seeds y contexto de tenant. |
| `modules/` | Módulos funcionales de la API. |

