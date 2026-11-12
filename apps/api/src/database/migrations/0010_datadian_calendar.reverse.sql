-- Reverso de 0010_datadian_calendar.sql (ARQUITECTURA_DB_DATADIAN.md §10.1). NO es una migración:
-- Drizzle solo aplica los archivos de meta/_journal.json y no tiene migraciones de bajada. Revertir en un
-- entorno real es una migración nueva con este SQL (y el esquema Drizzle sin datadian-calendar.ts).
-- La prueba apps/api/test/datadian-calendar.test.ts lo aplica, comprueba el resultado y vuelve a aplicar
-- la 0010 dentro de una transacción que luego deshace.
--
-- No toca el rol app_worker: lo crean init.sql y infra/compose/postgres/app-worker.sql, fuera de las
-- migraciones. Las tablas son globales y sin dependientes en la 0010; las migraciones 0011 a 0017 deben
-- revertirse antes que esta.
DROP FUNCTION app.radian_deadline(timestamptz, text, integer);
DROP FUNCTION app.is_business_day(date, smallint[]);
DROP FUNCTION app.co_holidays_compute(integer);
DROP FUNCTION app.co_easter_sunday(integer);
DROP TABLE app.radian_deadline_rules;
DROP TABLE app.co_holiday_years;
DROP TABLE app.co_holidays;
