-- Aislamiento por organización con RLS (ADR-004, ADR-005), con el mismo patrón probado en poc/rls:
--   * app.org_id y app.user_id se fijan por transacción con set_config(..., true) (withTenant / withUser).
--   * NULLIF(...)::uuid da NULL si no están fijados: sin contexto no se ve ni se escribe nada (falla cerrado).
--   * FORCE: las políticas aplican también a app_owner, el dueño de las tablas.
-- Toda tabla de negocio nueva repite este bloque en su propia migración.

-- Tablas con aislamiento simple por organization_id.
ALTER TABLE app.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.roles FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON app.roles
  USING      (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
--> statement-breakpoint
ALTER TABLE app.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.role_permissions FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON app.role_permissions
  USING      (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
--> statement-breakpoint
ALTER TABLE app.membership_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.membership_roles FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON app.membership_roles
  USING      (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
--> statement-breakpoint
ALTER TABLE app.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.invitations FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON app.invitations
  USING      (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
--> statement-breakpoint

-- memberships: además, cada usuario lee sus propias membresías para listar "mis organizaciones".
-- Escribir sigue exigiendo la organización activa.
ALTER TABLE app.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.memberships FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON app.memberships
  USING      (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
CREATE POLICY own_memberships ON app.memberships FOR SELECT
  USING (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid);
--> statement-breakpoint

-- organizations: visible si es la organización activa o si el usuario tiene membresía en ella.
ALTER TABLE app.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.organizations FORCE ROW LEVEL SECURITY;
CREATE POLICY organizations_select ON app.organizations FOR SELECT
  USING (
    id = NULLIF(current_setting('app.org_id', true), '')::uuid
    OR EXISTS (
      SELECT 1 FROM app.memberships m
      WHERE m.organization_id = organizations.id
        AND m.user_id = NULLIF(current_setting('app.user_id', true), '')::uuid
    )
  );
-- Onboarding self-service: cualquier usuario crea una organización, siempre a su propio nombre.
CREATE POLICY organizations_insert ON app.organizations FOR INSERT
  WITH CHECK (created_by = NULLIF(current_setting('app.user_id', true), '')::uuid);
CREATE POLICY organizations_update ON app.organizations FOR UPDATE
  USING      (id = NULLIF(current_setting('app.org_id', true), '')::uuid)
  WITH CHECK (id = NULLIF(current_setting('app.org_id', true), '')::uuid);
-- app_user no tiene DELETE: esta política solo sirve a app_owner (bajas de datos y limpieza de pruebas).
CREATE POLICY organizations_delete ON app.organizations FOR DELETE
  USING (id = NULLIF(current_setting('app.org_id', true), '')::uuid);
--> statement-breakpoint

-- audit_logs: append-only. Sin políticas de UPDATE ni DELETE, ni app_owner cambia filas por SQL;
-- solo desaparecen en cascada si se borra la organización.
ALTER TABLE app.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.audit_logs FORCE ROW LEVEL SECURITY;
CREATE POLICY audit_logs_select ON app.audit_logs FOR SELECT
  USING (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
CREATE POLICY audit_logs_insert ON app.audit_logs FOR INSERT
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
--> statement-breakpoint

-- Privilegios de app_user, tabla por tabla. permissions es un catálogo global: sin RLS y de solo lectura.
GRANT SELECT ON app.permissions TO app_user;
GRANT SELECT, INSERT, UPDATE ON app.organizations TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE
  ON app.memberships, app.roles, app.role_permissions, app.membership_roles, app.invitations
  TO app_user;
GRANT SELECT, INSERT ON app.audit_logs TO app_user;
