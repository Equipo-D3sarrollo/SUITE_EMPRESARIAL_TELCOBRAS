CREATE TABLE "app"."dian_files" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"organization_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"storage_key" text NOT NULL,
	"sha256" char(64) NOT NULL,
	"size_bytes" bigint NOT NULL,
	"content_type" text NOT NULL,
	"original_name" text,
	"created_by" uuid,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "dian_files_organization_id_id_key" UNIQUE("organization_id","id"),
	CONSTRAINT "dian_files_storage_key_key" UNIQUE("storage_key"),
	CONSTRAINT "dian_files_organization_id_kind_sha256_key" UNIQUE("organization_id","kind","sha256"),
	CONSTRAINT "dian_files_kind_check" CHECK ("app"."dian_files"."kind" in ('attached_document', 'invoice_pdf', 'event_request', 'event_response', 'status_response', 'dian_listing')),
	CONSTRAINT "dian_files_sha256_check" CHECK ("app"."dian_files"."sha256" ~ '^[0-9a-f]{64}$'),
	CONSTRAINT "dian_files_size_bytes_check" CHECK ("app"."dian_files"."size_bytes" > 0)
);
--> statement-breakpoint
CREATE TABLE "app"."dian_sync_runs" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"organization_id" uuid NOT NULL,
	"channel" text NOT NULL,
	"trigger" text NOT NULL,
	"requested_by" uuid,
	"job_id" uuid,
	"mailbox_id" uuid,
	"period_start" date,
	"period_end" date,
	"status" text DEFAULT 'queued' NOT NULL,
	"started_at" timestamp (3) with time zone,
	"finished_at" timestamp (3) with time zone,
	"listed_count" integer DEFAULT 0 NOT NULL,
	"new_count" integer DEFAULT 0 NOT NULL,
	"existing_count" integer DEFAULT 0 NOT NULL,
	"xml_downloaded_count" integer DEFAULT 0 NOT NULL,
	"failed_count" integer DEFAULT 0 NOT NULL,
	"listing_file_id" uuid,
	"error_message" text,
	"details" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "dian_sync_runs_organization_id_id_key" UNIQUE("organization_id","id"),
	CONSTRAINT "dian_sync_runs_channel_check" CHECK ("app"."dian_sync_runs"."channel" in ('rpa', 'imap', 'manual')),
	CONSTRAINT "dian_sync_runs_trigger_check" CHECK ("app"."dian_sync_runs"."trigger" in ('schedule', 'user', 'system')),
	CONSTRAINT "dian_sync_runs_status_check" CHECK ("app"."dian_sync_runs"."status" in ('queued', 'running', 'succeeded', 'partial', 'failed')),
	CONSTRAINT "dian_sync_runs_requested_by_check" CHECK ("app"."dian_sync_runs"."trigger" <> 'user' or "app"."dian_sync_runs"."requested_by" is not null),
	CONSTRAINT "dian_sync_runs_mailbox_check" CHECK (("app"."dian_sync_runs"."channel" = 'imap') = ("app"."dian_sync_runs"."mailbox_id" is not null)),
	CONSTRAINT "dian_sync_runs_period_check" CHECK ("app"."dian_sync_runs"."period_end" >= "app"."dian_sync_runs"."period_start"),
	CONSTRAINT "dian_sync_runs_finished_check" CHECK (("app"."dian_sync_runs"."status" in ('succeeded', 'partial', 'failed')) = ("app"."dian_sync_runs"."finished_at" is not null)),
	CONSTRAINT "dian_sync_runs_counts_check" CHECK ("app"."dian_sync_runs"."listed_count" >= 0 and "app"."dian_sync_runs"."new_count" >= 0 and "app"."dian_sync_runs"."existing_count" >= 0
        and "app"."dian_sync_runs"."xml_downloaded_count" >= 0 and "app"."dian_sync_runs"."failed_count" >= 0)
);
--> statement-breakpoint
ALTER TABLE "app"."dian_files" ADD CONSTRAINT "dian_files_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "app"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."dian_sync_runs" ADD CONSTRAINT "dian_sync_runs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "app"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."dian_sync_runs" ADD CONSTRAINT "dian_sync_runs_mailbox_fk" FOREIGN KEY ("organization_id","mailbox_id") REFERENCES "app"."imap_mailboxes"("organization_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."dian_sync_runs" ADD CONSTRAINT "dian_sync_runs_listing_file_fk" FOREIGN KEY ("organization_id","listing_file_id") REFERENCES "app"."dian_files"("organization_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "dian_sync_runs_cursor_idx" ON "app"."dian_sync_runs" USING btree ("organization_id","created_at","id");--> statement-breakpoint
CREATE INDEX "dian_sync_runs_channel_status_idx" ON "app"."dian_sync_runs" USING btree ("organization_id","channel","status");
--> statement-breakpoint

-- DataDian, subetapa 2.4: archivos en S3 con su hash y ejecuciones de sincronización
-- (ARQUITECTURA_DB_DATADIAN.md §5.4, §5.5 y §9). Reverso: 0012_datadian_files_sync.reverse.sql.
-- La FK de dian_sync_runs.job_id hacia telco_jobs llega con la 0015, que crea la cola.

-- dian_files es de solo inserción para todos (§2.2): sin privilegio ni política de UPDATE o DELETE, y además
-- un disparador por sentencia, que también frena a app_owner aunque la RLS no le deje filas. Solo las
-- cascadas desde organizations (que llegan desde el disparador de integridad referencial, con
-- pg_trigger_depth() > 1) pueden borrar.
CREATE FUNCTION app.dian_files_append_only() RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = app, pg_temp
AS $$
BEGIN
  IF TG_OP = 'DELETE' AND pg_trigger_depth() > 1 THEN
    RETURN NULL;
  END IF;
  RAISE EXCEPTION 'dian_files es de solo inserción: % no permitido', TG_OP
    USING ERRCODE = 'DD005';
END
$$;
--> statement-breakpoint
CREATE TRIGGER dian_files_append_only
  BEFORE UPDATE OR DELETE OR TRUNCATE ON app.dian_files
  FOR EACH STATEMENT EXECUTE FUNCTION app.dian_files_append_only();
REVOKE ALL ON FUNCTION app.dian_files_append_only() FROM PUBLIC;
--> statement-breakpoint

-- RLS forzada con políticas por comando (§9.2).
ALTER TABLE app.dian_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.dian_files FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_select ON app.dian_files FOR SELECT
  USING (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
CREATE POLICY tenant_insert ON app.dian_files FOR INSERT
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
--> statement-breakpoint
ALTER TABLE app.dian_sync_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.dian_sync_runs FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_select ON app.dian_sync_runs FOR SELECT
  USING (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
CREATE POLICY tenant_insert ON app.dian_sync_runs FOR INSERT
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
CREATE POLICY tenant_update ON app.dian_sync_runs FOR UPDATE
  USING      (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
--> statement-breakpoint

-- Privilegios (§9.3).
GRANT SELECT, INSERT ON app.dian_files TO app_user, app_worker;
GRANT SELECT, INSERT ON app.dian_sync_runs TO app_user, app_worker;
GRANT UPDATE (status, started_at, finished_at, listed_count, new_count, existing_count,
              xml_downloaded_count, failed_count, listing_file_id, error_message, details, job_id,
              updated_at)
  ON app.dian_sync_runs TO app_worker;
