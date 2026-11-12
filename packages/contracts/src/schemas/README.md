# Esquemas de validación compartidos

| Archivo | Propósito |
|---|---|
| `index.ts` | Reexporta los esquemas públicos de esta carpeta. |
| `invitation.ts` | Valida datos de invitaciones. |
| `nit.ts` | Valida el NIT y las reglas de formato asociadas. |
| `organization.ts` | Valida datos de organizaciones. |
| `page-size.ts` | Límites de paginación (`MAX_PAGE_SIZE`, `DEFAULT_PAGE_SIZE`) sin zod, para que la web los importe al arrancar sin descargar los esquemas. |
| `pagination.ts` | Define validaciones y tipos para parámetros de paginación (reexporta los límites de `page-size.ts`). |
| `problem.ts` | Contrato de respuestas de error/problem details. |
| `received-document.ts` | Factura recibida de DataDian: datos de la DIAN, estados internos, decisión, cifras del tablero y conexión con Odoo. |
| `role.ts` | Valida roles y asignaciones relacionadas. |

