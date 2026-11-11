# Módulo documents (DataDian)

Facturas recibidas de la DIAN: carga del listado, bandeja, decisión interna e historial. El usuario final lo ve como **DataDian**. Especificación: `docs/etapas/ETAPA_2_DATADIAN.md`.

| Archivo | Propósito |
|---|---|
| `dian-listing.parser.ts` | Lee el listado `.xlsx` que exporta la DIAN y conserva solo los 18 campos acordados. |
| `documents.module.ts` | Módulo NestJS de DataDian. |
| `received-documents.controller.ts` | Endpoints de importación, listado, consulta, decisión e historial. |
| `received-documents.service.ts` | Reglas de negocio: importar sin duplicar por CUFE, aprobar o rechazar y auditar. |
