# Migraciones de base de datos

Los archivos SQL se aplican en orden para evolucionar el esquema. `meta/` conserva snapshots y el diario usado por Drizzle Kit. Una migración aplicada no se edita ni se borra: los cambios van en una nueva.

Desde la `0010` (DataDian, ARQUITECTURA_DB_DATADIAN.md §10.1) cada migración es aditiva y trae al lado su `NNNN_nombre.reverse.sql`. Para generar con `pnpm db:generate`, `meta/README.md` debe salir temporalmente de `meta/`: drizzle-kit lee como snapshot todo archivo de esa carpeta. Lo mismo vale para `drizzle-kit check`.

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
| `0011_datadian_settings.sql` | DataDian 2.3: `dian_settings` (NIT único entre organizaciones), `dian_certificates` e `imap_mailboxes`; disparadores `DD010` (certificado activo válido, vigente y del mismo NIT) y `DD005`/`DD004` (certificado de una sola escritura); RLS por comando sin `DELETE`; privilegios por columna sin columnas secretas para `app_user`; guarda de `pg_auth_members` para `app_worker`. |
| `0012_datadian_files_sync.sql` | DataDian 2.4: `dian_files` (solo inserción, también para `app_owner`, con disparador por sentencia) y `dian_sync_runs`. |
| `0013_datadian_received_documents_v2.sql` | DataDian 2.5: columnas nuevas de `received_documents`, `import_id` nulable con `num_nonnulls(import_id, sync_run_id) = 1`, `CHECK` del CUFE y del NIT emisor `NOT VALID`, disparador `received_documents_guard` (datos de origen congelados con XML y `pre_xml_snapshot`), políticas por comando sin `DELETE`, `received_document_taxes` y privilegios de `app_worker`. |
| `0014_datadian_radian_events.sql` | DataDian 2.6: `radian_event_rules` con semilla, `radian_events`, `radian_event_attempts`, disparadores de secuencia, de actualización y de caché (con el vencimiento del plazo), índice único parcial y `radian_recompute_deadlines`. |
| `0015_datadian_telco_jobs.sql` | DataDian 2.7: `telco_jobs`, `telco_backoff`, disparador de transiciones por rol, `pg_notify` y políticas de `app_worker` (la única lectura entre organizaciones); FK de `dian_sync_runs.job_id`. |
| `0016_datadian_odoo_links.sql` | DataDian 2.8: `odoo_document_links` con la copia de `received_documents.odoo_*`; `SELECT, INSERT` de `audit_logs` y `SELECT` de `organizations` y `odoo_connections` para `app_worker`. |
| `0017_datadian_views_permissions.sql` | DataDian 2.9 (migración personalizada, `generate --custom`): vistas `security_invoker` `received_documents_radian` y `dian_certificate_status`; permisos `documents:events` y `documents:sync` en el catálogo y en los roles semilla. |
| `00NN_*.reverse.sql` (0011 a 0017) | **No son migraciones**: SQL de reverso de cada una, probado en `test/datadian-*.test.ts` (se aplican en orden inverso desde la última y se vuelven a aplicar, dentro de una transacción que se deshace). |
| `meta/` | Snapshots versionados y diario de migraciones. |

