# Referencia API (sección apidian-1: todos los endpoints)

> Copia íntegra del manual oficial de APIDIAN (FacturaLatam), descargada el 10-nov-2026 desde https://manual.facturalatam.com. Solo se censuraron tokens y secretos, se recortaron los base64 largos y se volvieron absolutos los enlaces e imágenes. Cada página conserva su URL de origen.

Páginas incluidas: 133.

## Contenido
- 01A - Configuracion de empresa — <https://manual.facturalatam.com/apidian-1/01-a-configuracion-de-empresa/>
- 01B - Configurar factura electronica — <https://manual.facturalatam.com/apidian-1/01-b-configurar-factura-electronica/>
- 01C - Configurar nomina electronica — <https://manual.facturalatam.com/apidian-1/01-c-configurar-nomina-electronica/>
- 01D - Configurar documento soporte — <https://manual.facturalatam.com/apidian-1/01-d-configurar-documento-soporte/>
- 01E - Configurar documentos equivalentes — <https://manual.facturalatam.com/apidian-1/01-e-configurar-documentos-equivalentes/>
- 03 - Consultas de Estado — <https://manual.facturalatam.com/apidian-1/03-consultas-de-estado/>
- 05 - Utilidades — <https://manual.facturalatam.com/apidian-1/05-utilidades/>
- 06 - Paso a Produccion — <https://manual.facturalatam.com/apidian-1/06-paso-a-produccion/>
- 07 - Otros tipos de Facturas — <https://manual.facturalatam.com/apidian-1/07-otros-tipos-de-facturas/>
- 08 - Generador de Eventos — <https://manual.facturalatam.com/apidian-1/08-generador-de-eventos/>
- 09 - Planes — <https://manual.facturalatam.com/apidian-1/09-planes/>
- 10 - Regenerar PDFs — <https://manual.facturalatam.com/apidian-1/10-regenerar-pd-fs/>
- 11 - Servicios APP — <https://manual.facturalatam.com/apidian-1/11-servicios-app/>
- 14 - Extractor V2 — <https://manual.facturalatam.com/apidian-1/14-extractor-v-2/>
- API DIAN FacturaLatam — <https://manual.facturalatam.com/apidian-1/api-dian-facturalatam/>
- Autenticacion — <https://manual.facturalatam.com/apidian-1/autenticacion/>
- Configuracion — <https://manual.facturalatam.com/apidian-1/configuracion/>
- Consultar documentos enviados — <https://manual.facturalatam.com/apidian-1/consultar-documentos-enviados/>
- Contingencia tipo 4 — <https://manual.facturalatam.com/apidian-1/contingencia-tipo-4/>
- Documento soporte — <https://manual.facturalatam.com/apidian-1/documento-soporte/>
- Envio de RIPS y consulta de CUV — <https://manual.facturalatam.com/apidian-1/envio-de-rips-y-consulta-de-cuv/>
- Estado del servicio — <https://manual.facturalatam.com/apidian-1/estado-del-servicio/>
- Factura de venta — <https://manual.facturalatam.com/apidian-1/factura-de-venta/>
- Buscar un cliente por tipo y numero de documento — <https://manual.facturalatam.com/apidian-1/get-api-customer-nit-dv-v-1/>
- Listar los clientes — <https://manual.facturalatam.com/apidian-1/get-api-customers-v-1/>
- Buscar documentos con filtros — <https://manual.facturalatam.com/apidian-1/get-api-documents-v-1/>
- Descargar el PDF de un documento desde la app — <https://manual.facturalatam.com/apidian-1/get-api-download-nit-filename-v-1/>
- Modo 3 - Consultar el avance y el resultado — <https://manual.facturalatam.com/apidian-1/get-api-extractor-company-jobs-job-id-v-1/>
- Listar documentos por rango de fechas — <https://manual.facturalatam.com/apidian-1/get-api-information-nit-fecha-inicial-fecha-final-v-1/>
- Listar documentos pagina por pagina — <https://manual.facturalatam.com/apidian-1/get-api-information-nit-page-page-page-v-1/>
- Descargar el PDF de un documento — <https://manual.facturalatam.com/apidian-1/get-api-invoice-nit-filename-v-1/>
- Listar los productos — <https://manual.facturalatam.com/apidian-1/get-api-items-v-1/>
- Descargar un documento recibido — <https://manual.facturalatam.com/apidian-1/get-api-receivedfile-nit-filename-v-1/>
- Listar las formas de pago — <https://manual.facturalatam.com/apidian-1/get-api-table-payment-forms-v-1/>
- Listar los metodos de pago — <https://manual.facturalatam.com/apidian-1/get-api-table-payment-methods-v-1/>
- Listar las resoluciones de la empresa — <https://manual.facturalatam.com/apidian-1/get-api-table-resolutions-nit-v-1/>
- Listar las plantillas de PDF disponibles — <https://manual.facturalatam.com/apidian-1/get-api-templates-v-1/>
- Total de documentos por rango de fechas — <https://manual.facturalatam.com/apidian-1/get-api-total-documents-nit-fecha-inicial-fecha-final-v-1/>
- Consultar los administradores — <https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-administrator-query-nit-v-1/>
- Listar las empresas de un administrador — <https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-administrator-queryusersbyadmin-nit-v-1/>
- Listar los certificados cargados de una empresa — <https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-certificates-listing-nit-v-1/>
- Consultar los datos de una empresa — <https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-config-query-nit-v-1/>
- Descargar un archivo del documento (XML, PDF o ZIP) — <https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-download-nit-filename-base-64-v-1/>
- Consultar los parametros de correo de la empresa — <https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-emailconfig-v-1/>
- Consultar el ultimo consecutivo por tipo de documento — <https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-invoice-current-number-nit-v-1/>
- Consultar la razon social por NIT — <https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-name-by-nit-nit-v-1/>
- Consultar el plan y el consumo de una empresa — <https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-plan-infoplanuser-v-1/>
- Consultar un plan por su id — <https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-plan-query-nit-v-1/>
- Listar todos los planes — <https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-plan-query-v-1/>
- Listar las empresas que tienen un plan — <https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-plan-queryusersbyplan-plan-id-v-1/>
- Consultar los datos de una empresa por NIT — <https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-search-company-nit-v-1/>
- Consultar la URL de conexion de WhatsApp — <https://manual.facturalatam.com/apidian-1/get-api-whatsapp-config-v-1/>
- Consultar la version del API RIPS — <https://manual.facturalatam.com/apidian-1/get-basic-health-v-1/>
- Mensajes — <https://manual.facturalatam.com/apidian-1/mensajes/>
- Nomina electronica — <https://manual.facturalatam.com/apidian-1/nomina-electronica/>
- Nota credito — <https://manual.facturalatam.com/apidian-1/nota-credito/>
- Nota debito — <https://manual.facturalatam.com/apidian-1/nota-debito/>
- POS — <https://manual.facturalatam.com/apidian-1/pos/>
- Obtener el token del API RIPS — <https://manual.facturalatam.com/apidian-1/post-api-auth-login-sispro-v-1/>
- Modo 2 - Iniciar la extraccion en segundo plano — <https://manual.facturalatam.com/apidian-1/post-api-certificate-v-1/>
- Consultar el CUV de una factura — <https://manual.facturalatam.com/apidian-1/post-api-consultas-fev-rips-consultar-cuv-v-1/>
- Descargar los archivos del CUV — <https://manual.facturalatam.com/apidian-1/post-api-consultas-fev-rips-descargar-archivos-fev-rips-cuv-v-1/>
- Recuperar el CUV de una factura ya validada — <https://manual.facturalatam.com/apidian-1/post-api-consultas-fev-rips-recuperar-cuv-v-1/>
- Modo 1 - Extraccion completa (respuesta inmediata) — <https://manual.facturalatam.com/apidian-1/post-api-extractor-company-stream-v-1/>
- Registrar un producto — <https://manual.facturalatam.com/apidian-1/post-api-items-add-v-1/>
- Cargar un documento recibido por CUFE — <https://manual.facturalatam.com/apidian-1/post-api-load-document-by-cufe-v-1/>
- Iniciar sesion y obtener el token — <https://manual.facturalatam.com/apidian-1/post-api-login-v-1/>
- RIPS de capita final — <https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-capita-final-v-1/>
- RIPS de capita inicial — <https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-capita-inicial-v-1/>
- RIPS de capita del periodo — <https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-capita-periodo-v-1/>
- RIPS con factura - un paciente con pago moderador — <https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-fev-rips-v-1/>
- RIPS de nota credito por acuerdo de voluntades — <https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-nc-acuerdo-voluntades-v-1/>
- RIPS de nota credito total — <https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-nc-total-v-1/>
- RIPS de nota credito — <https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-nc-v-1/>
- RIPS de nota debito — <https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-nd-v-1/>
- RIPS de nota de ajuste — <https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-nota-ajuste-v-1/>
- RIPS sin factura — <https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-rips-sin-factura-v-1/>
- Reenviar un documento al correo del cliente — <https://manual.facturalatam.com/apidian-1/post-api-send-email-customer-no-v-1/>
- Reenviar la nomina al correo del empleado — <https://manual.facturalatam.com/apidian-1/post-api-send-email-employee-no-v-1/>
- Eliminar una empresa con la clave de administracion — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-config-delete-nit-email-v-1/>
- Paso 1 - Registrar o actualizar la empresa (NIT y datos basicos) — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-config-nit-dv-v-1/>
- Nota credito de una linea sin descuentos — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-credit-note-test-set-id-v-1/>
- Nota debito de una linea sin descuentos — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-debit-note-test-set-id-v-1/>
- Eliminar una empresa — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-delete-company-nit-dv-v-1/>
- Documento equivalente POS de una linea — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-eqdoc-test-set-id-v-1/>
- Factura AIU (administracion, imprevistos y utilidad) — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-aiu-v-1/>
- Transmitir las facturas de contingencia pendientes — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-contingency-4-send-pendings-test-set-id-v-1/>
- Enviar una factura de contingencia tipo 4 — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-contingency-4-test-set-id-v-1/>
- Factura de contingencia (tipo 03) — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-contingency-test-set-id-v-1/>
- Factura de exportacion — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-export-v-1/>
- Factura de mandato — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-mandate-v-1/>
- Vista previa del PDF de la factura (sin enviar a la DIAN) — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-preeliminar-view-v-1/>
- Factura de restaurante con IVA e impuesto al consumo — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-test-set-id-v-1/>
- Factura de transporte de carga — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-transport-v-1/>
- Unir varios PDF en un solo archivo — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-join-pdfs-v-1/>
- Consultar el proximo consecutivo a usar — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-next-consecutive-v-1/>
- Consultar los rangos de numeracion de la DIAN — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-numbering-range-v-1/>
- Nota de ajuste de nomina - Reemplazar — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-payroll-adjust-note-test-set-id-v-1/>
- Nomina individual — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-payroll-test-set-id-v-1/>
- Regenerar el AttachedDocument de un documento — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-regenerate-attached-document-v-1/>
- Regenerar el PDF por prefijo, numero y CUFE — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-regeneratepdf-prefijo-numero-cufe-v-1/>
- Regenerar el PDF enviando el JSON del documento — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-regeneratepdf-v-1/>
- Nota de ajuste de documento soporte — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-sd-credit-note-test-set-id-v-1/>
- Reenviar un documento por correo a otra direccion — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-send-email-v-1/>
- Enviar un evento indicando el CUFE — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-send-event-data-v-1/>
- Enviar un evento desde el AttachedDocument — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-send-event-v-1/>
- Estado de una factura por CUFE — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-status-document-cufe-v-1/>
- Eventos registrados de un documento por CUFE — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-status-events-document-cufe-v-1/>
- Estado de una factura por ZIP\_KEY — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-status-zip-zip-key-v-1/>
- Documento soporte sencillo — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-support-document-test-set-id-v-1/>
- Descargar el XML de un documento por CUFE — <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-xml-document-cufe-v-1/>
- Enviar un mensaje de texto por WhatsApp — <https://manual.facturalatam.com/apidian-1/post-api-whatsapp-config-send-message-v-1/>
- Actualizar un cliente — <https://manual.facturalatam.com/apidian-1/put-api-customers-id-v-1/>
- Actualizar un producto — <https://manual.facturalatam.com/apidian-1/put-api-items-id-v-1/>
- Cambiar la plantilla de PDF de la empresa — <https://manual.facturalatam.com/apidian-1/put-api-templates-v-1/>
- Crear o modificar un administrador — <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-administrator-v-1/>
- Consultar la fecha de vencimiento del certificado — <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-certificate-end-date-v-1/>
- Paso 2 - Cargar el certificado digital (.p12) — <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-certificate-v-1/>
- Cambiar entre habilitacion y produccion — <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-environment-v-1/>
- Ajustar el consecutivo de un tipo de documento — <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-generateddocuments-v-1/>
- Cargar el logo de la empresa — <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-logo-v-1/>
- Paso 3 - Crear la resolucion de nota credito — <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-resolution-v-1/>
- Cambiar el api\_token de una empresa — <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-rotate-token-nit-v-1/>
- Configurar el SMTP general de la instalacion — <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-smtp-global-v-1/>
- Paso 1 - Registrar el software de facturacion — <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-software-v-1/>
- Paso 1 - Registrar el software de documentos equivalentes — <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-softwareeqdocs-v-1/>
- Paso 1 - Registrar el software de nomina electronica — <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-softwarepayroll-v-1/>
- Paso 1 - Registrar el software de documento soporte — <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-softwaresupportdocument-v-1/>
- Crear un plan — <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-plan-v-1/>
- Registrar o actualizar un cliente — <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-register-update-customer-v-1/>
- Configurar la cuenta de WhatsApp — <https://manual.facturalatam.com/apidian-1/put-api-whatsapp-config-v-1/>
- Resoluciones de notas credito y debito — <https://manual.facturalatam.com/apidian-1/resoluciones-de-notas-credito-y-debito/>
- Restaurante — <https://manual.facturalatam.com/apidian-1/restaurante/>

---

## 01A - Configuracion de empresa

Fuente: <https://manual.facturalatam.com/apidian-1/01-a-configuracion-de-empresa/>

* Servicios Para configurar la empresa

[## 📄️ Paso 1 - Registrar o actualizar la empresa (NIT y datos basicos)

CONFIGURAR COMPAÑIA](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-config-nit-dv-v-1/)

[## 📄️ Paso 2 - Cargar el certificado digital (.p12)

CONFIGURAR CERTIFICADO](https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-certificate-v-1/)

[## 📄️ Consultar los datos de una empresa

CONSULTAR UNA EMPRESA](https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-config-query-nit-v-1/)

[## 📄️ Cambiar el api\_token de una empresa

CAMBIAR EL API\_TOKEN DE UNA EMPRESA](https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-rotate-token-nit-v-1/)

[## 📄️ Eliminar una empresa con la clave de administracion

ELIMINAR UNA EMPRESA](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-config-delete-nit-email-v-1/)

[## 📄️ Configurar el SMTP general de la instalacion

CONFIGURAR EL SMTP GENERAL](https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-smtp-global-v-1/)

---

## 01B - Configurar factura electronica

Fuente: <https://manual.facturalatam.com/apidian-1/01-b-configurar-factura-electronica/>

* Servicios exclusivos para Facturas Electronicas

[## 🗃️ Resoluciones de notas credito y debito

2 items](https://manual.facturalatam.com/apidian-1/resoluciones-de-notas-credito-y-debito/)

[## 📄️ Paso 1 - Registrar el software de facturacion

CONFIGURAR SOFTWARE](https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-software-v-1/)

[## 📄️ Paso 2 - Crear la resolucion de facturacion

Json que permite generar una resolución de Factura Electrónica](https://manual.facturalatam.com/apidian-3/put-api-ubl-2-1-config-resolution-v-3/)

---

## 01C - Configurar nomina electronica

Fuente: <https://manual.facturalatam.com/apidian-1/01-c-configurar-nomina-electronica/>

* Servicios exclusivos para las Nominas

[## 📄️ Paso 1 - Registrar el software de nomina electronica

CONFIGURAR SOFTWARE DE NOMINA ELECTRONICA](https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-softwarepayroll-v-1/)

[## 📄️ Paso 2 - Crear la resolucion de nomina electronica

CONFIGURAR RESOLUCION DE NOMINA ELECTRONICA](https://manual.facturalatam.com/apidian-4/put-api-ubl-2-1-config-resolution-v-4/)

[## 📄️ Paso 3 - Crear la resolucion de nota de ajuste de nomina

CONFIGURAR RESOLUCION DE NOTA DE AJUSTE DE NOMINA](https://manual.facturalatam.com/apidian-5/put-api-ubl-2-1-config-resolution-v-5/)

---

## 01D - Configurar documento soporte

Fuente: <https://manual.facturalatam.com/apidian-1/01-d-configurar-documento-soporte/>

* Servicios exclusivos para los Documentos de soporte

[## 📄️ Paso 1 - Registrar el software de documento soporte

CONFIGURAR SOFTWARE DE DOCUMENTO SOPORTE](https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-softwaresupportdocument-v-1/)

[## 📄️ Paso 2 - Crear la resolucion de documento soporte

CONFIGURAR RESOLUCION DE DOCUMENTO SOPORTE](https://manual.facturalatam.com/apidian-6/put-api-ubl-2-1-config-resolution-v-6/)

[## 📄️ Paso 3 - Crear la resolucion de nota de ajuste de documento soporte

CONFIGURAR RESOLUCION DE NOTA DE AJUSTE DE DOCUMENTO SOPORTE](https://manual.facturalatam.com/apidian-7/put-api-ubl-2-1-config-resolution-v-7/)

---

## 01E - Configurar documentos equivalentes

Fuente: <https://manual.facturalatam.com/apidian-1/01-e-configurar-documentos-equivalentes/>

* servicios exclusivos para documentos equivalentes

[## 📄️ Paso 1 - Registrar el software de documentos equivalentes

CONFIGURAR SOFTWARE DE DOCUMENTOS EQUIVALENTES](https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-softwareeqdocs-v-1/)

[## 📄️ Paso 2 - Crear la resolucion de documento equivalente POS

CONFIGURAR RESOLUCION DE DOCUMENTOS EQUIVALENTES - POS](https://manual.facturalatam.com/apidian-8/put-api-ubl-2-1-config-resolution-v-8/)

[## 📄️ Paso 3 - Crear la resolucion de tiquete de transporte terrestre

CONFIGURAR RESOLUCION DE DOCUMENTOS EQUIVALENTES - TRANSPORTE TERRESTRE](https://manual.facturalatam.com/apidian-9/put-api-ubl-2-1-config-resolution-v-9/)

[## 📄️ Paso 4 - Crear la resolucion de servicios publicos domiciliarios

CONFIGURAR RESOLUCION DE DOCUMENTOS EQUIVALENTES - SERVICIOS PUBLICOS](https://manual.facturalatam.com/apidian-10/put-api-ubl-2-1-config-resolution-v-10/)

[## 📄️ Paso 5 - Crear la resolucion de boleta de ingreso a cine

CONFIGURAR RESOLUCION DE DOCUMENTOS EQUIVALENTES - BOLETA DE INGRESO A CINE](https://manual.facturalatam.com/apidian-11/put-api-ubl-2-1-config-resolution-v-11/)

[## 📄️ Paso 6 - Crear la resolucion de nota credito de documentos equivalentes

CONFIGURAR RESOLUCION DE NOTAS CREDITO DE DOCUMENTOS EQUIVALENTES](https://manual.facturalatam.com/apidian-12/put-api-ubl-2-1-config-resolution-v-12/)

[## 📄️ Paso 7 - Crear la resolucion de nota debito de documentos equivalentes

CONFIGURAR RESOLUCION DE NOTAS DEBITO DE DOCUMENTOS EQUIVALENTES](https://manual.facturalatam.com/apidian-13/put-api-ubl-2-1-config-resolution-v-13/)

---

## 03 - Consultas de Estado

Fuente: <https://manual.facturalatam.com/apidian-1/03-consultas-de-estado/>

Son los request que nos permiten una vez se haya enviado los primeros documentos, consultar el estado de
estos envios para saber el porque fueron rechazados o en su defecto, saber si fue autorizado dicho
documento.

[## 📄️ Estado de una factura por ZIP\_KEY

CONSULTA DE ESTADO POR ZIP\_KEY](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-status-zip-zip-key-v-1/)

[## 📄️ Estado de una nomina por ZIP\_KEY

CONSULTA DE ESTADO POR ZIP\_KEY](https://manual.facturalatam.com/apidian-2/post-api-ubl-2-1-status-zip-zip-key-v-2/)

[## 📄️ Estado de una factura por CUFE

CONSULTA DE ESTADO POR CUFE, CUDE, CUNE](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-status-document-cufe-v-1/)

[## 📄️ Estado de una nomina por CUNE

CONSULTA DE ESTADO POR CUFE, CUDE, CUNE](https://manual.facturalatam.com/apidian-2/post-api-ubl-2-1-status-document-cufe-v-2/)

[## 📄️ Eventos registrados de un documento por CUFE

CONSULTA DE ESTADO POR CUFE, CUDE, CUNE](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-status-events-document-cufe-v-1/)

---

## 05 - Utilidades

Fuente: <https://manual.facturalatam.com/apidian-1/05-utilidades/>

Los request de esta carpeta permiten realizar operaciones varias.

[## 🗃️ Consultar documentos enviados

4 items](https://manual.facturalatam.com/apidian-1/consultar-documentos-enviados/)

[## 📄️ Registrar o actualizar un cliente

\*\*REGISTRAR/MODIFICAR DATOS DE UN CLIENTE\*\*](https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-register-update-customer-v-1/)

[## 📄️ Buscar un cliente por tipo y numero de documento

\*\*Consulta de datos de un cliente por tipo y número de documento\*\*](https://manual.facturalatam.com/apidian-1/get-api-customer-nit-dv-v-1/)

[## 📄️ Consultar la fecha de vencimiento del certificado

\*\*FECHA DE VENCIMIENTO DEL CERTIFICADO DIGITAL\*\*](https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-certificate-end-date-v-1/)

[## 📄️ Consultar el proximo consecutivo a usar

\*\*OBTENER EL PRÓXIMO CONSECUTIVO DE DOCUMENTO\*\*](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-next-consecutive-v-1/)

[## 📄️ Descargar el XML de un documento por CUFE

\*\*CONSULTA DEL XML DE UN DOCUMENTO POR CUFE\*\*](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-xml-document-cufe-v-1/)

[## 📄️ Consultar los parametros de correo de la empresa

\*\*Consulta de configuración de correo electrónico\*\*](https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-emailconfig-v-1/)

[## 📄️ Consultar la razon social por NIT

\*\*Consulta de nombre por NIT\*\*](https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-name-by-nit-nit-v-1/)

[## 📄️ Consultar los datos de una empresa por NIT

\*\*Consulta de información de empresa por NIT\*\*](https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-search-company-nit-v-1/)

[## 📄️ Unir varios PDF en un solo archivo

\*\*Unir varios archivos PDF en uno solo\*\*](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-join-pdfs-v-1/)

[## 📄️ Descargar un archivo del documento (XML, PDF o ZIP)

\*\*Descarga de archivos de documentos electrónicos\*\*](https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-download-nit-filename-base-64-v-1/)

[## 📄️ Descargar el AttachedDocument en BASE64

\*\*Descarga de archivos de documentos electrónicos\*\*](https://manual.facturalatam.com/apidian-2/get-api-ubl-2-1-download-nit-filename-base-64-v-2/)

[## 📄️ Descargar el PDF de un documento

\*\*Descargar PDF de un documento electrónico\*\*](https://manual.facturalatam.com/apidian-1/get-api-invoice-nit-filename-v-1/)

[## 📄️ Descargar un documento recibido

\*\*Descargar archivo recibido de la empresa\*\*](https://manual.facturalatam.com/apidian-1/get-api-receivedfile-nit-filename-v-1/)

[## 📄️ Consultar el ultimo consecutivo por tipo de documento

### CONSULTAR EL ÚLTIMO NÚMERO DE DOCUMENTO](https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-invoice-current-number-nit-v-1/)

[## 📄️ Eliminar una empresa

### ELIMINAR COMPAÑÍA](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-delete-company-nit-dv-v-1/)

[## 📄️ Reenviar un documento al correo del cliente

### ENVIAR CORREO AL ADQUIRIENTE](https://manual.facturalatam.com/apidian-1/post-api-send-email-customer-no-v-1/)

[## 📄️ Reenviar un documento por correo a otra direccion

### ENVIAR CORREO AL ADQUIRIENTE](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-send-email-v-1/)

[## 📄️ Reenviar la nomina al correo del empleado

### ENVIAR CORREO AL EMPLEADO (NÓMINA)](https://manual.facturalatam.com/apidian-1/post-api-send-email-employee-no-v-1/)

[## 📄️ Cargar el logo de la empresa

### CONFIGURAR LOGO DE LA EMPRESA](https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-logo-v-1/)

[## 📄️ Listar los certificados cargados de una empresa

### LISTADO DE CERTIFICADOS DIGITALES](https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-certificates-listing-nit-v-1/)

[## 📄️ Ajustar el consecutivo de un tipo de documento

### REGISTRAR NÚMERO INICIAL DE DOCUMENTO](https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-generateddocuments-v-1/)

[## 📄️ Regenerar el AttachedDocument de un documento

### Endpoint: Regenerar AttachedDocument](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-regenerate-attached-document-v-1/)

---

## 06 - Paso a Produccion

Fuente: <https://manual.facturalatam.com/apidian-1/06-paso-a-produccion/>

Estos request son necesarios cuando se termina la habilitacion y se quiere llevar la empresa a produccion.

[## 📄️ Cambiar entre habilitacion y produccion

CAMBIAR AMBIENTE DE OPERACION](https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-environment-v-1/)

[## 📄️ Consultar los rangos de numeracion de la DIAN

CONSULTAR RANGOS DE NUMERACION](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-numbering-range-v-1/)

---

## 07 - Otros tipos de Facturas

Fuente: <https://manual.facturalatam.com/apidian-1/07-otros-tipos-de-facturas/>

Se incluyen otros tipos de facturas como AIU, Mandato, Exportacion y Contingencia.

[## 🗃️ Sector salud

7 items](https://manual.facturalatam.com/apidian-34/post-api-ubl-2-1-invoice-test-set-id-v-34/)

[## 📄️ Factura con productos exentos de IVA

ENVIO DE FACTURA ARTICULOS EXCENTOS DE IVA](https://manual.facturalatam.com/apidian-41/post-api-ubl-2-1-invoice-test-set-id-v-41/)

[## 📄️ Factura con productos exentos e IVA 0%

ENVIO DE FACTURA CON ARTICULOS EXCENTOS E IVA 0](https://manual.facturalatam.com/apidian-42/post-api-ubl-2-1-invoice-test-set-id-v-42/)

[## 📄️ Factura con productos exentos e IVA 19%

ENVIO DE FACTURA ARTICULOS EXCENTOS E IVA 19](https://manual.facturalatam.com/apidian-43/post-api-ubl-2-1-invoice-test-set-id-v-43/)

[## 📄️ Factura con productos exentos, IVA 19% y 0%

ENVIO DE FACTURA CON ARTICULOS EXCENTOS, IVA 0 E IVA 19](https://manual.facturalatam.com/apidian-44/post-api-ubl-2-1-invoice-test-set-id-v-44/)

[## 📄️ Factura de mandato

ENVIO DE FACTURA MANDATO](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-mandate-v-1/)

[## 📄️ Factura AIU (administracion, imprevistos y utilidad)

ENVIO DE FACTURA CON AIU](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-aiu-v-1/)

[## 📄️ Factura de contingencia (tipo 03)

ENVIO DE FACTURA DE CONTINGENCIA](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-contingency-test-set-id-v-1/)

[## 📄️ Factura de exportacion

ENVIO DE FACTURA DE EXPORTACION](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-export-v-1/)

[## 📄️ Factura de transporte de carga

ENVIO DE FACTURA DE TRANSPORTE](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-transport-v-1/)

---

## 08 - Generador de Eventos

Fuente: <https://manual.facturalatam.com/apidian-1/08-generador-de-eventos/>

Con este request se implementa el acuse de recibo, la aceptacion y rechazo de documento y la recepcion de
bienes.

[## 📄️ Enviar un evento desde el AttachedDocument

ENVIAR EVENTO](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-send-event-v-1/)

[## 📄️ Enviar un evento indicando el CUFE

ENVIAR EVENTO](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-send-event-data-v-1/)

[## 📄️ Cargar un documento recibido por CUFE

CARGAR UN DOCUMENTO POR CUFE](https://manual.facturalatam.com/apidian-1/post-api-load-document-by-cufe-v-1/)

---

## 09 - Planes

Fuente: <https://manual.facturalatam.com/apidian-1/09-planes/>

[## 📄️ Crear un plan

CREAR PLAN](https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-plan-v-1/)

[## 📄️ Modificar un plan

MODIFICAR PLAN](https://manual.facturalatam.com/apidian-2/put-api-ubl-2-1-plan-v-2/)

[## 📄️ Listar todos los planes

CONSULTAR PLANES](https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-plan-query-v-1/)

[## 📄️ Consultar el plan y el consumo de una empresa

INFORMACION DEL PLAN DE LA EMPRESA](https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-plan-infoplanuser-v-1/)

[## 📄️ Consultar un plan por su id

CONSULTAR UN PLAN](https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-plan-query-nit-v-1/)

[## 📄️ Listar las empresas que tienen un plan

CONSULTAR USUARIOS POR PLAN](https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-plan-queryusersbyplan-plan-id-v-1/)

[## 📄️ Asignar, renovar o cambiar el plan de una empresa

CONFIGURAR COMPAÑIA](https://manual.facturalatam.com/apidian-2/post-api-ubl-2-1-config-nit-dv-v-2/)

[## 📄️ Crear o modificar un administrador

CREAR O MODIFICAR UN ADMINISTRADOR](https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-administrator-v-1/)

[## 📄️ Consultar los administradores

CONSULTAR ADMINISTRADORES](https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-administrator-query-nit-v-1/)

[## 📄️ Listar las empresas de un administrador

CONSULTAR LAS EMPRESAS DE UN ADMINISTRADOR](https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-administrator-queryusersbyadmin-nit-v-1/)

---

## 10 - Regenerar PDFs

Fuente: <https://manual.facturalatam.com/apidian-1/10-regenerar-pd-fs/>

[## 📄️ Regenerar el PDF enviando el JSON del documento

REGENERAR EL PDF DE UN DOCUMENTO ENVIANDO EL JSON](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-regeneratepdf-v-1/)

[## 📄️ Regenerar el PDF por prefijo, numero y CUFE

REGENERAR EL PDF DE UN DOCUMENTO POR URL](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-regeneratepdf-prefijo-numero-cufe-v-1/)

[## 📄️ Listar las plantillas de PDF disponibles

LISTA DE PLANTILLAS PDF DISPONIBLES](https://manual.facturalatam.com/apidian-1/get-api-templates-v-1/)

[## 📄️ Cambiar la plantilla de PDF de la empresa

ACTUALIZAR LA PLANTILLA PDF DE LA COMPAÑIA](https://manual.facturalatam.com/apidian-1/put-api-templates-v-1/)

---

## 11 - Servicios APP

Fuente: <https://manual.facturalatam.com/apidian-1/11-servicios-app/>

grupo de servicios que consume la app movil

[## 📄️ Iniciar sesion y obtener el token

El login requiere de un usuario que se haya registrado junto a una empresa, se utiliza el correo y el numero de documento como contraseña en los primeros accesos hasta que sea modificada.](https://manual.facturalatam.com/apidian-1/post-api-login-v-1/)

[## 📄️ Listar los documentos de la empresa

Permite listar los documentos y filtrar por fecha utilizando la clave date y los valores all, current\_month, last\_month, last\_ninety, mientras que search es capaz de buscar por numero, prefijo, total, fecha especifica y algunos datos principales del cliente como nombre, correo, telefono o numero de documento, tambien cuenta con el sistema paginacion utilizando la clave page.](https://manual.facturalatam.com/apidian-2/get-api-documents-v-2/)

[## 📄️ Listar los clientes

Permite listar los clientes registrados por la empresa. La clave search busca por numero de documento o nombre, y cuenta con el sistema de paginacion utilizando la clave page.](https://manual.facturalatam.com/apidian-1/get-api-customers-v-1/)

[## 📄️ Actualizar un cliente

Permite actualizar un cliente, el numero de identificacion no es modificable ya que es unico por cliente](https://manual.facturalatam.com/apidian-1/put-api-customers-id-v-1/)

[## 📄️ Listar las resoluciones de la empresa

Permite listar las resoluciones](https://manual.facturalatam.com/apidian-1/get-api-table-resolutions-nit-v-1/)

[## 📄️ Listar los metodos de pago

Permite listar los metodos de pago disponibles (payment\_method\_id), que son los que indican el medio con el que se paga el documento: efectivo, consignacion, tarjeta de credito, etc. Devuelve el id y el nombre de cada uno.](https://manual.facturalatam.com/apidian-1/get-api-table-payment-methods-v-1/)

[## 📄️ Listar las formas de pago

Permite listar las formas de pago disponibles (payment\_form\_id), que son las que indican si el documento es de contado o a credito. Devuelve el id y el nombre de cada una.](https://manual.facturalatam.com/apidian-1/get-api-table-payment-forms-v-1/)

[## 📄️ Listar los productos

Permite listar los productos y filtrar con 'search', es capaz de buscar por codigo interno o nombre.](https://manual.facturalatam.com/apidian-1/get-api-items-v-1/)

[## 📄️ Actualizar un producto

Permite actualizar un producto, el parametro para la url es el id del mismo](https://manual.facturalatam.com/apidian-1/put-api-items-id-v-1/)

[## 📄️ Registrar un producto

Permite registrar un producto en el catalogo de la empresa. El codigo interno no se puede repetir; para modificar uno ya existente se usa el request Actualizar producto.](https://manual.facturalatam.com/apidian-1/post-api-items-add-v-1/)

[## 📄️ Descargar el PDF de un documento desde la app

Permite descargar el PDF de un documento ya emitido para mostrarlo en la app. En URL el primer parametro es el NIT de la empresa y el segundo el nombre del archivo, que se obtiene del listado de documentos.](https://manual.facturalatam.com/apidian-1/get-api-download-nit-filename-v-1/)

---

## 14 - Extractor V2

Fuente: <https://manual.facturalatam.com/apidian-1/14-extractor-v-2/>

Extractor de documentos de la DIAN, su despliegue es separado de proyecto APIDIAN

[## 📄️ Modo 1 - Extraccion completa (respuesta inmediata)

## 1. Extracción completa (todo en uno)](https://manual.facturalatam.com/apidian-1/post-api-extractor-company-stream-v-1/)

[## 📄️ Modo 2 - Iniciar la extraccion en segundo plano

## 2. Iniciar extracción (asíncrono)](https://manual.facturalatam.com/apidian-1/post-api-certificate-v-1/)

[## 📄️ Modo 3 - Consultar el avance y el resultado

## 3. Consultar avance y resultado](https://manual.facturalatam.com/apidian-1/get-api-extractor-company-jobs-job-id-v-1/)

[## 📄️ Modo 4 - Descargar el XML de un documento por CUFE

## 4. XML de un documento por CUFE](https://manual.facturalatam.com/apidian-2/post-api-ubl-2-1-xml-document-cufe-v-2/)

---

## API DIAN FacturaLatam

Fuente: <https://manual.facturalatam.com/apidian-1/api-dian-facturalatam/>

Version: 2.1.0


Documentación auto-generada desde la collection de Postman (FacturaLatam ApiDian). Para actualizarla: reemplaza postman/collection.json con el export de Postman y ejecuta `npm run api:update`.

### Authentication

* HTTP: Bearer Auth
* API Key: adminTokenAuth

|  |  |
| --- | --- |
| Security Scheme Type: | http |
| HTTP Authorization Scheme: | bearer |

Clave de administración de la plataforma (`PLATFORM_ADMIN_TOKEN` del `.env` del API). La muestra `php artisan api:admin-token`.

|  |  |
| --- | --- |
| Security Scheme Type: | apiKey |
| Header parameter name: | X-Admin-Token |

---

## Autenticacion

Fuente: <https://manual.facturalatam.com/apidian-1/autenticacion/>

Servicios de acceso y obtención de token para el consumo de apirps-docker

[## 📄️ Obtener el token del API RIPS

Requiere lso datos de acceso del usuario de Sector Salud y Nit de la empresa](https://manual.facturalatam.com/apidian-1/post-api-auth-login-sispro-v-1/)

---

## Configuracion

Fuente: <https://manual.facturalatam.com/apidian-1/configuracion/>

[## 📄️ Configurar la cuenta de WhatsApp

Para obtener su url\_whatsapp y generar su token comuniquese al WhatsApp de [FacturaLatam](https://waya.lat/sign-up)](https://manual.facturalatam.com/apidian-1/put-api-whatsapp-config-v-1/)

[## 📄️ Consultar la URL de conexion de WhatsApp

Puedes consultar tu url\_whatsapp si es que ya tiene una configurada](https://manual.facturalatam.com/apidian-1/get-api-whatsapp-config-v-1/)

---

## Consultar documentos enviados

Fuente: <https://manual.facturalatam.com/apidian-1/consultar-documentos-enviados/>

[## 📄️ Listar documentos por rango de fechas

### CONSULTA DE DOCUMENTOS POR NIT](https://manual.facturalatam.com/apidian-1/get-api-information-nit-fecha-inicial-fecha-final-v-1/)

[## 📄️ Total de documentos por rango de fechas

### TOTAL DE DOCUMENTOS POR NIT](https://manual.facturalatam.com/apidian-1/get-api-total-documents-nit-fecha-inicial-fecha-final-v-1/)

[## 📄️ Listar documentos pagina por pagina

### CONSULTA DE DOCUMENTOS POR NIT](https://manual.facturalatam.com/apidian-1/get-api-information-nit-page-page-page-v-1/)

[## 📄️ Buscar documentos con filtros

Permite listar los documentos y filtrar por fecha utilizando la clave date y los valores all, current\_month, last\_month, last\_ninety, mientras que search es capaz de buscar por numero, prefijo, total, fecha especifica y algunos datos principales del cliente como nombre, correo, telefono o numero de documento, tambien cuenta con el sistema paginacion utilizando la clave page.](https://manual.facturalatam.com/apidian-1/get-api-documents-v-1/)

---

## Contingencia tipo 4

Fuente: <https://manual.facturalatam.com/apidian-1/contingencia-tipo-4/>

[## 📄️ Enviar una factura de contingencia tipo 4

ENVIO DE FACTURA DE CONTINGENCIA TIPO 4](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-contingency-4-test-set-id-v-1/)

[## 📄️ Transmitir las facturas de contingencia pendientes

ENVIO DE LAS FACTURAS PENDIENTES DE CONTINGENCIA TIPO 4](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-contingency-4-send-pendings-test-set-id-v-1/)

[## 📄️ Crear la resolucion de contingencia tipo 4

CONFIGURAR RESOLUCION DE CONTINGENCIA TIPO 4](https://manual.facturalatam.com/apidian-16/put-api-ubl-2-1-config-resolution-v-16/)

---

## Documento soporte

Fuente: <https://manual.facturalatam.com/apidian-1/documento-soporte/>

[## 📄️ Documento soporte sencillo

PRIMER ENVIO DE DOCUMENTO SOPORTE](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-support-document-test-set-id-v-1/)

[## 📄️ Documento soporte con descuento

PRIMER ENVIO DE DOCUMENTO SOPORTE](https://manual.facturalatam.com/apidian-2/post-api-ubl-2-1-support-document-test-set-id-v-2/)

[## 📄️ Documento soporte con descuento (variante 2)

PRIMER ENVIO DE DOCUMENTO SOPORTE](https://manual.facturalatam.com/apidian-3/post-api-ubl-2-1-support-document-test-set-id-v-3/)

[## 📄️ Documento soporte a proveedor extranjero (no residente)

PRIMER ENVIO DE DOCUMENTO SOPORTE](https://manual.facturalatam.com/apidian-4/post-api-ubl-2-1-support-document-test-set-id-v-4/)

[## 📄️ Nota de ajuste de documento soporte

PRIMER ENVIO DE NOTA DE AJUSTE DE DOCUMENTO SOPORTE](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-sd-credit-note-test-set-id-v-1/)

[## 📄️ Documento soporte con impuesto

ENVIO DE DOCUMENTO SOPORTE CON IMPUESTO](https://manual.facturalatam.com/apidian-5/post-api-ubl-2-1-support-document-test-set-id-v-5/)

[## 📄️ Documento soporte exento con retencion del 11%

ENVIO DE DOCUMENTO SOPORTE CON IMPUESTO EXENTO Y RETENCION DEL 11%](https://manual.facturalatam.com/apidian-6/post-api-ubl-2-1-support-document-test-set-id-v-6/)

---

## Envio de RIPS y consulta de CUV

Fuente: <https://manual.facturalatam.com/apidian-1/envio-de-rips-y-consulta-de-cuv/>

Listado de servicios que reciben RIPS en sus diferentes formatos

[## 📄️ RIPS sin factura

RIPS sin factura](https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-rips-sin-factura-v-1/)

[## 📄️ RIPS con factura - un paciente con pago moderador

RIPS con factura](https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-fev-rips-v-1/)

[## 📄️ RIPS con factura - varios pacientes y varios pagos

RIPS con factura](https://manual.facturalatam.com/apidian-2/post-api-paquetes-fev-rips-cargar-fev-rips-v-2/)

[## 📄️ RIPS de nota credito

RIPS de una nota credito](https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-nc-v-1/)

[## 📄️ RIPS de nota credito total

RIPS de una nota credito total](https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-nc-total-v-1/)

[## 📄️ RIPS de capita inicial

RIPS de capita inicial](https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-capita-inicial-v-1/)

[## 📄️ RIPS de capita del periodo

RIPS de capita por periodo](https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-capita-periodo-v-1/)

[## 📄️ RIPS de capita final

RIPS de capita final](https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-capita-final-v-1/)

[## 📄️ RIPS de nota debito

RIPS de una nota debito](https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-nd-v-1/)

[## 📄️ RIPS de nota de ajuste

RIPS de una nota de ajuste](https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-nota-ajuste-v-1/)

[## 📄️ RIPS de nota credito por acuerdo de voluntades

RIPS de una nota credito por acuerdo de voluntades](https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-nc-acuerdo-voluntades-v-1/)

[## 📄️ Consultar el CUV de una factura

CONSULTAR UN CUV](https://manual.facturalatam.com/apidian-1/post-api-consultas-fev-rips-consultar-cuv-v-1/)

[## 📄️ Descargar los archivos del CUV

DESCARGAR LOS ARCHIVOS DE UN CUV](https://manual.facturalatam.com/apidian-1/post-api-consultas-fev-rips-descargar-archivos-fev-rips-cuv-v-1/)

[## 📄️ Recuperar el CUV de una factura ya validada

RECUPERAR UN CUV](https://manual.facturalatam.com/apidian-1/post-api-consultas-fev-rips-recuperar-cuv-v-1/)

---

## Estado del servicio

Fuente: <https://manual.facturalatam.com/apidian-1/estado-del-servicio/>

Listado de servicios que muestran detalles de la versión instalada de apirips-docker

[## 📄️ Consultar la version del API RIPS

Muestra los datos de la version actual del apirips-docker](https://manual.facturalatam.com/apidian-1/get-basic-health-v-1/)

---

## Factura de venta

Fuente: <https://manual.facturalatam.com/apidian-1/factura-de-venta/>

[## 🗃️ Restaurante

2 items](https://manual.facturalatam.com/apidian-1/restaurante/)

[## 📄️ Factura de dos lineas con una tarifa de IVA

PRIMER ENVIO DE FACTURA](https://manual.facturalatam.com/apidian-3/post-api-ubl-2-1-invoice-test-set-id-v-3/)

[## 📄️ Factura con cliente de varias responsabilidades fiscales

PRIMER ENVIO DE FACTURA](https://manual.facturalatam.com/apidian-4/post-api-ubl-2-1-invoice-test-set-id-v-4/)

[## 📄️ Factura con referencia a documento de recepcion

PRIMER ENVIO DE FACTURA](https://manual.facturalatam.com/apidian-5/post-api-ubl-2-1-invoice-test-set-id-v-5/)

[## 📄️ Factura con descuento en linea y descuento global

PRIMER ENVIO DE FACTURA](https://manual.facturalatam.com/apidian-6/post-api-ubl-2-1-invoice-test-set-id-v-6/)

[## 📄️ Factura de una linea con descuento en la linea

PRIMER ENVIO DE FACTURA](https://manual.facturalatam.com/apidian-7/post-api-ubl-2-1-invoice-test-set-id-v-7/)

[## 📄️ Factura de tres lineas con descuento en cada linea

PRIMER ENVIO DE FACTURA](https://manual.facturalatam.com/apidian-8/post-api-ubl-2-1-invoice-test-set-id-v-8/)

[## 📄️ Factura de una linea sin descuentos (la mas sencilla)

PRIMER ENVIO DE FACTURA](https://manual.facturalatam.com/apidian-9/post-api-ubl-2-1-invoice-test-set-id-v-9/)

[## 📄️ Factura a credito (forma de pago 2)

PRIMER ENVIO DE FACTURA](https://manual.facturalatam.com/apidian-10/post-api-ubl-2-1-invoice-test-set-id-v-10/)

[## 📄️ Factura con varios metodos de pago

PRIMER ENVIO DE FACTURA](https://manual.facturalatam.com/apidian-11/post-api-ubl-2-1-invoice-test-set-id-v-11/)

[## 📄️ Factura de una linea con descuento global

PRIMER ENVIO DE FACTURA](https://manual.facturalatam.com/apidian-12/post-api-ubl-2-1-invoice-test-set-id-v-12/)

[## 📄️ Factura de tres lineas con descuento global

PRIMER ENVIO DE FACTURA](https://manual.facturalatam.com/apidian-13/post-api-ubl-2-1-invoice-test-set-id-v-13/)

[## 📄️ Vista previa del PDF de la factura (sin enviar a la DIAN)

VISTA PRELIMINAR DE LA FACTURA](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-preeliminar-view-v-1/)

[## 📄️ Factura con dos tarifas de IVA y los dos tipos de descuento

PRIMER ENVIO DE FACTURA](https://manual.facturalatam.com/apidian-14/post-api-ubl-2-1-invoice-test-set-id-v-14/)

[## 📄️ Factura con dos retenciones

PRIMER ENVIO DE FACTURA](https://manual.facturalatam.com/apidian-15/post-api-ubl-2-1-invoice-test-set-id-v-15/)

---

## Buscar un cliente por tipo y numero de documento

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-customer-nit-dv-v-1/>

```
GET

### /api/customer/:nit/:dv
```

**Consulta de datos de un cliente por tipo y número de documento**

Este endpoint permite consultar la información de un cliente utilizando el tipo de documento y el número de documento.

**URL de uso:**  
`http://[DOMINIO]/api/customer/[ID_TIPO_DOCUMENTO]/[NUMERO_DOCUMENTO]`

* **ID\_TIPO\_DOCUMENTO:** Código del tipo de documento (ver tabla abajo).
* **NUMERO\_DOCUMENTO:** Número del documento del cliente.

**Ejemplo:**  
`http://midominio.com/api/customer/13/123456789`

**Nota:**

* si su sistema esta en entorno de pruebas puede utilizar los numeros facilitados por el servicio que se encuentran en <https://www.dian.gov.co/impuestos/factura-electronica/Documents/Guia-Herramienta-para-el-Consumo-de-Web-Services.pdf>

**Códigos de tipo de documento:**

* ID de tipo de documento

| ID | Nombre |
| --- | --- |
| 11 | Registro civil |
| 12 | Tarjeta de identidad |
| 13 | Cédula de ciudadanía |
| 21 | Tarjeta de extranjería |
| 22 | Cédula de extranjería |
| 31 | NIT |
| 41 | Pasaporte |
| 42 | Documento de identificación extranjero |
| 47 | PEP (Permiso Especial de Permanencia) |
| 48 | PPT (Permiso Protección Temporal) |
| 50 | NIT de otro país |
| 91 | NUIP |

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

404

---

## Listar los clientes

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-customers-v-1/>

```
GET

### /api/customers
```

Permite listar los clientes registrados por la empresa. La clave search busca por numero de documento o nombre, y cuenta con el sistema de paginacion utilizando la clave page.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Lista Clientes

---

## Buscar documentos con filtros

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-documents-v-1/>

```
GET

### /api/documents
```

Permite listar los documentos y filtrar por fecha utilizando la clave date y los valores all, current\_month, last\_month, last\_ninety, mientras que search es capaz de buscar por numero, prefijo, total, fecha especifica y algunos datos principales del cliente como nombre, correo, telefono o numero de documento, tambien cuenta con el sistema paginacion utilizando la clave page.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200
* 401

Success

Unauthorized

---

## Descargar el PDF de un documento desde la app

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-download-nit-filename-v-1/>

```
GET

### /api/download/:nit/:filename
```

Permite descargar el PDF de un documento ya emitido para mostrarlo en la app. En URL el primer parametro es el NIT de la empresa y el segundo el nombre del archivo, que se obtiene del listado de documentos.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |

### Responses

* 200

Successful response

---

## Modo 3 - Consultar el avance y el resultado

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-extractor-company-jobs-job-id-v-1/>

```
GET

### /api/extractor/company/jobs/:job_id
```

## 3. Consultar avance y resultado

```
GET {{base_url}}/api/extractor/company/jobs/{{job_id}}
```

Se consulta por **polling** hasta que `status` sea `done` o `error`.

#### Headers

```
Authorization: Bearer {{token}}
```

#### Respuesta — en proceso

```
{  
  "success": true,  
  "status": "running",  
  "stage": "enriching",  
  "total": 9,  
  "processed": 5,  
  "log": [  
    "🟢 CUFEs obtenidos: 9. Consultando la DIAN por cada uno…",  
    "⬇️ Procesados 5/9 documento(s)…"  
  ]  
}
```

#### Respuesta — terminado

```
{  
  "success": true,  
  "status": "done",  
  "stage": "done",  
  "total": 9,  
  "processed": 9,  
  "log": ["...", "✅ Proceso terminado"],  
  "data": [ ... ]  
}
```

#### Campos de estado

| Campo | Valores |
| --- | --- |
| `status` | `running` · `done` · `error` |
| `stage` | `getting_cufes` → `enriching` → `done` (o `error`) |
| `total` | CUFEs encontrados en el rango |
| `processed` | CUFEs ya consultados en la DIAN |

#### Notas

* 🔁 **Cada consulta hace avanzar el proceso** (procesa 5 documentos por llamada).  
  Sin polling, el job no progresa. **Consultar cada 3–5 segundos.**
* `404` si el job no existe, expiró (2 h) o pertenece a otra empresa.
* Con `status: "error"` viene además el campo `message`.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Respuesta — en proceso

---

## Listar documentos por rango de fechas

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-information-nit-fecha-inicial-fecha-final-v-1/>

```
GET

### /api/information/:nit/:fechaInicial/:fechaFinal
```

### CONSULTA DE DOCUMENTOS POR NIT

Este endpoint permite consultar los documentos asociados a un NIT (identificación de empresa) en diferentes rangos de fechas y paginación.

#### Endpoints disponibles

* Consultar todos los documentos por NIT:  
  /api/information/{nit}

  Retorna todos los documentos del NIT especificado.
* Consultar documentos por NIT y fecha específica:  
  /api/information/{nit}/{desde}

  Retorna los documentos del NIT en la fecha `{desde}`.
* Consultar documentos por NIT y rango de fechas:  
  /api/information/{nit}/{desde}/{hasta}

  Retorna los documentos del NIT entre las fechas `{desde}` y `{hasta}`.
* Consultar documentos por NIT y paginación:  
  /api/information/{nit}/page/{page}/page

  Retorna los documentos del NIT en la página `{page}` (100 documentos por página).

#### Parámetros

* `nit`: Número de identificación tributaria de la empresa.
* `desde`: Fecha inicial en formato `YYYY-MM-DD` (opcional).
* `hasta`: Fecha final en formato `YYYY-MM-DD` (opcional).
* `page`: Número de página para paginación (opcional).

#### Respuesta

La respuesta incluye:

* `success`: Indica si la consulta fue exitosa.
* `message`: Mensaje descriptivo.
* `data`: Listado de documentos agrupados por tipo (Factura, Nota Crédito, Nota Débito, POS).
* `company`: Nombre de la empresa.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Listar documentos pagina por pagina

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-information-nit-page-page-page-v-1/>

```
GET

### /api/information/:nit/page/:page/page
```

### CONSULTA DE DOCUMENTOS POR NIT

Este endpoint permite consultar los documentos asociados a un NIT (identificación de empresa) en diferentes rangos de fechas y paginación.

#### Endpoints disponibles

* Consultar todos los documentos por NIT:  
  /api/information/{nit}

  Retorna todos los documentos del NIT especificado.
* Consultar documentos por NIT y fecha específica:  
  /api/information/{nit}/{desde}

  Retorna los documentos del NIT en la fecha `{desde}`.
* Consultar documentos por NIT y rango de fechas:  
  /api/information/{nit}/{desde}/{hasta}

  Retorna los documentos del NIT entre las fechas `{desde}` y `{hasta}`.
* Consultar documentos por NIT y paginación:  
  /api/information/{nit}/page/{page}/page

  Retorna los documentos del NIT en la página `{page}` (100 documentos por página).

#### Parámetros

* `nit`: Número de identificación tributaria de la empresa.
* `desde`: Fecha inicial en formato `YYYY-MM-DD` (opcional).
* `hasta`: Fecha final en formato `YYYY-MM-DD` (opcional).
* `page`: Número de página para paginación (opcional).

#### Respuesta

La respuesta incluye:

* `success`: Indica si la consulta fue exitosa.
* `message`: Mensaje descriptivo.
* `data`: Listado de documentos agrupados por tipo (Factura, Nota Crédito, Nota Débito, POS).
* `company`: Nombre de la empresa.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Descargar el PDF de un documento

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-invoice-nit-filename-v-1/>

```
GET

### /api/invoice/:nit/:filename
```

**Descargar PDF de un documento electrónico**

Este endpoint permite descargar el archivo PDF de un documento electrónico de una empresa, utilizando el NIT y el nombre del archivo.

**URL:**  
`GET /api/invoice/{identification}/{filename}`

* **identification:** NIT de la empresa.
* **filename:** Nombre del archivo PDF a descargar (ejemplo: `FES-SETP990000650.pdf`).

**Parámetros en la URL:**

* `identification`: NIT de la empresa.
* `filename`: Nombre del archivo PDF.

**Respuesta:**

* Si el archivo existe, retorna el PDF como descarga directa (stream).

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Listar los productos

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-items-v-1/>

```
GET

### /api/items
```

Permite listar los productos y filtrar con 'search', es capaz de buscar por codigo interno o nombre.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

200

---

## Descargar un documento recibido

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-receivedfile-nit-filename-v-1/>

```
GET

### /api/receivedfile/:nit/:filename
```

**Descargar archivo recibido de la empresa**

Este endpoint permite descargar archivos recibidos (por ejemplo, XML, PDF, ZIP) asociados a una empresa, utilizando el NIT y el nombre del archivo.

**URL:**  
`GET /api/receivedfile/{identification}/{filename}`

* **identification:** NIT de la empresa.
* **filename:** Nombre del archivo recibido a descargar (ejemplo: `ad090011631902722219520220419145805646.xml`).

**Autenticación:**  
Requiere el `api_token` del usuario dueño de la empresa, en la cabecera `Authorization: Bearer SU_TOKEN` o como `?api_token=SU_TOKEN`. Sin token responde `401`; con el token de otra empresa, `403`.

**Parámetros en la URL:**

* `identification` (string): NIT de la empresa.
* `filename` (string): Nombre del archivo recibido.

**Respuesta:**

* Si el archivo existe, retorna el archivo como descarga directa (stream).
* Si el archivo no existe, retorna un mensaje de error en formato JSON.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Listar las formas de pago

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-table-payment-forms-v-1/>

```
GET

### /api/table/payment-forms
```

Permite listar las formas de pago disponibles (payment\_form\_id), que son las que indican si el documento es de contado o a credito. Devuelve el id y el nombre de cada una.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Success

---

## Listar los metodos de pago

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-table-payment-methods-v-1/>

```
GET

### /api/table/payment-methods
```

Permite listar los metodos de pago disponibles (payment\_method\_id), que son los que indican el medio con el que se paga el documento: efectivo, consignacion, tarjeta de credito, etc. Devuelve el id y el nombre de cada uno.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Success

---

## Listar las resoluciones de la empresa

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-table-resolutions-nit-v-1/>

```
GET

### /api/table/resolutions/:nit
```

Permite listar las resoluciones  
\* obtiene las resoluciones dependiendo del entorno en el que esta la compañia  
\* permite filtrar por tipo de documento, ver ejemplo de respuesta 2

Tipos de documento

| **id** | **nombre** |
| --- | --- |
| 1 | Factura electronica |
| 4 | Nota de credito |
| 5 | Nota de debito |
| 9 | Nomina |

> si no lista las resoluciones del entorno actual, debe consumir el servicio de configuracion de resolucion para que se establezca la relacion del entorno de la empresa con la resolucion

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

200

---

## Listar las plantillas de PDF disponibles

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-templates-v-1/>

```
GET

### /api/templates
```

LISTA DE PLANTILLAS PDF DISPONIBLES

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/templates>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* No requiere cuerpo. Acepta el parametro de consulta type, que indica el tipo de documento: factura, pos (documento equivalente), soporte (documento soporte) o nomina. Tambien se aceptan los alias en ingles invoice, eqdocs, support-document y payroll. Si no se envia type se asume factura.
* Devuelve las plantillas de representacion grafica que trae la API para ese tipo y la que tiene asignada la empresa. Para ver las de los demas tipos hay que llamar .../templates?type=pos, ?type=soporte o ?type=nomina.
* Para cambiarla se usa el request Actualizar la plantilla de la compañia.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Lista de Plantillas PDF disponibles

---

## Total de documentos por rango de fechas

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-total-documents-nit-fecha-inicial-fecha-final-v-1/>

```
GET

### /api/total_documents/:nit/:fechaInicial/:fechaFinal
```

### TOTAL DE DOCUMENTOS POR NIT

Este endpoint permite consultar el total de documentos emitidos por una empresa (NIT), agrupados por tipo de documento y en rangos de fechas.

#### Endpoints disponibles

* GET /api/total\_documents/{nit}
* GET /api/total\_documents/{nit}/{desde}
* GET /api/total\_documents/{nit}/{desde}/{hasta}

**Descripción:**  
Retorna el total de cada tipo de documento (Factura, Nota Crédito, Nota Débito, Nómina, Documento Soporte, POS, etc.) emitido por el NIT especificado, en el rango de fechas solicitado.

**Parámetros:**

* `nit`: Número de identificación tributaria de la empresa.
* `desde`: Fecha inicial en formato `YYYY-MM-DD` (opcional).
* `hasta`: Fecha final en formato `YYYY-MM-DD` (opcional).

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Consultar los administradores

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-administrator-query-nit-v-1/>

```
GET

### /api/ubl2.1/administrator/query/:nit
```

CONSULTAR ADMINISTRADORES

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/administrator/query/900123456>

* Requiere el header X-Admin-Token con la clave de administracion de la instalacion (PLATFORM\_ADMIN\_TOKEN del .env, la crea php artisan api:admin-token). Solo lo usa quien administra la plataforma: no se debe exponer a los clientes.
* En URL el ultimo parametro es el NIT del administrador y es opcional: sin el devuelve todos los administradores registrados.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `X-Admin-Token` | `<SU_CLAVE_DE_ADMINISTRACION>` |

### Responses

* 200

Successful response

---

## Listar las empresas de un administrador

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-administrator-queryusersbyadmin-nit-v-1/>

```
GET

### /api/ubl2.1/administrator/queryusersbyadmin/:nit
```

CONSULTAR LAS EMPRESAS DE UN ADMINISTRADOR

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/administrator/queryusersbyadmin/900123456>

* Requiere el header X-Admin-Token con la clave de administracion de la instalacion (PLATFORM\_ADMIN\_TOKEN del .env, la crea php artisan api:admin-token). Solo lo usa quien administra la plataforma: no se debe exponer a los clientes.
* En URL el ultimo parametro es el NIT del administrador.
* Devuelve los usuarios (empresas) registrados a ese administrador.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `X-Admin-Token` | `<SU_CLAVE_DE_ADMINISTRACION>` |

### Responses

* 200

Successful response

---

## Listar los certificados cargados de una empresa

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-certificates-listing-nit-v-1/>

```
GET

### /api/ubl2.1/certificates-listing/:nit
```

### LISTADO DE CERTIFICADOS DIGITALES

Estos endpoints permiten consultar los certificados digitales registrados en la API, ya sea de todas las empresas o de una empresa específica.

**Autenticación:**  
Requiere un token de autorización (`API_TOKEN`).  
Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravió, se cambia con el comando `php artisan api:rotate-token {nit}` o con `PUT /api/ubl2.1/config/rotate-token/{nit}` usando el header `X-Admin-Token`.

**Parámetros en la URL:**

* `company_identification_number` (opcional): NIT de la empresa para filtrar los certificados.

**Notas:**

* Si no se envía el parámetro, retorna todos los certificados disponibles.
* Si se envía el NIT, retorna solo los certificados de esa empresa.
* No requiere campos JSON en el body.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Consultar los datos de una empresa

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-config-query-nit-v-1/>

```
GET

### /api/ubl2.1/config/query/:nit
```

CONSULTAR UNA EMPRESA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/query/89008003>

* Requiere el header X-Admin-Token con la clave de administracion de la instalacion (PLATFORM\_ADMIN\_TOKEN del .env, la crea php artisan api:admin-token). Solo responde sin esa clave mientras la instalacion tenga ALLOW\_PUBLIC\_API\_REGISTER=true, que es un modo temporal.
* En URL el ultimo parametro es el NIT de la empresa.
* Devuelve los datos de la empresa, su plan y los datos del certificado digital cargado, con su fecha de vencimiento. No devuelve el api\_token: ese se entrega al crear la empresa y se cambia con PUT /api/ubl2.1/config/rotate-token/{nit}.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `X-Admin-Token` | `<SU_CLAVE_DE_ADMINISTRACION>` |

### Responses

* 200

Successful response

---

## Descargar un archivo del documento (XML, PDF o ZIP)

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-download-nit-filename-base-64-v-1/>

```
GET

### /api/ubl2.1/download/:nit/:filename/BASE64
```

**Descarga de archivos de documentos electrónicos**

Este endpoint permite descargar archivos asociados a documentos electrónicos de una empresa, como PDFs, XMLs o ZIPs.  
Se puede obtener el archivo directamente o en formato base64.

**URL:**  
`GET /api/ubl2.1/download/{identification}/{file}/{type_response?}`

* **identification:** Número de identificación de la empresa.
* **file:** Nombre del archivo a descargar (ejemplo: `Attachment-SETP990000399.xml`).
* **type\_response (opcional):** Si se envía el valor `BASE64`, el archivo se retorna en base64; si se omite, se descarga el archivo directamente.

**Autenticación:**  
Requiere token de autorización en el header:  
`Authorization: Bearer {API_TOKEN}`

**Parámetros:**

* En la URL:

  + `identification`: Identificación de la empresa.
  + `file` (string): Nombre del archivo.
  + `type_response` (opcional): Si es `BASE64`, retorna el archivo en base64.

**Respuesta:**

* Si el archivo existe, retorna el archivo solicitado (descarga directa o base64).
* Si no existe, retorna un mensaje de error.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Consultar los parametros de correo de la empresa

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-emailconfig-v-1/>

```
GET

### /api/ubl2.1/emailconfig
```

**Consulta de configuración de correo electrónico**

Este endpoint permite obtener la configuración de envío de correo electrónico asociada a la empresa autenticada mediante el token de acceso.  
Primero busca la configuración personalizada en la base de datos del usuario (empresa).  
Si no existe configuración personalizada, retorna la configuración general definida en el archivo [.env](https://null) y muestra un mensaje indicando que se está usando la configuración por defecto.

**URL:**  
`GET /api/ubl2.1/emailconfig`

**Autenticación:**  
Requiere token de autorización en el header:  
`Authorization: Bearer {API_TOKEN}`

**Parámetros:**  
No requiere parámetros en la URL ni en el body.

**Respuesta:**

* Si la empresa tiene configuración personalizada, retorna esos datos (host, puerto, usuario, encriptación, etc.).
* Si no tiene configuración personalizada, retorna la configuración general y un mensaje informativo.
* La contraseña siempre se oculta por seguridad.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |

### Responses

* 200

Successful response

---

## Consultar el ultimo consecutivo por tipo de documento

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-invoice-current-number-nit-v-1/>

```
GET

### /api/ubl2.1/invoice/current_number/:nit
```

### CONSULTAR EL ÚLTIMO NÚMERO DE DOCUMENTO

Este endpoint permite consultar el siguiente número consecutivo disponible para un tipo de documento específico de la empresa.

#### Endpoint

```
GET /api/ubl2.1/invoice/current_number/{type}/{prefix?}/{ignore_state_document_id?}
```

**Parámetros:**

* `type`: ID del tipo de documento (ver tabla `type_documents` en la base de datos).
* `prefix` (opcional): Prefijo de la resolución (ejemplo: 'FES', 'NC', etc.).
* `ignore_state_document_id` (opcional): Si es `true`, ignora el estado del documento para calcular el consecutivo.

**Autenticación:**  
Requiere un token de autorización (`API_TOKEN`).  
Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravió, se cambia con el comando `php artisan api:rotate-token {nit}` o con `PUT /api/ubl2.1/config/rotate-token/{nit}` usando el header `X-Admin-Token`.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Consultar la razon social por NIT

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-name-by-nit-nit-v-1/>

```
GET

### /api/ubl2.1/name-by-nit/:nit
```

**Consulta de nombre por NIT**

Este endpoint permite obtener el nombre y la estructura básica del nombre de una empresa/persona a partir de su NIT (Número de Identificación Tributaria).

**URL:**  
`GET /api/ubl2.1/name-by-nit/{nit}`

* **nit:** Número de identificación tributaria de la empresa o persona.

**Autenticación:**  
Requiere token de autorización en el header:  
`Authorization: Bearer {API_TOKEN}`

**Parámetros:**

* En la URL:

  + `nit`: NIT de la empresa/persona a consultar.

**Respuesta:**

* Si encuentra el NIT, retorna la estructura del nombre (primer nombre, otros nombres, primer apellido, segundo apellido).
* Si no lo encuentra, retorna un mensaje de error.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Consultar el plan y el consumo de una empresa

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-plan-infoplanuser-v-1/>

```
GET

### /api/ubl2.1/plan/infoplanuser
```

INFORMACION DEL PLAN DE LA EMPRESA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/plan/infoplanuser>

* Requiere el token de la empresa, el mismo que fue devuelto al realizar el Paso 1 - Config Company.
* Este endpoint no tiene parametros en la URL: devuelve el plan asignado a la empresa dueña del token, su fecha de vencimiento y los documentos consumidos frente a los disponibles.
* Es el request que debe usar el cliente para saber cuantos documentos le quedan.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Consultar un plan por su id

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-plan-query-nit-v-1/>

```
GET

### /api/ubl2.1/plan/query/:nit
```

CONSULTAR UN PLAN

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/plan/query/1>

* Este endpoint no esta autenticado, por lo que solo lo debe usar el administrador de la API: no se debe exponer a los clientes.
* En URL el ultimo parametro corresponde al id del plan que se quiere consultar.
* Devuelve los datos de ese plan: nombre, cupos por tipo de documento, periodo y estado.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `X-Admin-Token` | `<SU_CLAVE_DE_ADMINISTRACION>` |

### Responses

* 200

Successful response

---

## Listar todos los planes

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-plan-query-v-1/>

```
GET

### /api/ubl2.1/plan/query
```

CONSULTAR PLANES

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/plan/query>

* Este endpoint no esta autenticado, por lo que solo lo debe usar el administrador de la API: no se debe exponer a los clientes.
* Sin parametros en la URL devuelve el listado de todos los planes registrados con sus cupos por tipo de documento, el periodo y el estado.
* Para consultar uno solo se agrega su id al final de la ruta, como en el request Consultar Plan.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `X-Admin-Token` | `<SU_CLAVE_DE_ADMINISTRACION>` |

### Responses

* 200

Successful response

---

## Listar las empresas que tienen un plan

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-plan-queryusersbyplan-plan-id-v-1/>

```
GET

### /api/ubl2.1/plan/queryusersbyplan/:planId
```

CONSULTAR USUARIOS POR PLAN

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/plan/queryusersbyplan/1>

* Este endpoint no esta autenticado, por lo que solo lo debe usar el administrador de la API: no se debe exponer a los clientes.
* En URL el ultimo parametro corresponde al id del plan.
* Devuelve las empresas que tienen asignado ese plan, con su NIT, razon social y el estado de su suscripcion.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `X-Admin-Token` | `<SU_CLAVE_DE_ADMINISTRACION>` |

### Responses

* 200

Successful response

---

## Consultar los datos de una empresa por NIT

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-ubl-2-1-search-company-nit-v-1/>

```
GET

### /api/ubl2.1/SearchCompany/:nit
```

**Consulta de información de empresa por NIT**

Este endpoint permite obtener información básica de una empresa consultando por su NIT (Número de Identificación Tributaria).  
La consulta se realiza en fuentes externas y retorna datos como nombre, tipo, dirección, estado y actividad de la empresa.

**URL:**  
`GET /api/ubl2.1/SearchCompany/{nit}`

* **nit:** Número de identificación tributaria de la empresa.

**Autenticación:**  
Requiere token de autorización en el header:  
`Authorization: Bearer {API_TOKEN}`

**Parámetros:**

* En la URL:

  + `nit`: NIT de la empresa a consultar.

**Respuesta:**

* Si encuentra el NIT, retorna información relevante de la empresa.
* Si no lo encuentra, retorna un mensaje de error.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Consultar la URL de conexion de WhatsApp

Fuente: <https://manual.facturalatam.com/apidian-1/get-api-whatsapp-config-v-1/>

```
GET

### /api/whatsapp-config
```

Puedes consultar tu url\_whatsapp si es que ya tiene una configurada

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Consultar la version del API RIPS

Fuente: <https://manual.facturalatam.com/apidian-1/get-basic-health-v-1/>

```
GET

### /BasicHealth
```

Muestra los datos de la version actual del apirips-docker

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `text/plain` |

### Responses

* 200

200

---

## Mensajes

Fuente: <https://manual.facturalatam.com/apidian-1/mensajes/>

[## 📄️ Enviar un mensaje de texto por WhatsApp

Permite enviar un mensaje de texto por WhatsApp al numero indicado en el campo number, sin adjuntar ningun documento. Requiere tener configurada la url\_whatsapp con el request Configurar WhatsApp.](https://manual.facturalatam.com/apidian-1/post-api-whatsapp-config-send-message-v-1/)

---

## Nomina electronica

Fuente: <https://manual.facturalatam.com/apidian-1/nomina-electronica/>

[## 📄️ Nomina individual

PRIMER ENVIO DE NOMINA ELECTRONICA](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-payroll-test-set-id-v-1/)

[## 📄️ Nota de ajuste de nomina - Reemplazar

PRIMER ENVIO DE NOMINA DE AJUSTE](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-payroll-adjust-note-test-set-id-v-1/)

[## 📄️ Nota de ajuste de nomina - Eliminar

PRIMER ENVIO DE NOMINA DE AJUSTE](https://manual.facturalatam.com/apidian-2/post-api-ubl-2-1-payroll-adjust-note-test-set-id-v-2/)

---

## Nota credito

Fuente: <https://manual.facturalatam.com/apidian-1/nota-credito/>

[## 📄️ Nota credito de una linea sin descuentos

PRIMER ENVIO DE NOTA CREDITO](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-credit-note-test-set-id-v-1/)

[## 📄️ Nota credito con descuento global

PRIMER ENVIO DE NOTA CREDITO](https://manual.facturalatam.com/apidian-2/post-api-ubl-2-1-credit-note-test-set-id-v-2/)

[## 📄️ Nota credito con descuento en la linea

PRIMER ENVIO DE NOTA CREDITO](https://manual.facturalatam.com/apidian-3/post-api-ubl-2-1-credit-note-test-set-id-v-3/)

[## 📄️ Nota credito sin referencia a factura

PRIMER ENVIO DE NOTA CREDITO](https://manual.facturalatam.com/apidian-4/post-api-ubl-2-1-credit-note-test-set-id-v-4/)

---

## Nota debito

Fuente: <https://manual.facturalatam.com/apidian-1/nota-debito/>

[## 📄️ Nota debito de una linea sin descuentos

PRIMER ENVIO DE NOTA DEBITO](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-debit-note-test-set-id-v-1/)

[## 📄️ Nota debito con descuento global

PRIMER ENVIO DE NOTA DEBITO](https://manual.facturalatam.com/apidian-2/post-api-ubl-2-1-debit-note-test-set-id-v-2/)

[## 📄️ Nota debito con descuento en la linea

PRIMER ENVIO DE NOTA DEBITO](https://manual.facturalatam.com/apidian-3/post-api-ubl-2-1-debit-note-test-set-id-v-3/)

[## 📄️ Nota debito sin referencia a factura

PRIMER ENVIO DE NOTA DEBITO](https://manual.facturalatam.com/apidian-4/post-api-ubl-2-1-debit-note-test-set-id-v-4/)

---

## POS

Fuente: <https://manual.facturalatam.com/apidian-1/pos/>

[## 📄️ Documento equivalente POS de una linea

PRIMER ENVIO DE DOCUMENTO EQUIVALENTE POS](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-eqdoc-test-set-id-v-1/)

[## 📄️ Documento equivalente POS con impuesto al consumo (INC)

PRIMER ENVIO DE DOCUMENTO EQUIVALENTE POS](https://manual.facturalatam.com/apidian-2/post-api-ubl-2-1-eqdoc-test-set-id-v-2/)

[## 📄️ Documento equivalente POS de una linea (variante 2)

PRIMER ENVIO DE DOCUMENTO EQUIVALENTE POS](https://manual.facturalatam.com/apidian-3/post-api-ubl-2-1-eqdoc-test-set-id-v-3/)

[## 📄️ Documento equivalente POS con impuesto a las bolsas

ENVIO DE DOCUMENTO EQUIVALENTE POS CON IMPUESTO A LA BOLSA](https://manual.facturalatam.com/apidian-4/post-api-ubl-2-1-eqdoc-test-set-id-v-4/)

---

## Obtener el token del API RIPS

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-auth-login-sispro-v-1/>

```
POST

### /api/auth/LoginSISPRO
```

Requiere lso datos de acceso del usuario de Sector Salud y Nit de la empresa

```
{  
  "clave": "<string>",  
  "nit": "<string>",  
  "persona": {  
    "identificacion": {  
      "numero": "<string>",  
      "tipo": "<string>"  
    }  
  }  
  
}
```

* tabla para identificar el tipo de documento

![](https://content.pstmn.io/453e5771-c72e-40d0-992e-baa6bb81b617/aW1hZ2UucG5n)

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

### Responses

* 200

aceptado

---

## Modo 2 - Iniciar la extraccion en segundo plano

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-certificate-v-1/>

```
POST

### /api/certificate
```

## 2. Iniciar extracción (asíncrono)

```
POST {{base_url}}/api/extractor/company
```

Arranca el proceso y devuelve un `jobId` al instante. El resultado se consulta con  
el endpoint 3.

#### Headers

```
Authorization: Bearer {{token}}  
Content-Type: application/json
```

#### Body

Idéntico al endpoint 1.

```
{  
  "url": "{{dian_url}}",  
  "tipo": "Received",  
  "fechaDesde": "2026-01-01",  
  "fechaHasta": "2026-01-31"  
}
```

#### Respuesta `202`

```
{  
  "success": true,  
  "jobId": "3f2a1b8c-...",  
  "statusUrl": "https://api.tu-dominio.com/api/extractor/company/jobs/3f2a1b8c-...",  
  "message": "Extracción iniciada. Consulte statusUrl para el avance y el resultado."  
}
```

#### Script de test (guardar el `jobId`)

```
const r = pm.response.json();  
if (r.jobId) pm.collectionVariables.set("job_id", r.jobId);
```

#### Notas

* ⚠️ **Un body inválido devuelve** **`502`\*\*\*\*, no** **`422`\*\*\*\*.** Si aparece  
  `"No se pudo iniciar la extracción: ..."`, revisar primero el formato de las  
  fechas (`YYYY-MM-DD`) y el valor de `tipo`.
* El job vive **2 horas** en caché.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

success

---

## Consultar el CUV de una factura

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-consultas-fev-rips-consultar-cuv-v-1/>

```
POST

### /api/ConsultasFevRips/ConsultarCUV
```

CONSULTAR UN CUV

* consulta el estado de un paquete de RIPS ya cargado, usando el Codigo Unico de Validacion (CUV) que devolvio el servicio de carga
* el unico campo del cuerpo es "codigoUnicoValidacion"
* va al grupo ConsultasFevRips y no al de PaquetesFevRips:

.../api/ConsultasFevRips/ConsultarCUV

* usa el mismo token que los servicios de carga, el que devuelve el Login de la carpeta Auth

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

aceptado

---

## Descargar los archivos del CUV

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-consultas-fev-rips-descargar-archivos-fev-rips-cuv-v-1/>

```
POST

### /api/ConsultasFevRips/DescargarArchivosFevRipsCUV
```

DESCARGAR LOS ARCHIVOS DE UN CUV

* descarga el paquete que quedo registrado para un Codigo Unico de Validacion (CUV): el JSON de los RIPS y el XML de la factura
* el unico campo del cuerpo es "codigoUnicoValidacion"
* va al grupo ConsultasFevRips y no al de PaquetesFevRips:

.../api/ConsultasFevRips/DescargarArchivosFevRipsCUV

* usa el mismo token que los servicios de carga, el que devuelve el Login de la carpeta Auth

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

aceptado

---

## Recuperar el CUV de una factura ya validada

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-consultas-fev-rips-recuperar-cuv-v-1/>

```
POST

### /api/ConsultasFevRips/RecuperarCUV
```

RECUPERAR UN CUV

* devuelve el Codigo Unico de Validacion (CUV) de un paquete que ya fue cargado, cuando se perdio la respuesta original del servicio de carga
* el unico campo del cuerpo es "codigoUnicoValidacion"
* va al grupo ConsultasFevRips y no al de PaquetesFevRips:

.../api/ConsultasFevRips/RecuperarCUV

* usa el mismo token que los servicios de carga, el que devuelve el Login de la carpeta Auth

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

aceptado

---

## Modo 1 - Extraccion completa (respuesta inmediata)

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-extractor-company-stream-v-1/>

```
POST

### /api/extractor/company/stream
```

## 1. Extracción completa (todo en uno)

```
POST {{base_url}}/api/extractor/company/stream
```

Hace todo el proceso en una sola llamada: obtiene los CUFEs del catálogo y  
consulta el XML de cada uno. Devuelve el resultado **completo al terminar**.

#### Headers

```
Authorization: Bearer {{token}}  
Content-Type: application/json
```

#### Body

```
{  
  "url": "{{dian_url}}",  
  "tipo": "Received",  
  "fechaDesde": "2026-01-01",  
  "fechaHasta": "2026-01-31"  
}
```

#### Respuesta `200`

```
{  
  "log": [  
    "✅ Extracción iniciada",  
    "🟡 Obteniendo CUFEs del catálogo DIAN…",  
    "📄 Página 1",  
    "🟢 CUFEs obtenidos: 9. Consultando la DIAN por cada uno…",  
    "⬇️ Procesado 1/9 [ok]",  
    "⬇️ Procesado 9/9 [ok]",  
    "✅ Proceso terminado"  
  ],  
  "data": [  
    {  
      "TipoDocumento": "Invoice",  
      "CUFE": "41a77209dcc997ca657d4f858f09c93c...",  
      "Sub Total": 99495.8,  
      "Total a Pagar": 118400,  
      "TaxBreakdown": [],  
      "LineItems": []  
    }  
  ]  
}
```

> Estructura completa de `data` en la sección **Estructura de los documentos**.

#### Notas

* ⏱️ **El proceso puede tardar varios minutos.** Subir el timeout en Postman  
  (*Settings → Request timeout*). Si hay un proxy con límite de tiempo, usar los  
  endpoints 2 y 3.
* La respuesta llega **completa al final**; no es un stream en vivo.
* Si se agota la espera interna (~10 min) o no hay CUFEs en el rango, responde  
  `200` con `data: []` y el motivo en `log`.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

success

---

## Registrar un producto

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-items-add-v-1/>

```
POST

### /api/items/add
```

Permite registrar un producto en el catalogo de la empresa. El codigo interno no se puede repetir; para modificar uno ya existente se usa el request Actualizar producto.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

### Responses

* 201

Success

---

## Cargar un documento recibido por CUFE

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-load-document-by-cufe-v-1/>

```
POST

### /api/load-document-by-cufe
```

CARGAR UN DOCUMENTO POR CUFE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/load-document-by-cufe>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* Este endpoint no tiene parametros en la URL. En el cuerpo se envia el cufe de la factura y, opcionalmente, save en true para guardar el documento en el listado de documentos RADIAN (received\_documents); sin ese campo solo devuelve los datos consultados, con saved en false.
* El cuerpo de ejemplo de este request manda la clave como "saved", que la API no interpreta: el campo correcto es "save".
* No envia ningun evento a la DIAN: solo consulta el documento para poder aplicarle despues los eventos de acuse, aceptacion o rechazo.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Iniciar sesion y obtener el token

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-login-v-1/>

```
POST

### /api/login
```

El login requiere de un usuario que se haya registrado junto a una empresa, se utiliza el correo y el numero de documento como contraseña en los primeros accesos hasta que sea modificada.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

### Responses

* 200
* 401

Success

Unauthorized

---

## RIPS de capita final

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-capita-final-v-1/>

```
POST

### /api/PaquetesFevRips/CargarCapitaFinal
```

RIPS de capita final

* cierra el contrato por capitacion: reporta los ultimos servicios prestados, por lo que lleva el bloque "rips" con los usuarios atendidos
* el campo "xmlFevFile" esta relacionado con el campo "attacheddocument" de la respuesta de la factura de cierre (aceptada) en el API
* el campo "numFactura" debe contener el correlativo y numeración juntos, sin caracteres especiales

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

rechazado

---

## RIPS de capita inicial

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-capita-inicial-v-1/>

```
POST

### /api/PaquetesFevRips/CargarCapitaInicial
```

RIPS de capita inicial

* es el primer envio de un contrato por capitacion: la factura no reporta atencion de pacientes, por lo que el campo "rips" va en **null** y solo se envia el "xmlFevFile"
* el campo "xmlFevFile" esta relacionado con el campo "attacheddocument" de la respuesta de una factura (aceptada) en el API
* se puede utilizar el JSON dentro de **09 - Otros tipos de Facturas** ejemplo: \*\*"\*\*SendInvoice-TestSetId Health SS-recaudo | Capita inicial"
* los servicios efectivamente prestados se reportan despues con CargarCapitaPeriodo

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

rechazado

---

## RIPS de capita del periodo

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-capita-periodo-v-1/>

```
POST

### /api/PaquetesFevRips/CargarCapitaPeriodo
```

RIPS de capita por periodo

* reporta los servicios efectivamente prestados durante el periodo de un contrato por capitacion, por eso si lleva el bloque "rips" con los usuarios atendidos
* el campo "xmlFevFile" esta relacionado con el campo "attacheddocument" de la respuesta de una factura (aceptada) en el API
* se puede utilizar el JSON dentro de **09 - Otros tipos de Facturas** ejemplo: \*\*"\*\*SendInvoice-TestSetId Health SS-cufe| Capita Periodo"

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

rechazado

---

## RIPS con factura - un paciente con pago moderador

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-fev-rips-v-1/>

```
POST

### /api/PaquetesFevRips/CargarFevRips
```

RIPS con factura

* el campo "xmlFevFile" esta relacionado con el campo "attacheddocument" de la respuesta de una factura (aceptada) en el API

  + tambien cuenta con servicios para obtener el valor
  + si posee el zip, puede convertirlo en Base64 y añadir el string obtenido
* el campo "numFactura" debe contener el correlativo y numeración juntos, sin caracteres especiales

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

rechazado

---

## RIPS de nota credito por acuerdo de voluntades

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-nc-acuerdo-voluntades-v-1/>

```
POST

### /api/PaquetesFevRips/CargarNCAcuerdoVoluntades
```

RIPS de una nota credito por acuerdo de voluntades

* se usa cuando la nota credito corresponde a un acuerdo entre el prestador y la entidad responsable de pago, no a una correccion de los servicios
* al no cambiar los servicios reportados, el campo "rips" va en **null** y solo se envia el "xmlFevFile"
* el campo "xmlFevFile" esta relacionado con el campo "attacheddocument" de la respuesta de la nota credito (aceptada) en el API

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## RIPS de nota credito total

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-nc-total-v-1/>

```
POST

### /api/PaquetesFevRips/CargarNCTotal
```

RIPS de una nota credito total

* se usa cuando la nota credito anula la factura completa: al no quedar servicios por reportar, el campo "rips" va en **null** y solo se envia el "xmlFevFile"
* el campo "xmlFevFile" esta relacionado con el campo "attacheddocument" de la respuesta de la nota credito (aceptada) en el API

  + tambien cuenta con servicios para obtener el valor
  + si posee el zip, puede convertirlo en Base64 y añadir el string obtenido

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## RIPS de nota credito

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-nc-v-1/>

```
POST

### /api/PaquetesFevRips/CargarNC
```

RIPS de una nota credito

* se usa cuando se corrige parcialmente una factura ya validada con RIPS: se cargan solo los servicios que se ajustan
* el campo "numFactura" es el de la factura que se corrige y "numNota" el de la nota credito, ambos con correlativo y numeración juntos, sin caracteres especiales
* el campo "tipoNota" debe ser **NC**
* el campo "xmlFevFile" esta relacionado con el campo "attacheddocument" de la respuesta de la nota credito (aceptada) en el API

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 400

rechazado

---

## RIPS de nota debito

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-nd-v-1/>

```
POST

### /api/PaquetesFevRips/CargarND
```

RIPS de una nota debito

* se usa cuando la nota debito aumenta el valor de una factura ya validada con RIPS
* el campo "numFactura" es el de la factura que se corrige y "numNota" el de la nota debito, ambos con correlativo y numeración juntos, sin caracteres especiales
* el campo "tipoNota" debe ser **ND**
* el campo "xmlFevFile" esta relacionado con el campo "attacheddocument" de la respuesta de la nota debito (aceptada) en el API

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## RIPS de nota de ajuste

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-nota-ajuste-v-1/>

```
POST

### /api/PaquetesFevRips/CargarNotaAjuste
```

RIPS de una nota de ajuste

* se usa para corregir los datos de los RIPS de una factura ya validada, sin que cambie su valor
* el campo "numFactura" es el de la factura que se ajusta y "numNota" el de la nota de ajuste, ambos con correlativo y numeración juntos, sin caracteres especiales
* el campo "tipoNota" debe ser **NA**
* el campo "xmlFevFile" esta relacionado con el campo "attacheddocument" de la respuesta de la factura (aceptada) en el API

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## RIPS sin factura

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-paquetes-fev-rips-cargar-rips-sin-factura-v-1/>

```
POST

### /api/PaquetesFevRips/CargarRipsSinFactura
```

RIPS sin factura

* el json es similar a un RIPS con factura pero el acmpo "xmlFevFile" debe quedar **null**
* debe utilizar RS en el campo TipoNota haciendo referencia al documento no electrónico y su numeración (numNota)

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200
* 400

aceptado

rechazo

---

## Reenviar un documento al correo del cliente

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-send-email-customer-no-v-1/>

```
POST

### /api/send-email-customer/NO
```

### ENVIAR CORREO AL ADQUIRIENTE

Este endpoint permite enviar el documento adjunto de una factura al correo electrónico del adquiriente registrado en la base de datos.

**Parámetros en URL:**

* `ShowView` (opcional): Si se envía, retorna una vista con el resultado; si no, retorna un JSON.

**Autenticación:**  
Requiere un token de autorización (`API_TOKEN`).

**Body del request (JSON):**

* `company_idnumber`: NIT de la empresa emisora.
* `prefix`: Prefijo de la factura.
* `number`: Número de la factura.
* `smtp_parameters` (opcional): Parámetros SMTP personalizados.
* `customerEmail` (opcional): Correo alternativo del adquiriente.

**Notas:**

* El documento adjunto enviado corresponde a la factura especificada.
* Si el parámetro `ShowView` es `YES`, la respuesta será una vista HTML; si es `NO` o se omite, la respuesta será JSON.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

### Responses

* 200

Successful response

---

## Reenviar la nomina al correo del empleado

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-send-email-employee-no-v-1/>

```
POST

### /api/send-email-employee/NO
```

### ENVIAR CORREO AL EMPLEADO (NÓMINA)")

Este endpoint permite enviar el documento adjunto de la nómina al correo electrónico del empleado registrado en la base de datos.

**Autenticación:**  
Requiere un token de autorización (`API_TOKEN`).  
Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravió, se cambia con el comando `php artisan api:rotate-token {nit}` o con `PUT /api/ubl2.1/config/rotate-token/{nit}` usando el header `X-Admin-Token`.

**Body del request (JSON):**

* `company_idnumber`: NIT de la empresa emisora.
* `prefix`: Prefijo de la nómina.
* `number`: Número/consecutivo de la nómina.
* `smtp_parameters` (opcional): Parámetros SMTP personalizados.
* `email_cc_list` (opcional): Lista de correos en copia.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

### Responses

* 200

Successful response

---

## Eliminar una empresa con la clave de administracion

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-config-delete-nit-email-v-1/>

```
POST

### /api/ubl2.1/config/delete/:nit/:email
```

ELIMINAR UNA EMPRESA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/delete/89008003/correo@dominio.com>

* Requiere el header X-Admin-Token con la clave de administracion de la instalacion (PLATFORM\_ADMIN\_TOKEN del .env, la crea php artisan api:admin-token). Este endpoint siempre la exige, aunque la instalacion tenga ALLOW\_PUBLIC\_API\_REGISTER=true.
* En URL los ultimos dos parametros son el NIT de la empresa y el correo del usuario con que fue creada.
* Este endpoint no tiene cuerpo. Borra la empresa, sus documentos, sus logs y su usuario: no se puede deshacer.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `X-Admin-Token` | `<SU_CLAVE_DE_ADMINISTRACION>` |

### Responses

* 200

Successful response

---

## Paso 1 - Registrar o actualizar la empresa (NIT y datos basicos)

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-config-nit-dv-v-1/>

```
POST

### /api/ubl2.1/config/:nit/:dv
```

CONFIGURAR COMPAÑIA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/89008003/2>

* Requiere el header X-Admin-Token con la clave de administracion de la instalacion (PLATFORM\_ADMIN\_TOKEN del .env, la crea php artisan api:admin-token). Solo responde sin esa clave mientras la instalacion tenga ALLOW\_PUBLIC\_API\_REGISTER=true, que es un modo temporal.
* En URL los ultimos dos parametros son NIT y digito de verificacion de la empresa.

.../ubl2.1/config/NitEmpresa/DigitoVerificacion

* Los datos necesarios para llenar los campos JSON cuyo nombre finalice con "\_id" se encuentran en las tablas parametricas de la base de datos de la API, ejemplo:

type\_liability\_id, se debe especificar el id del registro correspondiente de la tabla type\_liabilities de la base de datos de la API.

* Devuelve un token en el response, si fue posible la creacion de la empresa, este token es una cadena alfanumerica en el campo API\_TOKEN, este dato es necesario para utilizarlo como autorizacion (header Authorization: Bearer {api\_token}) en los siguientes endpoints de la API. Guardelo: si se pierde, no se consulta en la base de datos, se cambia con php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `X-Admin-Token` | `<SU_CLAVE_DE_ADMINISTRACION>` |

### Responses

* 200
* 403

Empresa creada/actualizada

Acceso restringido

---

## Nota credito de una linea sin descuentos

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-credit-note-test-set-id-v-1/>

```
POST

### /api/ubl2.1/credit-note/:testSetId
```

PRIMER ENVIO DE NOTA CREDITO

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/credit-note>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* Requiere la resolucion de nota de credito configurada en el Paso 3 de la seccion 01B. Si la empresa tiene mas de una resolucion de nota de credito, se debe enviar el campo resolution\_number para indicar cual se utiliza.
* El bloque billing\_reference identifica la factura que se esta corrigiendo con su number, uuid (el CUFE) e issue\_date. Si la nota credito no hace referencia a una factura se omite ese bloque y se envia discrepancyresponsecode en 5.
* Los campos discrepancyresponsecode y discrepancyresponsedescription corresponden al motivo de la nota credito segun la tabla 13.2.1 de la DIAN.
* En URL el ultimo parametro corresponde al id del set de pruebas que la dian entrego al momento de registrar el modo de operacion software propio.

.../ubl2.1/credit-note/iddelsetdepruebasdeladian

* Este endpoint se puede utilizar de dos modos:

1. Asincrono:
   .../ubl2.1/credit-note/iddelsetdepruebasdeladian
2. Sincrono:
   .../ubl2.1/credit-note

* El modo sincrono no afecta al set de pruebas, pero la respuesta de la DIAN incluye posibles errores de validacion y el estado de la nota credito, valida o no valida.
* El modo asincrono, afecta el set de pruebas y en la respuesta no se incluye el resultado de la nota credito, solo se entrega un ZIP\_KEY el cual debe ser consultado mediante el endpoint:

.../ubl2.1/status/zip

de la seccion 03 - Consultas de estado para asi poder establecer si la nota credito fue valida o no y los errores de validacion.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

99

---

## Nota debito de una linea sin descuentos

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-debit-note-test-set-id-v-1/>

```
POST

### /api/ubl2.1/debit-note/:testSetId
```

PRIMER ENVIO DE NOTA DEBITO

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/debit-note>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* Requiere la resolucion de nota de debito configurada en el Paso 4 de la seccion 01B. Si la empresa tiene mas de una resolucion de nota de debito, se debe enviar el campo resolution\_number para indicar cual se utiliza.
* El bloque billing\_reference identifica la factura que se esta corrigiendo con su number, uuid (el CUFE) e issue\_date. Si la nota debito no hace referencia a una factura se omite ese bloque.
* Los campos discrepancyresponsecode y discrepancyresponsedescription corresponden al motivo de la nota debito segun la tabla 13.3.1 de la DIAN.
* En URL el ultimo parametro corresponde al id del set de pruebas que la dian entrego al momento de registrar el modo de operacion software propio.

.../ubl2.1/debit-note/iddelsetdepruebasdeladian

* Este endpoint se puede utilizar de dos modos:

1. Asincrono:
   .../ubl2.1/debit-note/iddelsetdepruebasdeladian
2. Sincrono:
   .../ubl2.1/debit-note

* El modo sincrono no afecta al set de pruebas, pero la respuesta de la DIAN incluye posibles errores de validacion y el estado de la nota debito, valida o no valida.
* El modo asincrono, afecta el set de pruebas y en la respuesta no se incluye el resultado de la nota debito, solo se entrega un ZIP\_KEY el cual debe ser consultado mediante el endpoint:

.../ubl2.1/status/zip

de la seccion 03 - Consultas de estado para asi poder establecer si la nota debito fue valida o no y los errores de validacion.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Eliminar una empresa

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-delete-company-nit-dv-v-1/>

```
POST

### /api/ubl2.1/delete/company/:nit/:dv
```

### ELIMINAR COMPAÑÍA

Este endpoint permite eliminar una empresa de la base de datos de la API. **Debe utilizarse con precaución**, ya que borra toda la información asociada a la empresa.

**Parámetros:**

* `nit`: Número de identificación tributaria de la empresa.
* `dv`: Dígito de verificación de la empresa.

**Autenticación:**  
Requiere un token de autorización (`API_TOKEN`).  
Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravió, se cambia con el comando `php artisan api:rotate-token {nit}` o con `PUT /api/ubl2.1/config/rotate-token/{nit}` usando el header `X-Admin-Token`.

**Ejemplo de uso:**

```
POST http://midominio.com/api/ubl2.1/delete/company/900123456/5
```

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Documento equivalente POS de una linea

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-eqdoc-test-set-id-v-1/>

```
POST

### /api/ubl2.1/eqdoc/:testSetId
```

PRIMER ENVIO DE DOCUMENTO EQUIVALENTE POS

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/eqdoc>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* Todos los documentos equivalentes se envian a este mismo endpoint; el tipo lo define el campo type\_document\_id. En este ejemplo es el 15, Documento equivalente electronico del tiquete de maquina registradora con sistema P.O.S.
* Requiere el software de documentos equivalentes (Paso 1 de la seccion 01E) y la resolucion POS (Paso 2 de la misma seccion).
* En URL el ultimo parametro corresponde al id del set de pruebas que la dian entrego al momento de registrar el modo de operacion software propio.

.../ubl2.1/eqdoc/iddelsetdepruebasdeladian

* Este endpoint se puede utilizar de dos modos:

1. Asincrono:
   .../ubl2.1/eqdoc/iddelsetdepruebasdeladian
2. Sincrono:
   .../ubl2.1/eqdoc

* El modo sincrono no afecta al set de pruebas, pero la respuesta de la DIAN incluye posibles errores de validacion y el estado del documento equivalente, valido o no valido.
* El modo asincrono, afecta el set de pruebas y en la respuesta no se incluye el resultado del documento equivalente, solo se entrega un ZIP\_KEY el cual debe ser consultado mediante el endpoint:

.../ubl2.1/status/zip

de la seccion 03 - Consultas de estado para asi poder establecer si el documento equivalente fue valido o no y los errores de validacion.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

99

---

## Factura AIU (administracion, imprevistos y utilidad)

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-aiu-v-1/>

```
POST

### /api/ubl2.1/invoice-aiu
```

ENVIO DE FACTURA CON AIU

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Este ejemplo ilustra como se debe utilizar la API para enviar una factura AIU, este tipo de factura tiene como caracteristica que incluye las lineas ADMINISTRACION, IMPREVISTO y UTILIDAD, pero solo se cobra impuesto sobre el campo UTILIDAD, es muy utilizada por contratistas del area de la construccion.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Transmitir las facturas de contingencia pendientes

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-contingency-4-send-pendings-test-set-id-v-1/>

```
POST

### /api/ubl2.1/invoice-contingency-4/send_pendings/:testSetId
```

ENVIO DE LAS FACTURAS PENDIENTES DE CONTINGENCIA TIPO 4

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice-contingency-4/send_pendings>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* Transmite a la DIAN las facturas de contingencia tipo 4 que quedaron pendientes de envio, una vez restablecida la conexion.
* Sin parametros en la URL envia todas las pendientes. Tambien acepta dos parametros opcionales para transmitir una sola:

.../ubl2.1/invoice-contingency-4/send\_pendings/prefijo/numero

* La respuesta devuelve un ZIP\_KEY por cada documento transmitido, que debe ser consultado mediante el endpoint:

.../ubl2.1/status/zip

de la seccion 03 - Consultas de estado.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Enviar una factura de contingencia tipo 4

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-contingency-4-test-set-id-v-1/>

```
POST

### /api/ubl2.1/invoice-contingency-4/:testSetId
```

ENVIO DE FACTURA DE CONTINGENCIA TIPO 4

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice-contingency-4>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* Es la contingencia que se utiliza cuando el facturador no tiene conexion con la DIAN: la factura se genera, se firma y se entrega al adquiriente con su CUFE, pero no se envia a la DIAN en el momento.
* Requiere la resolucion de contingencia tipo 4 configurada en el Paso 14 de esta misma carpeta.
* Este endpoint no tiene parametros en la URL y no recibe el id del set de pruebas.
* Los documentos quedan almacenados como pendientes de envio; cuando se restablece la conexion se transmiten con el request Contingencia Tipo 4 - Enviar Pendientes.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Factura de contingencia (tipo 03)

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-contingency-test-set-id-v-1/>

```
POST

### /api/ubl2.1/invoice-contingency/:testSetId
```

ENVIO DE FACTURA DE CONTINGENCIA

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Este ejemplo ilustra como se debe utilizar la API para enviar una factura de contingencia, se debe especificar los datos de la factura a la cual se hace referencia en los campos AdditionalDocumentReferenceID, AdditionalDocumentReferenceDate y AdditionalDocumentReferenceTypeDocument .

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Factura de exportacion

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-export-v-1/>

```
POST

### /api/ubl2.1/invoice-export
```

ENVIO DE FACTURA DE EXPORTACION

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Este ejemplo ilustra como se debe utilizar la API para enviar una factura de exportacion, se envia al endpoint .../ubl2.1/invoice-export y el type\_document\_id corresponde al 2.
* El bloque k\_supplement contiene los datos del certificado de embarque: responsible\_incharge (responsable del despacho), departure\_place (lugar de salida), conveyance (medio de transporte), transport\_document\_type y transport\_document\_number (tipo y numero del documento de transporte), transporter\_processor (transportador), merchandise\_origin\_country (pais de origen de la mercancia), destination (destino), payment\_means, insurance\_carrier y observations.
* El mismo bloque lleva los valores reexpresados en pesos colombianos (FctConvCop con la tasa de cambio aplicada, MonedaCop, SubTotalCop, TotalBrutoFacturaCop, TotIvaCop, MntImpCop y los demas totales Cop), tal como lo exige la DIAN para las facturas en moneda extranjera.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Factura de mandato

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-mandate-v-1/>

```
POST

### /api/ubl2.1/invoice-mandate
```

ENVIO DE FACTURA MANDATO

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Este ejemplo ilustra como se debe utilizar la API para enviar una factura tipo MANDATO, este tipo de facturas se utiliza mucho en inmobiliarias, donde el valor del arrendamiento de un bien se recibe a nombre de un tercero, este tercero se especifica en los campos agentpary y agentparty\_dv.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Vista previa del PDF de la factura (sin enviar a la DIAN)

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-preeliminar-view-v-1/>

```
POST

### /api/ubl2.1/invoice/preeliminar-view
```

VISTA PRELIMINAR DE LA FACTURA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice/preeliminar-view>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* Este endpoint no tiene parametros en la URL y no admite id del set de pruebas: no existe el modo sincrono ni el asincrono.
* Se envia el mismo JSON de la factura y la API devuelve unicamente la representacion grafica (PDF) en base64, sin firmarla, sin transmitirla a la DIAN y sin consumir consecutivo ni cupo del plan.
* Sirve para que el cliente revise como quedara la factura antes de enviarla.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Factura de restaurante con IVA e impuesto al consumo

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-test-set-id-v-1/>

```
POST

### /api/ubl2.1/invoice/:testSetId
```

PRIMER ENVIO DE FACTURA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* En URL el ultimo parametro corresponde al id del set de pruebas que la dian entrego al momento de registrar el modo de operacion software propio.

.../ubl2.1/invoice/iddelsetdepruebasdeladian

* Este endpoint se puede utilizar de dos modos:

1. Asincrono:
   .../ubl2.1/invoice/iddelsetdepruebasdeladian
2. Sincrono:
   .../ubl2.1/invoice

* El modo sincrono no afecta al set de pruebas, pero la respuesta de la DIAN incluye posibles errores de validacion y estado de la factura, valida o no valida.
* El modo asincrono, afecta el set de pruebas y en la respuesta no se incluye el resultado de la factura, solo se entrega un ZIP\_KEY el cual debe ser consultado mediante el endpoint:

.../ubl2.1/status/zip

de la seccion 03 - Consultas de estado para asi poder establecer si la factura fue valida o no y los errores de validacion.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Factura de transporte de carga

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-transport-v-1/>

```
POST

### /api/ubl2.1/invoice-transport
```

ENVIO DE FACTURA DE TRANSPORTE

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Este ejemplo ilustra como se debe utilizar la API para enviar una factura de transporte de carga, se envia al endpoint .../ubl2.1/invoice-transport y es la que deben utilizar las empresas de transporte que facturan remesas registradas en el RNDC.
* En las lineas que correspondan a una remesa del RNDC se debe enviar is\_RNDC en true junto con los campos RNDC\_consignment\_number (numero de la remesa en el RNDC), internal\_consignment\_number (numero interno de la remesa), value\_consignment (valor de la remesa), unit\_measure\_consignment\_id y quantity\_consignment (unidad de medida y cantidad de la carga).
* En las lineas que no hacen parte de una remesa se envia is\_RNDC en false y no se incluyen los campos anteriores.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Unir varios PDF en un solo archivo

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-join-pdfs-v-1/>

```
POST

### /api/ubl2.1/join-pdfs
```

**Unir varios archivos PDF en uno solo**

Este endpoint permite unir varios archivos PDF de documentos electrónicos de la empresa autenticada en un solo archivo PDF.  
El usuario debe indicar los documentos a unir y el nombre del archivo resultante.

**URL:**  
`POST /api/ubl2.1/join-pdfs`

**Autenticación:**  
Requiere token de autorización en el header:  
`Authorization: Bearer {API_TOKEN}`

**Parámetros (body JSON):**

* `pdfs`: Array de objetos con los datos de cada PDF a unir. Cada objeto debe incluir:

  + `type_document_id`: ID del tipo de documento.
  + `prefix`: Prefijo del documento.
  + `number`: Número del documento.
* `name_joined_pdfs`: Nombre del archivo PDF resultante.

**Respuesta:**

* Si la operación es exitosa, retorna el PDF unido en base64 y un mensaje de éxito.
* Si ocurre un error, retorna el mensaje de error.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Consultar el proximo consecutivo a usar

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-next-consecutive-v-1/>

```
POST

### /api/ubl2.1/next-consecutive
```

**OBTENER EL PRÓXIMO CONSECUTIVO DE DOCUMENTO**

Este endpoint permite consultar cuál será el próximo número consecutivo disponible para un tipo de documento y prefijo específico, según la resolución activa de la empresa.

**URL de uso:**  
`http://midominio.com/api/ubl2.1/next-consecutive`

**Autenticación:**  
Requiere un token de autorización (API\_TOKEN).

**Parámetros:**

* No requiere parámetros en la URL.
* Debes enviar los siguientes campos en el body (JSON):

  + `type_document_id`: ID del tipo de documento (por ejemplo, factura, nota crédito, etc.).
  + `prefix`: Prefijo de la resolución.

**Respuesta:**  
Retorna el próximo número consecutivo disponible para el tipo de documento y prefijo indicados.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Success

---

## Consultar los rangos de numeracion de la DIAN

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-numbering-range-v-1/>

```
POST

### /api/ubl2.1/numbering-range
```

CONSULTAR RANGOS DE NUMERACION

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/numbering-range>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* Este endpoint tiene no tiene parametros en la URL
* Este endpoint permite consultar los rangos de numeracion asociados a este software desde el portal de la DIAN, en su response muestra la informacion necesaria para registrar una resolucion, incluida la clave tecnica.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Nota de ajuste de nomina - Reemplazar

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-payroll-adjust-note-test-set-id-v-1/>

```
POST

### /api/ubl2.1/payroll-adjust-note/:testSetId
```

PRIMER ENVIO DE NOMINA DE AJUSTE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* En URL el ultimo parametro corresponde al id del set de pruebas que la dian entrego al momento de registrar el modo de operacion software propio.

.../ubl2.1/invoice/iddelsetdepruebasdeladian

* Este endpoint se puede utilizar de dos modos:

1. Asincrono:
   .../ubl2.1/invoice/iddelsetdepruebasdeladian
2. Sincrono:
   .../ubl2.1/invoice

* El modo sincrono no afecta al set de pruebas, pero la respuesta de la DIAN incluye posibles errores de validacion y estado de la factura, valida o no valida.
* El modo asincrono, afecta el set de pruebas y en la respuesta no se incluye el resultado de la factura, solo se entrega un ZIP\_KEY el cual debe ser consultado mediante el endpoint:

.../ubl2.1/status/zip

de la seccion 03 - Consultas de estado para asi poder establecer si la factura fue valida o no y los errores de validacion.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Nomina individual

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-payroll-test-set-id-v-1/>

```
POST

### /api/ubl2.1/payroll/:testSetId
```

PRIMER ENVIO DE NOMINA ELECTRONICA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* En URL el ultimo parametro corresponde al id del set de pruebas que la dian entrego al momento de registrar el modo de operacion software propio.

.../ubl2.1/invoice/iddelsetdepruebasdeladian

* Este endpoint se puede utilizar de dos modos:

1. Asincrono:
   .../ubl2.1/invoice/iddelsetdepruebasdeladian
2. Sincrono:
   .../ubl2.1/invoice

* El modo sincrono no afecta al set de pruebas, pero la respuesta de la DIAN incluye posibles errores de validacion y estado de la factura, valida o no valida.
* El modo asincrono, afecta el set de pruebas y en la respuesta no se incluye el resultado de la factura, solo se entrega un ZIP\_KEY el cual debe ser consultado mediante el endpoint:

.../ubl2.1/status/zip

de la seccion 03 - Consultas de estado para asi poder establecer si la factura fue valida o no y los errores de validacion.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Error 99

---

## Regenerar el AttachedDocument de un documento

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-regenerate-attached-document-v-1/>

```
POST

### /api/ubl2.1/regenerate-attached-document
```

### Endpoint: Regenerar AttachedDocument

Regenera el XML adjunto (AttachedDocument, code 89) de una factura ya validada por la DIAN, a partir de los archivos guardados (`FES-{n}.xml` + `RptaFE-{n}.xml`). No reconsulta a la DIAN ni envía correo: solo regenera y devuelve el archivo.

#### Petición

```
POST /api/ubl2.1/regenerate-attached-document
```

**Headers**

```
Authorization: Bearer {token}  
Content-Type: application/json  
Accept: application/json
```

**Body** — identificá el documento por CUFE **o** por prefijo + número:

```
{ "cufe": "a1b2c3d4e5f6..." }
```

```
{ "prefix": "SETP", "number": "990000001" }
```

Debe enviarse `cufe`, **o** la pareja `prefix` + `number`. El documento debe pertenecer a la empresa autenticada y estar validado

Respuesta de attachment en base64

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Regenerar el PDF por prefijo, numero y CUFE

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-regeneratepdf-prefijo-numero-cufe-v-1/>

```
POST

### /api/ubl2.1/regeneratepdf/:prefijo/:numero/:cufe
```

REGENERAR EL PDF DE UN DOCUMENTO POR URL

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/regeneratepdf/SETP/990000667/elcufedeldocumento>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* Vuelve a generar la representacion grafica (PDF) de un documento ya enviado a la DIAN, sin transmitirlo de nuevo y sin consumir consecutivo.
* En URL los tres parametros corresponden al prefijo, al numero y al CUFE (o CUDE / CUNE) del documento:

.../ubl2.1/regeneratepdf/prefijo/numero/cufe

* A diferencia del request anterior no requiere el JSON del documento: la API reconstruye el PDF con los datos que ya tiene almacenados.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Regenerar el PDF enviando el JSON del documento

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-regeneratepdf-v-1/>

```
POST

### /api/ubl2.1/regeneratepdf
```

REGENERAR EL PDF DE UN DOCUMENTO ENVIANDO EL JSON

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/regeneratepdf>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* Vuelve a generar la representacion grafica (PDF) de un documento ya enviado a la DIAN, sin transmitirlo de nuevo y sin consumir consecutivo.
* Este endpoint no tiene parametros en la URL: se envia el mismo JSON con el que se genero el documento, agregando el campo cufe del documento original. Si el documento no se encuentra por el cufe, se busca por los campos prefix y number del mismo JSON.
* Es util cuando se cambio la plantilla o el logo de la empresa y se necesita el PDF actualizado. Para regenerarlo sin tener el JSON a mano, use el request Regenerar Documento Con URL.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Nota de ajuste de documento soporte

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-sd-credit-note-test-set-id-v-1/>

```
POST

### /api/ubl2.1/sd-credit-note/:testSetId
```

PRIMER ENVIO DE NOTA DE AJUSTE DE DOCUMENTO SOPORTE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/sd-credit-note>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* Es la nota de ajuste que corrige un documento soporte ya emitido, por lo que requiere el software y la resolucion de NC de documento soporte configurados en la seccion 01D (Pasos 1 y 3).
* El bloque billing\_reference identifica el documento soporte que se esta ajustando con su number, uuid (el CUDS) e issue\_date.
* Como en el documento soporte, el bloque seller corresponde al proveedor del bien o servicio, no al adquiriente.
* En URL el ultimo parametro corresponde al id del set de pruebas que la dian entrego al momento de registrar el modo de operacion software propio.

.../ubl2.1/sd-credit-note/iddelsetdepruebasdeladian

* Este endpoint se puede utilizar de dos modos:

1. Asincrono:  
   .../ubl2.1/sd-credit-note/iddelsetdepruebasdeladian
2. Sincrono:  
   .../ubl2.1/sd-credit-note

* El modo sincrono no afecta al set de pruebas, pero la respuesta de la DIAN incluye posibles errores de validacion y el estado de la nota de ajuste, valida o no valida.
* El modo asincrono, afecta el set de pruebas y en la respuesta no se incluye el resultado de la nota de ajuste, solo se entrega un ZIP\_KEY el cual debe ser consultado mediante el endpoint:

.../ubl2.1/status/zip

de la seccion 03 - Consultas de estado para asi poder establecer si la nota de ajuste fue valida o no y los errores de validacion.

## Tipos de identificación del vendedor permitidos

Valores permitidos para `seller.type_document_identification_id`.

| ID | Nombre | Residente | No Residente |
| --- | --- | --- | --- |
| 4 | Tarjeta de extranjería |  | X |
| 5 | Cédula de extranjería |  | X |
| 6 | NIT | X | X |
| 7 | Pasaporte |  | X |
| 8 | Documento de identificación extranjero |  | X |
| 9 | NIT de otro país |  | X |
| 11 | PEP (Permiso Especial de Permanencia) |  | X |

> Se envía el **ID**, no el código DIAN. Cualquier otro valor es rechazado por validación.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Reenviar un documento por correo a otra direccion

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-send-email-v-1/>

```
POST

### /api/ubl2.1/send-email
```

### ENVIAR CORREO AL ADQUIRIENTE

Este endpoint permite enviar el documento adjunto de una factura al correo electrónico del adquiriente registrado en la base de datos o al correo alternativo especificado.

**Autenticación:**  
Requiere un token de autorización (`API_TOKEN`).  
Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravió, se cambia con el comando `php artisan api:rotate-token {nit}` o con `PUT /api/ubl2.1/config/rotate-token/{nit}` usando el header `X-Admin-Token`.

**Body del request (JSON):**

* `prefix`: Prefijo de la factura.
* `number`: Número de la factura.
* `alternate_email` (opcional): Correo alternativo del adquiriente.
* `base64graphicrepresentation` (opcional): PDF codificado en base64 para enviar una representación gráfica personalizada.
* `email_cc_list` (opcional): Lista de correos en copia.
* `smtp_parameters` (opcional): Parámetros SMTP personalizados.

**Notas:**

* Si no se especifica `base64graphicrepresentation`, se envía la representación gráfica por defecto.
* El correo se envía al email registrado en la base de datos o al alternativo si se indica.
* Puedes enviar copia a otros correos usando `email_cc_list`

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Enviar un evento indicando el CUFE

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-send-event-data-v-1/>

```
POST

### /api/ubl2.1/send-event-data
```

ENVIAR EVENTO

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/send-event>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* Este endpoint tiene no tiene parametros en la URL
* Este endpoint permite registrar un evento al documento especificado en el json del request, este evento puede ser ACEPTACION, RECHAZO, RECEPCION DE BIENES ó ACUSE DE RECIBO.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Enviar un evento desde el AttachedDocument

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-send-event-v-1/>

```
POST

### /api/ubl2.1/send-event
```

ENVIAR EVENTO

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/send-event>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* Este endpoint tiene no tiene parametros en la URL
* Este endpoint permite registrar un evento al documento especificado en el json del request, este evento puede ser ACEPTACION, RECHAZO, RECEPCION DE BIENES ó ACUSE DE RECIBO.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Estado de una factura por CUFE

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-status-document-cufe-v-1/>

```
POST

### /api/ubl2.1/status/document/:cufe
```

CONSULTA DE ESTADO POR CUFE, CUDE, CUNE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/status/document>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* En URL el ultimo parametro corresponde al uuid del documento que se quiere consultar, este uuid puede ser un cufe si es una factura electronica, un cude si es otro documento o un cune si es un documento de nomina.

.../ubl2.1/invoice/status/document/uuiddeldocumentoaconsultar

* El response de este endpoint muestra si el documento electronico fue valido o si fue rechazado, en cuyo caso mostrara las reglas de validacion por las cuales se rechazo.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Eventos registrados de un documento por CUFE

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-status-events-document-cufe-v-1/>

```
POST

### /api/ubl2.1/status/events-document/:cufe
```

CONSULTA DE ESTADO POR CUFE, CUDE, CUNE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/status/document>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* En URL el ultimo parametro corresponde al uuid del documento que se quiere consultar, este uuid puede ser un cufe si es una factura electronica, un cude si es otro documento o un cune si es un documento de nomina.

.../ubl2.1/invoice/status/document/uuiddeldocumentoaconsultar

* El response de este endpoint muestra si el documento electronico fue valido o si fue rechazado, en cuyo caso mostrara las reglas de validacion por las cuales se rechazo.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Estado de una factura por ZIP\_KEY

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-status-zip-zip-key-v-1/>

```
POST

### /api/ubl2.1/status/zip/:zipKey
```

CONSULTA DE ESTADO POR ZIP\_KEY

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/status/zip>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* En URL el ultimo parametro corresponde al zip\_key que el response del envio de un documento electronico en modo asincrono retorno.

.../ubl2.1/invoice/status/zip/codigodelzip\_key

* El response de este endpoint muestra si el documento electronico fue valido o si fue rechazado, en cuyo caso mostrara las reglas de validacion por las cuales se rechazo.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Documento soporte sencillo

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-support-document-test-set-id-v-1/>

```
POST

### /api/ubl2.1/support-document/:testSetId
```

PRIMER ENVIO DE DOCUMENTO SOPORTE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* En URL el ultimo parametro corresponde al id del set de pruebas que la dian entrego al momento de registrar el modo de operacion software propio.

.../ubl2.1/invoice/iddelsetdepruebasdeladian

* Este endpoint se puede utilizar de dos modos:

1. Asincrono:  
   .../ubl2.1/invoice/iddelsetdepruebasdeladian
2. Sincrono:  
   .../ubl2.1/invoice

* El modo sincrono no afecta al set de pruebas, pero la respuesta de la DIAN incluye posibles errores de validacion y estado de la factura, valida o no valida.
* El modo asincrono, afecta el set de pruebas y en la respuesta no se incluye el resultado de la factura, solo se entrega un ZIP\_KEY el cual debe ser consultado mediante el endpoint:

.../ubl2.1/status/zip

de la seccion 03 - Consultas de estado para asi poder establecer si la factura fue valida o no y los errores de validacion.

## Tipos de identificación del vendedor permitidos

Valores permitidos para `seller.type_document_identification_id`.

| ID | Nombre | Residente | No Residente |
| --- | --- | --- | --- |
| 4 | Tarjeta de extranjería |  | X |
| 5 | Cédula de extranjería |  | X |
| 6 | NIT | X | X |
| 7 | Pasaporte |  | X |
| 8 | Documento de identificación extranjero |  | X |
| 9 | NIT de otro país |  | X |
| 11 | PEP (Permiso Especial de Permanencia) |  | X |

> Se envía el **ID**, no el código DIAN. Cualquier otro valor es rechazado por validación.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Descargar el XML de un documento por CUFE

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-xml-document-cufe-v-1/>

```
POST

### /api/ubl2.1/xml/document/:cufe
```

**CONSULTA DEL XML DE UN DOCUMENTO POR CUFE**

Este endpoint permite consultar y obtener el archivo XML de un documento electrónico registrado en la DIAN, utilizando el CUFE del documento.

**URL de uso:**  
`{{url_base}}/ubl2.1/xml/document/{cufe}`

* **CUFE:** Identificador único del documento .

**Autenticación:**  
Requiere un token de autorización (API\_TOKEN).

**Parámetros en la URL:**

* CUFE.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Enviar un mensaje de texto por WhatsApp

Fuente: <https://manual.facturalatam.com/apidian-1/post-api-whatsapp-config-send-message-v-1/>

```
POST

### /api/whatsapp-config/send-message
```

Permite enviar un mensaje de texto por WhatsApp al numero indicado en el campo number, sin adjuntar ningun documento. Requiere tener configurada la url\_whatsapp con el request Configurar WhatsApp.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Actualizar un cliente

Fuente: <https://manual.facturalatam.com/apidian-1/put-api-customers-id-v-1/>

```
PUT

### /api/customers/:id
```

Permite actualizar un cliente, el numero de identificacion no es modificable ya que es unico por cliente

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

200

---

## Actualizar un producto

Fuente: <https://manual.facturalatam.com/apidian-1/put-api-items-id-v-1/>

```
PUT

### /api/items/:id
```

Permite actualizar un producto, el parametro para la url es el id del mismo

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

200

---

## Cambiar la plantilla de PDF de la empresa

Fuente: <https://manual.facturalatam.com/apidian-1/put-api-templates-v-1/>

```
PUT

### /api/templates
```

ACTUALIZAR LA PLANTILLA PDF DE LA COMPAÑIA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/templates>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* Este endpoint no tiene parametros en la URL.
* El campo type indica a que tipo de documento se le cambia la plantilla: factura, pos, soporte o nomina. Las notas credito y debito usan la misma plantilla de la factura.
* El campo id es el numero de la plantilla, de los que devuelve el request Lista de Plantillas PDF disponibles.
* El cambio aplica a los documentos que se generen desde ese momento; para rehacer el PDF de uno ya enviado se usan los request de la seccion 10 - Regenerar PDFs.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Actualizar la plantilla de la compañia

---

## Crear o modificar un administrador

Fuente: <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-administrator-v-1/>

```
PUT

### /api/ubl2.1/administrator
```

CREAR O MODIFICAR UN ADMINISTRADOR

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/administrator>

* Requiere el header X-Admin-Token con la clave de administracion de la instalacion (PLATFORM\_ADMIN\_TOKEN del .env, la crea php artisan api:admin-token). Solo lo usa quien administra la plataforma: no se debe exponer a los clientes.
* Este endpoint no tiene parametros en la URL. Se identifica el administrador por el campo identification\_number: si no existe se crea y si ya existe se actualiza.
* Los campos identification\_number, dv y plan son obligatorios. El correo (email) solo se guarda al crearlo y no puede repetirse.
* Si no se envia password la clave queda en 12345\*. El campo state activa (true) o desactiva (false) al administrador.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `X-Admin-Token` | `<SU_CLAVE_DE_ADMINISTRACION>` |

### Responses

* 200

Successful response

---

## Consultar la fecha de vencimiento del certificado

Fuente: <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-certificate-end-date-v-1/>

```
PUT

### /api/ubl2.1/certificate-end-date
```

**FECHA DE VENCIMIENTO DEL CERTIFICADO DIGITAL**

Este endpoint permite consultar la fecha de vencimiento del certificado digital asociado a la empresa autenticada.

**URL de uso:**  
`http://midominio.com/api/ubl2.1/certificate-end-date`

**Autenticación:**  
Requiere un token de autorización, obtenido en el Paso 1 - Config Company.  
Si se extravió, se cambia con el comando `php artisan api:rotate-token {nit}` o con `PUT /api/ubl2.1/config/rotate-token/{nit}` usando el header `X-Admin-Token`.

**Parámetros:**

* No requiere parámetros en la URL.
* No requiere campos JSON en el body.

**Respuesta:**  
Retorna la fecha de vencimiento del certificado digital de la empresa correspondiente al token utilizado en la autorización.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Paso 2 - Cargar el certificado digital (.p12)

Fuente: <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-certificate-v-1/>

```
PUT

### /api/ubl2.1/config/certificate
```

CONFIGURAR CERTIFICADO

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/certificate>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* Este endpoint no tiene parametros en la URL.
* El campo certificate corresponde a una cadena resultante de codificar en base 64 el archivo .pfx ó .p12 correspondiente al certificado digital PKCS10 de la empresa. Dicho certificado se puede codificar en linea en la pagina [www.base64encode.org](http://www.base64encode.org) o si lo requiere hacer desde su propio ERP, debe encontrar la libreria o funcion para realizarlo, ejemplo: En php seria mediante esta funcion.

<https://www.php.net/manual/es/function.base64-encode.php>

* El campo password corresponde a la clave que fue entregada por su proveedor de certificados cuando fue adquirido.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Cambiar entre habilitacion y produccion

Fuente: <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-environment-v-1/>

```
PUT

### /api/ubl2.1/config/environment
```

CAMBIAR AMBIENTE DE OPERACION

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/environment>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* Este endpoint tiene no tiene parametros en la URL
* Este endpoint permite cambiar el ambiente de operacion de la API para la empresa que se especifica mediante el token utilizado, el ambiente se especifica en el campo type\_environment\_id del json enviado.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Ajustar el consecutivo de un tipo de documento

Fuente: <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-generateddocuments-v-1/>

```
PUT

### /api/ubl2.1/config/generateddocuments
```

### REGISTRAR NÚMERO INICIAL DE DOCUMENTO

Este endpoint permite registrar el número inicial de un documento para una empresa, útil para configurar el primer consecutivo de facturas, nómina, soporte, etc.

**Autenticación:**  
Requiere un token de autorización (`API_TOKEN`).  
Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravió, se cambia con el comando `php artisan api:rotate-token {nit}` o con `PUT /api/ubl2.1/config/rotate-token/{nit}` usando el header `X-Admin-Token`.

**Body del request (JSON):**

* `identification_number`: NIT de la empresa.
* `type_document_id`: ID del tipo de documento (ver tabla `type_documents`).
* `prefix`: Prefijo de la resolución.
* `number`: Número inicial del documento.

**Notas:**

* Aplica para cualquier tipo de documento: factura, nómina, soporte, etc.
* Es útil para configurar el primer envío y el consecutivo inicial de la empresa.
* Para facturas AIU, se debe enviar la información correspondiente en el body, siguiendo el mismo formato.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Cargar el logo de la empresa

Fuente: <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-logo-v-1/>

```
PUT

### /api/ubl2.1/config/logo
```

### CONFIGURAR LOGO DE LA EMPRESA

Este endpoint permite registrar o actualizar el logo de la empresa en la API. El logo debe ser una imagen JPG codificada en base64.

**Autenticación:**  
Requiere un token de autorización (`API_TOKEN`).  
Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravió, se cambia con el comando `php artisan api:rotate-token {nit}` o con `PUT /api/ubl2.1/config/rotate-token/{nit}` usando el header `X-Admin-Token`.

**Body del request (JSON):**

* `logo`: Imagen JPG codificada en base64.

**Notas:**

* El logo se asocia a la empresa identificada por el token utilizado.
* Solo se acepta formato JPG codificado en base64.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Paso 3 - Crear la resolucion de nota credito

Fuente: <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-resolution-v-1/>

```
PUT

### /api/ubl2.1/config/resolution
```

CONFIGURAR RESOLUCION DE NOTAS CREDITO

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/resolution>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* Este endpoint no tiene parametros en la URL.
* Los datos necesarios para llenar los campos JSON cuyo nombre finalice con "\_id" se encuentran en las tablas parametricas de la base de datos de la API, ejemplo:

type\_liability\_id, se debe especificar el id del registro correspondiente de la tabla type\_liabilities de la base de datos de la API.

* Este endpoint es muy similar al de configurar resolucion de facturas, tanto asi que se utiliza la misma URL, se diferencia en que la resolucion de notas credito no requiere una resolucion autorizada por la DIAN, por lo tanto los datos from, to y prefix, son escogidos por nosotros mismos.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Success

---

## Cambiar el api\_token de una empresa

Fuente: <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-rotate-token-nit-v-1/>

```
PUT

### /api/ubl2.1/config/rotate-token/:nit
```

CAMBIAR EL API\_TOKEN DE UNA EMPRESA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/rotate-token/89008003>

* Requiere el header X-Admin-Token con la clave de administracion de la instalacion (PLATFORM\_ADMIN\_TOKEN del .env, la crea php artisan api:admin-token). Este endpoint siempre la exige, aunque la instalacion tenga ALLOW\_PUBLIC\_API\_REGISTER=true.
* En URL el ultimo parametro es el NIT de la empresa.
* Este endpoint no tiene cuerpo. Devuelve el token nuevo en el campo token del response: el anterior deja de funcionar de inmediato, asi que hay que cambiarlo en el sistema que integra la empresa.
* El mismo cambio se puede hacer en el servidor con el comando php artisan api:rotate-token {nit}.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Accept` | `application/json` |
| `X-Admin-Token` | `<SU_CLAVE_DE_ADMINISTRACION>` |

### Responses

* 200

Successful response

---

## Configurar el SMTP general de la instalacion

Fuente: <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-smtp-global-v-1/>

```
PUT

### /api/ubl2.1/config/smtp-global
```

CONFIGURAR EL SMTP GENERAL

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/smtp-global>

* Requiere el header X-Admin-Token con la clave de administracion de la instalacion (PLATFORM\_ADMIN\_TOKEN del .env, la crea php artisan api:admin-token). Este endpoint siempre la exige, aunque la instalacion tenga ALLOW\_PUBLIC\_API\_REGISTER=true.
* Este endpoint no tiene parametros en la URL. Escribe la configuracion en el .env del API, asi que aplica a todas las empresas que no tengan su propio SMTP.
* Los campos mail\_host, mail\_port y mail\_username son obligatorios. mail\_encryption acepta tls o ssl.
* Si mail\_password o mail\_from\_name se envian vacios se conservan los que ya tiene el .env. Si no se envia mail\_from\_address se usa mail\_username.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `X-Admin-Token` | `<SU_CLAVE_DE_ADMINISTRACION>` |

### Responses

* 200

Successful response

---

## Paso 1 - Registrar el software de facturacion

Fuente: <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-software-v-1/>

```
PUT

### /api/ubl2.1/config/software
```

CONFIGURAR SOFTWARE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/software>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* Este endpoint no tiene parametros en la URL.
* El campo id, corresponde al id de software que entrega la DIAN al momento de registrarse como facturador electronico y agregar modo de operacion software propio.
* El campo pin, corresponde al pin del software propio, este pin corresponde a un numero de 5 digitos que nosotros mismos escogimos al registrar dicho software.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Paso 1 - Registrar el software de documentos equivalentes

Fuente: <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-softwareeqdocs-v-1/>

```
PUT

### /api/ubl2.1/config/softwareeqdocs
```

CONFIGURAR SOFTWARE DE DOCUMENTOS EQUIVALENTES

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/softwareeqdocs>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* Los documentos equivalentes usan un software distinto al de la factura electronica, por eso se registra en su propio endpoint y no reemplaza el configurado en la seccion 01B.
* Un unico software cubre todos los tipos de documento equivalente (POS, transporte terrestre, servicios publicos, boleta de cine, etc.).
* Este endpoint no tiene parametros en la URL.
* El campo ideqdocs, corresponde al id de software de documentos equivalentes que entrega la DIAN al momento de habilitarse en ese servicio.
* El campo pineqdocs, corresponde al pin de ese software, un numero de 5 digitos que nosotros mismos escogimos al registrarlo.
* No se deben enviar los campos id y pin: esos corresponden al software de facturacion y lo sobrescribirian.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Paso 1 - Registrar el software de nomina electronica

Fuente: <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-softwarepayroll-v-1/>

```
PUT

### /api/ubl2.1/config/softwarepayroll
```

CONFIGURAR SOFTWARE DE NOMINA ELECTRONICA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/softwarepayroll>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* La nomina electronica usa un software distinto al de la factura electronica, por eso se registra en su propio endpoint y no reemplaza el configurado en la seccion 01B.
* Este endpoint no tiene parametros en la URL.
* El campo idpayroll, corresponde al id de software de nomina que entrega la DIAN al momento de habilitarse en el servicio de nomina electronica.
* El campo pinpayroll, corresponde al pin de ese software, un numero de 5 digitos que nosotros mismos escogimos al registrarlo.
* No se deben enviar los campos id y pin: esos corresponden al software de facturacion y lo sobrescribirian.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Paso 7 - Config-Software Payroll

---

## Paso 1 - Registrar el software de documento soporte

Fuente: <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-softwaresupportdocument-v-1/>

```
PUT

### /api/ubl2.1/config/softwaresupportdocument
```

CONFIGURAR SOFTWARE DE DOCUMENTO SOPORTE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/softwaresupportdocument>

* Requiere el token de la empresa en el header Authorization: Bearer {api\_token}. Ese token se entrega en la respuesta del Paso 1 - Config Company; si se extravio, se cambia con el comando php artisan api:rotate-token {nit} o con PUT /api/ubl2.1/config/rotate-token/{nit} usando el header X-Admin-Token.
* El documento soporte usa un software distinto al de la factura electronica, por eso se registra en su propio endpoint y no reemplaza el configurado en la seccion 01B.
* Este endpoint no tiene parametros en la URL.
* El campo idsupportdocument, corresponde al id de software de documento soporte que entrega la DIAN al momento de habilitarse en ese servicio.
* El campo pinsupportdocument, corresponde al pin de ese software, un numero de 5 digitos que nosotros mismos escogimos al registrarlo.
* No se deben enviar los campos id y pin: esos corresponden al software de facturacion y lo sobrescribirian.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Crear un plan

Fuente: <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-plan-v-1/>

```
PUT

### /api/ubl2.1/plan
```

CREAR PLAN

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/plan>

* Este endpoint no esta autenticado, por lo que solo lo debe usar el administrador de la API: no se debe exponer a los clientes.
* Este endpoint no tiene parametros en la URL. Si el id enviado no existe se crea el plan, si ya existe se actualiza.
* Los campos qty\_docs\_invoice, qty\_docs\_payroll, qty\_docs\_radian y qty\_docs\_ds son la cantidad de documentos que el plan permite por cada tipo (facturas, nominas, eventos RADIAN y documentos soporte). Los cuatro son obligatorios.
* El campo period es la vigencia del plan: 1 = MENSUAL, 2 = ANUAL, 3 = PAQUETE.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `X-Admin-Token` | `<SU_CLAVE_DE_ADMINISTRACION>` |

### Responses

* 200

Successful response

---

## Registrar o actualizar un cliente

Fuente: <https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-register-update-customer-v-1/>

```
PUT

### /api/ubl2.1/register-update-customer
```

**REGISTRAR/MODIFICAR DATOS DE UN CLIENTE**

Este endpoint permite registrar un nuevo cliente o actualizar la información de un cliente existente, como el correo electrónico o el teléfono, en la base de datos de la API.

**URL de uso:**  
Si tienes un dominio instalado, utiliza la siguiente ruta:  
`http://midominio.com/api/ubl2.1/register-update-customer`

**Autenticación:**  
Requiere un token de autorización, el cual se obtiene al realizar el Paso 1 - Config Company.  
Si se extravió, se cambia con el comando `php artisan api:rotate-token {nit}` o con `PUT /api/ubl2.1/config/rotate-token/{nit}` usando el header `X-Admin-Token`.

**Parámetros:**  
Este endpoint no requiere parámetros en la URL.  
Toda la información del cliente se envía en el cuerpo (body) de la solicitud.

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Configurar la cuenta de WhatsApp

Fuente: <https://manual.facturalatam.com/apidian-1/put-api-whatsapp-config-v-1/>

```
PUT

### /api/whatsapp-config
```

Para obtener su url\_whatsapp y generar su token comuniquese al WhatsApp de [FacturaLatam](https://waya.lat/sign-up)

### Request

#### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <TU_TOKEN>` |

### Responses

* 200

Successful response

---

## Resoluciones de notas credito y debito

Fuente: <https://manual.facturalatam.com/apidian-1/resoluciones-de-notas-credito-y-debito/>

* Servicios exclusivos para las Notas de Credito y Debito

[## 📄️ Paso 3 - Crear la resolucion de nota credito

CONFIGURAR RESOLUCION DE NOTAS CREDITO](https://manual.facturalatam.com/apidian-1/put-api-ubl-2-1-config-resolution-v-1/)

[## 📄️ Paso 4 - Crear la resolucion de nota debito

CONFIGURAR RESOLUCION DE NOTAS DEBITO](https://manual.facturalatam.com/apidian-2/put-api-ubl-2-1-config-resolution-v-2/)

---

## Restaurante

Fuente: <https://manual.facturalatam.com/apidian-1/restaurante/>

[## 📄️ Factura de restaurante con IVA e impuesto al consumo

PRIMER ENVIO DE FACTURA](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-invoice-test-set-id-v-1/)

[## 📄️ Factura de restaurante con propina como cargo

PRIMER ENVIO DE FACTURA](https://manual.facturalatam.com/apidian-2/post-api-ubl-2-1-invoice-test-set-id-v-2/)
