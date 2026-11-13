# Esquema de base de datos

| Archivo | Propósito |
|---|---|
| `app-schema.ts` | Ensambla/exporta el esquema de aplicación. |
| `audit-logs.ts` | Define los registros de auditoría. |
| `auth.ts` | Define tablas y relaciones de autenticación. |
| `columns.ts` | Reutiliza columnas comunes del esquema. |
| `datadian-calendar.ts` | Define las tablas globales de DataDian (sin RLS, de solo lectura para la aplicación): festivos de Colombia, años cubiertos y reglas versionadas del plazo de reclamo. |
| `datadian-files.ts` | DataDian 2.4: `dian_files` (archivos en S3 con su hash, solo inserción) y `dian_sync_runs` (ejecuciones de sincronización por RPA, IMAP o carga manual). |
| `datadian-jobs.ts` | DataDian 2.7: `telco_jobs`, la cola de trabajos de Telco en PostgreSQL (`FOR UPDATE SKIP LOCKED` con arrendamiento). |
| `datadian-odoo.ts` | DataDian 2.8: `odoo_document_links`, el vínculo de cada factura con su movimiento de Odoo. |
| `datadian-radian.ts` | DataDian 2.6: `radian_event_rules` (catálogo global de precedencia), `radian_events` y `radian_event_attempts`. |
| `datadian-settings.ts` | DataDian 2.3: `dian_settings`, `dian_certificates` e `imap_mailboxes`. Las columnas secretas (`software_pin`, `password`, `pfx_data_key`, `secret`) no las lee `app_user`: se consultan con selecciones explícitas. |
| `index.ts` | Punto de exportación del esquema Drizzle. |
| `invitations.ts` | Define invitaciones a organizaciones. |
| `memberships.ts` | Define membresías entre usuarios y organizaciones. |
| `odoo-connections.ts` | Define la conexión de cada organización con Odoo (API key cifrada). |
| `organizations.ts` | Define organizaciones/tenants. |
| `rbac.ts` | Define roles, permisos y asignaciones de control de acceso. |
| `received-documents.ts` | Define los lotes de ingreso (legado) y las facturas recibidas de DataDian, evolucionadas en la `0013` (datos del XML, ingesta, validación y caché RADIAN), y `received_document_taxes`. |

Las vistas `received_documents_radian` y `dian_certificate_status` (`0017`) no se declaran en Drizzle: viven solo en la migración.
