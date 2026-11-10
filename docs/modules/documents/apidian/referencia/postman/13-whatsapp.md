# 13 - WhatsApp

> Fuente: colección Postman pública «FacturaLatam ApiDianV2.1» (<https://documenter.getpostman.com/view/50442293/2sBYHUSfRJ>), descargada el 10-nov-2026. Tokens y secretos censurados; base64 largos recortados.

## 📁 Configuracion

### Configurar la cuenta de WhatsApp

`PUT http://facturalatam-apidian.oo/api/whatsapp-config`

Para obtener su url\_whatsapp y generar su token comuniquese al WhatsApp de [FacturaLatam](https://waya.lat/sign-up)

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "url_whatsapp": "https://tu-url-whatsapp.com",//ingresar la url base
    "token_whatsapp": "[CENSURADO]"//token proporcionado al conectar su WhatsApp
}
```

---

### Consultar la URL de conexion de WhatsApp

`GET http://facturalatam-apidian.oo/api/whatsapp-config`

Puedes consultar tu url\_whatsapp si es que ya tiene una configurada

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

---

## 📁 Mensajes

### Enviar un mensaje de texto por WhatsApp

`POST http://facturalatam-apidian.oo/api/whatsapp-config/send-message`

Permite enviar un mensaje de texto por WhatsApp al numero indicado en el campo number, sin adjuntar ningun documento. Requiere tener configurada la url\_whatsapp con el request Configurar WhatsApp.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "number": "123456789",//numero al que quiere enviar el mensaje
    "message": "Mensaje de prueba"
}
```

---

## 📁 Envio de documentos

### Enviar una factura por WhatsApp al facturar

`POST http://facturalatam-apidian.oo/api/ubl2.1/invoice`

Para que los documentos generados puedan ser enviados desde el numero de WhatsApp anteriormente configurado,necesitamos agregar en campo

```
"send_whatsapp": true
```

e ingresar en customer el numero al que se le quiere enviar

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990060201,
	"type_document_id": 1,
	"date": "2025-05-29",
	"time": "04:08:12",
	"resolution_number": "18760000001",
	"prefix": "SETP",
    "establishment_name": "TORRE SOFTWARE",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "establishment_email": "alternate_email@alternate.com",
    "send_whatsapp": true,//enviar este campo en true para el envio
	"customer": {
		"identification_number": 900166483,
		"dv": 1,
		"name": "INVERSIONES DAVAL SAS",
		"phone": "123456789",//debe ingresar el numero al que quiere enviar el documento
		"address": "CLL 4 NRO 33-90",
		"email": "gerencia@torresoftware.com",
		"merchant_registration": "0000000-00",
		"type_document_identification_id": 6,
		"type_organization_id": 1,
        "type_liability_id": 7,
		"municipality_id": 822,
		"type_regime_id": 1
	},
	"payment_form": {
		"payment_form_id": 1,
		"payment_method_id": 10,
		"payment_due_date": "2025-05-29",
		"duration_measure": "0"
	},	
	"legal_monetary_totals": {
		"line_extension_amount": "769500.00",
		"tax_exclusive_amount": "950000.00",
		"tax_inclusive_amount": "950000.00",
        "allowance_total_amount": "0.00",
		"payable_amount": "950000.00"
	},
	"tax_totals": 
	[
		{
			"tax_id": 1,
			"tax_amount": "180500",
			"percent": "19",
			"taxable_amount": "950000.00"
		}
	],
	"invoice_lines": 
	[
		{
			"unit_measure_id": 70,
			"invoiced_quantity": "1",
			"line_extension_amount": "769500.00",
			"free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": false,
					"allowance_charge_reason": "DESCUENTO GENERAL",
					"amount": "50000.00",
					"base_amount": "1000000.00"
				}
			],
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "180500",
					"taxable_amount": "950000",
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
