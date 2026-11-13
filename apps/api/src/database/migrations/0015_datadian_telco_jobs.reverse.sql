-- Reverso de 0015_datadian_telco_jobs.sql (ARQUITECTURA_DB_DATADIAN.md §10.1). NO es una migración: revertir
-- en un entorno real es una migración nueva con este SQL (y el esquema Drizzle sin datadian-jobs.ts ni la
-- FK dian_sync_runs_job_fk). Las migraciones 0016 y 0017 deben revertirse antes que esta.
ALTER TABLE app.dian_sync_runs DROP CONSTRAINT dian_sync_runs_job_fk;
DROP TABLE app.telco_jobs;
DROP FUNCTION app.telco_jobs_notify();
DROP FUNCTION app.telco_jobs_transition_guard();
DROP FUNCTION app.telco_backoff(integer, integer, integer);
