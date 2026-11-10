# Módulo 04 Documentos

Documentación del módulo `documents`. Sus submódulos son `document-center` (Centro Documental),
`radian-invoices` (RADIAN / DIAN Facturas) y `odoo-approvals` (Aprobaciones Odoo), según
`packages/contracts/src/navigation.ts`.

El alcance funcional está en el Documento Madre §4.4 (RADIAN / Document Intelligence) y §4.7
(Document Management). La etapa que lo construye es la 4, y su alcance lo fija ADR-011: recepción
de facturas de proveedores, eventos 030, 031, 032 y 033, aprobación humana y borrador en Odoo.

| Carpeta | Contenido |
|---|---|
| `apidian/` | Análisis de APIDIAN (FacturaLatam) y su Extractor V2, la herramienta que se evalúa para descargar los documentos de la DIAN, con la copia completa de su documentación |
