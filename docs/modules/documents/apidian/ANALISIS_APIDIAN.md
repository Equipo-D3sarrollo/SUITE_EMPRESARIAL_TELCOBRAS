# Análisis de APIDIAN (FacturaLatam) para el módulo 04 Documentos

| Campo | Valor |
|---|---|
| Fecha | 10 de noviembre de 2026 |
| Elaborado | Claude Code, a pedido del usuario |
| Módulo destino | `documents` (04 Documentos): submódulos `radian-invoices`, `odoo-approvals` y `document-center` |
| Estado | Análisis. No hay código del módulo todavía |
| Fuentes | Manual oficial completo (290 páginas), colección Postman pública (185 requests) y la transcripción del video del extractor. Copias en `referencia/` |

**Encargo del usuario.** Analizar APIDIAN, incorporar dentro de la suite su herramienta que
descarga de la DIAN los documentos electrónicos, y adaptarla a nuestro flujo. Ese flujo es:
documentos descargados → panel → aprobación humana → borrador en Odoo.

**Resumen en cinco puntos**

1. APIDIAN es un **API de facturación electrónica en PHP (Laravel)**. Su foco es **emitir**
   documentos ante la DIAN. La descarga de documentos recibidos es un complemento, el **Extractor
   V2**, que se despliega como servicio aparte.
2. El extractor **combina dos técnicas**. Lista los documentos del catálogo de la DIAN con un
   **enlace de acceso por token** que emite el portal de la DIAN. Después baja el XML de cada CUFE
   por el **web service oficial** de la DIAN, firmado con el certificado `.p12` de la empresa.
3. **Descargar** documentos recibidos solo exige el certificado. **Enviar eventos RADIAN** exige
   además el ID y el PIN de un software de facturación propio, habilitado ante la DIAN. Eso toca
   directamente la decisión abierta D-14.
4. **APIDIAN no habla con Odoo.** La aprobación humana y el borrador en Odoo son nuestros. Así lo
   fija ADR-011: Odoo 19/20, API JSON-2, sin XML-RPC.
5. **El código no es público.** El repositorio vive en un GitLab privado que pide cuenta, y la
   documentación no menciona ninguna licencia. Antes de "clonar" hay que conseguir el acceso y
   confirmar la licencia (§2).

---

## 1. Qué es APIDIAN

| Aspecto | Detalle | Fuente |
|---|---|---|
| Propósito | Emisión y gestión de documentos electrónicos de Colombia bajo UBL 2.1: facturas, notas crédito y débito, documentos equivalentes (POS, transporte, cine, servicios públicos), nómina electrónica y su ajuste, documento soporte y su nota de ajuste, contingencia, exportación, AIU, mandato, transporte de carga y sector salud con RIPS | Manual: inicio; Postman 02, 04 y 07 |
| Versión de la documentación | 2.1.0, generada desde la colección Postman «FacturaLatam ApiDianV2.1» | Manual: Referencia API |
| Lenguaje y framework | PHP 8.3 con Laravel. Desde el 21-oct-2026 la imagen Docker usa `php:8.3.36-fpm-bookworm` | Manual: Actualización |
| Base de datos | MySQL/MariaDB por defecto, o PostgreSQL desde agosto de 2026, elegido en el `.env` | Manual: Instalación; Novedades ago-2026 |
| Contenedores | `php_api` (API), `scheduling_api` (tareas programadas) y `nginx_api` (proxy). Los nombres pueden llevar el dominio como sufijo | Manual: Actualización |
| Tareas programadas | Necesita el cron de `schedule:run`: consulta cada 10 minutos los documentos "en proceso" y envía avisos diarios de vencimientos | Novedades sep y oct-2026 |
| Almacenamiento | Disco local o S3 (`FILESYSTEM_DRIVER=s3`, `AWS_*`, `AWS_ENDPOINT`, path style configurable) | Manual: Almacenamiento S3 |
| PDF | mPDF, con plantillas numeradas configurables por tipo de documento | Manual: Almacenamiento S3; Novedades jul-2026 |
| Interfaz | Panel web por empresa, portales de propietario, vendedor, cliente y empleado, asistente IA que responde con el manual, monitoreo del servidor y copias de seguridad | Manual de la interfaz |
| Multiempresa | Una instalación sirve a varias empresas. Cada empresa tiene su `api_token`. El administrador de la plataforma ve todas; el usuario de una empresa solo la suya | Manual de la interfaz: Qué ve cada rol |
| Extras | Planes y consumo por empresa, envío por WhatsApp, API RIPS de salud, app móvil web, carga de Ficha RUT en PDF | Postman 09, 11, 12 y 13 |

### 1.1 Las 14 secciones del API y su relevancia para nosotros

| Sección | Qué hace | Relevancia para el módulo 04 |
|---|---|---|
| 01 Configuraciones básicas | Registrar empresa, certificado `.p12`, software, resoluciones, logo, SMTP, ambiente | **Media.** Solo registrar la empresa, su certificado y el ambiente de eventos |
| 02 Primeros envíos | Emitir facturas, notas, nómina, documento soporte y equivalentes | No aplica: no emitimos en la etapa 4 |
| 03 Consultas de estado | Estado por CUFE, por ZipKey y eventos de un documento | **Alta** para los eventos de un documento recibido |
| 04 Casuísticas de envíos | Variantes de factura con impuestos, descuentos y cargos | No aplica |
| 05 Utilidades | Listados, descargas, consecutivos, rangos de numeración, clientes y productos | **Media.** Descarga de archivos recibidos y razón social por NIT |
| 06 Paso a producción | Set de pruebas y cambio de ambiente | **Baja.** Solo si una organización envía eventos con su propio software |
| 07 Otros tipos de facturas | Exportación, AIU, mandato, transporte y salud | No aplica |
| 08 Generador de eventos | Enviar eventos RADIAN y cargar un documento recibido por CUFE | **Alta** |
| 09 Planes | Planes y consumo de la instalación | No aplica: tenemos nuestro propio modelo de planes |
| 10 Regenerar PDFs | PDF y AttachedDocument | Baja |
| 11 Servicios APP | Login, documentos y clientes para la app | Baja |
| 12 API RIPS | Sector salud | No aplica |
| 13 WhatsApp | Configuración y envío | No aplica: lo cubre nuestro Integration Hub |
| 14 Extractor V2 | Descarga masiva de documentos de la DIAN | **Alta. Es el núcleo del encargo** |

El índice de los 185 endpoints está en `referencia/indice-de-endpoints.md`.

---

## 2. Disponibilidad del código y licencia

| Hecho comprobado el 10-nov-2026 | Consecuencia |
|---|---|
| Desde el 19-oct-2026 el repositorio es `https://git.buho.la/facturalatam/apidian/co-apidian2026.git` | Es la dirección que habría que clonar |
| Esa ruta y sus archivos `docs/*.md` responden con la pantalla de inicio de sesión de GitLab | **El repositorio no es público.** No se pudo leer el código ni los manuales internos del extractor |
| El manual y la colección Postman no mencionan ninguna licencia, ni de código abierto ni comercial | No hay base para afirmar que sea código abierto. Hay que confirmarlo con FacturaLatam |
| Un snippet público de instalación con Docker sí responde (`git.buho.la/-/snippets/31`) | Solo describe la instalación |
| La colección Postman es pública: `documenter.getpostman.com/view/50442293/2sBYHUSfRJ` | Es la fuente más completa disponible sin acceso al código |

**Documentos que quedaron fuera por estar en el repositorio privado:**

- `docs/API_EXTRACTOR.md`: rutas, autenticación y la sección "Estructura de los documentos" del
  extractor. El manual público la cita, pero no la publica.
- `docs/EXTRACTOR_INTEGRACION.md`: cómo conectar el worker del extractor a una instalación del API.
- `docs/MANUAL_POSTGRESQL.md` y `docs/MANUAL_POSTGRESQL_DOCKER.md`.
- `docs/Errores frecuentes APIDIAN.md` y `docs/Proceso de actualizacion APIDIAN.md`.
- Los comandos de instalación 2025 y 2026 para Windows y Ubuntu, y la configuración de Fichas RUT.

**Antes de incorporar código** hace falta:

1. una cuenta con acceso de lectura a `co-apidian2026`, y al repositorio del extractor si es otro;
2. la licencia por escrito. Si fuera comercial o restrictiva, copiar su código dentro de un SaaS
   multiempresa de terceros podría no estar permitido.

---

## 3. Cómo obtiene los documentos de la DIAN

```
                ┌──────────────────────── Extractor V2 (servicio aparte) ────────────────────────┐
 Portal DIAN    │ 1. getting_cufes: entra al catálogo con el "enlace de acceso por token"       │
 (catálogo de   │    y recorre las páginas de "Recibidos" o "Enviados" en el rango de fechas    │
 documentos) ───┼──▶ lista de CUFE                                                               │
                │ 2. enriching: por cada CUFE pide el XML al web service de la DIAN             │
 Web service    │    (GetXmlByDocumentKey), firmado con el certificado .p12 de la empresa       │
 DIAN (SOAP) ◀──┼──▶ XML UBL → JSON normalizado (emisor, totales, impuestos, ítems)              │
                │ 3. done: reporte JSON y Excel; el panel deja "registrar en Eventos RADIAN"     │
                └─────────────────────────────────────────────────────────────────────────────────┘
```

- **Paso 1, listado.** Depende del portal de la DIAN y de su formato de pantalla. Se probó frágil:
  en septiembre de 2026 la DIAN cambió el formato de fechas a `YYYY-MM-DD` y las consultas
  devolvían cero documentos **sin error** hasta que el extractor se corrigió.
- **Paso 2, enriquecimiento.** Usa un servicio oficial de la DIAN. Es más estable. Hace una
  consulta por documento, así que el tiempo crece con el rango de fechas.
- **El enlace por token.** El usuario lo pega en el panel o lo envía en el campo `url`. Es "el
  enlace de autenticación que emite el portal de la DIAN" y debe ser del mismo ambiente que la
  empresa. El manual no dice cuánto dura ni cómo se pide. Por lo que se sabe del portal, lo
  solicita una persona autorizada de la empresa y llega por correo; **esto no está verificado**.
  Si es así, cada barrido necesita a una persona que pida un enlace nuevo, y la extracción semanal
  no se puede automatizar del todo.
- **Modo por certificado `.p12`.** Subir el certificado y su contraseña para consultar sin enlace.
  El manual dice que **existe pero está oculto porque sigue en pruebas**. Es el modo del video de
  la primera versión.
- **Relación con el video.** La transcripción presenta la primera versión: Python, Flask,
  PostgreSQL y Docker, con acceso por certificado y scraping. Los registros de ejemplo de Postman
  muestran rutas de una carpeta `facturalatam-scraperv2`. Lo más probable es que el Extractor V2
  sea la evolución de ese script. Su lenguaje actual no está documentado.

---

## 4. Extractor V2 en detalle

### 4.1 Despliegue

- Es **independiente del proyecto APIDIAN**. El panel y el API hablan con él como servicio.
- Desde agosto de 2026, los scripts de instalación con Docker lo instalan junto con el API.
- El panel tiene un botón **Probar conexión**. Si falla o aparece *Extractor no configurado*, el
  problema es del proveedor del servicio, no del certificado ni de las credenciales.

### 4.2 Endpoints

Todos usan `Authorization: Bearer <api_token de la empresa>`. El extractor usa el certificado que
la empresa ya tiene cargado; no se envía en cada llamada.

| Modo | Método y ruta | Uso |
|---|---|---|
| 1 Extracción completa | `POST /api/extractor/company/stream` | Una sola llamada. Devuelve todo al final; **no** es un stream en vivo. Espera interna máxima de unos 10 min |
| 2 Iniciar en segundo plano | `POST /api/extractor/company` | Devuelve `202` con `jobId` y `statusUrl` |
| 3 Avance y resultado | `GET /api/extractor/company/jobs/{jobId}` | Polling hasta `done` o `error` |
| 4 XML por CUFE | `POST /api/ubl2.1/xml/document/{cufe}` | XML en base64 de un documento |

**Cuerpo de los modos 1 y 2:**

```json
{
  "url": "<enlace de acceso por token de la DIAN>",
  "tipo": "Received",
  "fechaDesde": "2026-01-01",
  "fechaHasta": "2026-01-31"
}
```

- `tipo` admite `Received` (documentos recibidos, las compras) y `Sent` (enviados).
- Las fechas van en `YYYY-MM-DD`.

**Comportamientos que hay que respetar al integrarlo:**

| Comportamiento | Detalle |
|---|---|
| El job avanza solo con el polling | Cada consulta al modo 3 procesa **5 documentos**. Sin polling el job no progresa. La recomendación es consultar cada 3 a 5 segundos |
| Vida del job | 2 horas en caché. Después, `404` |
| Aislamiento | `404` si el job es de otra empresa |
| Error de cuerpo | Un cuerpo inválido devuelve **`502`, no `422`**, con *No se pudo iniciar la extracción: ...* |
| Rango vacío o tiempo agotado | `200` con `data: []` y el motivo en `log` |
| Estados | `status`: `running`, `done` o `error`. `stage`: `getting_cufes` → `enriching` → `done` o `error`. Con `error` viene `message` |
| Contadores | `total` (CUFE encontrados) y `processed` (CUFE ya consultados) |

**Inconsistencia de la documentación:** la colección Postman pone el modo 2 en
`POST /api/certificate`, pero su propia descripción dice `POST /api/extractor/company`. Las
novedades de octubre de 2026 confirman la segunda. Usar `/api/extractor/company` y comprobarlo.

**Endpoint no documentado:** las novedades de octubre de 2026 nombran
`POST /api/cufes/enrich`, que enriquece CUFE sin pasar por el catálogo. No aparece ni en la
colección ni en el manual.

### 4.3 Estructura de cada documento extraído

Tomada de la respuesta de ejemplo del modo 1. La especificación completa está en el
`API_EXTRACTOR.md` privado. Los nombres de campo llevan espacios y tildes, tal como los devuelve.

| Campo | Ejemplo | Nota |
|---|---|---|
| `TipoDocumento` | `Invoice` | Tipo UBL |
| `TipoBusqueda` | `Sent` o `Received` | Bandeja de origen |
| `Numero de Factura` | `FEBC24` | Prefijo y consecutivo |
| `CUFE` | 96 caracteres hexadecimales | Clave única |
| `Fecha de Creación`, `Fecha de Vencimiento` | `2025-08-05` | |
| `Moneda` | `COP` | |
| `NIT del Emisor`, `Razon Social del Emisor` | | Proveedor, en recibidos |
| `NIT del Receptor`, `Razon Social del Receptor` | | Nuestra organización, en recibidos |
| `Metodo de Pago` | `10`, `31` | Código DIAN del medio de pago |
| `Sub Total`, `Impuestos Cabecera`, `Retenciones`, `Total a Pagar` | números | |
| `TaxBreakdown[]` | `code`, `name`, `percent`, `taxable_amount`, `amount` | Impuestos por tarifa |
| `LineItems[]` | `Nombre del Producto`, `Referencia`, `Unidad de Medida`, `Cantidad`, `Precio Unitario`, `Total`, `taxes[]`, `total_tax_line` | Detalle de ítems |

La vista previa del panel muestra además el folio, el estado RADIAN y el resultado de la
extracción de cada fila. El reporte se descarga en Excel y en JSON.

### 4.4 Modo 4: el XML de un documento

- Cuerpo `{ "is_event": true }` para consultar por el endpoint de eventos, el de documentos
  recibidos.
- El XML viene en
  `ResponseDian → Envelope → Body → GetXmlByDocumentKeyResponse → GetXmlByDocumentKeyResult → XmlBytesBase64`.
- Si el XML es un `AttachedDocument`, la factura real va embebida dentro de un `cbc:Description`.
- La respuesta trae `certificate_days_left`, útil para avisar vencimientos del certificado.
- Si la DIAN rechaza la consulta: `success: false` y el detalle en `ResponseDian`.

### 4.5 Reglas del panel que conviene copiar

- **Solo se registran documentos cuyo adquiriente es el NIT de la empresa.** Las filas de otro
  NIT quedan fuera. Es una protección, no un fallo.
- **El ambiente manda.** Un CUFE de producción no se encuentra si la empresa tiene los eventos en
  habilitación, y un enlace de un ambiente no sirve en el otro.
- **Registrar válidos** carga de una vez todas las filas que admiten registro.

---

## 5. Documentos recibidos y eventos RADIAN

### 5.1 Qué exige cada operación

| Operación | Certificado `.p12` | ID y PIN del software de facturación |
|---|---|---|
| Cambiar el ambiente de los eventos | No | No |
| Extraer, consultar por CUFE y descargar XML o JSON | **Sí** | No (desde octubre de 2026) |
| **Enviar eventos** (acuse, recibo del bien o servicio, aceptación, rechazo) | **Sí** | **Sí.** Se firman con el `SoftwareID` y el `SoftwareSecurityCode` |

Sin software, el envío de eventos responde antes de llegar a la DIAN con: *Para enviar eventos
RADIAN la empresa necesita un software de facturación electrónica propio, habilitado ante la DIAN.*

### 5.2 Endpoints

| Endpoint | Para qué | Cuerpo |
|---|---|---|
| `POST /api/load-document-by-cufe` | Consulta un documento recibido por CUFE. Con `save: true` lo guarda en la tabla `received_documents` (listado de Eventos RADIAN). **No envía eventos** | `{ "cufe": "...", "save": true }`. El ejemplo oficial manda `saved`, que el API **ignora** |
| `POST /api/ubl2.1/send-event` | Envía un evento a partir del `AttachedDocument` del proveedor | `event_id`, `allow_cash_documents`, `sendmail`, `base64_attacheddocument_name`, `base64_attacheddocument`, `type_rejection_id`, `resend_consecutive` |
| `POST /api/ubl2.1/send-event-data` | Envía un evento indicando solo el CUFE | `event_id`, `document_reference.cufe`, `issuer_party` (`identification_number`, `first_name`, `last_name`, `organization_department`, `job_title`) |
| `POST /api/ubl2.1/status/events-document/{cufe}` | Eventos registrados de un documento | — |
| `POST /api/ubl2.1/status/document/{cufe}` | Validez de un documento (CUFE, CUDE o CUNE) | — |
| `GET /api/receivedfile/{nit}/{archivo}` | Descarga un archivo recibido (XML, PDF o ZIP) | Exige token desde octubre de 2026, aunque la colección diga lo contrario |

- `POST /api/accept-reject-document` **ya no existe**. Los eventos van por `send-event`.
- Para el reclamo, el API usa los códigos de motivo `01` a `04` del anexo técnico. Se corrigieron
  en septiembre de 2026 porque la DIAN respondía `AAH10`.
- Los eventos llevan las responsabilidades tributarias en `cbc:TaxLevelCode`, varias separadas por
  `;` desde octubre de 2026.

**Vacío importante:** la documentación **no publica el catálogo de `event_id`**. Los ejemplos solo
usan `1`. El texto nombra cuatro eventos: acuse de recibo, recibo del bien o servicio, aceptación
y rechazo. Para nosotros corresponden a 030, 032, 033 y 031 (Documento Madre §4.4). La relación
entre cada `event_id` y su código DIAN hay que confirmarla en el código o con FacturaLatam antes de
enviar nada a producción.

### 5.3 Estados de la DIAN que devuelve el API

| `dian_status` | Significado |
|---|---|
| `VALIDADA` | La DIAN lo aceptó |
| `RECHAZADA` | Tiene veredicto negativo. Los motivos vienen en la respuesta |
| `EN_PROCESO` | Código 98: la DIAN aún no decide. El número queda reservado y una tarea lo consulta cada 10 min |
| `NO_ENCONTRADO` | La DIAN no tiene el documento |

Cuando el envío se corta sin respuesta, el API devuelve **`502`** con `success: false` y el CUFE.
La regla 90 de la DIAN, *Documento procesado anteriormente*, indica que ese número ya existe.

---

## 6. Autenticación y seguridad

| Credencial | Uso | Detalle |
|---|---|---|
| `api_token` de empresa | Todo lo que opera sobre una empresa | Se entrega al registrar la empresa. Va en `Authorization: Bearer` o en `?api_token=`. Se rota con `PUT /api/ubl2.1/config/rotate-token/{nit}` (con `X-Admin-Token`) o con `php artisan api:rotate-token {nit}` |
| `X-Admin-Token` | Crear, consultar y eliminar empresas, planes, administradores y SMTP general | Es `PLATFORM_ADMIN_TOKEN` del `.env`. Se crea con `php artisan api:admin-token`. Obligatorio desde el 27-oct-2026 |

**Respuestas de error de acceso:**

- sin token: `401` *No autenticado. Esta consulta requiere un api_token valido.*
- con el token de otra empresa: `403` *No tienes acceso a esta empresa.*

**Otras medidas de seguridad de octubre de 2026:**

- Las descargas del panel usan enlaces firmados que caducan a las 2 horas.
- El botón del correo para aceptar o rechazar usa un enlace firmado que caduca a los 30 días.
- El log enmascara el certificado, las contraseñas y el PIN.
- `certificates-listing` ya no devuelve la contraseña del certificado.
- Periodos de gracia temporales en el `.env`: `ALLOW_PUBLIC_API_REGISTER`, `ALLOW_PUBLIC_RESUME`,
  `ALLOW_PUBLIC_FILES` y `ALLOW_PUBLIC_DOWNLOAD`. En nuestra instalación deben quedar en `false`.
- PHP publicó dos vulnerabilidades críticas de ejecución remota el 21-oct-2026. Toda instalación
  debe reconstruir la imagen con `php:8.3.36-fpm-bookworm`.

**Antecedente a tener en cuenta:** hasta octubre de 2026 varias rutas respondían sin
autenticación. Bastaba conocer el NIT y el nombre del archivo para descargar documentos de una
empresa. Cualquier instalación debe estar en la versión corregida.

---

## 7. Instalación y operación

| Tema | Detalle |
|---|---|
| Opciones | Windows local, Ubuntu 20.04 LAMP manual o por script, Docker en Ubuntu 20.04, 22.04 y 24.04, y cPanel |
| Docker | `docker compose build --no-cache php_api scheduling_api`, `up -d`, `docker restart nginx_api` para evitar un `502` por cambio de IP interna, luego `composer install`, `php artisan migrate --seed` y `config:cache` dentro del contenedor |
| Actualizar | `git pull`, reconstruir si cambió el `Dockerfile` o `docker/`, y migrar cuando la versión lo pida |
| Rendimiento | Activar OPcache. Medir por etapas en `monitoring_slow_requests` con `MONITOR_SLOW_REQUEST_MS`, `MONITOR_TRACK_QUERIES` y `MONITOR_RETENTION_DAYS` |
| Correo | SMTP por `.env` (`MAIL_*`), por empresa con `PUT /api/ubl2.1/config/smtp` o general con `PUT /api/ubl2.1/config/smtp-global` |
| Registro público | `ENABLE_API_REGISTER=false` desactiva el alta de empresas por API |
| Montos | Desde octubre de 2026, `received_documents` guarda montos en `decimal(18,2)`. Antes fallaba con totales mayores a 99.999.999,99 |

---

## 8. Cómo encaja en OrveX.IA

### 8.1 Correspondencia de funciones

| Nuestro flujo (Documento Madre §4.4) | Lo que aporta APIDIAN | Lo que construimos nosotros |
|---|---|---|
| Obtención | Extractor V2 (modos 1 a 3) y XML por CUFE (modo 4) | Disparo programado o manual en BullMQ, por organización |
| Almacenamiento | Su tabla `received_documents` y su disco o S3 | XML y PDF en nuestro S3. Metadatos y hash en PostgreSQL con RLS (Document Manager) |
| Extracción y normalización | JSON con emisor, totales, impuestos e ítems | Mapeo a nuestro modelo. Validación determinística propia |
| Validación y reglas | Solo filtra por NIT del adquiriente | Validation Engine: campos, duplicados por CUFE, coherencia de totales |
| Revisión y aprobación humana | No existe | Submódulo `odoo-approvals` con permisos, auditoría y separación de funciones |
| Borrador en Odoo | No existe | Conector Odoo JSON-2 del Integration Hub (ADR-011) |
| Eventos RADIAN 030, 031, 032 y 033 | `send-event-data` y `status/events-document` | Tabla de eventos aparte del estado interno, y la decisión D-14 sobre quién firma |

### 8.2 Opciones de incorporación

| Opción | Cómo | A favor | En contra |
|---|---|---|---|
| **A. Servicio externo** | Desplegar APIDIAN y su extractor en contenedores propios. La suite lo consume desde un adaptador NestJS del Integration Hub. Cada organización se registra como "empresa" de APIDIAN y su `api_token` se guarda cifrado en el Credential Manager | Respeta el Documento Madre: integrar por contrato sin reescribir. Recibe las correcciones de FacturaLatam ante cambios de la DIAN | Suma PHP, MySQL o PostgreSQL y un worker a la operación. Duplica datos. Depende de la licencia y del acceso al repositorio |
| **B. Reimplementar lo necesario** | Escribir en TypeScript solo la consulta al web service de la DIAN (`GetXmlByDocumentKey`), el parser UBL y el envío de eventos, con APIDIAN como referencia funcional | Un solo stack y multiempresa nativa con RLS. Sin dependencia de licencia si no se copia código | Más trabajo. Hay que mantener la firma XAdES y seguir los cambios de la DIAN. El listado por catálogo sigue dependiendo del portal |
| **C. Mixta** | Empezar con A y reemplazar por B la parte que más pese | Entrega valor antes | Dos integraciones durante un tiempo |

**Recomendación preliminar:** la opción A para arrancar la etapa 4. El Documento Madre exige
inspeccionar antes de reescribir, y un servicio externo se reemplaza sin tocar el resto. La
decisión final depende de §2 y de D-14, y la toma el arquitecto.

### 8.3 Requisitos de multiempresa

- Una organización de OrveX.IA equivale a una "empresa" en APIDIAN, con su propio `api_token`.
- El `X-Admin-Token` lo usa solo un proceso interno del servidor. Nunca llega al navegador.
- El certificado `.p12` y su contraseña se cargan una vez, cifrados con nuestro cifrado envolvente
  (D-12). Vigilar `certificate_days_left` y avisar con 30 y 7 días de antelación.
- Ningún enlace de descarga de APIDIAN se muestra al usuario. Los archivos se copian a nuestro S3
  y se sirven con nuestras URL prefirmadas.

---

## 9. Riesgos y vacíos

| # | Riesgo o vacío | Impacto | Qué hacer |
|---|---|---|---|
| R1 | Repositorio privado y licencia desconocida | No se puede "clonar" hoy. Riesgo legal si se copia código | Pedir acceso y licencia por escrito a FacturaLatam |
| R2 | El envío de eventos exige un software propio habilitado por organización | Choca con D-14, abierta: figura ante la DIAN | Decidir D-14 antes de prometer eventos. Descargar sí es posible sin software |
| R3 | El listado depende de un enlace por token que pide una persona | La extracción semanal no se automatiza del todo | Confirmar cómo se emite y cuánto dura. Evaluar el modo `.p12` cuando salga de pruebas |
| R4 | Scraping del portal | Un cambio de la DIAN rompe el listado en silencio, como en septiembre de 2026 | Alertar cuando un rango devuelva cero documentos de forma inesperada. Conciliar con el modo 4 |
| R5 | Términos de uso del portal de la DIAN | Uso automatizado no revisado legalmente | Revisión legal, en línea con D-14 y D-21 |
| R6 | Catálogo de `event_id` no publicado | Riesgo de enviar el evento equivocado | Confirmarlo en el código o con FacturaLatam |
| R7 | El job avanza con el polling, 5 documentos por llamada | Un worker que no consulte deja el job detenido | Polling cada 3 a 5 segundos desde un job de BullMQ, con tope de 2 horas |
| R8 | Errores no estándar (`502` por cuerpo inválido, `200` con `data: []`) | Errores mal clasificados | Normalizarlos en el adaptador |
| R9 | Stack PHP fuera del nuestro | Operación y parches de seguridad extra | Imagen fijada por digest, red interna y actualizaciones vigiladas |
| R10 | Datos de terceros en la documentación | Los ejemplos traen razones sociales y nombres reales | No usarlos como datos de prueba |

---

## 10. Preguntas abiertas para el arquitecto

1. ¿Telcobras tiene o puede conseguir acceso al repositorio `co-apidian2026` y al del extractor?
   ¿Con qué licencia?
2. ¿Qué opción de §8.2 prefiere: servicio externo, reimplementación o mixta?
3. Para D-14: ¿cada organización enviará los eventos con su propio software o lo hará Telcobras
   como proveedor tecnológico o mandatario? ¿O la etapa 4 arranca solo con descarga y aprobación?
4. ¿Quién de cada organización pedirá el enlace por token de la DIAN, y cada cuánto?
5. ¿Se incluyen los documentos **enviados** o solo los recibidos, como dice ADR-011?

---

## 11. Qué contiene `referencia/`

| Archivo | Contenido |
|---|---|
| `manual/01-inicio-instalacion-y-guias.md` | Inicio, instalación, actualización, guías, novedades 2026, avisos de seguridad, rendimiento, S3, responsabilidades tributarias, errores frecuentes y colección Postman (12 páginas) |
| `manual/02-manual-de-la-interfaz.md` | Manual completo del panel, incluido el extractor de compras y el paso a producción (11 páginas) |
| `manual/03-referencia-api.md` | Referencia de todos los endpoints (133 páginas) |
| `manual/04-variantes-de-ejemplo.md` | Variantes de ejemplo de las secciones 2 a 45 (133 páginas) |
| `postman/01-…` a `postman/14-…` | Los 185 requests con descripción, headers, cuerpo, scripts y respuestas de ejemplo |
| `indice-de-endpoints.md` | Tabla de los 185 endpoints por sección |
| `video-extractor-dian-python-flask.md` | Transcripción del video de la primera versión del extractor |

**Tratamiento aplicado:**

- Se censuraron tokens, JWT, valores cifrados, contraseñas, PIN, claves técnicas y los CUFE de
  ejemplo que gitleaks detecta como secretos.
- Se recortaron los base64 de más de 400 caracteres.
- Los enlaces e imágenes del manual quedaron absolutos.
- Gitleaks, con la configuración del proyecto, no encuentra hallazgos en la carpeta.
