# 10 - Regenerar PDFs

> Fuente: colección Postman pública «FacturaLatam ApiDianV2.1» (<https://documenter.getpostman.com/view/50442293/2sBYHUSfRJ>), descargada el 10-nov-2026. Tokens y secretos censurados; base64 largos recortados.

## Regenerar el PDF enviando el JSON del documento

`POST http://apidian2023.oo/api/ubl2.1/regeneratepdf`

REGENERAR EL PDF DE UN DOCUMENTO ENVIANDO EL JSON

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/regeneratepdf>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Vuelve a generar la representacion grafica (PDF) de un documento ya enviado a la DIAN, sin transmitirlo de nuevo y sin consumir consecutivo.
* Este endpoint no tiene parametros en la URL: se envia el mismo JSON con el que se genero el documento, agregando el campo cufe del documento original. Si el documento no se encuentra por el cufe, se busca por los campos prefix y number del mismo JSON.
* Es util cuando se cambio la plantilla o el logo de la empresa y se necesita el PDF actualizado. Para regenerarlo sin tener el JSON a mano, use el request Regenerar Documento Con URL.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "cufe": "c4075c096de4eb5f6ab17697936fb1687e468bb73f015bfe62701af753c7f1878614234734efea07e76bc3edfb922e44",
	"number": 990000667,
	"type_document_id": 1,
	"date": "2022-10-26",
	"time": "04:08:12",
	"resolution_number": "18760000001",
	"prefix": "SETP",
    "notes": "ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA",
    "disable_confirmation_text": true,
    "establishment_name": "TORRE SOFTWARE",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "atacheddocument_name_prefix": "FES-SETP990000244-",
    "establishment_email": "alternate_email@alternate.com",
	"sendmail": true,
    "sendmailtome": true,
    "seze": "2021-2017",
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL PIE DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
	"customer": {
		"identification_number": 800135582,
		"dv": 7,
		"name": "FUNDACION ALEJANDRO LONDOÑO",
		"phone": "3105193539",
		"address": "CLL 4 NRO 33-90",
		"email": "gerencia@torresoftware.com",
		"merchant_registration": "0000000-00",
		"type_document_identification_id": 6,
		"type_organization_id": 1,
        "type_liability_id": 117,
		"municipality_id": 822,
		"type_regime_id": 1
	},
	"payment_form": {
		"payment_form_id": 2,
		"payment_method_id": 30,
		"payment_due_date": "2022-11-26",
		"duration_measure": "30"
	},	
	"allowance_charges": [
		{
			"discount_id": 1,
			"charge_indicator": false,
			"allowance_charge_reason": "DESCUENTO GENERAL",
			"amount": "50000.00",
			"base_amount": "1000000.00"
		}
	],
	"legal_monetary_totals": {
		"line_extension_amount": "840336.134",
		"tax_exclusive_amount": "840336.134",
		"tax_inclusive_amount": "1000000.00",
		"allowance_total_amount": "50000.00",
		"payable_amount": "950000.00"
	},
	"tax_totals": 
	[
		{
			"tax_id": 1,
			"tax_amount": "159663.865",
			"percent": "19",
			"taxable_amount": "840336.134"
		}
	],
	"invoice_lines": 
	[
		{
			"unit_measure_id": 70,
			"invoiced_quantity": "1",
			"line_extension_amount": "840336.134",
			"free_of_charge_indicator": false,
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "159663.865",
					"taxable_amount": "840336.134",
					"percent": "19.00"
				}
			],
			"description": "COMISION POR SERVICIOS",
            "notes": "ESTA ES UNA PRUEBA DE NOTA DE DETALLE DE LINEA.",
			"code": "COMISION",
			"type_item_identification_id": 4,
			"price_amount": "1000000.00",
			"base_quantity": "1"
		}
	]
}
```

---

## Regenerar el PDF por prefijo, numero y CUFE

`POST http://apidian2023.oo/api/ubl2.1/regeneratepdf/SETP/990000667/c4075c096de4eb5f6ab17697936fb1687e468bb73f015bfe62701af753c7f1878614234734efea07e76bc3edfb922e44`

REGENERAR EL PDF DE UN DOCUMENTO POR URL

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/regeneratepdf/SETP/990000667/elcufedeldocumento>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Vuelve a generar la representacion grafica (PDF) de un documento ya enviado a la DIAN, sin transmitirlo de nuevo y sin consumir consecutivo.
* En URL los tres parametros corresponden al prefijo, al numero y al CUFE (o CUDE / CUNE) del documento:

.../ubl2.1/regeneratepdf/prefijo/numero/cufe

* A diferencia del request anterior no requiere el JSON del documento: la API reconstruye el PDF con los datos que ya tiene almacenados.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

---

## Listar las plantillas de PDF disponibles

`GET http://facturalatam-apidian.oo/api/templates`

LISTA DE PLANTILLAS PDF DISPONIBLES

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/templates>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* No requiere cuerpo. Acepta el parametro de consulta type, que indica el tipo de documento: factura, pos (documento equivalente), soporte (documento soporte) o nomina. Tambien se aceptan los alias en ingles invoice, eqdocs, support-document y payroll. Si no se envia type se asume factura.
* Devuelve las plantillas de representacion grafica que trae la API para ese tipo y la que tiene asignada la empresa. Para ver las de los demas tipos hay que llamar .../templates?type=pos, ?type=soporte o ?type=nomina.
* Para cambiarla se usa el request Actualizar la plantilla de la compañia.

**Headers**

| Header | Valor |
|---|---|
| `Cookie` | `XSRF-TOKEN=[VALOR CIFRADO CENSURADO]%3D%3D; apidian_session=[VALOR CIFRADO CENSURADO]` |
| `Cache-Control` | `no-cache` |
| `Postman-Token` | `<calculated when request is sent>` |
| `Host` | `<calculated when request is sent>` |
| `User-Agent` | `PostmanRuntime/7.39.1` |
| `Accept` | `*/*` |
| `Accept-Encoding` | `gzip, deflate, br` |
| `Connection` | `keep-alive` |
| `Accept` | `application/json` |
| `Content-type` | `application/json` |

**Autenticación:** `bearer`

**Respuesta de ejemplo — Lista de Plantillas PDF disponibles (200 OK)**

```json
{
    "templates": [
        {
            "id": "1",
            "name": "template1.blade.php",
            "image_url": "http://facturalatam-apidian.oo/pdf/template1.png"
        },
        {
            "id": "2",
            "name": "template2.blade.php",
            "image_url": "http://facturalatam-apidian.oo/pdf/template2.png"
        },
        {
            "id": "3",
            "name": "template3.blade.php",
            "image_url": "http://facturalatam-apidian.oo/pdf/template3.png"
        },
        {
            "id": "4",
            "name": "template4.blade.php",
            "image_url": "http://facturalatam-apidian.oo/pdf/template4.png"
        },
        {
            "id": "5",
            "name": "template5.blade.php",
            "image_url": "http://facturalatam-apidian.oo/pdf/template5.png"
        },
        {
            "id": "6",
            "name": "template6.blade.php",
            "image_url": "http://facturalatam-apidian.oo/pdf/template6.png"
        }
    ]
}
```

---

## Cambiar la plantilla de PDF de la empresa

`PUT http://facturalatam-apidian.oo/api/templates`

ACTUALIZAR LA PLANTILLA PDF DE LA COMPAÑIA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/templates>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Este endpoint no tiene parametros en la URL.
* El campo type indica a que tipo de documento se le cambia la plantilla: factura, pos, soporte o nomina. Las notas credito y debito usan la misma plantilla de la factura.
* El campo id es el numero de la plantilla, de los que devuelve el request Lista de Plantillas PDF disponibles.
* El cambio aplica a los documentos que se generen desde ese momento; para rehacer el PDF de uno ya enviado se usan los request de la seccion 10 - Regenerar PDFs.

**Headers**

| Header | Valor |
|---|---|
| `Cookie` | `XSRF-TOKEN=[VALOR CIFRADO CENSURADO]%3D%3D; apidian_session=[VALOR CIFRADO CENSURADO]` |
| `Cache-Control` | `no-cache` |
| `Postman-Token` | `<calculated when request is sent>` |
| `Host` | `<calculated when request is sent>` |
| `User-Agent` | `PostmanRuntime/7.39.1` |
| `Accept` | `*/*` |
| `Accept-Encoding` | `gzip, deflate, br` |
| `Connection` | `keep-alive` |
| `Accept` | `application/json` |
| `Content-type` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "type": "factura", //(factura) - pos - soporte - nomina
    "id": "2"
}
```

**Respuesta de ejemplo — Actualizar la plantilla de la compañia (200 OK)**

```json
{
    "success": true,
    "message": "Plantilla actualizada correctamente."
}
```

---
