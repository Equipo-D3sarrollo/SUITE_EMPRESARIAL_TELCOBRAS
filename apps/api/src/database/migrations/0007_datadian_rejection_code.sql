ALTER TABLE "app"."received_documents" ADD COLUMN "rejection_code" text;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD CONSTRAINT "received_documents_rejection_code_check" CHECK ("app"."received_documents"."rejection_code" in ('01', '02', '03', '04'));--> statement-breakpoint

-- Motivo de reclamo DIAN del rechazo (catálogo type_rejections de APIDIAN): parte de la decisión interna.
GRANT UPDATE (rejection_code) ON app.received_documents TO app_user;
