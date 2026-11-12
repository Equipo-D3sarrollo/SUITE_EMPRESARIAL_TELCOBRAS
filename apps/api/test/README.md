# Pruebas de API

Las pruebas verifican endpoints y reglas transversales; los casos que acceden a PostgreSQL requieren la infraestructura de Compose preparada.

| Archivo | Propósito |
|---|---|
| `app.test.ts` | Comprueba el montaje y comportamiento general de la aplicación. |
| `auth-email-otp.test.ts` | Verifica el flujo de autenticación con código de un solo uso por correo. |
| `datadian-calendar.test.ts` | DataDian 2.2 (migración `0010`): los 18 festivos de 2026, la Pascua de 2024 a 2030, la semilla de 2020 a 2035 contra lo calculado, día hábil, vectores de plazo con las dos reglas, `DD006` fuera del calendario, privilegios de solo lectura y el reverso de la `0010`. |
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
| `support/` | Utilidades de prueba para acceder a la base de datos. |

