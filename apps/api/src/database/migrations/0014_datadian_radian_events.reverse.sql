-- Reverso de 0014_datadian_radian_events.sql (ARQUITECTURA_DB_DATADIAN.md §10.1). NO es una migración:
-- revertir en un entorno real es una migración nueva con este SQL (y el esquema Drizzle sin
-- datadian-radian.ts). Las migraciones 0015 a 0017 deben revertirse antes que esta. La caché RADIAN de
-- received_documents (radian_status, claim_deadline_at...) la retira el reverso de la 0013.
DROP TABLE app.radian_event_attempts;
DROP TABLE app.radian_events;
DROP TABLE app.radian_event_rules;
DROP FUNCTION app.radian_recompute_deadlines(text);
DROP FUNCTION app.radian_events_status_sync();
DROP FUNCTION app.radian_events_update_guard();
DROP FUNCTION app.radian_events_sequence_guard();
