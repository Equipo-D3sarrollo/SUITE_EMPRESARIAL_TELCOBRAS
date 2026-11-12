# DataDian (módulo 04)

Pantallas del módulo `documents`, que el usuario ve como **DataDian**.

Las pantallas se reconstruyen en la Etapa 7 según [`docs/modules/documents/ARQUITECTURA_DATADIAN_TELCO.md`](../../../../../docs/modules/documents/ARQUITECTURA_DATADIAN_TELCO.md). Lo que hay aquí es la base que se conserva para adaptarla.

| Archivo | Propósito |
|---|---|
| `api.ts` | Consultas y utilidades de DataDian (número de factura, enlace al PDF guardado, mensajes de error). |
| `document-status.tsx` | Insignias del estado interno de la factura y de su envío a Odoo. |
| `invoice-detail.tsx` | Panel de la Zona 3: decisión, PDF (si la factura lo tiene), Odoo, datos de la DIAN y trazabilidad. |
| `invoices-page.tsx` | Tablero de facturas: cifras, filtro por estado y acciones Aprobar, Borrador y Rechazar. Aprobar exige la conexión con Odoo. |
| `reject-dialog.tsx` | Rechazo con un motivo 01 a 04 (catálogo de APIDIAN). Hoy es una decisión solo interna: no envía el evento de reclamo a la DIAN. |
| `settings-page.tsx` | Conexión con Odoo 19 (la API key se escribe y se guarda cifrada; nunca se lee). |
