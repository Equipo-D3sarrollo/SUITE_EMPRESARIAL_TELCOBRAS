# ADR-005: Drizzle ORM para acceso a datos y migraciones

- **Estado:** Aceptado
- **Fecha:** 5 de noviembre de 2026
- **Decide:** prueba de concepto de RLS (plan §0.3), según la regla aprobada "gana el primer candidato que pase"
- **Decisiones:** D-07 (documento madre §14)

## Contexto
ADR-004 exige tablas compartidas con RLS forzado, un rol de aplicación sin BYPASSRLS y el tenant fijado por transacción con `set_config('app.org_id', ..., true)`. El ORM debe soportar ese patrón sin trucos. Candidatos en orden: Drizzle, Prisma, Kysely.

## Evidencia
Prueba en `poc/rls/` con PostgreSQL 18.6, drizzle-orm 0.45.4 y pg 8.23.1. Siete pruebas, todas en verde:
1. Cada organización inserta y ve solo lo suyo.
2. Sin organización fijada no se ve nada (falla cerrado).
3. El tenant no se filtra a la siguiente petición en la misma conexión (pool de 1).
4. A no puede insertar filas a nombre de B (WITH CHECK).
5. A no puede modificar ni borrar filas de B.
6. 40 transacciones concurrentes en un pool de 5 no se mezclan.
7. El rol de la aplicación no tiene BYPASSRLS y el dueño también queda restringido (FORCE).

Control negativo: con RLS desactivado fallan las 7, así que las pruebas sí detectan una fuga.

## Decisión
Se usa **Drizzle ORM** para el esquema, las consultas y las migraciones (drizzle-kit). Prisma y Kysely no se evaluaron porque el primer candidato pasó.

Reglas de uso:
- Toda operación de negocio corre dentro de `withTenant(db, orgId, fn)`: una transacción que primero ejecuta `set_config('app.org_id', orgId, true)`.
- Las políticas usan `NULLIF(current_setting('app.org_id', true), '')::uuid`, para fallar cerrado cuando el valor está vacío.
- La API se conecta como `app_user` (sin BYPASSRLS); las migraciones corren como el rol dueño.
- Las 7 pruebas de `poc/rls` pasan a ser la base de la prueba de aislamiento obligatoria en la CI (etapa 1).

## Consecuencias
- Toda consulta debe pasar por `withTenant`; una consulta fuera de él devuelve 0 filas en vez de filtrar datos.
- Con PgBouncer (etapa 5) se usa el modo transacción, compatible con `set_config(..., true)`.
- drizzle-orm sigue en 0.x: fijar la versión y revisar cambios antes de cada actualización.
