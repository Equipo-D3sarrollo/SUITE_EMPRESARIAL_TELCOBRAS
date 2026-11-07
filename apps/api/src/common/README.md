# Infraestructura HTTP transversal

| Archivo | Propósito |
|---|---|
| `correlation-id.ts` | Propaga o asigna el identificador de correlación de una solicitud. |
| `idempotency.interceptor.ts` | Maneja claves de idempotencia para solicitudes repetibles. |
| `logging.ts` | Configura el registro de solicitudes y eventos de la API. |
| `pagination.ts` | Convierte y valida parámetros de paginación. |
| `problem-details.filter.ts` | Serializa errores HTTP con formato Problem Details. |
| `request-actor.ts` | Obtiene la identidad/actor asociado al contexto de solicitud. |
| `s3.module.ts` | Provee la integración de almacenamiento de objetos compatible con S3. |
| `valkey.module.ts` | Provee la integración con Valkey para servicios compartidos. |
| `zod.pipe.ts` | Adapta esquemas Zod a la validación de parámetros y cuerpos de NestJS. |

