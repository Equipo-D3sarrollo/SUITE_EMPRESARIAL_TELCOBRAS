# Etapa 4 — Backend de DataDian: Telco y API

> Tercera etapa de DataDian (2 a 5), según el orden fijado por el usuario el 12-nov-2026. Reúne lo que el blueprint llama núcleo criptográfico, interoperabilidad SOAP, ingesta RPA y ensamble UBL, más el E2E contra el frontend. Esta ficha es un resumen: **la especificación completa es [ARQUITECTURA_BACKEND_DATADIAN.md](../modules/documents/ARQUITECTURA_BACKEND_DATADIAN.md)**. Dependencias, bloqueos y estado: [RUTA_DE_TRABAJO_DATADIAN.md](../modules/documents/RUTA_DE_TRABAJO_DATADIAN.md).

| Campo | Valor |
|---|---|
| Estado | Pendiente. Diseño propuesto; las decisiones de la §15 del documento siguen abiertas |
| Componente | API: módulo `documents` de NestJS (implementa los contratos de la Etapa 3 sin cambiarlos). Telco: motor en segundo plano, propuesto como `apps/telco` (ADR-014) |
| Especificación | [ARQUITECTURA_BACKEND_DATADIAN.md](../modules/documents/ARQUITECTURA_BACKEND_DATADIAN.md) (§13: subetapas; §14: puntos por verificar 1 a 20; §15: decisiones) |
| Criterio de salida | Los E2E de la Etapa 3 pasan sin cambios contra la API real y Telco con la DIAN simulada; la simulación de tráfico cumple sus criterios; la lista de chequeo de habilitación está completa, salvo los puntos que el usuario exima por escrito por D-14 o por la revisión legal del portal |
| Bloqueos externos | Certificado `.pfx` de pruebas; SoftwareID, PIN y habilitación (D-14); revisión legal del RPA (PV-7); puntos por verificar contra fuentes primarias |

## Subetapas

| Sub | Contenido | Antes era (numeración previa) |
|---|---|---|
| 4.1 | Núcleo criptográfico: `CertificateVault`, validaciones previas, reloj, `XadesEpesSigner`, `CudeFormula`, `JobRunner` | Etapa 2 |
| 4.2 | Cliente SOAP con WS-Security: `GetXmlByDocumentKey`, `GetStatusEvent`, `SendEventUpdateStatus` | Etapa 3 |
| 4.3 | Ingesta: RPA con mTLS, IMAP y descarga del XML por CUFE | Etapa 4 |
| 4.4 | UBL (`ApplicationResponse`) y transmisión de eventos | Etapa 6 |
| 4.5 | Reglas, plazos y State Tracker | Parte de la Etapa 5 (la otra parte es la Etapa 2) |
| 4.6 | Integración con el frontend, SSE, E2E y simulación de tráfico | Parte de la Etapa 7 |

## Aportes de las especificaciones anteriores

Las antiguas `ETAPA_2_NUCLEO_CRIPTOGRAFICO.md`, `ETAPA_3_INTEROPERABILIDAD_SOAP.md`, `ETAPA_4_INGESTA_RPA.md`, `ETAPA_6_UBL_Y_TRANSMISION.md` y la parte de E2E de `ETAPA_7_FRONTEND_DATADIAN.md` se retiraron: el documento de arquitectura cubre su contenido con más detalle. Se conservan estos puntos que no estaban en él:

| Subetapa | Punto | Detalle |
|---|---|---|
| 4.1 | Raíces de confianza | Qué entidades de certificación acepta la DIAN y cómo se mantiene esa lista en el vault |
| 4.2 | CUFE de prueba en habilitación | Las facturas reales de los proveedores solo existen en producción. Usar un documento emitido en habilitación durante las pruebas del software; si no lo hay, hacer la prueba de lectura en producción **solo con autorización expresa del usuario** |
| 4.2 | Alcance de la consulta | Confirmar si la DIAN entrega el documento solo cuando el NIT del certificado es emisor o adquirente, y si consultar el servicio exige algo más que el certificado (por ejemplo, un software registrado) |
| 4.2 | Prueba de humo | Prueba diaria en habilitación para detectar cambios del WSDL; acciones y URL en configuración |
| 4.3 | Formato del listado | Nombres exactos de las columnas del archivo que exporta el portal y si llega suelto o dentro de un ZIP |
| 4.3 | Documentos enviados | Decidir si el descubrimiento incluye también los documentos que emite la organización (hoy solo recibe, D-15) |
| 4.3 | Cierres de mes | Corridas extra de sincronización en los cierres de mes, además de la diaria |
| 4.6 | Paso a producción | Además de la lista de habilitación (§9.3 del documento): D-13 resuelto (dónde corre producción), monitoreo de Telco y de la cola, **plan de vuelta atrás** y, con autorización del usuario, una factura real de Telcobras que recorra 030 → 032 → 033 (o 031) en producción |
| 4.6 | Odoo con RADIAN nativo | Confirmar antes de producción que el RADIAN nativo de Odoo 19 no envía eventos de las mismas facturas (D-16) |
