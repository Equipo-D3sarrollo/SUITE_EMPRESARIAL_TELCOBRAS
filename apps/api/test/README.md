# Pruebas de API

Las pruebas verifican endpoints y reglas transversales; los casos que acceden a PostgreSQL requieren la infraestructura de Compose preparada.

| Archivo | Propósito |
|---|---|
| `app.test.ts` | Comprueba el montaje y comportamiento general de la aplicación. |
| `auth-email-otp.test.ts` | Verifica el flujo de autenticación con código de un solo uso por correo. |
| `datadian-calendar.test.ts` | DataDian 2.2 (migración `0010`): los 18 festivos de 2026, la Pascua de 2024 a 2030, la semilla de 2020 a 2035 contra lo calculado, día hábil, vectores de plazo con las dos reglas, `DD006` fuera del calendario, privilegios de solo lectura y el reverso de la `0010`. |
| `datadian-files.test.ts` | DataDian 2.4 (`0012`): hash y tamaño inválidos, archivo duplicado, `UPDATE` y `DELETE` sobre `dian_files` para los tres roles, RLS, `succeeded` sin `finished_at`, ejecución `imap` sin buzón y reverso. |
| `datadian-odoo-views.test.ts` | DataDian 2.8 y 2.9 (`0016` y `0017`): copia de `odoo_*` a `odoo_document_links`, vínculo duplicado, `audit_logs` para `app_worker`, vistas `security_invoker` (aislamiento, `deadline_state`, certificados a 89 y 91 días), permisos nuevos y reversos. |
| `datadian-radian-events.test.ts` | DataDian 2.6 (`0014`): matriz de secuencia contra la tabla de §6.1, clave única de eventos vivos, `DD007`, eventos observados, concurrencia 031 frente a 033 (3 rondas), transiciones `DD004`, CUDE `DD005`, orden temporal, políticas de `app_user`, vencimiento con las dos reglas y `radian_recompute_deadlines`, y reverso. |
| `datadian-received-documents.test.ts` | DataDian 2.5 (`0013`): valores iniciales, `import_id`/`sync_run_id`, `pre_xml_snapshot`, datos congelados con XML (`DD005`, también como `app_owner`), CUFE inmutable, sin `DELETE`, caché RADIAN fuera del alcance de `app_user`, `received_document_taxes` y reverso. |
| `datadian-settings.test.ts` | DataDian 2.3 (`0011`): RLS entre organizaciones y sin contexto, columnas secretas (`42501` para `app_user`, legibles para `app_worker`), `DD010` al activar un certificado pendiente, vencido o de otro NIT, NIT único, `DD005` al cambiar `storage_key` o `password` (también como `app_owner`), transiciones del certificado, sin borrado y reverso. |
| `datadian-telco-jobs.test.ts` | DataDian 2.7 (`0015`): 4 conexiones reclaman 60 trabajos de 3 organizaciones una sola vez, recuperación de arrendamientos, token de exclusión, espera exponencial con *jitter*, `dedupe_key`, transiciones de `app_user`, purga de `app_worker` y reverso. |
| `datadian-worker-role.test.ts` | DataDian 2.1: rol `app_worker` (`NOBYPASSRLS`, sin privilegios fuera del inventario, sin lectura de tablas de negocio), catálogo de `SQLSTATE` `DD0xx` y `SYSTEM_ACTOR_TELCO`. |
| `documents.test.ts` | Verifica DataDian: listado y tablero, decisión, envío a Odoo con y sin PDF, reintento sin duplicar, historial, permisos, aislamiento e inmutabilidad de los datos de la DIAN. |
| `env.test.ts` | Comprueba validación de configuración y variables de entorno. |
| `global-setup.ts` | Prepara recursos compartidos antes de ejecutar las pruebas. |
| `idempotency.test.ts` | Comprueba el manejo de solicitudes idempotentes. |
| `invitations.test.ts` | Verifica endpoints y reglas de invitaciones. |
| `multiple-organizations.test.ts` | Verifica por HTTP que una cuenta crea varias organizaciones con la misma sesión, las lista todas sin filtrar por rol y cambia la activa. |
| `organizations.test.ts` | Verifica endpoints y reglas de organizaciones. |
| `pagination.test.ts` | Comprueba la lectura y validación de paginación. |
| `rls.test.ts` | Comprueba el aislamiento de tenants mediante RLS. |
| `xlsx-reader.test.ts` | Verifica el lector mínimo de .xlsx de DataDian: etiquetas con prefijo `x:`, textos compartidos y en línea, números, folios como texto y archivos inválidos. |
| `support/` | Utilidades de prueba para acceder a la base de datos (`database.ts`) y ayudas de DataDian (`datadian.ts`: SQL en contexto de organización, archivos, sincronizaciones y prueba de reversos). |

**Ejecución secuencial.** `vitest.config.ts` fija `fileParallelism: false`: todos los archivos comparten la misma base de PostgreSQL de Compose y, en paralelo, `documents.test.ts` y otros superaban a veces el límite de 5 s por prueba (de 2 a 13 fallos por corrida, auditoría del 12-nov-2026). No se investigó la causa por decisión del usuario (13-nov-2026); en secuencia la suite es estable. Las pruebas de concurrencia de DataDian abren sus propias conexiones, así que no dependen del paralelismo entre archivos. Las versiones de concurrencia son reducidas (3 rondas y 60 trabajos en lugar de 50 y 1 000) por la misma decisión.

