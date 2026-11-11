# Pruebas de API

Las pruebas verifican endpoints y reglas transversales; los casos que acceden a PostgreSQL requieren la infraestructura de Compose preparada.

| Archivo | Propósito |
|---|---|
| `app.test.ts` | Comprueba el montaje y comportamiento general de la aplicación. |
| `auth-email-otp.test.ts` | Verifica el flujo de autenticación con código de un solo uso por correo. |
| `documents.test.ts` | Verifica DataDian: lectura del listado de la DIAN, importación sin duplicar por CUFE, decisión, historial, permisos, aislamiento e inmutabilidad de los datos de la DIAN. |
| `env.test.ts` | Comprueba validación de configuración y variables de entorno. |
| `global-setup.ts` | Prepara recursos compartidos antes de ejecutar las pruebas. |
| `idempotency.test.ts` | Comprueba el manejo de solicitudes idempotentes. |
| `invitations.test.ts` | Verifica endpoints y reglas de invitaciones. |
| `multiple-organizations.test.ts` | Verifica por HTTP que una cuenta crea varias organizaciones con la misma sesión, las lista todas sin filtrar por rol y cambia la activa. |
| `organizations.test.ts` | Verifica endpoints y reglas de organizaciones. |
| `pagination.test.ts` | Comprueba la lectura y validación de paginación. |
| `rls.test.ts` | Comprueba el aislamiento de tenants mediante RLS. |
| `support/` | Utilidades de prueba para acceder a la base de datos. |

