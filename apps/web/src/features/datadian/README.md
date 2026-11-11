# DataDian (módulo 04)

Pantallas del módulo `documents`, que el usuario ve como **DataDian**. Especificación: `docs/etapas/ETAPA_2_DATADIAN.md`.

| Archivo | Propósito |
|---|---|
| `api.ts` | Consultas, cargas binarias (.xlsx y PDF) y utilidades de DataDian. |
| `document-status.tsx` | Insignias del estado interno de la factura y de su envío a Odoo. |
| `invoice-detail.tsx` | Panel de la Zona 3: datos de la DIAN, PDF, decisión, Odoo y trazabilidad. |
| `invoices-page.tsx` | Tablero de facturas: cifras, filtro por estado y acciones Aprobar, Borrador y Rechazar. |
| `reject-dialog.tsx` | Rechazo con el motivo de reclamo DIAN (01 a 04, catálogo de APIDIAN). |
| `settings-page.tsx` | Conexión con Odoo 19 (la API key se escribe y se guarda cifrada; nunca se lee). |
| `uploads-page.tsx` | Carga del listado de la DIAN en Excel y de los PDF de cada factura. |
