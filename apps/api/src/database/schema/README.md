# Esquema de base de datos

| Archivo | Propósito |
|---|---|
| `app-schema.ts` | Ensambla/exporta el esquema de aplicación. |
| `audit-logs.ts` | Define los registros de auditoría. |
| `auth.ts` | Define tablas y relaciones de autenticación. |
| `columns.ts` | Reutiliza columnas comunes del esquema. |
| `index.ts` | Punto de exportación del esquema Drizzle. |
| `dian-extraction.ts` | DataDian: sesión con el catálogo de la DIAN (cookies cifradas) y trabajos de extracción. |
| `invitations.ts` | Define invitaciones a organizaciones. |
| `memberships.ts` | Define membresías entre usuarios y organizaciones. |
| `odoo-connections.ts` | Define la conexión de cada organización con Odoo (API key cifrada). |
| `organizations.ts` | Define organizaciones/tenants. |
| `rbac.ts` | Define roles, permisos y asignaciones de control de acceso. |
| `received-documents.ts` | Define las cargas del listado de la DIAN y las facturas recibidas de DataDian. |
