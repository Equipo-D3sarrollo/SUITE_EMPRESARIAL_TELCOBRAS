# Especificación Técnica Integral: Gestión del Certificado Digital (`.pfx` / PKCS#12), Firma XAdES-EPES, WS-Security y Autenticación mTLS en DataDian y Telco

## 1. Marco Normativo Vigente y Naturaleza del Certificado `.pfx`

### 1.1. Vigencia Normativa (Resolución 000165 de 2023 y Resolución 000227 de 2025)

El ecosistema de facturación electrónica y registro de eventos RADIAN en Colombia se rige técnicamente por el Anexo Técnico de Factura Electrónica de Venta en su versión 1.9, adoptado inicialmente mediante la Resolución 000165 del 1 de noviembre de 2023, en conjunto con la Resolución 000085 de 2022 que regula el registro como título valor en RADIAN.

El 23 de septiembre de 2025, la DIAN expidió la **Resolución 000227 de 2025** (Resolución Única en Materia Tributaria, Aduanera y Cambiaria), la cual compiló en una sola norma las disposiciones vigentes de la Resolución 000165 de 2023 y sus modificaciones posteriores. Dentro de esta nueva compilación unificada, el marco de facturación electrónica quedó integrado en el Título 5 y su anexo técnico de factura electrónica fue renumerado como **Anexo Técnico T5.1**, manteniendo intactos la validación previa, el cálculo del CUFE/CUDE, la firma digital XAdES-EPES respaldada por certificado digital y las reglas de validación establecidas.

### 1.2. Qué es el Archivo `.pfx` (PKCS#12) y por qué es Obligatorio en "Software Propio"

Un archivo `.pfx` (*Personal Information Exchange*, equivalente estructural del formato `.p12` bajo el estándar PKCS#12) es una bóveda criptográfica cifrada mediante contraseña que encapsula tres artefactos críticos en un único archivo binario: la **llave privada** del contribuyente, el **certificado público X.509 v3** emitido a nombre del NIT correspondiente y la **cadena de certificación** completa de la entidad certificadora hasta su certificado raíz.

A diferencia del certificado gratuito administrado dentro de la "Solución Gratuita" en el portal de la DIAN —cuyo uso es exclusivo dentro de la plataforma web oficial de la entidad—, una arquitectura automatizada bajo la modalidad de **Software Propio** (como el motor **Telco** conectado a **DataDian** para una Unión Temporal o empresa) requiere posesión física y programática del archivo `.pfx` y su contraseña. Sin acceso directo al `.pfx` en el servidor, el sistema es incapaz de firmar documentos UBL 2.1 localmente, autenticarse vía WS-Security ante los servicios SOAP o negociar autenticación mutua TLS en el portal web.

### 1.3. Requisitos Técnicos del Certificado según la Circular 03-2016 de la ONAC

De acuerdo con la Política de Firma Oficial de la DIAN (`politicadefirmav2.pdf`), todo certificado digital empleado en facturación electrónica y eventos RADIAN (cuya vigencia haya iniciado después del 30 de septiembre de 2016) debe cumplir obligatoriamente con las condiciones técnicas de la Circular 03-2016 de la ONAC:

| Requisito Técnico | Valor / Especificación Obligatoria DIAN | Consecuencia de Incumplimiento |
| --- | --- | --- |
| Algoritmos de firma del certificado | `sha256WithRSAEncryption`, `sha384WithRSAEncryption` o `sha512WithRSAEncryption` (familia SHA-2) | Rechazo criptográfico de la firma por algoritmo no permitido |
| Extensión X509v3 Key Usage | Marcada obligatoriamente como `critical` | Firma catalogada como fallida en validación |
| Propósitos de uso de clave | Debe incluir ambos propósitos: `Digital Signature` y `Non Repudiation` | Rechazo por carencia de atributos legales de no repudio |
| Ventana de vigencia (`Validity`) | La fecha de expedición del documento debe estar dentro del rango `NotBefore` y `NotAfter` | Rechazo inmediato si el certificado está vencido o aún no inicia vigencia |
| Cadena de certificación | Debe incluir el certificado del firmante y toda la cadena de confianza hasta la raíz | Fallo al verificar la confianza del emisor en `<ds:X509Data>` |

Estas condiciones técnicas de validación, algoritmos permitidos, criticidad de `Key Usage` y vigencia están definidas explícitamente en la política de firma de la DIAN y en las reglas de validación de los documentos electrónicos. Adicionalmente, la DIAN permite solicitar la renovación del certificado hasta 3 meses antes de su fecha de vencimiento para evitar interrupciones operativas.

---

## 2. Arquitectura de Alojamiento, Bóveda de Secretos y Seguridad Multi-Tenant

Dado que la suite DataDian administrará múltiples entidades (por ejemplo, distintas Uniones Temporales como UT La Gloria, UT La Luisa o la empresa matriz), el manejo del archivo `.pfx` exige una arquitectura de aislamiento estricto por *tenant* para evitar contaminación cruzada de firmas o exposición de claves privadas.

### 2.1. Estrategia de Almacenamiento en Reposo (*Storage at Rest*)

1. **Separación de datos y secretos:** El archivo `.pfx` binario **nunca** debe alojarse dentro de repositorios Git, carpetas públicas del servidor web ni en texto plano dentro de la base de datos relacional. Debe almacenarse en un volumen privado cifrado del servidor (con permisos POSIX estrictos `0400` o `0600` exclusivos del usuario de ejecución del demonio Telco) o en un almacenamiento privado de objetos cifrado con KMS (como AWS S3 o Azure Blob Storage con acceso restringido por IAM).
2. **Protección de la contraseña:** La contraseña del `.pfx` jamás debe quedar escrita en el código fuente (*hardcoding*). En la tabla relacional `datadian_empresa`, la columna `keystore_path` almacena únicamente la referencia o URI privada al archivo `.pfx`, y la columna `keystore_pwd` almacena la contraseña cifrada simétricamente mediante AES-256-GCM, utilizando una llave maestra (KEK) inyectada vía variables de entorno seguras o un gestor de secretos (AWS Secrets Manager / HashiCorp Vault).
3. **Política de cero escritura temporal en disco:** Al momento de firmar o autenticar, el módulo `CertificateManager` de Telco debe leer el `.pfx` y descifrarlo **exclusivamente en memoria RAM** para extraer la llave privada y el certificado X.509. Está estrictamente prohibido exportar llaves privadas `.key` o `.pem` sin contraseña a directorios temporales como `/tmp`.

### 2.2. Validaciones *Pre-Flight* Obligatorias Antes de Invocar la DIAN

Antes de ejecutar cualquier firma XML o llamada SOAP, Telco debe someter el certificado cargado en memoria a un bloque de validación preventiva (*pre-flight check*):

* **Control de vigencia:** Verificar que la fecha actual sincronizada se encuentre dentro del periodo `Validity` del certificado y emitir alertas tempranas en el Dashboard de DataDian cuando falten menos de 90 días para su expiración.
* **Verificación de atributos ONAC:** Comprobar programáticamente que la extensión `KeyUsage` sea crítica e incluya `Digital Signature` y `Non Repudiation`, y que el algoritmo de firma pertenezca a la familia SHA-2.
* **Coincidencia de identidad multi-tenant:** Verificar que el NIT presente en el campo `Subject` / `SERIALNUMBER` del certificado X.509 coincida exactamente con el `nit` del *tenant* en la tabla `datadian_empresa` y con el NIT declarado en el XML del evento (`cac:SenderParty`), impidiendo firmar un documento de una UT con el certificado de otra.
* **Sincronización de reloj atómico:** Garantizar que el reloj del servidor donde corre Telco esté sincronizado vía NTP con la hora legal colombiana de la Superintendencia de Industria y Comercio (`http://www.sic.gov.co/hora-legal-colombiana`, huso horario `UTC-05:00`), dado que tanto el `<xades:SigningTime>` como el `<wsu:Timestamp>` SOAP dependen de esta exactitud cronológica.

---

## 3. Matriz de Invocación: Dónde, Cuándo y Cómo Telco Usa el `.pfx`

El archivo `.pfx` **no se usa de una sola manera**. Dentro de la arquitectura de DataDian y Telco, el mismo `.pfx` se invoca en **cuatro puntos distintos** y bajo **tres protocolos tecnológicos completamente diferentes**, según se resume a continuación:

| Punto de Invocación | Microservicio Telco | Protocolo / Estándar | Parte del `.pfx` Utilizada | Propósito en el Flujo |
| --- | --- | --- | --- | --- |
| 1. Descubrimiento masivo | Worker RPA (Playwright) | TLS Client Auth (`mTLS`) | Certificado + llave privada | Autenticarse directamente en `catalogo-vpfe.dian.gov.co` mediante la pestaña "Certificado", sin depender del enlace-token por correo del representante legal |
| 2. Descarga de XML oficial | Cliente SOAP (`GetXmlByDocumentKey`) | SOAP 1.2 / WS-Security 1.1 | Certificado X.509 (público) + llave privada | Construir el `BinarySecurityToken` y firmar la cabecera `<wsa:To>` para descargar el ZIP en Base64 del `AttachedDocument` desde `WcfDianCustomerServices.svc` |
| 3. Sellado del evento RADIAN | Firmador XML (`XadesEpesSigner`) | XMLDSig Enveloped / XAdES-EPES | Llave privada + cadena X.509 completa | Firmar internamente el documento XML `ApplicationResponse` (eventos `030`, `031`, `032` o `033`) inyectando `<ds:Signature>` en `ext:UBLExtensions` |
| 4. Transmisión del evento | Cliente SOAP (`SendEvent`) | SOAP 1.2 / WS-Security 1.1 | Certificado X.509 (público) + llave privada | Autenticar la petición de red contra `WcfDianCustomerServices.svc` para entregar el ZIP Base64 del `ApplicationResponse` ya firmado |

Esta matriz resume la articulación operativa de los mecanismos descritos en la documentación de Playwright sobre `clientCertificates`, el acceso por certificado al portal VPFE, el servicio `GetXmlByDocumentKey`, la firma interna XAdES-EPES de eventos `ApplicationResponse` y la seguridad WS-Security de `WcfDianCustomerServices.svc`.

---

## 4. Implementación Técnica Capa 1: Firma Documental XML XAdES-EPES (`ds:Signature`)

### 4.1. Ubicación XPath y Reglas Estructurales en UBL 2.1

Todo documento electrónico UBL 2.1 enviado a validación o registro en RADIAN (`Invoice`, `CreditNote`, `DebitNote` y `ApplicationResponse`) debe utilizar el estándar **XMLDSig *enveloped*** en formato **XAdES-EPES**, conforme a la especificación **ETSI TS 101 903** (versiones `1.2.2`, `1.3.2` o `1.4.1`, declarando explícitamente la versión adoptada en las etiquetas XML).

Las reglas estructurales del Anexo Técnico establecen:

* **Declaración de namespaces en la raíz:** Se deben declarar en la cabecera del documento los espacios de nombres estándar, incluyendo `xmlns:ds="http://www.w3.org/2000/09/xmldsig#"`, `xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"`, `xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"` y `xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2"`, junto con los prefijos `xades` y `xades141`.
* **Orden de extensiones (`ext:UBLExtensions`):** Para los documentos electrónicos que incorporan extensiones DIAN, el primer grupo `ext:UBLExtension` contiene `sts:DianExtensions` y el segundo contiene el nodo de firma digital en la ruta `//ext:UBLExtension/ext:ExtensionContent/ds:Signature`.
* **Regla de unicidad:** Solo puede existir **una** ocurrencia de un grupo `ext:UBLExtension` que contenga `ds:Signature` dentro del documento; incluir más de una firma provoca rechazo inmediato.

### 4.2. Referencias Criptográficas y Algoritmos en `<ds:SignedInfo>`

La Política de Firma de la DIAN exige que el elemento `<ds:SignedInfo>` (previamente canonicalizado) incluya exactamente tres referencias firmadas:

1. **Referencia al documento completo:** Aplica sobre todos los elementos del XML raíz (mediante la transformación *enveloped signature*, para excluir el propio nodo `ds:Signature` durante el cálculo).
2. **Referencia a `<xades:SignedProperties>`:** Asegura la integridad de la hora de firma, el rol del firmante, el certificado referenciado y la política de firma.
3. **Referencia a `<ds:KeyInfo>`:** Protege la clave pública y la cadena X.509 adjunta en la firma.

Los algoritmos exigidos por la DIAN para `<ds:SignatureMethod>` y `<ds:DigestMethod>`, según `politicadefirmav2.pdf`, deben guardar correspondencia estricta con el algoritmo SHA-2 del certificado:

* Para RSA con SHA-256: `http://www.w3.org/2001/04/xmldsig-more#rsasha256` y digest `http://www.w3.org/2001/04/xmlenc#sha256`.
* Para RSA con SHA-384: `http://www.w3.org/2001/04/xmldsig-more#rsasha384`.
* Para RSA con SHA-512: `http://www.w3.org/2001/04/xmldsig-more#rsasha512` y digest `http://www.w3.org/2001/04/xmlenc#sha512`.

### 4.3. Metadatos Obligatorios XAdES-EPES (`SignaturePolicyIdentifier`, `SigningTime` y `SignerRole`)

Lo que convierte a una firma XMLDSig estándar en **XAdES-EPES** es el bloque `<xades:QualifyingProperties>` incrustado dentro de `<ds:Object>`:

* **`<xades:SignaturePolicyIdentifier>` (Opción-2 para certificados SHA-2):**
  * `<xades:Identifier>`: debe contener textualmente la URL `https://facturaelectronica.dian.gov.co/politicadefirma/v2/politicadefirmav2.pdf`.
  * `<xades:Description>`: debe contener el texto `Política de firma para facturas electrónicas de la República de Colombia.`
  * `<xades:SigPolicyHash>`: contiene el `<ds:DigestMethod>` (como SHA-256 o SHA-512) y el `<ds:DigestValue>` resultante de aplicar dicha función hash sobre el archivo PDF de la política de firma.
  * *Nota técnica para Claude Code:* aunque en implementaciones comunitarias con SHA-256 suele aparecer el valor Base64 `dgsHIZx49492MKkwson1wwEZWaBCc78kh/RIvd/W6gw=`, la propia `politicadefirmav2.pdf` también ejemplifica `xmlenc#sha512`. Por ello, Telco debe calcular y fijar este digest directamente a partir de los bytes oficiales de `politicadefirmav2.pdf` y verificar que supere la validación de firma en Habilitación antes de pasar a Producción. No se debe copiar un hash sin verificar.
* **`<xades:SigningTime>`:** Fecha y hora en formato `xsd:dateTime`, sincronizada con la hora legal colombiana (`UTC-05:00`).
* **`<xades:SignerRole>`:** Dentro de `<xades:ClaimedRoles>/<xades:ClaimedRole>`, debe contener **uno y solo uno** de estos dos literales exactos:
  * `supplier`: cuando la empresa o Unión Temporal firma directamente sus propios documentos o eventos bajo la modalidad de Software Propio.
  * `third party`: exclusivamente cuando firma un Proveedor Tecnológico autorizado en nombre de un tercero.

### 4.4. Esqueleto Estructural de `<ds:Signature>` en UBL 2.1 (Guía para Claude Code)

Claude Code no debe construir las transformaciones de canonicalización ni los digests manualmente mediante concatenación de cadenas. Debe utilizar una librería XMLDSig/XAdES auditada (por ejemplo, `xml-crypto` / `xadesjs` en Node.js, `xades4j` en Java o `lxml` + `xmlsec` en Python) que genere la siguiente jerarquía dentro del segundo `ext:UBLExtension`. El esqueleto es una guía estructural; los detalles menores de ETSI TS 101 903 (por ejemplo, el contenido exacto de `SigningCertificate`) los resuelve la librería.

```xml
<ext:UBLExtensions>
  <ext:UBLExtension>
    <ext:ExtensionContent>
      <sts:DianExtensions>
        <!-- Bloque de extensiones DIAN (DianExtensions) -->
      </sts:DianExtensions>
    </ext:ExtensionContent>
  </ext:UBLExtension>
  <ext:UBLExtension>
    <ext:ExtensionContent>
      <ds:Signature Id="xmldsig-..." xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
        <ds:SignedInfo>
          <ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
          <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsasha256"/>
          <!-- Referencia 1: Documento raíz enveloped -->
          <ds:Reference Id="xmldsig-...-ref0" URI="">
            <ds:Transforms>
              <ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
            </ds:Transforms>
            <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
            <ds:DigestValue>...</ds:DigestValue>
          </ds:Reference>
          <!-- Referencia 2: KeyInfo -->
          <ds:Reference URI="#xmldsig-...-keyinfo">
            <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
            <ds:DigestValue>...</ds:DigestValue>
          </ds:Reference>
          <!-- Referencia 3: SignedProperties XAdES -->
          <ds:Reference Type="http://uri.etsi.org/01903#SignedProperties" URI="#xmldsig-...-signedprops">
            <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
            <ds:DigestValue>...</ds:DigestValue>
          </ds:Reference>
        </ds:SignedInfo>
        <ds:SignatureValue Id="xmldsig-...-sigvalue">...</ds:SignatureValue>
        <ds:KeyInfo Id="xmldsig-...-keyinfo">
          <ds:X509Data>
            <ds:X509Certificate><!-- Certificado hoja + cadena CA en Base64 --></ds:X509Certificate>
          </ds:X509Data>
        </ds:KeyInfo>
        <ds:Object>
          <xades:QualifyingProperties Target="#xmldsig-..." xmlns:xades="http://uri.etsi.org/01903/v1.3.2#">
            <xades:SignedProperties Id="xmldsig-...-signedprops">
              <xades:SignedSignatureProperties>
                <xades:SigningTime>2026-11-12T09:37:00-05:00</xades:SigningTime>
                <xades:SigningCertificate>
                  <!-- Hash y serial del certificado X.509 extraído del .pfx -->
                </xades:SigningCertificate>
                <xades:SignaturePolicyIdentifier>
                  <xades:SignaturePolicyId>
                    <xades:SigPolicyId>
                      <xades:Identifier>https://facturaelectronica.dian.gov.co/politicadefirma/v2/politicadefirmav2.pdf</xades:Identifier>
                      <xades:Description>Política de firma para facturas electrónicas de la República de Colombia.</xades:Description>
                    </xades:SigPolicyId>
                    <xades:SigPolicyHash>
                      <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
                      <ds:DigestValue><!-- Hash del PDF politicadefirmav2.pdf --></ds:DigestValue>
                    </xades:SigPolicyHash>
                  </xades:SignaturePolicyId>
                </xades:SignaturePolicyIdentifier>
                <xades:SignerRole>
                  <xades:ClaimedRoles>
                    <xades:ClaimedRole>supplier</xades:ClaimedRole>
                  </xades:ClaimedRoles>
                </xades:SignerRole>
              </xades:SignedSignatureProperties>
            </xades:SignedProperties>
          </xades:QualifyingProperties>
        </ds:Object>
      </ds:Signature>
    </ext:ExtensionContent>
  </ext:UBLExtension>
</ext:UBLExtensions>
```

---

## 5. Implementación Técnica Capa 2: Transporte SOAP WS-Security 1.1 (`WcfDianCustomerServices.svc`)

### 5.1. Endpoints y Seguridad de Mensajería WCF

Las operaciones de descarga y envío hacia la DIAN (`GetXmlByDocumentKey`, `SendEvent`, `GetStatus`, `SendBillAsync`) se ejecutan contra el servicio WCF `WcfDianCustomerServices.svc` (por ejemplo, en el ambiente de Habilitación `https://vpfe-hab.dian.gov.co/WcfDianCustomerServices.svc` y su equivalente en Producción). Este servicio **no** utiliza autenticación REST ni Bearer Tokens; implementa **WS-Security 1.1** con firma sobre la cabecera WS-Addressing mediante el `.pfx` de la empresa.

### 5.2. Anatomía Exacta del `<soap:Header>` Exigido por la DIAN

Basado en el patrón de implementación verificado para `WcfDianCustomerServices.svc`, Claude Code debe construir la cabecera SOAP con cuatro componentes interdependientes:

1. **Directivas WS-Addressing (`wsa:Action` y `wsa:To`):**
   * `wsa:Action` declara el método invocado bajo el namespace del contrato WCF, por ejemplo `http://wcf.dian.colombia/IWcfDianCustomerServices/GetStatus`, `.../SendEvent` o `.../GetXmlByDocumentKey`.
   * `wsa:To` contiene la URL del servicio `.svc` y debe portar un atributo `wsu:Id` único (por ejemplo `ID-<uuid_o_sha1>`) junto con `xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"`, ya que este nodo es el objetivo directo de la firma SOAP.
2. **Estampa temporal (`wsu:Timestamp`):**
   * Ubicada dentro de `<wsse:Security>` con su propio `wsu:Id` (ej. `TS-<hash>`).
   * Contiene `<wsu:Created>` y `<wsu:Expires>` formateados en UTC (`YYYY-MM-DDTHH:MM:SSZ`) para mitigar ataques de repetición.
3. **Token binario del certificado (`wsse:BinarySecurityToken`):**
   * Contiene el certificado público X.509 extraído del `.pfx` en una sola cadena Base64 limpia, eliminando explícitamente las cabeceras PEM (`-----BEGIN CERTIFICATE-----`, `-----END CERTIFICATE-----`) y todos los saltos de línea (`\r`, `\n`).
   * Debe declarar `EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary"`, `ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3"` y un atributo `wsu:Id` único (ej. `X509-<uuid>`).
4. **Firma de cabecera (`ds:Signature` en `<wsse:Security>`):**
   * **Canonicalización (`ds:CanonicalizationMethod`):** Debe usar `http://www.w3.org/2001/10/xml-exc-c14n#` con el hijo `<ec:InclusiveNamespaces PrefixList="wsa soap wcf" xmlns:ec="http://www.w3.org/2001/10/xml-exc-c14n#"/>`.
   * **Método de firma (`ds:SignatureMethod`):** `http://www.w3.org/2001/04/xmldsig-more#rsa-sha256`.
   * **Referencia (`ds:Reference`):** El atributo `URI` apunta a `#<wsuId_de_wsaTo>`, aplicando `<ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>` y calculando el `<ds:DigestValue>` como el Base64 del hash SHA-256 sobre el nodo `<wsa:To>` canonicalizado con sus namespaces.
   * **Valor de firma (`ds:SignatureValue`):** Se calcula firmando con la llave privada del `.pfx` (algoritmo RSA-SHA256) el nodo `<ds:SignedInfo>` canonicalizado (C14N) con los namespaces activos del sobre SOAP, codificado en Base64.
   * **Referencia al token (`ds:KeyInfo`):** Anida `<wsse:SecurityTokenReference>` con `<wsse:Reference URI="#<wsuId_de_BinarySecurityToken>" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3"/>`.

### 5.3. Plantilla Estructural del Sobre SOAP WS-Security (Guía para Claude Code)

El siguiente esqueleto muestra la estructura del sobre que el cliente SOAP de Telco debe ensamblar antes de enviar el archivo ZIP codificado en Base64 en el `<soap:Body>`:

```xml
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
               xmlns:wcf="http://wcf.dian.colombia"
               xmlns:wsa="http://www.w3.org/2005/08/addressing">
  <soap:Header>
    <wsse:Security soap:mustUnderstand="true"
                   xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
                   xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
      <wsu:Timestamp wsu:Id="TS-1a2b3c4d">
        <wsu:Created>2026-11-12T14:37:00Z</wsu:Created>
        <wsu:Expires>2026-11-12T14:42:00Z</wsu:Expires>
      </wsu:Timestamp>
      <wsse:BinarySecurityToken EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary"
                                ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3"
                                wsu:Id="X509-9f8e7d6c"><!-- Certificado X.509 Base64 sin headers PEM ni saltos de línea --></wsse:BinarySecurityToken>
      <ds:Signature Id="SIG-5e4d3c2b" xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
        <ds:SignedInfo>
          <ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#">
            <ec:InclusiveNamespaces PrefixList="wsa soap wcf" xmlns:ec="http://www.w3.org/2001/10/xml-exc-c14n#"/>
          </ds:CanonicalizationMethod>
          <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
          <ds:Reference URI="#ID-wsa-to-001">
            <ds:Transforms>
              <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#">
                <ec:InclusiveNamespaces PrefixList="soap wcf" xmlns:ec="http://www.w3.org/2001/10/xml-exc-c14n#"/>
              </ds:Transform>
            </ds:Transforms>
            <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
            <ds:DigestValue><!-- SHA-256 Base64 del nodo wsa:To canonicalizado --></ds:DigestValue>
          </ds:Reference>
        </ds:SignedInfo>
        <ds:SignatureValue><!-- RSA-SHA256 Base64 del SignedInfo canonicalizado --></ds:SignatureValue>
        <ds:KeyInfo Id="KI-7a8b9c0d">
          <wsse:SecurityTokenReference wsu:Id="STR-112233">
            <wsse:Reference URI="#X509-9f8e7d6c"
                            ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3"/>
          </wsse:SecurityTokenReference>
        </ds:KeyInfo>
      </ds:Signature>
    </wsse:Security>
    <wsa:Action>http://wcf.dian.colombia/IWcfDianCustomerServices/SendEvent</wsa:Action>
    <wsa:To wsu:Id="ID-wsa-to-001"
            xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">https://vpfe-hab.dian.gov.co/WcfDianCustomerServices.svc</wsa:To>
  </soap:Header>
  <soap:Body>
    <!-- Payload específico del método, ej. contentFile con el ZIP en Base64 -->
  </soap:Body>
</soap:Envelope>
```

---

## 6. Implementación Técnica Capa 3: Autenticación Automatizada mTLS en Playwright (`catalogo-vpfe.dian.gov.co`)

Dado que el Web Service `GetXmlByDocumentKey` exige conocer el CUFE de antemano y no ofrece un método para listar facturas recibidas por rango de fechas, el motor Telco utiliza un worker RPA para consultar `catalogo-vpfe.dian.gov.co` y descargar el listado de documentos recibidos en Excel.

### 6.1. Ventaja Operativa del Ingreso con Certificado `.pfx`

En `catalogo-vpfe.dian.gov.co`, el ingreso mediante las pestañas "Empresa" o "Persona" obliga a resolver comprobaciones anti-robot y envía un enlace temporal de acceso ("token") al correo electrónico registrado en el RUT del representante legal, lo que rompe la automatización desatendida. En cambio, seleccionar la opción **Certificado** permite que el navegador negocie autenticación mutua TLS (`mTLS`) con el certificado `.pfx` y acceda de forma directa sin depender del correo electrónico.

### 6.2. Soporte de `clientCertificates` en Playwright y Advertencia de Stack (Node.js vs Python)

A partir de la versión **v1.46**, Playwright incorporó soporte nativo para TLS Client Authentication mediante la propiedad `clientCertificates`, la cual acepta directamente un archivo `.pfx` o un `Buffer` en memoria junto con su `passphrase` y el `origin` exacto.

**Advertencia arquitectónica crítica para Claude Code:**

1. **Paridad de bindings:** Mientras que la documentación oficial y el paquete Node.js/TypeScript de Playwright (`@playwright/test` / `playwright` `>= 1.46`) implementan nativamente `clientCertificates` a nivel de contexto de navegador, con soporte directo para `pfxPath` o `pfx` Buffer, en versiones de Python Playwright se han reportado brechas de documentación y soporte en torno a `client_certificates`.
2. **Problema del diálogo nativo del SO:** En versiones anteriores, o sin `clientCertificates` activo, el navegador despliega un cuadro de diálogo nativo del sistema operativo solicitando seleccionar el certificado, el cual vive por fuera del DOM y no puede controlarse mediante selectores ni eventos estándar de CDP.
3. **Decisión de diseño recomendada:** Para evitar soluciones frágiles basadas en automatización de teclado del sistema operativo, se recomienda implementar el microservicio RPA (`RpaMtlsWorker`) en **Node.js / TypeScript con Playwright `>= 1.46`**, cargando el `.pfx` como `Buffer` en memoria en `browser.newContext({ clientCertificates: [...] })`. Si el proyecto exige Python estrictamente en contenedores Linux, se debe verificar la versión instalada de `playwright` para confirmar el soporte de `client_certificates` en `new_context`, o como alternativa usar `certutil` (NSS) más políticas de auto-selección de Chromium dentro del contenedor Docker.

### 6.3. Patrón de Código Playwright para Telco (TypeScript)

```typescript
import { chromium } from 'playwright';

async function authenticateDianPortal(pfxBuffer: Buffer, passphrase: string) {
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    clientCertificates: [
      {
        origin: 'https://catalogo-vpfe.dian.gov.co',
        pfx: pfxBuffer,
        passphrase: passphrase,
      },
    ],
  });

  const page = await context.newPage();
  await page.goto('https://catalogo-vpfe.dian.gov.co/User/Login');
  // Navegar a la pestaña Certificado y proceder a Histórico > Documentos recibidos
  return { browser, context, page };
}
```

---

## 7. Guía de Implementación y Diagnóstico de Errores para Claude Code

### 7.1. Estructura Modular Sugerida en Telco

Para mantener separación de responsabilidades y facilitar las pruebas unitarias, Claude Code debe estructurar la capa criptográfica y de interoperabilidad en cuatro módulos independientes:

* `CertificateVault` (`crypto/certificate_vault`): Descifra `keystore_pwd` con la llave maestra, lee el `.pfx` en memoria, extrae la llave privada, el certificado hoja y la cadena CA, y ejecuta todas las validaciones ONAC/NIT/vigencia antes de devolver el objeto criptográfico.
* `XadesEpesSigner` (`xml/xades_signer`): Recibe un XML `ApplicationResponse` UBL 2.1 sin firmar y las credenciales en memoria de `CertificateVault`; calcula las referencias, inyecta `<xades:SignaturePolicyIdentifier>` con la política v2 y retorna el XML firmado.
* `SoapWsSecurityClient` (`soap/dian_client`): Toma el certificado público y la llave privada de `CertificateVault`, construye el `<soap:Header>` con `wsa:Action`, `wsa:To`, `wsu:Timestamp`, `wsse:BinarySecurityToken` y `ds:Signature`, y ejecuta las peticiones POST hacia `WcfDianCustomerServices.svc`.
* `RpaMtlsWorker` (`rpa/vpfe_scraper`): Inyecta el buffer del `.pfx` en el contexto de Playwright con `clientCertificates` para descargar los listados de CUFEs desde `catalogo-vpfe.dian.gov.co`.

### 7.2. Flujo de Ejecución End-to-End al Emitir un Evento RADIAN

Cuando un usuario en el Dashboard de **DataDian** aprueba emitir un evento (por ejemplo, `030` Acuse de Recibo o `032` Recibo del Bien/Servicio):

1. El backend verifica en base de datos las reglas de precedencia (no permitir `032` sin `030` validado, ni `033`/`031` sin `032` validado).
2. Telco ensambla el XML `ApplicationResponse` UBL 2.1 con el código del evento en `cbc:CustomizationID` y el ambiente (`2` para Habilitación, `1` para Producción) en `cbc:ProfileExecutionID`, calculando el CUDE con SHA-384.
3. Telco invoca a `CertificateVault` para cargar en memoria el `.pfx` de la UT correspondiente.
4. **Uso 1 del `.pfx`:** `XadesEpesSigner` firma el `ApplicationResponse` con XAdES-EPES (`SignerRole`: `supplier`) e inserta el bloque en `ext:UBLExtension[2]`.
5. Telco comprime el XML firmado en un archivo `.zip` en memoria y lo codifica en Base64.
6. **Uso 2 del `.pfx`:** `SoapWsSecurityClient` arma el sobre SOAP con `wsse:BinarySecurityToken` y firma el nodo `wsa:To`, enviando la petición al método `SendEvent` de `WcfDianCustomerServices.svc`.
7. Telco interpreta el XML de respuesta de la DIAN, registra el resultado en `datadian_evento` (`02` éxito o `04` rechazo con su traza) y notifica a DataDian.

### 7.3. Matriz de Diagnóstico de Errores Frecuentes (Habilitación y Producción)

| Síntoma / Código de Error DIAN | Causa Raíz Probable | Acción de Corrección en Telco |
| --- | --- | --- |
| Regla `ZE02` (valor de la firma inválido: difiere del calculado) o rechazo `SIGN` | Se alteró un espacio o salto de línea tras firmar, falló la canonicalización, o el `SigPolicyHash` no coincide con el `DigestMethod` declarado | Aplicar canonicalización estricta antes de firmar, no reformatear (pretty-print) el XML después de firmar, y recalcular el hash de `politicadefirmav2.pdf` |
| Error HTTP 500 SOAP: `An error occurred when verifying security for the message` | `wsu:Timestamp` desfasado de la hora legal, saltos de línea en `BinarySecurityToken`, o `PrefixList` incorrecto en `xml-exc-c14n#` | Sincronizar el reloj por NTP (`UTC-05:00`), limpiar `\r`/`\n` del certificado Base64, y verificar `PrefixList="wsa soap wcf"` y la firma sobre `wsa:To` |
| Rechazo de firma por vigencia o atributos del certificado | Certificado vencido, fecha de emisión fuera de `Validity`, algoritmo SHA-1 obsoleto o ausencia de `Non Repudiation` crítico | Activar la validación *pre-flight* ONAC Circular 03-2016 y renovar el `.pfx` antes de su fecha de expiración |
| Rechazo por más de un bloque `ds:Signature` | Se insertó accidentalmente más de un nodo `ext:UBLExtension` con firma digital | Garantizar en `XadesEpesSigner` la regla `FAC03` de un único nodo `ds:Signature` |
| Popup nativo del navegador bloqueando el bot RPA | Se utilizó Playwright `< v1.46` o bindings sin `clientCertificates` configurado para el origen exacto | Actualizar a Playwright `>= 1.46` en TypeScript/Node.js con `clientCertificates` y validar el `origin` `https://catalogo-vpfe.dian.gov.co` |

### 7.4. Checklist de Validación en Ambiente de Habilitación (Sandbox)

Antes de conmutar `ProfileExecutionID` a `1` (Producción), Claude Code debe verificar los siguientes hitos en el ambiente de pruebas (`https://catalogo-vpfe-hab.dian.gov.co/User/Login` y `https://vpfe-hab.dian.gov.co/WcfDianCustomerServices.svc`):

1. **Validación local del `.pfx`:** Confirmar la carga en memoria sin archivos temporales, algoritmo SHA-256/384/512, extensión `KeyUsage` crítica (`Digital Signature` + `Non Repudiation`) y coincidencia con el NIT de la UT.
2. **Prueba SOAP de lectura (`GetStatus` / `GetXmlByDocumentKey`):** Verificar respuesta HTTP 200 sin error WS-Security y correcta descompresión del ZIP Base64 devuelto.
3. **Prueba de firma XAdES-EPES y `SendEvent`:** Enviar un evento `030` de prueba en Habilitación, confirmando la recepción de un `ApplicationResponse` aprobado por la DIAN sin errores `ZE02` ni de política de firma.
4. **Prueba mTLS RPA:** Confirmar el acceso automatizado sin intervención humana ni tokens por correo en el portal de Habilitación mediante `clientCertificates`.
