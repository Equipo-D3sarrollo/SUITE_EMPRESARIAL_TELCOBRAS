-- Prueba de concepto de RLS (plan §0.3). Se ejecuta como superusuario en una base vacía.
-- app_owner: dueño de las tablas y de las migraciones. app_user: rol con el que se conecta la API.
CREATE ROLE app_owner LOGIN PASSWORD 'owner';
CREATE ROLE app_user LOGIN PASSWORD 'app' NOBYPASSRLS;
CREATE SCHEMA app AUTHORIZATION app_owner;

SET ROLE app_owner;

CREATE TABLE app.organizations (
  id   uuid PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE app.companies (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES app.organizations(id),
  name            text NOT NULL,
  UNIQUE (organization_id, name)
);

ALTER TABLE app.companies ENABLE ROW LEVEL SECURITY;
-- FORCE: la política aplica también al dueño de la tabla.
ALTER TABLE app.companies FORCE ROW LEVEL SECURITY;

-- Sin organización fijada en la transacción, NULLIF devuelve NULL y no se ve ni se escribe nada.
CREATE POLICY tenant_isolation ON app.companies
  USING      (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);

RESET ROLE;

GRANT USAGE ON SCHEMA app TO app_user;
GRANT SELECT ON app.organizations TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON app.companies TO app_user;

INSERT INTO app.organizations (id, name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Organización A'),
  ('22222222-2222-2222-2222-222222222222', 'Organización B');
