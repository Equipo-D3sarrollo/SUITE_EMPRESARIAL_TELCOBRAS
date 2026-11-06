CREATE TABLE "app"."audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"organization_id" uuid NOT NULL,
	"actor_user_id" uuid NOT NULL,
	"action" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" text,
	"result" text NOT NULL,
	"ip" "inet",
	"user_agent" text,
	"correlation_id" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "audit_logs_result_check" CHECK ("app"."audit_logs"."result" in ('success', 'failure', 'denied'))
);
--> statement-breakpoint
CREATE TABLE "app"."invitations" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"organization_id" uuid NOT NULL,
	"email" text NOT NULL,
	"role_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp (3) with time zone NOT NULL,
	"accepted_at" timestamp (3) with time zone,
	"invited_by" uuid NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invitations_token_hash_key" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "app"."memberships" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"organization_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "memberships_organization_id_user_id_key" UNIQUE("organization_id","user_id"),
	CONSTRAINT "memberships_organization_id_id_key" UNIQUE("organization_id","id"),
	CONSTRAINT "memberships_status_check" CHECK ("app"."memberships"."status" in ('active', 'suspended'))
);
--> statement-breakpoint
CREATE TABLE "app"."organizations" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"name" text NOT NULL,
	"legal_name" text NOT NULL,
	"nit" text NOT NULL,
	"size" text NOT NULL,
	"timezone" text DEFAULT 'America/Bogota' NOT NULL,
	"currency" char(3) DEFAULT 'COP' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organizations_size_check" CHECK ("app"."organizations"."size" in ('1-10', '11-50', '51-200', '200+')),
	CONSTRAINT "organizations_status_check" CHECK ("app"."organizations"."status" in ('active', 'suspended'))
);
--> statement-breakpoint
CREATE TABLE "app"."membership_roles" (
	"organization_id" uuid NOT NULL,
	"membership_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	CONSTRAINT "membership_roles_organization_id_membership_id_role_id_pk" PRIMARY KEY("organization_id","membership_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "app"."permissions" (
	"key" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."role_permissions" (
	"organization_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"permission_key" text NOT NULL,
	CONSTRAINT "role_permissions_organization_id_role_id_permission_key_pk" PRIMARY KEY("organization_id","role_id","permission_key")
);
--> statement-breakpoint
CREATE TABLE "app"."roles" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"organization_id" uuid NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_system" boolean DEFAULT false NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "roles_organization_id_key_key" UNIQUE("organization_id","key"),
	CONSTRAINT "roles_organization_id_id_key" UNIQUE("organization_id","id")
);
--> statement-breakpoint
ALTER TABLE "app"."audit_logs" ADD CONSTRAINT "audit_logs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "app"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."invitations" ADD CONSTRAINT "invitations_role_fk" FOREIGN KEY ("organization_id","role_id") REFERENCES "app"."roles"("organization_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."memberships" ADD CONSTRAINT "memberships_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "app"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."membership_roles" ADD CONSTRAINT "membership_roles_membership_fk" FOREIGN KEY ("organization_id","membership_id") REFERENCES "app"."memberships"("organization_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."membership_roles" ADD CONSTRAINT "membership_roles_role_fk" FOREIGN KEY ("organization_id","role_id") REFERENCES "app"."roles"("organization_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."role_permissions" ADD CONSTRAINT "role_permissions_permission_key_permissions_key_fk" FOREIGN KEY ("permission_key") REFERENCES "app"."permissions"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."role_permissions" ADD CONSTRAINT "role_permissions_role_fk" FOREIGN KEY ("organization_id","role_id") REFERENCES "app"."roles"("organization_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."roles" ADD CONSTRAINT "roles_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "app"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_logs_cursor_idx" ON "app"."audit_logs" USING btree ("organization_id","created_at","id");--> statement-breakpoint
CREATE INDEX "invitations_cursor_idx" ON "app"."invitations" USING btree ("organization_id","created_at","id");--> statement-breakpoint
CREATE INDEX "memberships_user_id_idx" ON "app"."memberships" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "memberships_cursor_idx" ON "app"."memberships" USING btree ("organization_id","created_at","id");--> statement-breakpoint
CREATE INDEX "membership_roles_role_idx" ON "app"."membership_roles" USING btree ("organization_id","role_id");--> statement-breakpoint
CREATE INDEX "roles_cursor_idx" ON "app"."roles" USING btree ("organization_id","created_at","id");