-- Reverso de 0012_datadian_files_sync.sql (ARQUITECTURA_DB_DATADIAN.md §10.1). NO es una migración: revertir
-- en un entorno real es una migración nueva con este SQL (y el esquema Drizzle sin datadian-files.ts). Las
-- migraciones 0013 a 0017 deben revertirse antes que esta. Lo prueba apps/api/test/datadian-files.test.ts.
DROP TABLE app.dian_sync_runs;
DROP TABLE app.dian_files;
DROP FUNCTION app.dian_files_append_only();
