# Módulo documents (DataDian)

Facturas recibidas de la DIAN: bandeja, decisión interna, envío a Odoo e historial. El usuario final lo ve como **DataDian**.

El módulo se reconstruye según la arquitectura de DataDian y Telco: [`docs/modules/documents/ARQUITECTURA_DATADIAN_TELCO.md`](../../../../../docs/modules/documents/ARQUITECTURA_DATADIAN_TELCO.md) y [ADR-014](../../../../../docs/decisions/ADR-014-arquitectura-datadian-telco.md). Lo que hay aquí es la base que se conserva para adaptarla en esas etapas.

| Archivo | Propósito |
|---|---|
| `documents.module.ts` | Módulo NestJS de DataDian. |
| `received-documents.controller.ts` | Endpoints de listado, cifras del tablero, consulta, PDF guardado, decisión, reintento del envío a Odoo e historial. |
| `received-documents.service.ts` | Reglas de negocio: tablero, aprobar (con envío a Odoo), dejar en borrador o rechazar, y auditar cada paso. El PDF es opcional: si la factura lo tiene guardado, se adjunta en Odoo. |
| `documents-settings.controller.ts` | Endpoints de la configuración de DataDian: conexión con Odoo (guardar y probar). |
| `documents-settings.service.ts` | Guarda la conexión con Odoo solo si Odoo acepta las credenciales; la API key queda cifrada. |
| `odoo.client.ts` | Cliente mínimo de la API JSON-2 de Odoo 19. |
| `odoo-vendor-bill.ts` | Crea en Odoo el borrador de la factura de proveedor y, si hay PDF, se lo adjunta. Es idempotente por CUFE. |
| `xlsx-reader.ts` | Lector mínimo de `.xlsx`. Hoy no lo usa ningún flujo; se conserva para adaptarlo en etapas posteriores. |
