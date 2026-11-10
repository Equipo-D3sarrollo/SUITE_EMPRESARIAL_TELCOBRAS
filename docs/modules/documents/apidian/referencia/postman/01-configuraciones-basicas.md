# 01 - Configuraciones Basicas

> Fuente: colección Postman pública «FacturaLatam ApiDianV2.1» (<https://documenter.getpostman.com/view/50442293/2sBYHUSfRJ>), descargada el 10-nov-2026. Tokens y secretos censurados; base64 largos recortados.

* Servicios para registrar/editar empresa
* servicios para configurar empresa (software, resoluciones)

## 📁 01A - Configuracion de empresa

* Servicios Para configurar la empresa

### Paso 1 - Registrar o actualizar la empresa (NIT y datos basicos)

`POST http://facturalatam-apidian.oo/api/ubl2.1/config/89008003/2`

CONFIGURAR COMPAÑIA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/89008003/2>

* No requiere autorizacion
* En URL los ultimos dos parametros son NIT y digito de verificacion de la empresa.

.../ubl2.1/config/NitEmpresa/DigitoVerificacion

* Los datos necesarios para llenar los campos JSON cuyo nombre finalice con "\_id" se encuentran en las tablas parametricas de la base de datos de la API, ejemplo:

type\_liability\_id, se debe especificar el id del registro correspondiente de la tabla type\_liabilities de la base de datos de la API.

* Devuelve un token en el response, si fue posible la creacion de la empresa, este token es una cadena alfanumerica en el campo API\_TOKEN, este dato es necesario para utilizarlo como autorizacion en los siguientes endpoints de la API. Si este token se pierde, se puede recuperar consultando la tabla users de la base de datos de la API, en el campo API\_TOKEN.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `X-Admin-Token` | `` |

**Autenticación:** `bearer`

**Body**

```json
{
	"type_document_identification_id": 3,
	"type_organization_id": 2,
	"type_regime_id": 2,
	"type_liability_id": 14,
    //"type_liability_ids": [7, 9],  Para asignar mas responsabilidades a la empresa
	"business_name": "ALEXANDER OBANDO LONDONO",
	"merchant_registration": "0000000-00",
	"municipality_id": 820,
	"address": "CRA 21A NRO 11-25",
	"phone": 3103891693,
	"email": "alexander_obando@hotmail.com",
    "mail_host": "smtp.gmail.com",
    "mail_port": "587",
    "mail_username": "backupsbabel7@gmail.com",
    "mail_password": "[CENSURADO]",
    "mail_encryption": "tls"
}
```

**Respuesta de ejemplo — Empresa creada/actualizada (200 OK)**

```json
{
    "success": true,
    "message": "Empresa creada/actualizada con éxito",
    "password": "[CENSURADO]",
    "token": "[CENSURADO]",
    "company": {
        "id": 1,
        "user_id": 3,
        "identification_number": "89008003",
        "dv": "2",
        "language_id": 79,
        "tax_id": 1,
        "type_environment_id": 2,
        "payroll_type_environment_id": 2,
        "eqdocs_type_environment_id": 2,
        "type_operation_id": 10,
        "type_document_identification_id": 3,
        "country_id": 46,
        "type_currency_id": 35,
        "type_organization_id": 2,
        "type_regime_id": 2,
        "type_liability_id": 14,
        "municipality_id": 820,
        "merchant_registration": "0000000-00",
        "address": "CRA 21A NRO 11-25",
        "phone": "3103891693",
        "password": null,
        "newpassword": null,
        "type_plan_id": 0,
        "type_plan2_id": 0,
        "type_plan3_id": 0,
        "type_plan4_id": 0,
        "start_plan_date": null,
        "start_plan_date2": null,
        "start_plan_date3": null,
        "start_plan_date4": null,
        "absolut_start_plan_date": null,
        "state": 1,
        "allow_seller_login": 0,
        "created_at": "2024-04-08 17:37:08",
        "updated_at": "2024-11-27 15:39:42",
        "user": {
            "id": 3,
            "name": "ALEXANDER OBANDO LONDONO",
            "email": "alexander_obando@hotmail.com",
            "email_verified_at": null,
            "created_at": "2024-04-08 17:37:08",
            "updated_at": "2024-11-04 16:38:12",
            "id_administrator": null,
            "mail_host": null,
            "mail_port": null,
            "mail_username": null,
            "mail_password": null,
            "mail_encryption": null
        },
        "send": []
    }
}
```

**Respuesta de ejemplo — Acceso restringido (403 Forbidden)**

```json
{
    "code": 403,
    "status": false,
    "message": "Access to this route is disabled."
}
```

---

### Paso 2 - Cargar el certificado digital (.p12)

`PUT http://apidian2024.oo/api/ubl2.1/config/certificate`

CONFIGURAR CERTIFICADO

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/certificate>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Este endpoint no tiene parametros en la URL.
* El campo certificate corresponde a una cadena resultante de codificar en base 64 el archivo .pfx ó .p12 correspondiente al certificado digital PKCS10 de la empresa. Dicho certificado se puede codificar en linea en la pagina [www.base64encode.org](http://www.base64encode.org) o si lo requiere hacer desde su propio ERP, debe encontrar la libreria o funcion para realizarlo, ejemplo: En php seria mediante esta funcion.

<https://www.php.net/manual/es/function.base64-encode.php>

* El campo password corresponde a la clave que fue entregada por su proveedor de certificados cuando fue adquirido.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `cache-control` | `no-cache` |
| `Connection` | `keep-alive` |
| `Accept-Encoding` | `gzip, deflate` |
| `accept` | `application/json` |
| `X-CSRF-TOKEN` | `` |

**Autenticación:** `bearer`

**Body**

```json
{
	"certificate": "MIACAQMwgAYJKoZIhvcNAQcBoIAkgASCA+gwgDCABgkqhkiG9w0BBwGggCSA…[base64 recortado, 9213 caracteres]",
	"password": "[CENSURADO]"
}
```

---

## 📁 01B - Configurar factura electronica

* Servicios exclusivos para Facturas Electronicas

### 📁 Resoluciones de notas credito y debito

* Servicios exclusivos para las Notas de Credito y Debito

#### Paso 3 - Crear la resolucion de nota credito

`PUT http://facturalatam-apidian.oo/api/ubl2.1/config/resolution`

CONFIGURAR RESOLUCION DE NOTAS CREDITO

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/resolution>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Este endpoint no tiene parametros en la URL.
* Los datos necesarios para llenar los campos JSON cuyo nombre finalice con "\_id" se encuentran en las tablas parametricas de la base de datos de la API, ejemplo:

type\_liability\_id, se debe especificar el id del registro correspondiente de la tabla type\_liabilities de la base de datos de la API.

* Este endpoint es muy similar al de configurar resolucion de facturas, tanto asi que se utiliza la misma URL, se diferencia en que la resolucion de notas credito no requiere una resolucion autorizada por la DIAN, por lo tanto los datos from, to y prefix, son escogidos por nosotros mismos.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"type_document_id": 4,
	"from": 1,
	"to": 99999999,
	"prefix": "NC",
    "resolution": "4" //numero libre para administrar las notas de credito
}
```

**Respuesta de ejemplo — Success (200 OK)**

```json
{
    "success": true,
    "message": "Resolución creada/actualizada con éxito",
    "resolution": {
        "id": 2,
        "type_document_id": 4,
        "prefix": "NC",
        "resolution": null,
        "resolution_date": null,
        "technical_key": null,
        "from": 1,
        "to": 99999999,
        "date_from": null,
        "date_to": null,
        "created_at": "2024-04-08 17:40:33",
        "updated_at": "2024-04-08 17:40:33",
        "number": 1,
        "next_consecutive": "NC1",
        "type_document": {
            "id": 4,
            "name": "Nota Crédito",
            "code": "91",
            "cufe_algorithm": "CUDE-SHA384",
            "prefix": "nc\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        }
    }
}
```

---

#### Paso 4 - Crear la resolucion de nota debito

`PUT http://apidian2023.oo/api/ubl2.1/config/resolution`

CONFIGURAR RESOLUCION DE NOTAS DEBITO

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/resolution>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Este endpoint no tiene parametros en la URL.
* Los datos necesarios para llenar los campos JSON cuyo nombre finalice con "\_id" se encuentran en las tablas parametricas de la base de datos de la API, ejemplo:

type\_liability\_id, se debe especificar el id del registro correspondiente de la tabla type\_liabilities de la base de datos de la API.

* Este endpoint es muy similar al de configurar resolucion de facturas, tanto asi que se utiliza la misma URL, se diferencia en que la resolucion de notas debito no requiere una resolucion autorizada por la DIAN, por lo tanto los datos from, to y prefix, son escogidos por nosotros mismos.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"type_document_id": 5,
	"from": 1,
	"to": 99999999,
	"prefix": "ND",
    "resolution": "5" //numero libre para administrar las notas de debito
}
```

---

### Paso 1 - Registrar el software de facturacion

`PUT http://apidian2024.oo/api/ubl2.1/config/software`

CONFIGURAR SOFTWARE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/software>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Este endpoint no tiene parametros en la URL.
* El campo id, corresponde al id de software que entrega la DIAN al momento de registrarse como facturador electronico y agregar modo de operacion software propio.
* El campo pin, corresponde al pin del software propio, este pin corresponde a un numero de 5 digitos que nosotros mismos escogimos al registrar dicho software.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `cache-control` | `no-cache` |
| `Connection` | `keep-alive` |
| `Accept-Encoding` | `gzip, deflate` |
| `accept` | `application/json` |
| `X-CSRF-TOKEN` | `` |

**Autenticación:** `bearer`

**Body**

```json
{
	"id": "82bf0c5e-0117-434d-9471-8a5ee58ae682",
	"pin": 12345
}
```

---

### Paso 2 - Crear la resolucion de facturacion

`PUT http://apidian2024.oo/api/ubl2.1/config/resolution`

Json que permite generar una resolución de Factura Electrónica

```
{
    "type_document_id": 1,
    "prefix": "SETP", // No debe contener números
    "resolution": "18760000001",
    "resolution_date": "2019-01-19",
    "technical_key": "[CLAVE TÉCNICA DE EJEMPLO CENSURADA]",
    "from": 990000000,
    "to": 995000000,
    "generated_to_date": 0,
    "date_from": "2019-01-19",
    "date_to": "2030-01-19"
}
```

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"type_document_id": 1,
	"prefix": "SETP",
	"resolution": "18760000001",
	"resolution_date": "2019-01-19",
	"technical_key": "[CLAVE TÉCNICA DE EJEMPLO CENSURADA]",
	"from": 990000000,
	"to": 995000000,
	"generated_to_date": 0,
	"date_from": "2019-01-19",
	"date_to": "2030-01-19"
}
```

---

## 📁 01C - Configurar nomina electronica

* Servicios exclusivos para las Nominas

### Paso 1 - Registrar el software de nomina electronica

`PUT http://apidian2024.oo/api/ubl2.1/config/softwarepayroll`

CONFIGURAR SOFTWARE DE NOMINA ELECTRONICA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/softwarepayroll>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* La nomina electronica usa un software distinto al de la factura electronica, por eso se registra en su propio endpoint y no reemplaza el configurado en la seccion 01B.
* Este endpoint no tiene parametros en la URL.
* El campo idpayroll, corresponde al id de software de nomina que entrega la DIAN al momento de habilitarse en el servicio de nomina electronica.
* El campo pinpayroll, corresponde al pin de ese software, un numero de 5 digitos que nosotros mismos escogimos al registrarlo.
* No se deben enviar los campos id y pin: esos corresponden al software de facturacion y lo sobrescribirian.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `cache-control` | `no-cache` |
| `Connection` | `keep-alive` |
| `Accept-Encoding` | `gzip, deflate` |
| `accept` | `application/json` |
| `X-CSRF-TOKEN` | `` |

**Autenticación:** `bearer`

**Body**

```json
{
	"idpayroll": "880eafd9-f445-4e0b-a355-92063e1557a4",
	"pinpayroll": 12345
}
```

**Respuesta de ejemplo — Paso 7 - Config-Software Payroll (200 OK)**

```json
{
    "success": true,
    "message": "Software creado/actualizado con éxito",
    "software": {
        "id": 2,
        "identifier": "2b4d1506-8af0-4c9a-96b8-4630addc5f59",
        "pin": "[CENSURADO]",
        "identifier_payroll": "0162cc7e-68f9-4145-a227-0957b4f75e19",
        "pin_payroll": "[CENSURADO]",
        "identifier_eqdocs": "",
        "pin_eqdocs": "",
        "url": "https://vpfe-hab.dian.gov.co/WcfDianCustomerServices.svc",
        "url_payroll": "https://vpfe-hab.dian.gov.co/WcfDianCustomerServices.svc",
        "url_eqdocs": "https://vpfe-hab.dian.gov.co/WcfDianCustomerServices.svc",
        "created_at": "2025-03-05 15:30:28",
        "updated_at": "2025-03-18 16:04:32"
    }
}
```

---

### Paso 2 - Crear la resolucion de nomina electronica

`PUT http://apidian2023.oo/api/ubl2.1/config/resolution`

CONFIGURAR RESOLUCION DE NOMINA ELECTRONICA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/resolution>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Este endpoint no tiene parametros en la URL.
* Los datos necesarios para llenar los campos JSON cuyo nombre finalice con "\_id" se encuentran en las tablas parametricas de la base de datos de la API, ejemplo:

type\_liability\_id, se debe especificar el id del registro correspondiente de la tabla type\_liabilities de la base de datos de la API.

* Este endpoint es muy similar al de configurar resolucion de facturas, tanto asi que se utiliza la misma URL, se diferencia en que la resolucion de nomina electronica no requiere una resolucion autorizada por la DIAN, por lo tanto los datos from, to y prefix, son escogidos por nosotros mismos.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"type_document_id": 9,
	"from": 1,
	"to": 99999999,
	"prefix": "NI",
    "resolution_number": 9
}
```

---

### Paso 3 - Crear la resolucion de nota de ajuste de nomina

`PUT http://apidian202.oo/api/ubl2.1/config/resolution`

CONFIGURAR RESOLUCION DE NOTA DE AJUSTE DE NOMINA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/resolution>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Este endpoint no tiene parametros en la URL.
* Es la numeracion de las notas de ajuste de nomina (las que reemplazan o eliminan una nomina ya enviada) y es independiente de la resolucion de nomina del Paso 2: se diferencia por el type\_document\_id y debe llevar su propio prefix.
* Como la resolucion de nomina, no requiere una resolucion autorizada por la DIAN, por lo tanto los datos from, to y prefix son escogidos por nosotros mismos.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"type_document_id": 10,
	"from": 1,
	"to": 99999999,
	"prefix": "NA",
    "resolution_number": 10
}
```

---

## 📁 01D - Configurar documento soporte

* Servicios exclusivos para los Documentos de soporte

### Paso 1 - Registrar el software de documento soporte

`PUT http://apidian2024.oo/api/ubl2.1/config/softwaresupportdocument`

CONFIGURAR SOFTWARE DE DOCUMENTO SOPORTE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/softwaresupportdocument>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* El documento soporte usa un software distinto al de la factura electronica, por eso se registra en su propio endpoint y no reemplaza el configurado en la seccion 01B.
* Este endpoint no tiene parametros en la URL.
* El campo idsupportdocument, corresponde al id de software de documento soporte que entrega la DIAN al momento de habilitarse en ese servicio.
* El campo pinsupportdocument, corresponde al pin de ese software, un numero de 5 digitos que nosotros mismos escogimos al registrarlo.
* No se deben enviar los campos id y pin: esos corresponden al software de facturacion y lo sobrescribirian.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `cache-control` | `no-cache` |
| `Connection` | `keep-alive` |
| `Accept-Encoding` | `gzip, deflate` |
| `accept` | `application/json` |
| `X-CSRF-TOKEN` | `` |

**Autenticación:** `bearer`

**Body**

```json
{
	"idsupportdocument": "82bf0c5e-0117-434d-9471-8a5ee58ae682",
	"pinsupportdocument": 12345
}
```

---

### Paso 2 - Crear la resolucion de documento soporte

`PUT http://facturalatam-apidian.oo/api/ubl2.1/config/resolution`

CONFIGURAR RESOLUCION DE DOCUMENTO SOPORTE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/resolution>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Este endpoint no tiene parametros en la URL.
* Los datos necesarios para llenar los campos JSON cuyo nombre finalice con "\_id" se encuentran en las tablas parametricas de la base de datos de la API, ejemplo:

type\_liability\_id, se debe especificar el id del registro correspondiente de la tabla type\_liabilities de la base de datos de la API.

* El campo technical\_key, corresponde a la clave tecnica de la resolucion, este dato en habilitacion siempre es el mismo: fc8eac422eba16e22ffd8c6f94b3f40a6e38162c, pero en produccion esta llave tecnica se debe consultar con el endpoint getnumberingrange de la seccion 06 - Paso a Produccion.
* Los demas datos, como date\_from, date\_to resolution, prefix, etc., son datos que se incluyen en el documento 1876 que entrega la DIAN cuando se solicita una resolucion de facturacion electronica.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"type_document_id": 11,
	"prefix": "SEDS",
	"resolution": "18760000001",
	"resolution_date": "2022-01-01",
	"from": 984000000,
	"to": 985000000,
	"generated_to_date": 0,
	"date_from": "2022-01-01",
	"date_to": "2022-12-31"
}
```

**Respuesta de ejemplo — Success (200 OK)**

```json
{
    "success": true,
    "message": "Resolución creada/actualizada con éxito",
    "resolution": {
        "type_document_id": 11,
        "resolution": "18760000001",
        "prefix": "SEDS",
        "resolution_date": "2022-01-01",
        "technical_key": null,
        "from": 984000000,
        "to": 985000000,
        "date_from": "2022-01-01",
        "date_to": "2022-12-31",
        "updated_at": "2025-01-30 14:43:23",
        "created_at": "2025-01-30 14:43:23",
        "id": 13,
        "number": 984000000,
        "next_consecutive": "SEDS984000000"
    }
}
```

---

### Paso 3 - Crear la resolucion de nota de ajuste de documento soporte

`PUT http://apidian2023.oo/api/ubl2.1/config/resolution`

CONFIGURAR RESOLUCION DE NOTA DE AJUSTE DE DOCUMENTO SOPORTE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/resolution>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Este endpoint no tiene parametros en la URL.
* Es la numeracion de las notas de ajuste al documento soporte, las que se envian al endpoint .../ubl2.1/sd-credit-note. Se utiliza la misma URL de la resolucion de facturas y lo que la diferencia es el campo type\_document\_id.
* Debe tener su propio prefix, distinto al del documento soporte del Paso 2.
* Como la resolucion de documento soporte, no requiere una resolucion autorizada por la DIAN, por lo tanto los datos from, to y prefix son escogidos por nosotros mismos.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"type_document_id": 13,
	"from": 1,
	"to": 99999999,
	"prefix": "NDS",
    "resolution": 12
}
```

---

## 📁 01E - Configurar documentos equivalentes

* servicios exclusivos para documentos equivalentes

### Paso 1 - Registrar el software de documentos equivalentes

`PUT http://apidian2024.oo/api/ubl2.1/config/softwareeqdocs`

CONFIGURAR SOFTWARE DE DOCUMENTOS EQUIVALENTES

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/softwareeqdocs>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Los documentos equivalentes usan un software distinto al de la factura electronica, por eso se registra en su propio endpoint y no reemplaza el configurado en la seccion 01B.
* Un unico software cubre todos los tipos de documento equivalente (POS, transporte terrestre, servicios publicos, boleta de cine, etc.).
* Este endpoint no tiene parametros en la URL.
* El campo ideqdocs, corresponde al id de software de documentos equivalentes que entrega la DIAN al momento de habilitarse en ese servicio.
* El campo pineqdocs, corresponde al pin de ese software, un numero de 5 digitos que nosotros mismos escogimos al registrarlo.
* No se deben enviar los campos id y pin: esos corresponden al software de facturacion y lo sobrescribirian.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `cache-control` | `no-cache` |
| `Connection` | `keep-alive` |
| `Accept-Encoding` | `gzip, deflate` |
| `accept` | `application/json` |
| `X-CSRF-TOKEN` | `` |

**Autenticación:** `bearer`

**Body**

```json
{
	"ideqdocs": "6edae6bd-3003-492f-bf0b-b23c32f46333",
	"pineqdocs": 12345
}
```

---

### Paso 2 - Crear la resolucion de documento equivalente POS

`PUT http://apidian2024.oo/api/ubl2.1/config/resolution`

CONFIGURAR RESOLUCION DE DOCUMENTOS EQUIVALENTES - POS

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/resolution>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Este endpoint no tiene parametros en la URL.
* Se utiliza la misma URL de la resolucion de facturas; lo que define a cual numeracion corresponde es el campo type\_document\_id, que para el documento equivalente POS es el 15.
* Cada tipo de documento equivalente necesita su propia resolucion y su propio prefix, aunque todos compartan el software configurado en el Paso 1.
* Los documentos equivalentes no requieren clave tecnica, por lo que no se envia el campo technical\_key.
* Los demas datos, como resolution, date\_from, date\_to, from, to y prefix, son los que la DIAN autorizo para esa numeracion.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"type_document_id": 15,
	"prefix": "EPOS",
	"resolution": "18760000001",
	"resolution_date": "2019-01-19",
	"from": 1,
	"to": 1000000,
	"generated_to_date": 0,
	"date_from": "2019-01-19",
	"date_to": "2030-01-19"
}
```

---

### Paso 3 - Crear la resolucion de tiquete de transporte terrestre

`PUT http://apidian2024.oo/api/ubl2.1/config/resolution`

CONFIGURAR RESOLUCION DE DOCUMENTOS EQUIVALENTES - TRANSPORTE TERRESTRE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/resolution>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Este endpoint no tiene parametros en la URL.
* Se utiliza la misma URL de la resolucion de facturas; lo que define a cual numeracion corresponde es el campo type\_document\_id, que para el tiquete de transporte de pasajeros terrestre es el 19.
* Cada tipo de documento equivalente necesita su propia resolucion y su propio prefix, aunque todos compartan el software configurado en el Paso 1.
* Los documentos equivalentes no requieren clave tecnica, por lo que no se envia el campo technical\_key.
* Los demas datos, como resolution, date\_from, date\_to, from, to y prefix, son los que la DIAN autorizo para esa numeracion.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"type_document_id": 19,
	"prefix": "DETP",
	"resolution": "DETP",
	"resolution_date": "2024-01-01",
	"from": 1,
	"to": 100000,
	"generated_to_date": 0,
	"date_from": "2024-01-01",
	"date_to": "2030-01-01"
}
```

---

### Paso 4 - Crear la resolucion de servicios publicos domiciliarios

`PUT http://apidian2024.oo/api/ubl2.1/config/resolution`

CONFIGURAR RESOLUCION DE DOCUMENTOS EQUIVALENTES - SERVICIOS PUBLICOS

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/resolution>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Este endpoint no tiene parametros en la URL.
* Se utiliza la misma URL de la resolucion de facturas; lo que define a cual numeracion corresponde es el campo type\_document\_id, que para el documento expedido para los servicios publicos y domiciliarios es el 24.
* Cada tipo de documento equivalente necesita su propia resolucion y su propio prefix, aunque todos compartan el software configurado en el Paso 1.
* Los documentos equivalentes no requieren clave tecnica, por lo que no se envia el campo technical\_key.
* Los demas datos, como resolution, date\_from, date\_to, from, to y prefix, son los que la DIAN autorizo para esa numeracion.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"type_document_id": 24,
	"prefix": "SSP",
	"resolution": "SSP",
	"resolution_date": "2024-01-01",
	"from": 1,
	"to": 100000,
	"generated_to_date": 0,
	"date_from": "2024-01-01",
	"date_to": "2030-01-01"
}
```

---

### Paso 5 - Crear la resolucion de boleta de ingreso a cine

`PUT http://apidian2024.oo/api/ubl2.1/config/resolution`

CONFIGURAR RESOLUCION DE DOCUMENTOS EQUIVALENTES - BOLETA DE INGRESO A CINE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/resolution>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Este endpoint no tiene parametros en la URL.
* Se utiliza la misma URL de la resolucion de facturas; lo que define a cual numeracion corresponde es el campo type\_document\_id, que para la boleta de ingreso a cine es el 16.
* Cada tipo de documento equivalente necesita su propia resolucion y su propio prefix, aunque todos compartan el software configurado en el Paso 1.
* Los documentos equivalentes no requieren clave tecnica, por lo que no se envia el campo technical\_key.
* Los demas datos, como resolution, date\_from, date\_to, from, to y prefix, son los que la DIAN autorizo para esa numeracion.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"type_document_id": 16,
	"prefix": "CIN",
	"resolution": "CIN",
	"resolution_date": "2024-01-01",
	"from": 1,
	"to": 100000,
	"generated_to_date": 0,
	"date_from": "2024-01-01",
	"date_to": "2030-01-01"
}
```

---

### Paso 6 - Crear la resolucion de nota credito de documentos equivalentes

`PUT http://apidian2024.oo/api/ubl2.1/config/resolution`

CONFIGURAR RESOLUCION DE NOTAS CREDITO DE DOCUMENTOS EQUIVALENTES

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/resolution>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Este endpoint no tiene parametros en la URL.
* Es la numeracion de las notas de ajuste de tipo credito al documento equivalente, cuyo type\_document\_id es el 26. Se utiliza la misma URL de la resolucion de facturas.
* Es una sola resolucion para las notas credito de todos los tipos de documento equivalente y debe tener su propio prefix.
* No requiere una resolucion autorizada por la DIAN, por lo tanto los datos from, to y prefix son escogidos por nosotros mismos.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"type_document_id": 26,
	"from": 1,
	"to": 99999999,
	"prefix": "NCP"
}
```

---

### Paso 7 - Crear la resolucion de nota debito de documentos equivalentes

`PUT http://apidian2024.oo/api/ubl2.1/config/resolution`

CONFIGURAR RESOLUCION DE NOTAS DEBITO DE DOCUMENTOS EQUIVALENTES

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/resolution>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Este endpoint no tiene parametros en la URL.
* Es la numeracion de las notas de ajuste de tipo debito al documento equivalente, cuyo type\_document\_id es el 25. Se utiliza la misma URL de la resolucion de facturas.
* Es una sola resolucion para las notas debito de todos los tipos de documento equivalente y debe tener su propio prefix, distinto al de las notas credito del Paso 5.
* No requiere una resolucion autorizada por la DIAN, por lo tanto los datos from, to y prefix son escogidos por nosotros mismos.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"type_document_id": 25,
	"from": 1,
	"to": 99999999,
	"prefix": "NDP"
}
```

---

## Crear la resolucion de factura de contingencia

`PUT http://apidian2024.oo/api/ubl2.1/config/resolution`

CONFIGURAR RESOLUCION DE CONTINGENCIA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/resolution>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Este endpoint no tiene parametros en la URL.
* Los datos necesarios para llenar los campos JSON cuyo nombre finalice con "\_id" se encuentran en las tablas parametricas de la base de datos de la API, ejemplo:

type\_liability\_id, se debe especificar el id del registro correspondiente de la tabla type\_liabilities de la base de datos de la API.

* Este endpoint es muy similar al de configurar resolucion de facturas, tanto asi que se utiliza la misma URL unicamente se diferencia en el campo type\_document\_id

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"type_document_id": 3,
	"prefix": "SETP",
	"resolution": "18760000001",
	"resolution_date": "2001-01-01",
	"technical_key": "[CLAVE TÉCNICA DE EJEMPLO CENSURADA]",
	"from": 990000000,
	"to": 995000000,
	"generated_to_date": 0,
	"date_from": "2019-01-19",
	"date_to": "2030-01-19"
}
```

---

## Crear la resolucion de factura de exportacion

`PUT http://apidian2024.oo/api/ubl2.1/config/resolution`

CONFIGURAR RESOLUCION DE EXPORTACION

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/resolution>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Este endpoint no tiene parametros en la URL.
* Los datos necesarios para llenar los campos JSON cuyo nombre finalice con "\_id" se encuentran en las tablas parametricas de la base de datos de la API, ejemplo:

type\_liability\_id, se debe especificar el id del registro correspondiente de la tabla type\_liabilities de la base de datos de la API.

* Este endpoint es muy similar al de configurar resolucion de facturas, tanto asi que se utiliza la misma URL unicamente se diferencia en el campo type\_document\_id

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"type_document_id": 2,
	"prefix": "SETP",
	"resolution": "18760000001",
	"resolution_date": "2019-01-19",
	"technical_key": "[CLAVE TÉCNICA DE EJEMPLO CENSURADA]",
	"from": 990000000,
	"to": 995000000,
	"generated_to_date": 0,
	"date_from": "2019-01-19",
	"date_to": "2030-01-19"
}
```

---
