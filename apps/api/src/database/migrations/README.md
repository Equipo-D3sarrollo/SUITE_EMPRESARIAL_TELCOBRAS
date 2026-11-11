# Migraciones de base de datos

Los archivos SQL se aplican en orden para evolucionar el esquema. `meta/` conserva snapshots y el diario usado por Drizzle Kit.

| Archivo | Propósito |
|---|---|
| `0000_init.sql` | Crea el esquema inicial de la aplicación. |
| `0001_rls.sql` | Añade políticas y configuración de Row-Level Security. |
| `0002_auth.sql` | Añade las tablas requeridas por autenticación. |
| `0003_better_auth_account_password.sql` | Ajusta el esquema de cuenta para Better Auth. |
| `0004_drop_passkeys.sql` | Elimina las estructuras de passkeys tras el cambio de flujo de identidad. |
| `0005_received_documents.sql` | Crea las tablas de DataDian (cargas del listado de la DIAN y facturas recibidas) con RLS, sus privilegios y los permisos `documents:import` y `documents:decide`. |
| `0006_datadian_pdf_odoo.sql` | DataDian: estado borrador, PDF de la DIAN, envío a Odoo, tabla `odoo_connections` con RLS y permiso `documents:configure`. |
| `0007_datadian_rejection_code.sql` | DataDian: motivo de reclamo DIAN (01 a 04, catálogo de APIDIAN) en los rechazos. |
| `0008_datadian_dian_extraction.sql` | DataDian: sesión con el catálogo de la DIAN, trabajos de extracción y fecha de recepción de las facturas. |
| `meta/` | Snapshots versionados y diario de migraciones. |

