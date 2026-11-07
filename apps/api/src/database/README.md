# Persistencia y contexto multiempresa

| Archivo o subcarpeta | Propósito |
|---|---|
| `database.ts` | Construye y exporta el cliente de base de datos Drizzle. |
| `db.module.ts` | Integra el cliente de base de datos en NestJS. |
| `migrate.ts` | Ejecuta migraciones de la base de datos. |
| `seed.ts` | Carga datos iniciales de la aplicación. |
| `seed-roles.ts` | Crea o actualiza el catálogo inicial de roles. |
| `tenant.ts` | Administra el contexto de tenant usado para el aislamiento de datos. |
| `schema/` | Definiciones Drizzle de tablas y relaciones. |
| `migrations/` | Cambios SQL ordenados y metadatos de migración. |

