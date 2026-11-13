-- Script de operación idempotente: crea o ajusta el rol app_worker de Telco (DataDian) en una base que
-- ya existe. init.sql solo corre al crear el volumen; app_owner no tiene CREATEROLE y las migraciones no
-- manejan contraseñas, así que la migración 0010 exige que este rol exista antes de aplicarse.
--
-- Corre como superusuario, conectado a la base de la aplicación, con APP_WORKER_PASSWORD en el entorno
-- de psql. Se puede repetir: la segunda vez solo vuelve a fijar la contraseña y los atributos. En local,
-- sin escribir la contraseña en la línea de comandos (quedaría en el historial y en ps): se exporta o se
-- lee sin eco, y `-e APP_WORKER_PASSWORD` sin valor la toma del entorno:
--   read -rs APP_WORKER_PASSWORD && export APP_WORKER_PASSWORD   # o: set -a; . ./.env; set +a
--   docker compose -f infra/compose/docker-compose.yml --env-file .env exec -T \
--     -e APP_WORKER_PASSWORD postgres \
--     psql -U postgres -d telcobras -f - < infra/compose/postgres/app-worker.sql
-- (pnpm local lo hace solo antes de las migraciones).
\set ON_ERROR_STOP on

\getenv app_worker_password APP_WORKER_PASSWORD
\if :{?app_worker_password}
\else
\set app_worker_password ''
\endif
SELECT :'app_worker_password' = '' AS app_worker_missing_password \gset
\if :app_worker_missing_password
DO $$ BEGIN RAISE EXCEPTION 'Falta APP_WORKER_PASSWORD: el rol app_worker necesita contraseña'; END $$;
\endif

SELECT NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_worker') AS app_worker_create \gset
\if :app_worker_create
CREATE ROLE app_worker LOGIN PASSWORD :'app_worker_password' NOBYPASSRLS;
\else
-- Mismos atributos que en init.sql, por si el rol se creó a mano con otros.
ALTER ROLE app_worker LOGIN PASSWORD :'app_worker_password'
  NOBYPASSRLS NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION INHERIT;
\endif

-- app_worker no puede heredar privilegios de otro rol (ARQUITECTURA_DB_DATADIAN.md §9.1). No se revoca solo:
-- una pertenencia indica que alguien lo modificó a mano y hay que revisarlo.
SELECT EXISTS (
  SELECT 1 FROM pg_auth_members m JOIN pg_roles r ON r.oid = m.member WHERE r.rolname = 'app_worker'
) AS app_worker_has_memberships \gset
\if :app_worker_has_memberships
DO $$ BEGIN RAISE EXCEPTION 'app_worker es miembro de otro rol: revoque esa pertenencia (REVOKE <rol> FROM app_worker)'; END $$;
\endif

-- Solo conexión y uso del esquema: los privilegios sobre tablas y funciones los otorga cada migración.
SELECT current_database() AS app_database \gset
GRANT CONNECT ON DATABASE :"app_database" TO app_worker;
GRANT USAGE ON SCHEMA app TO app_worker;

SELECT rolname, rolcanlogin, rolbypassrls, rolsuper FROM pg_roles WHERE rolname = 'app_worker';
