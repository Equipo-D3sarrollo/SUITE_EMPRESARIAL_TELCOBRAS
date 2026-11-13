-- Reverso de 0011_datadian_settings.sql (ARQUITECTURA_DB_DATADIAN.md §10.1). NO es una migración: Drizzle
-- solo aplica los archivos de meta/_journal.json. Revertir en un entorno real es una migración nueva con
-- este SQL (y el esquema Drizzle sin datadian-settings.ts). Las migraciones 0012 a 0017 deben revertirse
-- antes que esta. Lo prueba apps/api/test/datadian-settings.test.ts dentro de una transacción que se deshace.
DROP TABLE app.dian_settings;
DROP TABLE app.imap_mailboxes;
DROP TABLE app.dian_certificates;
DROP FUNCTION app.dian_settings_certificate_guard();
DROP FUNCTION app.dian_certificates_guard();
