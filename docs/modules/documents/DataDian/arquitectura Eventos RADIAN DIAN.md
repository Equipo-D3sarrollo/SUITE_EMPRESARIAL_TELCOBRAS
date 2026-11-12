# **Plano Arquitectónico y Especificaciones de Implementación: Módulo "DataDian" y Motor "Telco"**

## **1\. Visión General del Sistema y Nomenclatura**

Este documento constituye el *Blueprint* técnico para la construcción del módulo integral de recepción de facturas y gestión de eventos RADIAN dentro de la suite empresarial. La arquitectura se divide en dos grandes componentes orquestados:

* **DataDian (Frontend/UI):** Interfaz de usuario, cuadros de mando (Dashboards) y vistas de auditoría donde los usuarios operativos interactúan con los documentos.  
* **Telco (Backend/Motor Core):** Demonio o servicio en segundo plano, encargado de toda la capa de interoperabilidad (RPA, IMAP, SOAP), criptografía (SHA-384, XAdES-EPES), cumplimiento normativo (UBL 2.1) y comunicación oficial con los servidores de la DIAN.

## **2\. Requerimientos del Sistema**

### **2.1 Requerimientos Funcionales (RF)**

* **RF1 (Ingesta Activa RPA):** Telco debe contar con un script automatizado en entorno *headless* (ej. Playwright o Selenium) que se autentique en catalogo-vpfe.dian.gov.co utilizando el certificado digital de la empresa, evadiendo así la dependencia del correo (token) del representante legal1.  
* **RF2 (Extracción de Histórico):** El bot RPA debe navegar a "Histórico" \-\> "Documentos recibidos", filtrar por fechas y descargar masivamente el listado tabular para extraer los códigos CUFE pendientes1.  
* **RF3 (Descarga Oficial API):** Telco debe consumir el Web Service SOAP GetXmlByDocumentKey de la DIAN iterando sobre los CUFEs descubiertos. Debe recibir la respuesta, la cual es un archivo ZIP codificado en Base64, decodificarlo, extraer el XML contenedor (AttachedDocument) y almacenarlo3.  
* **RF4 (Generación UBL 2.1):** Telco debe ensamblar archivos XML bajo el estándar UBL 2.1 usando el esquema ApplicationResponse para construir los eventos RADIAN5.  
* **RF5 (Cálculo CUDE):** Para cada evento generado, Telco debe calcular el Código Único de Documento Electrónico (CUDE) aplicando el algoritmo criptográfico SHA-384 sobre una cadena plana que concatena variables estrictas según el Anexo Técnico 1.98.  
* **RF6 (Firma y Transmisión):** Telco inyectará la firma XAdES-EPES y consumirá el método SOAP SendEvent inyectando credenciales WS-Security, parseando el XML de retorno para capturar los códigos 02 (Éxito) o 04 (Rechazo)10.  
* **RF7 (Jerarquía UI):** DataDian debe bloquear en la interfaz la emisión de eventos desordenados. El usuario debe seguir el flujo: 030 (Acuse), luego 032 (Recibo de Bienes), y finalmente 033 (Aceptación) o 031 (Reclamo)9.

### **2.2 Requerimientos No Funcionales (RNF)**

* **RNF1 (Seguridad SOAP):** La comunicación con los Web Services WCF de la DIAN (ej. WcfDianCustomerServices.svc) debe estar asegurada por WS-Security incluyendo BinarySecurityToken firmado con certificado X.50911.  
* **RNF2 (Tolerancia a fallos):** Telco debe usar un Message Broker (RabbitMQ / Kafka) o colas de base de datos (Redis/Celery) para el encolamiento de transmisiones SendEvent, ya que el servicio asíncrono de la DIAN puede presentar caídas.  
* **RNF3 (Control Temporal RADIAN):** El sistema debe computar internamente un plazo de exactamente 3 días hábiles tras la confirmación exitosa del evento 032\. Si se cumple este plazo, la factura habilita legalmente el evento 034 (Aceptación Tácita) por parte del proveedor, bloqueando localmente la emisión de notas débito o crédito9.

## **3\. Modelo de Datos y Entidad-Relación**

El modelo se diseña en una base de datos relacional (ej. PostgreSQL / MySQL) y garantiza el principio de inmutabilidad exigido por RADIAN (una factura no muta, se le asocian nuevos eventos).

### **3.1. Tabla: datadian\_empresa (Configuración de Tenant)**

| Columna | Tipo de Dato | Restricción | Descripción |
| :---- | :---- | :---- | :---- |
| id\_empresa | UUID | PRIMARY KEY | Identificador interno de la empresa en la suite. |
| nit | VARCHAR(15) | UNIQUE, NOT NULL | NIT sin dígito de verificación. |
| keystore\_path | VARCHAR(255) | NOT NULL | Ruta encriptada en el servidor (o S3) al archivo .p12. |
| keystore\_pwd | VARCHAR(255) | NOT NULL | Contraseña desencriptable simétricamente (AES) del certificado. |
| software\_id | VARCHAR(100) | NOT NULL | UUID del software autorizado ante la DIAN. |
| software\_pin | VARCHAR(10) | NOT NULL | PIN técnico asociado al software. |

### **3.2. Tabla: datadian\_factura (Repositorio Documental)**

| Columna | Tipo de Dato | Restricción | Descripción |
| :---- | :---- | :---- | :---- |
| cufe | VARCHAR(100) | PRIMARY KEY | Llave unívoca SHA-384 de la factura electrónica. |
| id\_empresa | UUID | FOREIGN KEY | Empresa adquirente (cliente de la suite). |
| nit\_emisor | VARCHAR(15) | NOT NULL | NIT del proveedor que generó el cobro. |
| razon\_social\_emisor | VARCHAR(200) | NOT NULL | Nombre comercial del proveedor. |
| fecha\_emision | TIMESTAMP | NOT NULL | Fecha en la que la DIAN validó la factura. |
| valor\_total | DECIMAL(18,2) | NOT NULL | Total monetario para cálculo de sumatorias. |
| xml\_base64 | TEXT | NULLABLE | Archivo original contenedor XML AttachedDocument. |

### **3.3. Tabla: datadian\_evento (Cadena de Bloques RADIAN)**

| Columna | Tipo de Dato | Restricción | Descripción |
| :---- | :---- | :---- | :---- |
| cude | VARCHAR(100) | PRIMARY KEY | Código único del evento calculado localmente o por DIAN. |
| cufe\_factura | VARCHAR(100) | FOREIGN KEY | Vinculación estricta a la tabla datadian\_factura. |
| codigo\_evento | VARCHAR(3) | NOT NULL | 030, 031, 032, 033 o 034\. |
| fecha\_evento | TIMESTAMP | NOT NULL | Fecha del registro local (Timestamp). |
| estado\_dian | VARCHAR(3) | NOT NULL | 01 (Pendiente/Cola), 02 (Éxito), 04 (Rechazado). |
| xml\_response | TEXT | NULLABLE | Respuesta ApplicationResponse nativa de la DIAN. |
| traza\_error | TEXT | NULLABLE | Mensaje de rechazo técnico legible. |

## **4\. Diagramas de Arquitectura y Flujos**

### **4.1. Flujo de Descubrimiento de Facturas (Ingesta)**

Fragmento de código  
sequenceDiagram  
    participant Cron as Telco Scheduler (Cron)  
    participant RPA as Telco RPA (Playwright)  
    participant DIAN\_Web as Portal VPFE (DIAN)  
    participant DIAN\_API as WcfDianCustomerServices  
    participant DB as DataDian DB

    Cron-\>\>RPA: Iniciar rutina de sincronización diaria  
    RPA-\>\>RPA: Cargar Certificado Digital .p12  
    RPA-\>\>DIAN\_Web: Auth TLS Handshake (Sin Captcha/Token)  
    DIAN\_Web--\>\>RPA: Establece Sesión (Cookies/JWT)  
    RPA-\>\>DIAN\_Web: Navegar "Documentos Recibidos" (Filtro Fechas)  
    DIAN\_Web--\>\>RPA: Retorna listado (Excel/JSON)  
    RPA-\>\>RPA: Extrae lista de CUFEs no existentes en DB  
    loop Por cada CUFE nuevo  
        RPA-\>\>DIAN\_API: SOAP Request: GetXmlByDocumentKey(CUFE)  
        DIAN\_API--\>\>RPA: SOAP Response: ZIP (Base64)  
        RPA-\>\>RPA: Decodificar Base64, Descomprimir, Extraer UBL  
        RPA-\>\>DB: INSERT INTO datadian\_factura  
    end

### **4.2. Flujo de Generación de Eventos RADIAN**

Fragmento de código  
sequenceDiagram  
    participant UI as DataDian Frontend  
    participant API as DataDian API (Node/Python)  
    participant Telco\_Core as Telco Engine  
    participant DIAN\_API as WS DIAN (SendEvent)  
      
    UI-\>\>API: POST /api/facturas/{cufe}/eventos (code: 030\)  
    API-\>\>API: Valida Regla Jerarquía (No existe 030 previo)  
    API-\>\>Telco\_Core: Encola tarea: Construir 030  
    Telco\_Core-\>\>Telco\_Core: Genera XML UBL 2.1 (ApplicationResponse)  
    Telco\_Core-\>\>Telco\_Core: Calcula CUDE (SHA-384)  
    Telco\_Core-\>\>Telco\_Core: Firma XAdES-EPES con Certificado .p12  
    Telco\_Core-\>\>Telco\_Core: Empaqueta en ZIP y codifica Base64  
    Telco\_Core-\>\>DIAN\_API: SOAP Request WS-Security: SendEvent(Base64)  
    DIAN\_API--\>\>Telco\_Core: SOAP Response (02 Exito o 04 Rechazo)  
    Telco\_Core-\>\>DB: Actualizar datadian\_evento (estado\_dian, xml\_response)  
    Telco\_Core--\>\>UI: WebSocket/Polling Update Status

## **5\. Especificaciones del Motor "Telco" (Backend)**

### **5.1. Construcción del Evento (XML UBL 2.1)**

El motor de generación de Telco debe poblar la plantilla de OASIS UBL 2.1.

* **Código de Evento:** Insertado en /ApplicationResponse/cbc:CustomizationID (ej. 030, 032\)14.  
* **Ambiente:** Insertado en /ApplicationResponse/cbc:ProfileExecutionID (1 para Producción, 2 para Pruebas)15.  
* **Referencia a la Factura:** Insertada en cac:DocumentReference/cbc:UUID.

### **5.2. Algoritmo Criptográfico del CUDE (RF5)**

Para lograr la inmutabilidad y correcta vinculación exigida por RADIAN, el evento requiere su identificador único. Telco debe programar una rutina que concatene como cadena de texto los siguientes datos (en estricto orden y sin espacios) y luego les aplique un *hash* unidireccional utilizando la función estándar SHA-3848:

> 1. NumFac: Número de la factura original.  
> 2. FecFac: Fecha de la factura.  
> 3. ValFac: Valor total sin impuestos.  
> 4. CodImp, ValImp (Grupos de impuestos iterados).  
> 5. ValTot: Valor total con impuestos.  
> 6. NIT del Facturador Original.  
> 7. NIT del Adquirente (Usuario de DataDian).  
> 8. NIT del Emisor del Evento (Suele ser el Adquirente para los eventos 030 al 033).  
> 9. Tipo de Evento (ej. 030).  
> 10. Software PIN (Asignado en la tabla datadian\_empresa). *Nota para Code Assistant:* Utilizar bibliotecas criptográficas nativas (crypto en Node.js, o hashlib en Python asegurando usar hashlib.sha384())8.

### **5.3. Seguridad y Mensajería SOAP (RNF1)**

Las peticiones a WcfDianCustomerServices (tanto GetXmlByDocumentKey como SendEvent) no emplean REST JSON. Son peticiones SOAP puras. El sobre (\<soap:Envelope\>) debe contener un \<soap:Header\> que implemente el estándar WS-Security de OASIS11. El asistente de código debe implementar:

> 1. **Timestamp:** Rango temporal en milisegundos de validez de la petición para evitar ataques de repetición.  
> 2. **BinarySecurityToken:** El certificado público de la empresa exportado en base6411.  
> 3. **Signature (XMLDsig):** Nodos del cuerpo SOAP firmados matemáticamente (CanonicalizationMethod y SignatureMethod) usando las llaves del almacén de claves (Keystore) configurado en la base de datos12.

## **6\. Arquitectura del Frontend "DataDian" (UI)**

El frontend (Recomendación tecnológica: React.js, Vue 3, o Angular con Tailwind CSS) debe ser diseñado bajo una perspectiva operativa e "idiot-proof" que restrinja errores comerciales graves en los que incurren frecuentemente los usuarios9.

### **6.1. Panel Principal: Bandeja de Recepción (Grid View)**

Una tabla de datos reactiva que renderiza el contenido de datadian\_factura.

* **Columnas Clave:** NIT Proveedor, Proveedor, Fecha Emisión, Total, Estado RADIAN actual (Badge de color).  
* **Filtros Globales:** Rango de Fechas (mes actual, mes anterior), Búsqueda por NIT o CUFE.

### **6.2. Vista de Detalle y Auditoría Temporal (Split View)**

Al seleccionar una factura, la pantalla se divide en dos secciones principales:

* **Panel Izquierdo (Visor Documental):** Renderiza el XML original (o un PDF generado a partir del AttachedDocument usando hojas de estilo XSLT).  
* **Panel Derecho (Línea de Tiempo RADIAN):** Renderiza el historial de eventos extraídos de la tabla datadian\_evento.

### **6.3. Interfaz de Acciones y Máquina de Estados Finita (FSM)**

La máquina de estados finita del frontend determina la habilitación o deshabilitación de botones. Un error común es permitir eventos fuera de orden, ocasionando el rechazo "Evento fuera de secuencia" por la DIAN9.

* **Estado 1 (Factura Nueva):** Solo está habilitado el botón azul **"Acuse de Recibo (030)"**.  
* **Estado 2 (030 Confirmado):** El botón 030 se oculta/bloquea y se habilita el botón naranja **"Recibo del Bien (032)"**.  
* **Estado 3 (032 Confirmado):** Se habilitan simultáneamente dos botones: un botón verde **"Aceptación Expresa (033)"** y un botón rojo **"Reclamo (031)"**.  
  * *Manejo del evento 031:* Si se pulsa Reclamo, debe abrirse un componente modal (Popup) obligando al usuario a seleccionar el concepto oficial de reclamo (ej. "Mercancía averiada") que inyectará el código exacto en el nodo ResponseCode del UBL.  
* **Estado 4 (Terminal):** Si la base de datos registra el evento 033, 031, o el paso de 3 días hábiles computados post-032 que habilita la Aceptación Tácita (034), toda la interfaz de botones desaparece o se desactiva permanentemente para prevenir la transmisión de documentos inválidos.

## **7\. Plan de Acción por Etapas (Roadmap de Ejecución)**

Se establece el siguiente orden lógico de implementación para el asistente de código:

> 1. **Etapa 1: Core de Criptografía (Telco).**  
   * Implementar el manejo del Keystore (lectura y parseo del archivo .p12).  
   * Desarrollar y testear unitariamente la función generadora del Hash SHA-384 para el CUDE.  
   * Implementar la capa xml-crypto (o librería equivalente) para firmar nodos XAdES-EPES.  
> 2. **Etapa 2: Motor de Interoperabilidad DIAN (Telco).**  
   * Construir el cliente SOAP y el inyector de cabeceras WS-Security.  
   * Implementar el endpoint GetXmlByDocumentKey en ambiente Sandbox y procesar la respuesta Base64 a ZIP a XML.  
> 3. **Etapa 3: Ingesta Automatizada RPA (Telco).**  
   * Programar el script *headless* de Playwright para la autenticación por certificado en catalogo-vpfe.dian.gov.co.  
   * Desarrollar el worker de extracción masiva en Excel y validación contra la BD local.  
> 4. **Etapa 4: Base de Datos y Lógica de Restricciones.**  
   * Desplegar el esquema relacional (datadian\_empresa, datadian\_factura, datadian\_evento).  
   * Implementar los algoritmos de verificación temporal (contador de 72 horas hábiles) y la máquina de estados local en el backend que bloquee peticiones desordenadas de la API.  
> 5. **Etapa 5: Ensamble UBL y Transmisión.**  
   * Crear los mapeos XML / Plantillas (XSD) para ApplicationResponse.  
   * Integrar el consumo de SendEvent contra la DIAN y registrar trazas de éxito o rechazo (parseo de códigos 02/04).  
> 6. **Etapa 6: Desarrollo Frontend DataDian.**  
   * Crear la API REST en Node/Python que exponga la información a la UI.  
   * Desarrollar los componentes de React/Vue (Grid, Split View, Timeline y Modal de Reclamo).  
   * Integración end-to-end (E2E) y pase al entorno de Producción Oficial de la DIAN.

#### **Obras citadas**

> 1. Consultar factura electrónica DIAN y descargar XML o PDF, [https\://sisteacuse.com/blog/consultar-factura-electronica-dian](https://sisteacuse.com/blog/consultar-factura-electronica-dian)  
> 2. Cómo descargar facturas electrónicas de la DIAN \- Flipp Contable, [https\://flippcontable.com/blog/como-descargar-facturas-electronicas-dian/](https://flippcontable.com/blog/como-descargar-facturas-electronicas-dian/)  
> 3. Dirección de Impuestos y Aduanas Nacionales Anexo técnico del, [https\://www\.dian.gov.co/normatividad/Proyectosnormas/Anexo%202%20%E2%80%93%20Proyecto%20de%20resoluci%C3%B3n%2006112019.pdf](https://www.dian.gov.co/normatividad/Proyectosnormas/Anexo%202%20%E2%80%93%20Proyecto%20de%20resoluci%C3%B3n%2006112019.pdf)  
> 4. Get XML By CUFE \- Consulta XML completo a DIAN, [https\://apimanager.facturafacil.com.co/docs/endpoints/post-api-ubl2-1-xml-document-trackid-storein](https://apimanager.facturafacil.com.co/docs/endpoints/post-api-ubl2-1-xml-document-trackid-storein)  
> 5. Colombia DIAN electronic invoice: format guide \- Klarbon, [https\://klarbon.app/glossary/dian](https://klarbon.app/glossary/dian)  
> 6. UBL Invoice Format: Free XML Examples & Field Reference \[2026\], [https\://e-invoice.be/blog/ubl-format-guide](https://e-invoice.be/blog/ubl-format-guide)  
> 7. Modelo de operación \- Factura electrónica — DIAN, [https\://msfacturaelectdian.azurewebsites.net/modelo-operacion-19.html](https://msfacturaelectdian.azurewebsites.net/modelo-operacion-19.html)  
> 8. CUFE Colombia: qué es y cómo generarlo correctamente, [https\://blog.alanube.co/colombia/cufe-colombia-factura-electronica-que-es-como-generarlo/](https://blog.alanube.co/colombia/cufe-colombia-factura-electronica-que-es-como-generarlo/)  
> 9. Eventos RADIAN: cuáles son, en qué orden y por qué rechazan la, [https\://kiai.co/blog/eventos-radian-cuales-son-y-en-que-orden/](https://kiai.co/blog/eventos-radian-cuales-son-y-en-que-orden/)  
> 10. Preguntas Frecuentes de Integración con servicio Web (Val. Previa), [https\://felcowiki.thefactoryhka.com.co/index.php/Preguntas\_Frecuentes\_de\_Integraci%C3%B3n\_con\_servicio\_Web\_(Val.\_Previa)](https://felcowiki.thefactoryhka.com.co/index.php/Preguntas_Frecuentes_de_Integraci%C3%B3n_con_servicio_Web_\(Val._Previa\))  
> 11. Encrypting the SOAP Body \| Securing Web Services, [https\://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSOAPSEC\_bodyencr](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSOAPSEC_bodyencr)  
> 12. 4.2 BinarySecurityToken Element in a SOAP Request Message, [https\://learn.microsoft.com/en-us/openspecs/windows\_protocols/ms-lwssp/d3160dc5-d72a-4ed0-bb9e-062944353ff1](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-lwssp/d3160dc5-d72a-4ed0-bb9e-062944353ff1)  
> 13. Eventos RADIAN: qué son, códigos 030 a 034 y plazos \- SisteAcuse, [https\://sisteacuse.com/blog/que-son-eventos-radian-dian-colombia](https://sisteacuse.com/blog/que-son-eventos-radian-dian-colombia)  
> 14. Anexo Técnico de Factura Electrónica de Venta versión 1.9. \- DIAN, [https\://www\.dian.gov.co/impuestos/factura-electronica/Documents/Anexo-Tecnico-Factura-Electronica-de-Venta-vr-1-9.pdf](https://www.dian.gov.co/impuestos/factura-electronica/Documents/Anexo-Tecnico-Factura-Electronica-de-Venta-vr-1-9.pdf)  
> 15. ANEXO TECNICO Estructura UBL y Validaciones Factura ... \- DIAN, [https\://www\.dian.gov.co/normatividad/Proyectosnormas/Anexo%201%20-%20Proyecto%20Resoluci%C3%B3n%20000000%20-%2011032019%20-%20Soporte%20Tecnico.pdf](https://www.dian.gov.co/normatividad/Proyectosnormas/Anexo%201%20-%20Proyecto%20Resoluci%C3%B3n%20000000%20-%2011032019%20-%20Soporte%20Tecnico.pdf)  
> 16. Eventos RADIAN Colombia: guía regulatoria completa, [https\://blog.alanube.co/colombia/colombia-eventos-radian-colombia-guia-regulatoria/](https://blog.alanube.co/colombia/colombia-eventos-radian-colombia-guia-regulatoria/)