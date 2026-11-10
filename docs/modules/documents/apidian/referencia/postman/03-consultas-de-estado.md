# 03 - Consultas de Estado

> Fuente: colección Postman pública «FacturaLatam ApiDianV2.1» (<https://documenter.getpostman.com/view/50442293/2sBYHUSfRJ>), descargada el 10-nov-2026. Tokens y secretos censurados; base64 largos recortados.

Son los request que nos permiten una vez se haya enviado los primeros documentos, consultar el estado de
estos envios para saber el porque fueron rechazados o en su defecto, saber si fue autorizado dicho
documento.

## Estado de una factura por ZIP_KEY

`POST http://apidian2024.oo/api/ubl2.1/status/zip/b97308d9-968b-463a-a31a-94159a95e6ed`

CONSULTA DE ESTADO POR ZIP\_KEY

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/status/zip>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* En URL el ultimo parametro corresponde al zip\_key que el response del envio de un documento electronico en modo asincrono retorno.

.../ubl2.1/invoice/status/zip/codigodelzip\_key

* El response de este endpoint muestra si el documento electronico fue valido o si fue rechazado, en cuyo caso mostrara las reglas de validacion por las cuales se rechazo.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"sendmail": false,
    "sendmailtome": false,
    "is_payroll": false,
    "is_eqdoc": true
}
```

---

## Estado de una nomina por ZIP_KEY

`POST http://apidian2023.oo/api/ubl2.1/status/zip/7a89a4e4-ecb3-4eca-8ebb-6209c40477ce`

CONSULTA DE ESTADO POR ZIP\_KEY

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/status/zip>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* En URL el ultimo parametro corresponde al zip\_key que el response del envio de un documento electronico en modo asincrono retorno.

.../ubl2.1/invoice/status/zip/codigodelzip\_key

* El response de este endpoint muestra si el documento electronico fue valido o si fue rechazado, en cuyo caso mostrara las reglas de validacion por las cuales se rechazo.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"sendmail": true,
    "sendmailtome": true,
    "is_payroll": true 
}
```

**Respuesta de ejemplo — Paso 1 - GetStatus-zip Nomina (200 OK)**

```json
{
    "message": "Consulta generada con éxito",
    "ResponseDian": {
        "Envelope": {
            "Header": {
                "Action": {
                    "_attributes": {
                        "mustUnderstand": "1"
                    },
                    "_value": "http://wcf.dian.colombia/IWcfDianCustomerServices/GetStatusZipResponse"
                },
                "Security": {
                    "_attributes": {
                        "mustUnderstand": "1"
                    },
                    "Timestamp": {
                        "_attributes": {
                            "Id": "_0"
                        },
                        "Created": "2025-03-12T20:45:21.064Z",
                        "Expires": "2025-03-12T20:50:21.064Z"
                    }
                }
            },
            "Body": {
                "GetStatusZipResponse": {
                    "GetStatusZipResult": {
                        "DianResponse": {
                            "ErrorMessage": {},
                            "IsValid": "true",
                            "StatusCode": "00",
                            "StatusDescription": "Procesado Correctamente.",
                            "StatusMessage": "La Nomima Individual De Ajustes NA-10, ha sido autorizada.",
                            "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiIHN0YW5kYWxv…[base64 recortado, 14676 caracteres]",
                            "XmlBytes": {
                                "_attributes": {
                                    "nil": "true"
                                }
                            },
                            "XmlDocumentKey": "[CUFE DE EJEMPLO]",
                            "XmlFileName": "na09018462800002500000017"
                        }
                    }
                }
            }
        }
    },
    "reqzip": "PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzb2FwOkVudmVsb3BlIHhtbG5zOnNv…[base64 recortado, 7280 caracteres]",
    "rptazip": "PHM6RW52ZWxvcGUgeG1sbnM6cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMy8w…[base64 recortado, 21512 caracteres]",
    "attacheddocument": "",
    "certificate_days_left": 169
}
```

---

## Estado de una factura por CUFE

`POST http://apidian2024.oo/api/ubl2.1/status/document/d4905dbc009d247fd3926aae5a7e459e919a72792a231c45d549f0b0e5b07f0e2399c3a49003b556ff8ed9bedc5c72ac`

CONSULTA DE ESTADO POR CUFE, CUDE, CUNE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/status/document>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* En URL el ultimo parametro corresponde al uuid del documento que se quiere consultar, este uuid puede ser un cufe si es una factura electronica, un cude si es otro documento o un cune si es un documento de nomina.

.../ubl2.1/invoice/status/document/uuiddeldocumentoaconsultar

* El response de este endpoint muestra si el documento electronico fue valido o si fue rechazado, en cuyo caso mostrara las reglas de validacion por las cuales se rechazo.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"sendmail": true,
    "sendmailtome": true,
    "is_payroll": false,
    "is_eqdoc": false
}
```

---

## Estado de una nomina por CUNE

`POST http://apidian2023.oo/api/ubl2.1/status/document/bd07eb71012b593fc2ad42d79cdea403a422204422a3cc8b7822b075d5c44ac388f3159c127b00a2288b97410273a4ff`

CONSULTA DE ESTADO POR CUFE, CUDE, CUNE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/status/document>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* En URL el ultimo parametro corresponde al uuid del documento que se quiere consultar, este uuid puede ser un cufe si es una factura electronica, un cude si es otro documento o un cune si es un documento de nomina.

.../ubl2.1/invoice/status/document/uuiddeldocumentoaconsultar

* El response de este endpoint muestra si el documento electronico fue valido o si fue rechazado, en cuyo caso mostrara las reglas de validacion por las cuales se rechazo.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"sendmail": true,
    "sendmailtome": false,
    "is_payroll": true,
    "atacheddocument_name_prefix": "FES-SETP990000263-",
    "html_header": "<h1 style=\"color: #5e9ca0;\">Se&ntilde;or(es), XXXXXXXXXXXXXXXXXXX identificado con NIT 99999999-9</h1><h2 style=\"color: #2e6c80;\">Le informamos que ha recibido un documento electronico de: YYYYYYYYYYYYYYYYYYYYYYYYY</h2>",
    "html_buttons": "<table style=\"border-collapse: collapse; width: 100%;\" border=\"1\"><tbody><tr><td style=\"width: 100%;\"><h2><strong><span style=\"color: #008080;\">Puede descargar su factura mediante el siguiente enlace:</span></strong></h2></td></tr><tr><td style=\"width: 100%;\"><h4><a href=\"https://www.facilwebnube.com/apidian2021/public/index.php/api/download/88261176/FES-FE369.pdf\" target=\"_blank\">Haga click aqui para descargar su factura.</a></h4></td></tr></tbody></table>",
    "html_footer": "<table style=\"border-collapse: collapse; width: 100%;\" border=\"1\"><tbody><tr><td style=\"width: 100%;\"><h2><strong><span style=\"color: #008080;\">Previamente recibio un correo con las credenciales de ingreso a la plataforma.</span></strong></h2></td></tr><tr><td style=\"width: 100%;\"><div><h4><strong>Este es un sistema autom&aacute;tico de aviso, por favor no responda este mensaje de correo.</strong></h4></div></td></tr></tbody></table>"
}
```

---

## Eventos registrados de un documento por CUFE

`POST http://apidian2024.oo/api/ubl2.1/status/events-document/60f3eee79b3f7d019524f554a40e8c87008cd6686a66816246861609a54bc90e5266af9b989f84168cf68d3a88104e72`

CONSULTA DE ESTADO POR CUFE, CUDE, CUNE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/status/document>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* En URL el ultimo parametro corresponde al uuid del documento que se quiere consultar, este uuid puede ser un cufe si es una factura electronica, un cude si es otro documento o un cune si es un documento de nomina.

.../ubl2.1/invoice/status/document/uuiddeldocumentoaconsultar

* El response de este endpoint muestra si el documento electronico fue valido o si fue rechazado, en cuyo caso mostrara las reglas de validacion por las cuales se rechazo.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

---
