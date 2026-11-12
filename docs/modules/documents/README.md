# Módulo 04: DataDian

Documentación del módulo `documents`, que el usuario final ve como **DataDian** (ADR-013). El
identificador interno, las rutas y los permisos siguen usando `documents`.

DataDian recibe las facturas electrónicas de los proveedores de cada organización y gestiona sus
eventos RADIAN ante la DIAN: acuse de recibo (030), recibo del bien o servicio (032), aceptación
expresa (033) o reclamo (031), con el plazo de la aceptación tácita (034) bajo control. Ocupa el
lugar del antiguo Centro Documental. Tiene dos componentes ([ADR-014](../../decisions/ADR-014-arquitectura-datadian-telco.md)):

- **DataDian**, la interfaz: bandeja de recepción, detalle con línea de tiempo y acciones sobre los
  eventos;
- **Telco**, el motor en segundo plano: RPA con certificado, SOAP con WS-Security, firma
  XAdES-EPES, CUDE SHA-384 y UBL 2.1.

Se construye en las **Etapas 2 a 5**, en el orden que fijó el usuario el 12-nov-2026: base de
datos (2), frontend contra contratos y mocks (3), backend con Telco y la API (4) e integración con
Odoo 19 (5). La Etapa 2 está en curso: las subetapas 2.1 y 2.2 están implementadas y en auditoría.

**Empiece por [`RUTA_DE_TRABAJO_DATADIAN.md`](RUTA_DE_TRABAJO_DATADIAN.md)** (qué falta, en qué
orden y qué lo bloquea) y por [`ARQUITECTURA_DATADIAN_TELCO.md`](ARQUITECTURA_DATADIAN_TELCO.md)
(visión general).

| Documento | Contenido |
|---|---|
| [`RUTA_DE_TRABAJO_DATADIAN.md`](RUTA_DE_TRABAJO_DATADIAN.md) | Ruta de trabajo: etapas y subetapas con dependencias, entregables y criterio de salida, diagrama, bloqueos externos, estado actual, decisiones aceptadas y abiertas |
| [`ARQUITECTURA_DATADIAN_TELCO.md`](ARQUITECTURA_DATADIAN_TELCO.md) | Visión general: requerimientos, componentes, flujos, especificaciones de Telco, certificado `.pfx`, máquina de estados de la interfaz, lo conservado, mapa de etapas y puntos por verificar |
| [`ARQUITECTURA_DB_DATADIAN.md`](ARQUITECTURA_DB_DATADIAN.md) | **Etapa 2.** Modelo físico con RLS, eventos RADIAN y su orden, plazos y festivos, cola de Telco, rol `app_worker`, migraciones `0010` a `0017` y subetapas 2.1 a 2.9 |
| [`ARQUITECTURA_FRONTEND_DATADIAN.md`](ARQUITECTURA_FRONTEND_DATADIAN.md) | **Etapa 3.** Contratos de API (zod y OpenAPI), mocks con MSW, pantallas, máquina de estados de los botones, accesibilidad, pruebas y subetapas 3.1 a 3.8 |
| [`ARQUITECTURA_BACKEND_DATADIAN.md`](ARQUITECTURA_BACKEND_DATADIAN.md) | **Etapa 4.** API y Telco: vault del certificado, firma XAdES-EPES, SOAP con WS-Security, RPA, IMAP, UBL, State Tracker, observabilidad, simulación de tráfico, puntos por verificar 1 a 20 y subetapas 4.1 a 4.6 |
| [`DataDian/`](DataDian/) | Investigación del usuario, de solo lectura. `arquitectura Eventos RADIAN DIAN.md` es el **blueprint oficial**; los otros tres informes (automatización de eventos RADIAN, facturación electrónica y certificado `.pfx`) son soporte técnico |
| [`docs/Instructivo-RADIAN.pdf`](../../Instructivo-RADIAN.pdf) | Instructivo de RADIAN. Fuente primaria pendiente de contrastar con la arquitectura |
| [`docs/etapas/`](../../etapas/README.md) | Fichas por etapa: `ETAPA_2_BASE_DE_DATOS.md`, `ETAPA_3_FRONTEND.md` y `ETAPA_4_BACKEND.md` remiten a su documento de arquitectura; `ETAPA_5_INTEGRACION_ODOO.md` es la especificación completa de Odoo |
| [`apidian/`](apidian/) | Referencia de APIDIAN (FacturaLatam): análisis técnico, documentación pública y copia local de su código. Se usa solo como referencia de comportamiento |
| Documento madre §4.4 y §4.7 | Alcance funcional de RADIAN y del servicio interno de archivos |
