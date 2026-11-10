# Índice de endpoints de APIDIAN

> Generado el 10-nov-2026 desde la colección Postman pública «FacturaLatam ApiDianV2.1» (185 requests).
> El detalle de cada request (descripción, headers, cuerpo y respuesta de ejemplo) está en `postman/`.
> La columna Auth refleja lo que declara la colección; el manual aclara que desde octubre de 2026
> las rutas de administración piden además `X-Admin-Token` (ver `../ANALISIS_APIDIAN.md` §6).


## 01 - Configuraciones Basicas

| Subcarpeta | Request | Método | Ruta | Auth |
|---|---|---|---|---|
| 01A - Configuracion de empresa | Paso 1 - Registrar o actualizar la empresa (NIT y datos basicos) | `POST` | `/api/ubl2.1/config/89008003/2` | bearer + X-Admin-Token |
| 01A - Configuracion de empresa | Paso 2 - Cargar el certificado digital (.p12) | `PUT` | `/api/ubl2.1/config/certificate` | bearer |
| 01B - Configurar factura electronica › Resoluciones de notas credito y debito | Paso 3 - Crear la resolucion de nota credito | `PUT` | `/api/ubl2.1/config/resolution` | bearer |
| 01B - Configurar factura electronica › Resoluciones de notas credito y debito | Paso 4 - Crear la resolucion de nota debito | `PUT` | `/api/ubl2.1/config/resolution` | bearer |
| 01B - Configurar factura electronica | Paso 1 - Registrar el software de facturacion | `PUT` | `/api/ubl2.1/config/software` | bearer |
| 01B - Configurar factura electronica | Paso 2 - Crear la resolucion de facturacion | `PUT` | `/api/ubl2.1/config/resolution` | bearer |
| 01C - Configurar nomina electronica | Paso 1 - Registrar el software de nomina electronica | `PUT` | `/api/ubl2.1/config/softwarepayroll` | bearer |
| 01C - Configurar nomina electronica | Paso 2 - Crear la resolucion de nomina electronica | `PUT` | `/api/ubl2.1/config/resolution` | bearer |
| 01C - Configurar nomina electronica | Paso 3 - Crear la resolucion de nota de ajuste de nomina | `PUT` | `/api/ubl2.1/config/resolution` | bearer |
| 01D - Configurar documento soporte | Paso 1 - Registrar el software de documento soporte | `PUT` | `/api/ubl2.1/config/softwaresupportdocument` | bearer |
| 01D - Configurar documento soporte | Paso 2 - Crear la resolucion de documento soporte | `PUT` | `/api/ubl2.1/config/resolution` | bearer |
| 01D - Configurar documento soporte | Paso 3 - Crear la resolucion de nota de ajuste de documento soporte | `PUT` | `/api/ubl2.1/config/resolution` | bearer |
| 01E - Configurar documentos equivalentes | Paso 1 - Registrar el software de documentos equivalentes | `PUT` | `/api/ubl2.1/config/softwareeqdocs` | bearer |
| 01E - Configurar documentos equivalentes | Paso 2 - Crear la resolucion de documento equivalente POS | `PUT` | `/api/ubl2.1/config/resolution` | bearer |
| 01E - Configurar documentos equivalentes | Paso 3 - Crear la resolucion de tiquete de transporte terrestre | `PUT` | `/api/ubl2.1/config/resolution` | bearer |
| 01E - Configurar documentos equivalentes | Paso 4 - Crear la resolucion de servicios publicos domiciliarios | `PUT` | `/api/ubl2.1/config/resolution` | bearer |
| 01E - Configurar documentos equivalentes | Paso 5 - Crear la resolucion de boleta de ingreso a cine | `PUT` | `/api/ubl2.1/config/resolution` | bearer |
| 01E - Configurar documentos equivalentes | Paso 6 - Crear la resolucion de nota credito de documentos equivalentes | `PUT` | `/api/ubl2.1/config/resolution` | bearer |
| 01E - Configurar documentos equivalentes | Paso 7 - Crear la resolucion de nota debito de documentos equivalentes | `PUT` | `/api/ubl2.1/config/resolution` | bearer |
| — | Crear la resolucion de factura de contingencia | `PUT` | `/api/ubl2.1/config/resolution` | bearer |
| — | Crear la resolucion de factura de exportacion | `PUT` | `/api/ubl2.1/config/resolution` | bearer |

## 02 - Primeros Envios

| Subcarpeta | Request | Método | Ruta | Auth |
|---|---|---|---|---|
| Factura de venta › Restaurante | Factura de restaurante con IVA e impuesto al consumo | `POST` | `/api/ubl2.1/invoice` | bearer |
| Factura de venta › Restaurante | Factura de restaurante con propina como cargo | `POST` | `/api/ubl2.1/invoice` | bearer |
| Factura de venta | Factura de dos lineas con una tarifa de IVA | `POST` | `/api/ubl2.1/invoice` | bearer |
| Factura de venta | Factura con cliente de varias responsabilidades fiscales | `POST` | `/api/ubl2.1/invoice` | bearer |
| Factura de venta | Factura con referencia a documento de recepcion | `POST` | `/api/ubl2.1/invoice` | bearer |
| Factura de venta | Factura con descuento en linea y descuento global | `POST` | `/api/ubl2.1/invoice` | bearer |
| Factura de venta | Factura de una linea con descuento en la linea | `POST` | `/api/ubl2.1/invoice` | bearer |
| Factura de venta | Factura de tres lineas con descuento en cada linea | `POST` | `/api/ubl2.1/invoice` | bearer |
| Factura de venta | Factura de una linea sin descuentos (la mas sencilla) | `POST` | `/api/ubl2.1/invoice` | bearer |
| Factura de venta | Factura a credito (forma de pago 2) | `POST` | `/api/ubl2.1/invoice` | bearer |
| Factura de venta | Factura con varios metodos de pago | `POST` | `/api/ubl2.1/invoice` | bearer |
| Factura de venta | Factura de una linea con descuento global | `POST` | `/api/ubl2.1/invoice` | bearer |
| Factura de venta | Factura de tres lineas con descuento global | `POST` | `/api/ubl2.1/invoice` | bearer |
| Factura de venta | Vista previa del PDF de la factura (sin enviar a la DIAN) | `POST` | `/api/ubl2.1/invoice/preeliminar-view` | bearer |
| Factura de venta | Factura con dos tarifas de IVA y los dos tipos de descuento | `POST` | `/api/ubl2.1/invoice` | bearer |
| Factura de venta | Factura con dos retenciones | `POST` | `/api/ubl2.1/invoice` | bearer |
| Nota credito | Nota credito de una linea sin descuentos | `POST` | `/api/ubl2.1/credit-note` | bearer |
| Nota credito | Nota credito con descuento global | `POST` | `/api/ubl2.1/credit-note` | bearer |
| Nota credito | Nota credito con descuento en la linea | `POST` | `/api/ubl2.1/credit-note` | bearer |
| Nota credito | Nota credito sin referencia a factura | `POST` | `/api/ubl2.1/credit-note` | bearer |
| Nota debito | Nota debito de una linea sin descuentos | `POST` | `/api/ubl2.1/debit-note` | bearer |
| Nota debito | Nota debito con descuento global | `POST` | `/api/ubl2.1/debit-note` | bearer |
| Nota debito | Nota debito con descuento en la linea | `POST` | `/api/ubl2.1/debit-note` | bearer |
| Nota debito | Nota debito sin referencia a factura | `POST` | `/api/ubl2.1/debit-note` | bearer |
| Nomina electronica | Nomina individual | `POST` | `/api/ubl2.1/payroll/85d66719-3d34-4a53-9dca-e1a38a2a63fd` | bearer |
| Nomina electronica | Nota de ajuste de nomina - Reemplazar | `POST` | `/api/ubl2.1/payroll-adjust-note/7047db8a-213e-4b08-b567-b06b7a83b50d` | bearer |
| Nomina electronica | Nota de ajuste de nomina - Eliminar | `POST` | `/api/ubl2.1/payroll-adjust-note/7047db8a-213e-4b08-b567-b06b7a83b50d` | bearer |
| Documento soporte | Documento soporte sencillo | `POST` | `/api/ubl2.1/support-document` | bearer |
| Documento soporte | Documento soporte con descuento | `POST` | `/api/ubl2.1/support-document` | bearer |
| Documento soporte | Documento soporte con descuento (variante 2) | `POST` | `/api/ubl2.1/support-document` | bearer |
| Documento soporte | Documento soporte a proveedor extranjero (no residente) | `POST` | `/api/ubl2.1/support-document` | bearer |
| Documento soporte | Nota de ajuste de documento soporte | `POST` | `/api/ubl2.1/sd-credit-note` | bearer |
| Documento soporte | Documento soporte con impuesto | `POST` | `/api/ubl2.1/support-document` | bearer |
| Documento soporte | Documento soporte exento con retencion del 11% | `POST` | `/api/ubl2.1/support-document` | bearer |
| Documentos equivalentes › POS | Documento equivalente POS de una linea | `POST` | `/api/ubl2.1/eqdoc` | bearer |
| Documentos equivalentes › POS | Documento equivalente POS con impuesto al consumo (INC) | `POST` | `/api/ubl2.1/eqdoc` | bearer |
| Documentos equivalentes › POS | Documento equivalente POS de una linea (variante 2) | `POST` | `/api/ubl2.1/eqdoc` | bearer |
| Documentos equivalentes › POS | Documento equivalente POS con impuesto a las bolsas | `POST` | `/api/ubl2.1/eqdoc` | bearer |
| Documentos equivalentes › Transporte terrestre | Tiquete de transporte terrestre de pasajeros | `POST` | `/api/ubl2.1/eqdoc` | bearer |
| Documentos equivalentes › Boleta de ingreso a cine | Boleta de ingreso a cine | `POST` | `/api/ubl2.1/eqdoc/ae2a998a-6ab9-48f2-8cac-89b6f3f0c424` | bearer |
| Documentos equivalentes › Servicios publicos domiciliarios | Servicios publicos con servicio y complementos | `POST` | `/api/ubl2.1/eqdoc` | bearer |
| Documentos equivalentes › Servicios publicos domiciliarios | Servicios publicos solo con el servicio | `POST` | `/api/ubl2.1/eqdoc` | bearer |
| Documentos equivalentes | Nota credito de documento equivalente | `POST` | `/api/ubl2.1/credit-note` | bearer |
| Documentos equivalentes | Nota debito de documento equivalente | `POST` | `/api/ubl2.1/debit-note/936f14fb-3041-47c9-b194-e9bf81190d10` | bearer |
| Contingencia tipo 4 | Enviar una factura de contingencia tipo 4 | `POST` | `/api/ubl2.1/invoice-contingency-4` | bearer |
| Contingencia tipo 4 | Transmitir las facturas de contingencia pendientes | `POST` | `/api/ubl2.1/invoice-contingency-4/send_pendings` | bearer |
| Contingencia tipo 4 | Crear la resolucion de contingencia tipo 4 | `PUT` | `/api/ubl2.1/config/resolution` | bearer |

## 03 - Consultas de Estado

| Subcarpeta | Request | Método | Ruta | Auth |
|---|---|---|---|---|
| — | Estado de una factura por ZIP_KEY | `POST` | `/api/ubl2.1/status/zip/b97308d9-968b-463a-a31a-94159a95e6ed` | bearer |
| — | Estado de una nomina por ZIP_KEY | `POST` | `/api/ubl2.1/status/zip/7a89a4e4-ecb3-4eca-8ebb-6209c40477ce` | bearer |
| — | Estado de una factura por CUFE | `POST` | `/api/ubl2.1/status/document/d4905dbc009d247fd3926aae5a7e459e919a72792a231c45d549f0b0e5b07f0e2399c3a49003b556ff8ed9bedc5c72ac` | bearer |
| — | Estado de una nomina por CUNE | `POST` | `/api/ubl2.1/status/document/bd07eb71012b593fc2ad42d79cdea403a422204422a3cc8b7822b075d5c44ac388f3159c127b00a2288b97410273a4ff` | bearer |
| — | Eventos registrados de un documento por CUFE | `POST` | `/api/ubl2.1/status/events-document/60f3eee79b3f7d019524f554a40e8c87008cd6686a66816246861609a54bc90e5266af9b989f84168cf68d3a88104e72` | bearer |

## 04 - Casuisticas de Envios

| Subcarpeta | Request | Método | Ruta | Auth |
|---|---|---|---|---|
| — | Factura con referencia a orden de compra | `POST` | `/api/ubl2.1/invoice` | bearer |
| — | Factura con varias tarifas de IVA y descuentos | `POST` | `/api/ubl2.1/invoice` | bearer |
| — | Factura con datos de entrega (delivery) | `POST` | `/api/public/api/ubl2.1/invoice` | bearer |
| — | Factura con impuesto al consumo de licores (ICL) | `POST` | `/api/ubl2.1/invoice` | bearer |
| — | Factura con impuesto a las bolsas plasticas (INPP) | `POST` | `/api/ubl2.1/invoice` | bearer |
| — | Nota credito de varias lineas | `POST` | `/api/ubl2.1/credit-note` | bearer |
| — | Factura a credito con descuento | `POST` | `/api/ubl2.1/invoice` | bearer |
| — | Factura con descuento en dos lineas | `POST` | `/api/public/api/ubl2.1/invoice` | bearer |
| — | Factura con anticipo (pago previo) | `POST` | `/api/public/api/ubl2.1/invoice` | bearer |
| — | Factura con cargo en la linea | `POST` | `/api/ubl2.1/invoice` | bearer |
| — | Factura con cargo en el encabezado | `POST` | `/api/ubl2.1/invoice` | bearer |
| — | Factura con dos impuestos: telefonia celular | `POST` | `/api/ubl2.1/invoice` | bearer |
| — | Factura con impuesto saludable: alimentos ultraprocesados | `POST` | `/api/ubl2.1/invoice` | bearer |
| — | Factura con IVA e impuesto al consumo de licores | `POST` | `/api/ubl2.1/invoice` | bearer |
| — | Factura con impuesto saludable: bebidas azucaradas | `POST` | `/api/ubl2.1/invoice` | bearer |
| — | Factura con impuesto saludable: varias bebidas azucaradas | `POST` | `/api/ubl2.1/invoice` | bearer |
| — | Factura con productos gratis (regalos) | `POST` | `/api/public/api/ubl2.1/invoice` | bearer |
| — | Factura con dos tarifas de impuestos y retenciones | `POST` | `/api/public/api/ubl2.1/invoice` | bearer |
| — | Factura con impuesto nacional al consumo (INC) | `POST` | `/api/ubl2.1/invoice` | bearer |

## 05 - Utilidades

| Subcarpeta | Request | Método | Ruta | Auth |
|---|---|---|---|---|
| Consultar documentos enviados | Listar documentos por rango de fechas | `GET` | `/api/information/89008003/1900-01-01/2023-09-15` | bearer |
| Consultar documentos enviados | Total de documentos por rango de fechas | `GET` | `/api/total_documents/89008003/1900-01-01/2023-09-15` | bearer |
| Consultar documentos enviados | Listar documentos pagina por pagina | `GET` | `/api/information/89008003/page/0/page` | bearer |
| Consultar documentos enviados | Buscar documentos con filtros | `GET` | `/api/documents` | bearer |
| — | Registrar o actualizar un cliente | `PUT` | `/api/ubl2.1/register-update-customer` | bearer |
| — | Buscar un cliente por tipo y numero de documento | `GET` | `/api/customer/31/31999910` | bearer |
| — | Consultar la fecha de vencimiento del certificado | `PUT` | `/api/ubl2.1/certificate-end-date` | bearer |
| — | Consultar el proximo consecutivo a usar | `POST` | `/api/ubl2.1/next-consecutive` | bearer |
| — | Descargar el XML de un documento por CUFE | `POST` | `/api/ubl2.1/xml/document/7735317bef9d6b648eeb0d0ad56ec5feb63911072947a3d06a894bf6dd66a3c912325660eeb27d7424d23af740432f66` | bearer |
| — | Consultar los parametros de correo de la empresa | `GET` | `/api/ubl2.1/emailconfig` | noauth |
| — | Consultar la razon social por NIT | `GET` | `/api/ubl2.1/name-by-nit/89008003` | bearer |
| — | Consultar los datos de una empresa por NIT | `GET` | `/api/ubl2.1/SearchCompany/1124024319` | bearer |
| — | Unir varios PDF en un solo archivo | `POST` | `/api/ubl2.1/join-pdfs` | bearer |
| — | Descargar un archivo del documento (XML, PDF o ZIP) | `GET` | `/api/ubl2.1/download/89008003/Attachment-SETP990000399.xml/BASE64` | bearer |
| — | Descargar el AttachedDocument en BASE64 | `GET` | `/api/ubl2.1/download/89008003/Attachment-SETP990000506.xml/BASE64` | bearer |
| — | Descargar el PDF de un documento | `GET` | `/api/invoice/89008003/FES-SETP990000650.pdf` | bearer |
| — | Descargar un documento recibido | `GET` | `/api/receivedfile/89008003/ad090011631902722219520220419145805646.xml` | bearer |
| — | Consultar el ultimo consecutivo por tipo de documento | `GET` | `/api/ubl2.1/invoice/current_number/1` | bearer |
| — | Eliminar una empresa | `POST` | `/api/ubl2.1/delete/company/89008003/2` | bearer |
| — | Reenviar un documento al correo del cliente | `POST` | `/api/send-email-customer/NO` | noauth |
| — | Reenviar un documento por correo a otra direccion | `POST` | `/api/ubl2.1/send-email` | bearer |
| — | Reenviar la nomina al correo del empleado | `POST` | `/api/send-email-employee/NO` | noauth |
| — | Cargar el logo de la empresa | `PUT` | `/api/ubl2.1/config/logo` | bearer |
| — | Listar los certificados cargados de una empresa | `GET` | `/api/ubl2.1/certificates-listing/89008003` | bearer |
| — | Ajustar el consecutivo de un tipo de documento | `PUT` | `/api/ubl2.1/config/generateddocuments` | bearer |
| — | Regenerar el AttachedDocument de un documento | `POST` | `/api/ubl2.1/regenerate-attached-document` | bearer |

## 06 - Paso a Produccion

| Subcarpeta | Request | Método | Ruta | Auth |
|---|---|---|---|---|
| — | Cambiar entre habilitacion y produccion | `PUT` | `/api/ubl2.1/config/environment` | bearer |
| — | Consultar los rangos de numeracion de la DIAN | `POST` | `/api/ubl2.1/numbering-range` | bearer |

## 07 - Otros tipos de Facturas

| Subcarpeta | Request | Método | Ruta | Auth |
|---|---|---|---|---|
| Sector salud | Factura del sector salud | `POST` | `/api/ubl2.1/invoice` | bearer |
| Sector salud | Factura de salud sin contrato | `POST` | `/api/ubl2.1/invoice` | bearer |
| Sector salud | Factura de salud con varios pacientes | `POST` | `/api/ubl2.1/invoice` | bearer |
| Sector salud | Factura de salud con recaudo (SS-Recaudo) | `POST` | `/api/ubl2.1/invoice` | bearer |
| Sector salud | Factura de salud por capita inicial | `POST` | `/api/ubl2.1/invoice` | bearer |
| Sector salud | Factura de salud por capita del periodo | `POST` | `/api/ubl2.1/invoice` | bearer |
| Sector salud | Factura de salud con pago moderador | `POST` | `/api/ubl2.1/invoice` | bearer |
| — | Factura con productos exentos de IVA | `POST` | `/api/ubl2.1/invoice` | bearer |
| — | Factura con productos exentos e IVA 0% | `POST` | `/api/ubl2.1/invoice` | bearer |
| — | Factura con productos exentos e IVA 19% | `POST` | `/api/ubl2.1/invoice` | bearer |
| — | Factura con productos exentos, IVA 19% y 0% | `POST` | `/api/ubl2.1/invoice` | bearer |
| — | Factura de mandato | `POST` | `/api/ubl2.1/invoice-mandate` | bearer |
| — | Factura AIU (administracion, imprevistos y utilidad) | `POST` | `/api/ubl2.1/invoice-aiu` | bearer |
| — | Factura de contingencia (tipo 03) | `POST` | `/api/ubl2.1/invoice-contingency` | bearer |
| — | Factura de exportacion | `POST` | `/api/ubl2.1/invoice-export` | bearer |
| — | Factura de transporte de carga | `POST` | `/api/ubl2.1/invoice-transport` | bearer |

## 08 - Generador de Eventos

| Subcarpeta | Request | Método | Ruta | Auth |
|---|---|---|---|---|
| — | Enviar un evento desde el AttachedDocument | `POST` | `/api/ubl2.1/send-event` | bearer |
| — | Enviar un evento indicando el CUFE | `POST` | `/api/ubl2.1/send-event-data` | bearer |
| — | Cargar un documento recibido por CUFE | `POST` | `/api/load-document-by-cufe` | bearer |

## 09 - Planes

| Subcarpeta | Request | Método | Ruta | Auth |
|---|---|---|---|---|
| — | Crear un plan | `PUT` | `/api/ubl2.1/plan` | bearer + X-Admin-Token |
| — | Modificar un plan | `PUT` | `/api/ubl2.1/plan` | bearer + X-Admin-Token |
| — | Listar todos los planes | `GET` | `/api/ubl2.1/plan/query` | bearer + X-Admin-Token |
| — | Consultar el plan y el consumo de una empresa | `GET` | `/api/ubl2.1/plan/infoplanuser` | bearer |
| — | Consultar un plan por su id | `GET` | `/api/ubl2.1/plan/query/1` | bearer + X-Admin-Token |
| — | Listar las empresas que tienen un plan | `GET` | `/api/ubl2.1/plan/queryusersbyplan/1` | bearer + X-Admin-Token |
| — | Asignar, renovar o cambiar el plan de una empresa | `POST` | `/api/ubl2.1/config/89008003/2` | X-Admin-Token |

## 10 - Regenerar PDFs

| Subcarpeta | Request | Método | Ruta | Auth |
|---|---|---|---|---|
| — | Regenerar el PDF enviando el JSON del documento | `POST` | `/api/ubl2.1/regeneratepdf` | bearer |
| — | Regenerar el PDF por prefijo, numero y CUFE | `POST` | `/api/ubl2.1/regeneratepdf/SETP/990000667/c4075c096de4eb5f6ab17697936fb1687e468bb73f015bfe62701af753c7f1878614234734efea07e76bc3edfb922e44` | bearer |
| — | Listar las plantillas de PDF disponibles | `GET` | `/api/templates` | bearer |
| — | Cambiar la plantilla de PDF de la empresa | `PUT` | `/api/templates` | bearer |

## 11 - Servicios APP

| Subcarpeta | Request | Método | Ruta | Auth |
|---|---|---|---|---|
| — | Iniciar sesion y obtener el token | `POST` | `/api/login` | noauth |
| — | Listar los documentos de la empresa | `GET` | `/api/documents` | bearer |
| — | Listar los clientes | `GET` | `/api/customers` | bearer |
| — | Actualizar un cliente | `PUT` | `/api/customers/2222222222` | bearer |
| — | Listar las resoluciones de la empresa | `GET` | `/api/table/resolutions/89008003` | bearer |
| — | Listar los metodos de pago | `GET` | `/api/table/payment-methods` | bearer |
| — | Listar las formas de pago | `GET` | `/api/table/payment-forms` | bearer |
| — | Listar los productos | `GET` | `/api/items` | bearer |
| — | Actualizar un producto | `PUT` | `/api/items/1` | bearer |
| — | Registrar un producto | `POST` | `/api/items/add` | bearer |
| — | Descargar el PDF de un documento desde la app | `GET` | `/api/download/89008003/FES-SETP990060188.pdf` | bearer |

## 12 - API RIPS

| Subcarpeta | Request | Método | Ruta | Auth |
|---|---|---|---|---|
| Estado del servicio | Consultar la version del API RIPS | `GET` | `/api/BasicHealth` | noauth |
| Autenticacion | Obtener el token del API RIPS | `POST` | `/api/auth/LoginSISPRO` | noauth |
| Envio de RIPS y consulta de CUV | RIPS sin factura | `POST` | `/api/PaquetesFevRips/CargarRipsSinFactura` | bearer |
| Envio de RIPS y consulta de CUV | RIPS con factura - un paciente con pago moderador | `POST` | `/api/PaquetesFevRips/CargarFevRips` | bearer |
| Envio de RIPS y consulta de CUV | RIPS con factura - varios pacientes y varios pagos | `POST` | `/api/PaquetesFevRips/CargarFevRips` | bearer |
| Envio de RIPS y consulta de CUV | RIPS de nota credito | `POST` | `/api/PaquetesFevRips/CargarNC` | bearer |
| Envio de RIPS y consulta de CUV | RIPS de nota credito total | `POST` | `/api/PaquetesFevRips/CargarNCTotal` | bearer |
| Envio de RIPS y consulta de CUV | RIPS de capita inicial | `POST` | `/api/PaquetesFevRips/CargarCapitaInicial` | bearer |
| Envio de RIPS y consulta de CUV | RIPS de capita del periodo | `POST` | `/api/PaquetesFevRips/CargarCapitaPeriodo` | bearer |
| Envio de RIPS y consulta de CUV | RIPS de capita final | `POST` | `/api/PaquetesFevRips/CargarCapitaFinal` | bearer |
| Envio de RIPS y consulta de CUV | RIPS de nota debito | `POST` | `/api/PaquetesFevRips/CargarND` | bearer |
| Envio de RIPS y consulta de CUV | RIPS de nota de ajuste | `POST` | `/api/PaquetesFevRips/CargarNotaAjuste` | bearer |
| Envio de RIPS y consulta de CUV | RIPS de nota credito por acuerdo de voluntades | `POST` | `/api/PaquetesFevRips/CargarNCAcuerdoVoluntades` | bearer |
| Envio de RIPS y consulta de CUV | Consultar el CUV de una factura | `POST` | `/api/ConsultasFevRips/ConsultarCUV` | bearer |
| Envio de RIPS y consulta de CUV | Descargar los archivos del CUV | `POST` | `/api/ConsultasFevRips/DescargarArchivosFevRipsCUV` | bearer |
| Envio de RIPS y consulta de CUV | Recuperar el CUV de una factura ya validada | `POST` | `/api/ConsultasFevRips/RecuperarCUV` | bearer |

## 13 - WhatsApp

| Subcarpeta | Request | Método | Ruta | Auth |
|---|---|---|---|---|
| Configuracion | Configurar la cuenta de WhatsApp | `PUT` | `/api/whatsapp-config` | bearer |
| Configuracion | Consultar la URL de conexion de WhatsApp | `GET` | `/api/whatsapp-config` | bearer |
| Mensajes | Enviar un mensaje de texto por WhatsApp | `POST` | `/api/whatsapp-config/send-message` | bearer |
| Envio de documentos | Enviar una factura por WhatsApp al facturar | `POST` | `/api/ubl2.1/invoice` | bearer |

## 14 - Extractor V2

| Subcarpeta | Request | Método | Ruta | Auth |
|---|---|---|---|---|
| — | Modo 1 - Extraccion completa (respuesta inmediata) | `POST` | `/api/extractor/company/stream` | bearer |
| — | Modo 2 - Iniciar la extraccion en segundo plano | `POST` | `/api/certificate` | bearer |
| — | Modo 3 - Consultar el avance y el resultado | `GET` | `/api/extractor/company/jobs/{{job_id}}` | bearer |
| — | Modo 4 - Descargar el XML de un documento por CUFE | `POST` | `/api/ubl2.1/xml/document/{{cufe}}` | bearer |
