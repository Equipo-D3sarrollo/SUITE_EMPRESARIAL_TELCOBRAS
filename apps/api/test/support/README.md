# Soporte de pruebas de API

| Archivo | Propósito |
|---|---|
| `database.ts` | Provee utilidades de conexión (`appDatabase` como `app_user`, `ownerDatabase` como `app_owner` y `workerDatabase` como `app_worker`) y preparación de base de datos para pruebas. |
| `fake-odoo.ts` | Odoo de prueba que responde la API JSON-2 con lo mínimo que usa DataDian y deja forzar fallas. |

