# Módulo 04: DataDian

Documentación del módulo `documents`, que el usuario final ve como **DataDian** (ADR-013). El
identificador interno, las rutas y los permisos siguen usando `documents`.

DataDian carga el listado de facturas recibidas que exporta el catálogo de la DIAN, obtiene el PDF
y el XML de cada una por su CUFE, las deja en una bandeja para auditarlas y aprobarlas o
rechazarlas con trazabilidad y, al aprobar, las envía como borrador a Odoo 19 con el PDF adjunto.
Los eventos RADIAN son una fase posterior. Ocupa el lugar del antiguo Centro Documental, que
desaparece. Se construye en la **etapa 2**.

| Documento | Contenido |
|---|---|
| `docs/etapas/ETAPA_2_DATADIAN.md` | Decisiones, alcance y lo que falta diseñar antes de implementar |
| Documento madre §4.4 y §4.7 | Alcance funcional de RADIAN y del servicio interno de archivos |
| `apidian/` | Análisis de APIDIAN (FacturaLatam), auditoría de su código, su documentación completa y la copia local del código, que se usa solo como referencia |
