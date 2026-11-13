CREATE TABLE "app"."telco_jobs" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"organization_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"priority" smallint DEFAULT 100 NOT NULL,
	"run_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 8 NOT NULL,
	"lease_owner" text,
	"leased_at" timestamp (3) with time zone,
	"lease_expires_at" timestamp (3) with time zone,
	"backoff_base_seconds" integer DEFAULT 30 NOT NULL,
	"backoff_max_seconds" integer DEFAULT 3600 NOT NULL,
	"recurrence_seconds" integer,
	"dedupe_key" text,
	"last_error" text,
	"last_error_at" timestamp (3) with time zone,
	"result" jsonb,
	"created_by" uuid,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp (3) with time zone,
	CONSTRAINT "telco_jobs_organization_id_id_key" UNIQUE("organization_id","id"),
	CONSTRAINT "telco_jobs_kind_check" CHECK ("app"."telco_jobs"."kind" in ('rpa_sync', 'imap_sync', 'xml_fetch', 'xml_ingest', 'radian_event_send', 'radian_status_query', 'certificate_check', 'odoo_push')),
	CONSTRAINT "telco_jobs_status_check" CHECK ("app"."telco_jobs"."status" in ('queued', 'running', 'succeeded', 'dead', 'cancelled')),
	CONSTRAINT "telco_jobs_payload_check" CHECK (jsonb_typeof("app"."telco_jobs"."payload") = 'object'),
	CONSTRAINT "telco_jobs_max_attempts_check" CHECK ("app"."telco_jobs"."max_attempts" > 0),
	CONSTRAINT "telco_jobs_attempts_check" CHECK ("app"."telco_jobs"."attempts" between 0 and "app"."telco_jobs"."max_attempts"),
	CONSTRAINT "telco_jobs_backoff_check" CHECK ("app"."telco_jobs"."backoff_base_seconds" > 0 and "app"."telco_jobs"."backoff_max_seconds" >= "app"."telco_jobs"."backoff_base_seconds"),
	CONSTRAINT "telco_jobs_recurrence_check" CHECK ("app"."telco_jobs"."recurrence_seconds" > 0),
	CONSTRAINT "telco_jobs_lease_check" CHECK (("app"."telco_jobs"."status" = 'running') = ("app"."telco_jobs"."lease_owner" is not null and "app"."telco_jobs"."lease_expires_at" is not null)),
	CONSTRAINT "telco_jobs_finished_check" CHECK (("app"."telco_jobs"."status" in ('succeeded', 'dead', 'cancelled')) = ("app"."telco_jobs"."finished_at" is not null))
);
--> statement-breakpoint
ALTER TABLE "app"."telco_jobs" ADD CONSTRAINT "telco_jobs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "app"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "telco_jobs_dedupe_key" ON "app"."telco_jobs" USING btree ("organization_id","kind","dedupe_key") WHERE "app"."telco_jobs"."status" in ('queued', 'running');--> statement-breakpoint
CREATE INDEX "telco_jobs_claim_idx" ON "app"."telco_jobs" USING btree ("priority","run_at","id") WHERE "app"."telco_jobs"."status" = 'queued';--> statement-breakpoint
CREATE INDEX "telco_jobs_lease_idx" ON "app"."telco_jobs" USING btree ("lease_expires_at") WHERE "app"."telco_jobs"."status" = 'running';--> statement-breakpoint
CREATE INDEX "telco_jobs_cursor_idx" ON "app"."telco_jobs" USING btree ("organization_id","created_at","id");--> statement-breakpoint
CREATE INDEX "telco_jobs_dead_idx" ON "app"."telco_jobs" USING btree ("organization_id","kind") WHERE "app"."telco_jobs"."status" = 'dead';--> statement-breakpoint
ALTER TABLE "app"."dian_sync_runs" ADD CONSTRAINT "dian_sync_runs_job_fk" FOREIGN KEY ("organization_id","job_id") REFERENCES "app"."telco_jobs"("organization_id","id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint

-- DataDian, subetapa 2.7: cola de trabajos de Telco (ARQUITECTURA_DB_DATADIAN.md §7.6 y §9).
-- Reverso: 0015_datadian_telco_jobs.reverse.sql.

-- Espera exponencial con jitter (§7.6.1): least(max, base * 2^(attempts - 1)) por un factor entre 0,5 y 1.
CREATE FUNCTION app.telco_backoff(p_attempts integer, p_base integer, p_max integer) RETURNS interval
  LANGUAGE sql VOLATILE PARALLEL SAFE
  SET search_path = app, pg_temp
AS $$
  SELECT make_interval(secs => least(p_max::float8, p_base * power(2, greatest(p_attempts, 1) - 1))
                               * (0.5 + random() * 0.5));
$$;
--> statement-breakpoint

-- Transiciones según el rol (§9.2). app_user: queued -> cancelled y dead -> queued (con attempts = 0).
-- app_worker: queued -> running, running -> queued | succeeded | dead, queued -> cancelled, y cambios sin
-- cambio de estado (latido del arrendamiento). app_owner (migraciones) no tiene restricción.
CREATE FUNCTION app.telco_jobs_transition_guard() RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = app, pg_temp
AS $$
BEGIN
  IF ROW(NEW.id, NEW.organization_id, NEW.kind, NEW.payload, NEW.created_by, NEW.created_at)
     IS DISTINCT FROM ROW(OLD.id, OLD.organization_id, OLD.kind, OLD.payload, OLD.created_by, OLD.created_at) THEN
    RAISE EXCEPTION 'La identidad y el payload de un trabajo no cambian' USING ERRCODE = 'DD005';
  END IF;
  IF current_user = 'app_user' AND NOT (
       (OLD.status = 'queued' AND NEW.status = 'cancelled')
       OR (OLD.status = 'dead' AND NEW.status = 'queued' AND NEW.attempts = 0)) THEN
    RAISE EXCEPTION 'Transición de trabajo no permitida para la aplicación: % -> %', OLD.status, NEW.status
      USING ERRCODE = 'DD004';
  END IF;
  IF current_user = 'app_worker' AND NEW.status <> OLD.status AND NOT (
       (OLD.status = 'queued' AND NEW.status IN ('running', 'cancelled'))
       OR (OLD.status = 'running' AND NEW.status IN ('queued', 'succeeded', 'dead'))) THEN
    RAISE EXCEPTION 'Transición de trabajo no permitida para Telco: % -> %', OLD.status, NEW.status
      USING ERRCODE = 'DD004';
  END IF;
  RETURN NEW;
END
$$;
--> statement-breakpoint
CREATE TRIGGER telco_jobs_transition_guard
  BEFORE UPDATE ON app.telco_jobs
  FOR EACH ROW EXECUTE FUNCTION app.telco_jobs_transition_guard();
--> statement-breakpoint

-- Aviso inmediato a Telco (§7.6.1); el sondeo periódico sigue siendo la garantía.
CREATE FUNCTION app.telco_jobs_notify() RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = app, pg_temp
AS $$
BEGIN
  PERFORM pg_notify('telco_jobs', NEW.kind);
  RETURN NULL;
END
$$;
--> statement-breakpoint
CREATE TRIGGER telco_jobs_notify
  AFTER INSERT ON app.telco_jobs
  FOR EACH ROW EXECUTE FUNCTION app.telco_jobs_notify();
--> statement-breakpoint

REVOKE ALL ON FUNCTION app.telco_backoff(integer, integer, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION app.telco_jobs_transition_guard() FROM PUBLIC;
REVOKE ALL ON FUNCTION app.telco_jobs_notify() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app.telco_backoff(integer, integer, integer) TO app_user, app_worker;
--> statement-breakpoint

-- RLS (§9.1 y §9.2). La única excepción entre organizaciones: app_worker lee y actualiza trabajos de todas
-- (reclamar y recuperar), pero solo inserta dentro de una organización y solo purga trabajos terminados
-- hace más de 30 días.
ALTER TABLE app.telco_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.telco_jobs FORCE ROW LEVEL SECURITY;
CREATE POLICY user_select ON app.telco_jobs FOR SELECT TO app_user
  USING (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
CREATE POLICY user_insert ON app.telco_jobs FOR INSERT TO app_user
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid
              AND status = 'queued' AND attempts = 0);
CREATE POLICY user_update ON app.telco_jobs FOR UPDATE TO app_user
  USING      (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
CREATE POLICY worker_select ON app.telco_jobs FOR SELECT TO app_worker USING (true);
CREATE POLICY worker_insert ON app.telco_jobs FOR INSERT TO app_worker
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
CREATE POLICY worker_update ON app.telco_jobs FOR UPDATE TO app_worker USING (true) WITH CHECK (true);
CREATE POLICY worker_purge ON app.telco_jobs FOR DELETE TO app_worker
  USING (status IN ('succeeded', 'cancelled') AND finished_at < now() - interval '30 days');
--> statement-breakpoint

-- Privilegios (§9.3).
GRANT SELECT, INSERT ON app.telco_jobs TO app_user;
GRANT UPDATE (status, run_at, attempts, finished_at, updated_at) ON app.telco_jobs TO app_user;
GRANT SELECT, INSERT, DELETE ON app.telco_jobs TO app_worker;
GRANT UPDATE (status, run_at, attempts, lease_owner, leased_at, lease_expires_at, last_error,
              last_error_at, result, finished_at, updated_at)
  ON app.telco_jobs TO app_worker;
