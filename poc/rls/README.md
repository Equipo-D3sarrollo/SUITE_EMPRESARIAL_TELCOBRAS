# Prueba de concepto de RLS (ADR-005)

No es código del producto. Comprueba el aislamiento multiempresa con Drizzle.

```bash
docker run -d --name rls-poc -e POSTGRES_PASSWORD=poc -p 55432:5432 postgres:18
docker exec -i rls-poc psql -U postgres -v ON_ERROR_STOP=1 -q < schema.sql
pnpm install && pnpm test
```
