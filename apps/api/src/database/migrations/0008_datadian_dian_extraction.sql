CREATE TABLE "app"."dian_extraction_jobs" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"organization_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"stage" text DEFAULT 'connecting' NOT NULL,
	"message" text,
	"portal_total" integer,
	"import_id" uuid,
	"created_count" integer,
	"existing_count" integer,
	"rejected_count" integer,
	"requested_by" uuid NOT NULL,
	"started_at" timestamp (3) with time zone,
	"finished_at" timestamp (3) with time zone,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "dian_extraction_jobs_status_check" CHECK ("app"."dian_extraction_jobs"."status" in ('queued', 'running', 'done', 'error')),
	CONSTRAINT "dian_extraction_jobs_stage_check" CHECK ("app"."dian_extraction_jobs"."stage" in ('connecting', 'requesting_export', 'waiting_export', 'downloading', 'importing', 'done'))
);
--> statement-breakpoint
CREATE TABLE "app"."dian_sessions" (
	"organization_id" uuid PRIMARY KEY NOT NULL,
	"host" text NOT NULL,
	"nit" text NOT NULL,
	"cookies" jsonb NOT NULL,
	"expires_at" timestamp (3) with time zone,
	"connected_by" uuid NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "received_at" timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "app"."dian_extraction_jobs" ADD CONSTRAINT "dian_extraction_jobs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "app"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."dian_sessions" ADD CONSTRAINT "dian_sessions_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "app"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "dian_extraction_jobs_cursor_idx" ON "app"."dian_extraction_jobs" USING btree ("organization_id","created_at","id");--> statement-breakpoint

-- Aislamiento por organización, igual que en 0001_rls.sql.
ALTER TABLE app.dian_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.dian_sessions FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON app.dian_sessions
  USING      (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
--> statement-breakpoint
ALTER TABLE app.dian_extraction_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.dian_extraction_jobs FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON app.dian_extraction_jobs
  USING      (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
--> statement-breakpoint

-- La sesión es una credencial: se reemplaza o se cierra. Los trabajos son un registro de avance.
GRANT SELECT, INSERT, UPDATE, DELETE ON app.dian_sessions TO app_user;
GRANT SELECT, INSERT, UPDATE ON app.dian_extraction_jobs TO app_user;
