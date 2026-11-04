# ADR-004: Tablas compartidas con RLS

- **Estado:** Aceptado
- **Fecha:** 4 de noviembre de 2026
- **Decide:** arquitecto del producto
- **Decisiones:** D-08 (documento madre §14)

## Contexto
El PDF exige aislamiento en backend y BD; Stitch sugiere un esquema por tenant; el SQL del blueprint no soporta RLS.

## Decisión
Tablas compartidas con `organization_id NOT NULL` en toda tabla de negocio. Row-Level Security con FORCE y un rol de aplicación sin BYPASSRLS; el tenant se fija por transacción con `set_config('app.org_id', ..., true)`. Membresías usuario–organización. UNIQUE compuestos por organización. Pruebas de aislamiento obligatorias en la CI.

## Consecuencias
Migraciones únicas para todos los clientes. El ORM debe soportar este patrón (ADR-005, pendiente de la prueba de concepto).
