# Migraciones de base de datos

Los archivos SQL se aplican en orden para evolucionar el esquema. `meta/` conserva snapshots y el diario usado por Drizzle Kit.

| Archivo | Propósito |
|---|---|
| `0000_init.sql` | Crea el esquema inicial de la aplicación. |
| `0001_rls.sql` | Añade políticas y configuración de Row-Level Security. |
| `0002_auth.sql` | Añade las tablas requeridas por autenticación. |
| `0003_better_auth_account_password.sql` | Ajusta el esquema de cuenta para Better Auth. |
| `0004_drop_passkeys.sql` | Elimina las estructuras de passkeys tras el cambio de flujo de identidad. |
| `meta/` | Snapshots versionados y diario de migraciones. |

