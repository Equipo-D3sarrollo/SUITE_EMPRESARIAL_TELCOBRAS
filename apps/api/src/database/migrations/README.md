# Migraciones de base de datos

Los archivos SQL se aplican en orden para evolucionar el esquema. `meta/` conserva snapshots y el diario usado por Drizzle Kit. Una migración aplicada no se edita ni se borra: los cambios van en una nueva.

Desde la `0010` (DataDian, ARQUITECTURA_DB_DATADIAN.md §10.1) cada migración es aditiva y trae al lado su `NNNN_nombre.reverse.sql`. Para generar con `pnpm db:generate`, `meta/README.md` debe salir temporalmente de `meta/`: drizzle-kit lee como snapshot todo archivo de esa carpeta.

| Archivo | Propósito |
|---|---|
| `0000_init.sql` | Crea el esquema inicial de la aplicación. |
| `0001_rls.sql` | Añade políticas y configuración de Row-Level Security. |
| `0002_auth.sql` | Añade las tablas requeridas por autenticación. |
| `0003_better_auth_account_password.sql` | Ajusta el esquema de cuenta para Better Auth. |
| `0004_drop_passkeys.sql` | Elimina las estructuras de passkeys tras el cambio de flujo de identidad. |
| `0005_received_documents.sql` | Crea las tablas base de DataDian (`received_document_imports` y `received_documents`) con RLS, sus privilegios y el permiso `documents:decide`. |
| `0006_datadian_pdf_odoo.sql` | DataDian: estado borrador, columnas del PDF, envío a Odoo, tabla `odoo_connections` con RLS y permiso `documents:configure`. |
| `0007_datadian_rejection_code.sql` | DataDian: motivo de reclamo DIAN (01 a 04, catálogo de APIDIAN) en los rechazos. |
| `0008_datadian_dian_extraction.sql` | DataDian: fecha de recepción de las facturas (`received_at`) y dos tablas que retira la 0009. |
| `0009_datadian_drop_dian_extraction.sql` | DataDian: retira las tablas `dian_sessions` y `dian_extraction_jobs` (con sus políticas y privilegios) y el permiso `documents:import`. Conserva `received_at`. |
| `0010_datadian_calendar.sql` | DataDian (Etapa 2.2): comprueba que exista el rol `app_worker`; tablas globales `co_holidays`, `co_holiday_years` y `radian_deadline_rules`; funciones `co_easter_sunday`, `co_holidays_compute`, `is_business_day` y `radian_deadline`; festivos de 2020 a 2035 y reglas de plazo; solo lectura y `EXECUTE` de día hábil y plazo para `app_user` y `app_worker`. |
| `0010_datadian_calendar.reverse.sql` | **No es una migración** (Drizzle no la aplica): SQL de reverso de la `0010`, probado en `test/datadian-calendar.test.ts`. Revertir en un entorno real es una migración nueva con este SQL. |
| `meta/` | Snapshots versionados y diario de migraciones. |

