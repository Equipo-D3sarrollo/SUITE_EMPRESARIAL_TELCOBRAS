# 04 - Casuisticas de Envios

> Fuente: colección Postman pública «FacturaLatam ApiDianV2.1» (<https://documenter.getpostman.com/view/50442293/2sBYHUSfRJ>), descargada el 10-nov-2026. Tokens y secretos censurados; base64 largos recortados.

Se incluyen estos request para ejemplificar el envio de documentos con varias casuisticas, varios invoice
lines, varias tarifas de impuestos, incluyendo cargos, incluyendo descuentos, etc.

## Factura con referencia a orden de compra

`POST http://facturalatam-apidian.oo/api/ubl2.1/invoice`

ENVIO DE FACTURA CON ORDER REFERENCE

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Utilice este ejemplo cuando requiera incluir en el XML de la factura electronica los campos correspondientes a order\_reference, se utiliza habitualmente para enviar numeros de pedido.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990000356,
	"type_document_id": 1,
	"date": "2021-08-17",
	"time": "04:08:12",
	"resolution_number": "18760000001",
	"prefix": "SETP",
	"sendmail": true,
	"customer": {
		"identification_number": 900166483,
		"dv": 1,
		"name": "INVERSIONES DAVAL SAS",
		"phone": "3103891693",
		"address": "CLL 4 NRO 33-90",
		"email": "alexanderobandolondono@gmail.com",
		"merchant_registration": "0000000-00",
		"type_document_identification_id": 6,
		"type_organization_id": 1,
		"municipality_id": 822,
		"type_regime_id": 1
	},
    "order_reference": {
        "id_order": "A23061977FBC",
        "issue_date_order": "2020-10-01"
    },
	"payment_form": {
		"payment_form_id": 2,
		"payment_method_id": 30,
		"payment_due_date": "2021-09-17",
		"duration_measure": "30"
	},	
	"allowance_charges": [
		{
			"discount_id": 1,
			"charge_indicator": false,
			"allowance_charge_reason": "DESCUENTO GENERAL",
			"amount": "0.00",
			"base_amount": "840336.13"
		}
	],
	"legal_monetary_totals": {
		"line_extension_amount": "840336.13",
		"tax_exclusive_amount": "840336.13",
		"tax_inclusive_amount": "1000000.00",
		"allowance_total_amount": "0.00",
		"charge_total_amount": "0.00",
		"payable_amount": "1000000.00"
	},
	"tax_totals": 
	[
		{
			"tax_id": 2,
			"tax_amount": "159663.86",
			"percent": "19",
			"taxable_amount": "840336.13"
		}
	],
	"invoice_lines": 
	[
		{
			"unit_measure_id": 70,
			"invoiced_quantity": "1",
			"line_extension_amount": "840336.13",
			"free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": false,
					"allowance_charge_reason": "DESCUENTO GENERAL",
					"amount": "0.00",
					"base_amount": "1000000.00"
				}
			],
			"tax_totals": [
				{
					"tax_id": 2,
					"tax_amount": "159663.86",
					"taxable_amount": "840336.13",
					"percent": "19.00"
				}
			],
			"description": "COMISION POR SERVICIOS",
			"code": "COMISION",
			"type_item_identification_id": 4,
			"price_amount": "840336.13",
			"base_quantity": "1"
		}
		
	]
}
```

---

## Factura con varias tarifas de IVA y descuentos

`POST http://facturalatam-apidian.oo/api/ubl2.1/invoice`

ENVIO DE FACTURA CON VARIAS TARIFAS DE IVA Y DESCUENTOS INCLUIDOS

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Utilice este ejemplo cuando incluya articulos con varias tarifas de impuestos y/o descuentos incluidos, ejemplo, en una misma factura se venden articulos con IVA 19% y articulos con IVA 5%.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "number": 990060196,
    "type_document_id": 1,
    "date": "2025-01-20",
    "time": "11:12:48",
    "customer": {
        "identification_number": 89008003,
        "name": "ALEXANDER OBANDO LONDONO",
        "phone": "3103891693",
        "address": "BRR LIMONAR MZ 6 CS 3 ET 1",
        "email": "alexander_obando@hotmail.com",
        "merchant_registration": "0000-00",
        "type_document_identification_id": 3,
        "type_organization_id": 2,
        "municipality_id": 149,
        "type_regime_id": 2
    },
    "payment_form": {
        "payment_form_id": 1,
        "payment_method_id": 10,
        "payment_due_date": "2025-01-20",
        "duration_measure": "0"
    },
    "allowance_charges": [
        {
            "discount_id": 1,
            "charge_indicator": false,
            "allowance_charge_reason": "DESCUENTO GENERAL",
            "amount": "1317.08",
            "base_amount": "32246.50"
        }
    ],
    "legal_monetary_totals": {
        "line_extension_amount": "32246.50",
        "tax_exclusive_amount": "32246.50",
        "tax_inclusive_amount": "36014.00",
        "allowance_total_amount": "1317.08",
        "charge_total_amount": "0.00",
        "payable_amount": "34696.92"
    },
    "tax_totals": [
        {
            "tax_id": 1,
            "tax_amount": "0.00",
            "percent": "0",
            "taxable_amount": "5400.00"
        },
        {
            "tax_id": 1,
            "tax_amount": "476.19",
            "percent": "5",
            "taxable_amount": "9523.81"
        },
        {
            "tax_id": 1,
            "tax_amount": "3291.31",
            "percent": "19",
            "taxable_amount": "17322.69"
        }
    ],
    "invoice_lines": [
        {
            "unit_measure_id": 70,
            "invoiced_quantity": "4",
            "line_extension_amount": "6722.69",
            "free_of_charge_indicator": false,
            "allowance_charges": [
                {
                    "charge_indicator": false,
                    "allowance_charge_reason": "DESCUENTO GENERAL",
                    "amount": "336.13",
                    "base_amount": "8000.00"
                }
            ],
            "tax_totals": [
                {
                    "tax_id": 1,
                    "tax_amount": "1277.31",
                    "taxable_amount": "6722.69",
                    "percent": "19.00"
                }
            ],
            "description": "BONOS POR SERVICIOS",
            "code": "BONOS",
            "type_item_identification_id": 4,
            "price_amount": "1764.70",
            "base_quantity": "4"
        },
        {
            "unit_measure_id": 70,
            "invoiced_quantity": "1",
            "line_extension_amount": "9523.81",
            "free_of_charge_indicator": false,
            "allowance_charges": [
                {
                    "charge_indicator": false,
                    "allowance_charge_reason": "DESCUENTO GENERAL",
                    "amount": "380.95",
                    "base_amount": "10000.00"
                }
            ],
            "tax_totals": [
                {
                    "tax_id": 1,
                    "tax_amount": "476.19",
                    "taxable_amount": "9523.81",
                    "percent": "5.00"
                }
            ],
            "description": "CARNE MOLIDA",
            "code": "CARNE",
            "type_item_identification_id": 4,
            "price_amount": "9904.76",
            "base_quantity": "1"
        },
        {
            "unit_measure_id": 70,
            "invoiced_quantity": "2",
            "line_extension_amount": "3000.00",
            "free_of_charge_indicator": false,
            "allowance_charges": [
                {
                    "charge_indicator": false,
                    "allowance_charge_reason": "DESCUENTO GENERAL",
                    "amount": "360.00",
                    "base_amount": "3000.00"
                }
            ],
            "tax_totals": [
                {
                    "tax_id": 1,
                    "tax_amount": "0.00",
                    "taxable_amount": "3000.00",
                    "percent": "0.00"
                }
            ],
            "description": "CESANTIA MERCANTIL",
            "code": "CESANTIA",
            "type_item_identification_id": 4,
            "price_amount": "1680.00",
            "base_quantity": "2"
        },
        {
            "unit_measure_id": 70,
            "invoiced_quantity": "1",
            "line_extension_amount": "2000.00",
            "free_of_charge_indicator": false,
            "allowance_charges": [
                {
                    "charge_indicator": false,
                    "allowance_charge_reason": "DESCUENTO GENERAL",
                    "amount": "0.00",
                    "base_amount": "2380.00"
                }
            ],
            "tax_totals": [
                {
                    "tax_id": 1,
                    "tax_amount": "380.00",
                    "taxable_amount": "2000.00",
                    "percent": "19.00"
                }
            ],
            "description": "COMISION POR SERVICIOS",
            "code": "COMISION",
            "type_item_identification_id": 4,
            "price_amount": "2000.00",
            "base_quantity": "1"
        },
        {
            "unit_measure_id": 70,
            "invoiced_quantity": "2",
            "line_extension_amount": "2400.00",
            "free_of_charge_indicator": false,
            "allowance_charges": [
                {
                    "charge_indicator": false,
                    "allowance_charge_reason": "DESCUENTO GENERAL",
                    "amount": "240.00",
                    "base_amount": "2400.00"
                }
            ],
            "tax_totals": [
                {
                    "tax_id": 1,
                    "tax_amount": "0.00",
                    "taxable_amount": "2400.00",
                    "percent": "0.00"
                }
            ],
            "description": "CURUBA",
            "code": "CURUBA",
            "type_item_identification_id": 4,
            "price_amount": "1320.00",
            "base_quantity": "2"
        },
        {
            "unit_measure_id": 70,
            "invoiced_quantity": "1",
            "line_extension_amount": "1000.00",
            "free_of_charge_indicator": false,
            "allowance_charges": [
                {
                    "charge_indicator": false,
                    "allowance_charge_reason": "DESCUENTO GENERAL",
                    "amount": "0.00",
                    "base_amount": "1190.00"
                }
            ],
            "tax_totals": [
                {
                    "tax_id": 1,
                    "tax_amount": "190.00",
                    "taxable_amount": "1000.00",
                    "percent": "19.00"
                }
            ],
            "description": "MANZANA",
            "code": "MANZANA",
            "type_item_identification_id": 4,
            "price_amount": "1000.00",
            "base_quantity": "1"
        },
        {
            "unit_measure_id": 70,
            "invoiced_quantity": "4",
            "line_extension_amount": "7600.00",
            "free_of_charge_indicator": false,
            "allowance_charges": [
                {
                    "charge_indicator": false,
                    "allowance_charge_reason": "DESCUENTO GENERAL",
                    "amount": "0.00",
                    "base_amount": "9044.00"
                }
            ],
            "tax_totals": [
                {
                    "tax_id": 1,
                    "tax_amount": "1444.00",
                    "taxable_amount": "7600.00",
                    "percent": "19.00"
                }
            ],
            "description": "PERAS",
            "code": "PERAS",
            "type_item_identification_id": 4,
            "price_amount": "1900.00",
            "base_quantity": "4"
        }
    ]
}
```

**Respuesta de ejemplo — SendInvoice-TestSetId Varias Tarifas y Descuentos (200 OK)**

```json
{
    "success": true,
    "message": "AttachedDocument #SETP990060196 generada con éxito",
    "send_email_success": false,
    "send_email_date_time": false,
    "urlinvoicexml": "FES-SETP990060196.xml",
    "urlinvoicepdf": "FES-SETP990060196.pdf",
    "urlinvoiceattached": "ad00890080030002500000029.xml",
    "cufe": "628bf6318126a73cc13c1682c989025e81c7b6879717e18dc037616c366e60a789a026a5ade394d8ddde29ca12bc7f3b",
    "QRStr": "https://catalogo-vpfe-hab.dian.gov.co/document/searchqr?documentkey=[CUFE DE EJEMPLO]",
    "certificate_days_left": 405,
    "resolution_days_left": 1825,
    "ResponseDian": {
        "Envelope": {
            "Header": {
                "Action": {
                    "_attributes": {
                        "mustUnderstand": "1"
                    },
                    "_value": "http://wcf.dian.colombia/IWcfDianCustomerServices/SendBillSyncResponse"
                },
                "Security": {
                    "_attributes": {
                        "mustUnderstand": "1"
                    },
                    "Timestamp": {
                        "_attributes": {
                            "Id": "_0"
                        },
                        "Created": "2025-01-20T16:19:05.033Z",
                        "Expires": "2025-01-20T16:24:05.033Z"
                    }
                }
            },
            "Body": {
                "SendBillSyncResponse": {
                    "SendBillSyncResult": {
                        "ErrorMessage": {
                            "string": "Regla: FAJ43b, Notificación: Nombre informado No corresponde al registrado en el RUT con respecto al Nit suminstrado."
                        },
                        "IsValid": "true",
                        "StatusCode": "00",
                        "StatusDescription": "Procesado Correctamente.",
                        "StatusMessage": "La Factura electrónica SETP990060196, ha sido autorizada.",
                        "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiIHN0YW5kYWxv…[base64 recortado, 14752 caracteres]",
                        "XmlBytes": {
                            "_attributes": {
                                "nil": "true"
                            }
                        },
                        "XmlDocumentKey": "[CUFE DE EJEMPLO]",
                        "XmlFileName": "fv00890080030002500000029"
                    }
                }
            }
        }
    },
    "invoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 40840 caracteres]",
    "zipinvoicexml": "[CENSURADO]",
    "unsignedinvoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 31388 caracteres]",
    "reqfe": "PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzb2FwOkVudmVsb3BlIHhtbG5zOnNv…[base64 recortado, 18648 caracteres]",
    "rptafe": "PHM6RW52ZWxvcGUgeG1sbnM6cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMy8w…[base64 recortado, 21776 caracteres]",
    "attacheddocument": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 69476 caracteres]"
}
```

---

## Factura con datos de entrega (delivery)

`POST http://apidian2023.oo/public/api/ubl2.1/invoice`

ENVIO DE FACTURA CON DELIVERY

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Utilice este ejemplo cuando requiera incluir en el XML de la factura electronica los campos correspondientes a delivery y delivery\_party, estos campos se utilizan para indicar la empresa o persona natural que realizara la entrega.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "number": 990000358,
    "type_document_id": 1,
    "resolution_number": "18760000001",
    "date": "2021-08-17",
    "time": "04:08:12",
    "sendmail": true,
    "customer": {
        "identification_number": 900166483,
        "dv": 1,
        "name": "INVERSIONES DAVAL SAS",
        "phone": 3103891693,
        "address": "CLL 4 NRO 33-90",
        "email": "alexanderobandolondono@gmail.com",
        "merchant_registration": "0000000-00",
        "type_document_identification_id": 6,
        "type_organization_id": 1,
        "municipality_id": 822,
        "type_regime_id": 1
    },
    "delivery": {
        "languaje_id": 79,
        "country_id": 46,
        "municipality_id": 822,
        "address": "CLL 4 NRO 33-90",
        "actual_delivery_date": "2020-07-30"
    },
    "deliveryparty": {
        "identification_number": 890050452,
        "dv": 9,
        "name": "INVERSIONES DAVAL SAS",
        "phone": 3103891693,
        "address": "CLL 4 NRO 33-90",
        "email": "alexanderobandolondono@gmail.com",
        "merchant_registration": "0000000-00",
        "type_document_identification_id": 6,
        "type_organization_id": 1,
        "municipality_id": 822,
        "type_regime_id": 1
    },
    "payment_form": {
        "payment_form_id": 2,
        "payment_method_id": 30,
        "payment_due_date": "2021-09-17",
        "duration_measure": "30"
    },
    "allowance_charges": [{
            "discount_id": 1,
            "charge_indicator": false,
            "allowance_charge_reason": "DESCUENTO GENERAL",
            "amount": "0.00",
            "base_amount": "840336.13"
        }
    ],
    "legal_monetary_totals": {
        "line_extension_amount": "840336.13",
        "tax_exclusive_amount": "840336.13",
        "tax_inclusive_amount": "1000000.00",
        "allowance_total_amount": "0.00",
        "charge_total_amount": "0.00",
        "payable_amount": "1000000.00"
    },
    "tax_totals":
    [{
            "tax_id": 1,
            "tax_amount": "159663.86",
            "percent": "19",
            "taxable_amount": "840336.13"
        }
    ],
    "invoice_lines":
    [{
            "unit_measure_id": 70,
            "invoiced_quantity": "1",
            "line_extension_amount": "840336.13",
            "free_of_charge_indicator": false,
            "allowance_charges": [{
                    "charge_indicator": false,
                    "allowance_charge_reason": "DESCUENTO GENERAL",
                    "amount": "0.00",
                    "base_amount": "1000000000.00"
                }
            ],
            "tax_totals": [{
                    "tax_id": 1,
                    "tax_amount": "159663.86",
                    "taxable_amount": "840336.13",
                    "percent": "19.00"
                }
            ],
            "description": "COMISION POR SERVICIOS",
            "code": "COMISION",
            "type_item_identification_id": 4,
            "price_amount": "840336.13",
            "base_quantity": "1"
        }

    ]
}
```

---

## Factura con impuesto al consumo de licores (ICL)

`POST http://facturalatam-apidian.oo/api/ubl2.1/invoice`

ENVIO DE FACTURA CON IMPUESTO A LOS LICORES

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Utilice este ejemplo cuando requiera incluir en el XML de la factura electronica el impuesto al consumo de licores, vinos, aperitivos y similares (ICL).
* El ICL se liquida sobre el grado de alcohol y el volumen del producto, no sobre un porcentaje del valor, por eso en el tax\_total de la linea se envia unit\_measure\_id, per\_unit\_amount y base\_unit\_measure en lugar de percent.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "number": "990060195",
    "type_document_id": 1,
    "date": "2025-01-15",
    "time": "15:34:00",
    "resolution_number": "18760000001",
    "prefix": "SETP",
    "notes": "Pedido Desde App Desde Cotización:CT-664857 CT-664857 V14",
    "disable_confirmation_text": true,
    "establishment_name": "RINVAL S.A.S",
    "establishment_address": "CLL 11 # 47B 20 ESPERANZA",
    "establishment_phone": "3172657814",
    "establishment_municipality": "687",
    "establishment_email": "",
    "sendmail": true,
    "sendmailtome": true,
    "send_customer_credentials": false,
    "customer": {
        "identification_number": 17348947,
        "dv": 6,
        "name": "WILSON  DAZA CASTILLO",
        "phone": "3102156276",
        "address": "CRR 35 A 5 A - 80 SUR",
        "email": "alexanderobndolondono@gmail.com",
        "merchant_registration": "000000",
        "type_document_identification_id": 3,
        "type_organization_id": 2,
        "type_liability_id": 117,
        "municipality_id": 687,
        "type_regime_id": 2
    },
    "payment_form": {
        "payment_form_id": 1,
        "payment_method_id": 1,
        "payment_due_date": "2025-01-15",
        "duration_measure": 0
    },
    "tax_totals": [{
            "tax_id": 1,
            "tax_amount": "4500.00",
            "percent": "5.00",
            "taxable_amount": "90000.000"
        }, {
            "tax_id": 19,
            "unit_measure_id": "70",
            "tax_amount": "10000.00",
            "taxable_amount": "0.00",
            "percent": "0.00",
            "per_unit_amount": "5000.00",
            "base_unit_measure": "2.00"
        }
    ],
    "legal_monetary_totals": {
        "line_extension_amount": "90000.000",
        "tax_exclusive_amount": "90000.000",
        "tax_inclusive_amount": "104500.000",
        "allowance_total_amount": "0.000",
        "charge_total_amount": "0.000",
        "payable_amount": "104500.000"
    },
    "invoice_lines": [{
            "tax_totals": [{
                    "tax_id": 1,
                    "tax_amount": "4500.00",
                    "percent": "5.00",
                    "taxable_amount": "90000.000"
                }, {
                    "tax_id": 19,
                    "unit_measure_id": "70",
                    "tax_amount": "10000.00",
                    "taxable_amount": "0.00",
                    "percent": "0.00",
                    "per_unit_amount": "5000.00",
                    "base_unit_measure": "2.00"
                }
            ],
            "unit_measure_id": 1076,
            "invoiced_quantity": "2.000",
            "line_extension_amount": "90000.00",
            "free_of_charge_indicator": false,
            "description": "LDM AGUARDIENTE LLANERO EDICION COLEO 750 C.C BOTELLA ",
            "notes": "",
            "code": "LDM001002",
            "type_item_identification_id": 4,
            "price_amount": "45000.000",
            "base_quantity": "2"
        }
    ]
}
```

**Respuesta de ejemplo — Success (200 OK)**

```json
{
    "success": true,
    "message": "AttachedDocument #SETP990060195 generada con éxito",
    "send_email_success": true,
    "send_email_date_time": true,
    "urlinvoicexml": "FES-SETP990060195.xml",
    "urlinvoicepdf": "FES-SETP990060195.pdf",
    "urlinvoiceattached": "ad00890080030002500000026.xml",
    "cufe": "4a19f71e1defc163d8c77a8dfaaaf0c8f7179c0705058b9b488e6f1ad9f9aa5f198ebe9e35c698bd8e39758d0a4963d5",
    "QRStr": "https://catalogo-vpfe-hab.dian.gov.co/document/searchqr?documentkey=[CUFE DE EJEMPLO]",
    "certificate_days_left": 410,
    "resolution_days_left": 1830,
    "ResponseDian": {
        "Envelope": {
            "Header": {
                "Action": {
                    "_attributes": {
                        "mustUnderstand": "1"
                    },
                    "_value": "http://wcf.dian.colombia/IWcfDianCustomerServices/SendBillSyncResponse"
                },
                "Security": {
                    "_attributes": {
                        "mustUnderstand": "1"
                    },
                    "Timestamp": {
                        "_attributes": {
                            "Id": "_0"
                        },
                        "Created": "2025-01-15T22:35:24.837Z",
                        "Expires": "2025-01-15T22:40:24.837Z"
                    }
                }
            },
            "Body": {
                "SendBillSyncResponse": {
                    "SendBillSyncResult": {
                        "ErrorMessage": {
                            "string": "Regla: FAJ43b, Notificación: Nombre informado No corresponde al registrado en el RUT con respecto al Nit suminstrado."
                        },
                        "IsValid": "true",
                        "StatusCode": "00",
                        "StatusDescription": "Procesado Correctamente.",
                        "StatusMessage": "La Factura electrónica SETP990060195, ha sido autorizada.",
                        "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiIHN0YW5kYWxv…[base64 recortado, 14752 caracteres]",
                        "XmlBytes": {
                            "_attributes": {
                                "nil": "true"
                            }
                        },
                        "XmlDocumentKey": "[CUFE DE EJEMPLO]",
                        "XmlFileName": "fv00890080030002500000026"
                    }
                }
            }
        }
    },
    "invoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 26804 caracteres]",
    "zipinvoicexml": "[CENSURADO]",
    "unsignedinvoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 17352 caracteres]",
    "reqfe": "PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzb2FwOkVudmVsb3BlIHhtbG5zOnNv…[base64 recortado, 17920 caracteres]",
    "rptafe": "PHM6RW52ZWxvcGUgeG1sbnM6cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMy8w…[base64 recortado, 21776 caracteres]",
    "attacheddocument": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 55436 caracteres]"
}
```

---

## Factura con impuesto a las bolsas plasticas (INPP)

`POST http://apidian2024.oo/api/ubl2.1/invoice`

ENVIO DE FACTURA CON IMPUESTO A LA BOLSA

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Utilice este ejemplo cuando requiera incluir en el XML de la factura electronica el impuesto a la bolsa o INCBP.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990000992,
	"type_document_id": 1,
	"date": "2024-06-07",
	"time": "04:08:12",
	"resolution_number": "18760000001",
	"prefix": "SETP",
    "establishment_name": "TORRE SOFTWARE",
	"sendmail": true,
	"customer": {
		"identification_number": 900166483,
		"dv": 1,
		"name": "INVERSIONES DAVAL SAS",
		"phone": "3103891693",
		"address": "CLL 4 NRO 33-90",
		"email": "alexanderobandolondono@gmail.com",
		"merchant_registration": "0000000-00",
		"type_document_identification_id": 6,
		"type_organization_id": 1,
        "type_liability_id": 7,
		"municipality_id": 822,
		"type_regime_id": 1
	},
	"payment_form": {
		"payment_form_id": 2,
		"payment_method_id": 30,
		"payment_due_date": "2024-07-07",
		"duration_measure": "30"
	},	
	"allowance_charges": [
		{
			"discount_id": 1,
			"charge_indicator": false,
			"allowance_charge_reason": "DESCUENTO GENERAL",
			"amount": "0.00",
			"base_amount": "840336.13"
		}
	],
	"legal_monetary_totals": {
		"line_extension_amount": "840336.13",
		"tax_exclusive_amount": "840336.13",
		"tax_inclusive_amount": "1000500.00",
		"allowance_total_amount": "0.00",
		"charge_total_amount": "0.00",
		"payable_amount": "1000500.00"
	},
	"tax_totals": 
	[
		{
			"tax_id": 1,
			"tax_amount": "159663.86",
			"percent": "19",
			"taxable_amount": "840336.13"
		},
        {
            "tax_id": 10,
            "unit_measure_id": "70",
            "tax_amount": "500.00",
            "percent": "0",
            "taxable_amount": "500.00",
            "per_unit_amount": "50.00",
            "base_unit_measure": "1.00"
        }
	],
	"invoice_lines": 
	[
		{
			"unit_measure_id": 70,
			"invoiced_quantity": "1",
			"line_extension_amount": "840336.13",
			"free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": false,
					"allowance_charge_reason": "DESCUENTO GENERAL",
					"amount": "0.00",
					"base_amount": "1000000.00"
				}
			],
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "159663.86",
					"taxable_amount": "840336.13",
					"percent": "19.00"
				}
			],
			"description": "COMISION POR SERVICIOS",
			"code": "COMISION",
			"type_item_identification_id": 4,
			"price_amount": "840336.13",
			"base_quantity": "1"
		},	
        {
            "unit_measure_id": "70",
            "invoiced_quantity": "10",
            "line_extension_amount": "0.00",
            "reference_price_id": 3,
            "free_of_charge_indicator": true,
            "allowance_charges": [{
                    "charge_indicator": false,
                    "allowance_charge_reason": "DESCUENTO GENERAL",
                    "amount": "0.00",
                    "base_amount": "500.00"
                }
            ],
            "tax_totals": [
                {
                    "tax_id": "10",
                    "unit_measure_id": "70",
                    "tax_amount": "500.00",
                    "taxable_amount": "0.00",
                    "percent": "0.00",
                    "per_unit_amount": "50.00",
                    "base_unit_measure": "1.00"
                }
            ],
            "description": "INCBP IMPUESTO NACIONAL AL CONSUMO DE BOLSAS PLASTICAS",
            "code": "BOLSA",
            "type_item_identification_id": 4,
            "price_amount": "50.00",
            "base_quantity": "1"
        }
	]
}
```

---

## Nota credito de varias lineas

`POST http://apidian2023.oo/api/ubl2.1/credit-note`

ENVIO DE NOTA CREDITO CON VARIAS LINEAS DE DETALLE

* Aplica la misma documentacion que el PRIMER ENVIO DE NOTA CREDITO de la seccion 02 - PRIMEROS ENVIOS.
* Se envia al endpoint .../ubl2.1/credit-note.
* Utilice este ejemplo cuando desee enviar varias lineas de productos o lineas de detalle en una misma nota credito.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "billing_reference": {
        "number": "990000360",
        "uuid": "43408510e1fa4ce24159b4a339b0e223b31de9431df4d50af37d627a86669a520fe87f9938ace108f9ce91b6636aad90",
        "issue_date": "2021-08-17"
    },
    "discrepancyresponsecode": 2,
    "discrepancyresponsedescription": "PRUEBA DE MOTIVO NOTA CREDITO",
    "notes": "PRUEBA DE NOTA CREDITO",
    "resolution_number": "0000000000",
    "prefix": "NC",
    "number": 35,
    "type_document_id": 4,
    "date": "2021-08-17",
    "time": "10:00:52",
    "customer": {
        "identification_number": 89008003,
        "name": "ALEXANDER OBANDO LONDONO",
        "phone": 3103891693,
        "address": "BRR EL CARDAL MZ 4 CS 7 ET 1",
        "email": "alexander_obando@hotmail.com",
        "merchant_registration": "0000-00",
        "type_document_identification_id": 3,
        "type_organization_id": 2,
        "municipality_id": 149,
        "type_regime_id": 2
    },
    "tax_totals": [{
        "tax_id": 1,
        "tax_amount": "0.00",
        "taxable_amount": "15000.00",
        "percent": "0.00"
    },
	{
        "tax_id": 1,
        "tax_amount": "3193.28",
        "taxable_amount": "16806.72",
        "percent": "19.00"
    }],
    "legal_monetary_totals": {
        "line_extension_amount": "31806.72",
        "tax_exclusive_amount": "31806.72",
        "tax_inclusive_amount": "35000.00",
        "allowance_total_amount": "0.00",
        "charge_total_amount": "0.00",
        "payable_amount": "35000.00"
    },
    "credit_note_lines":
    [{
            "unit_measure_id": 70,
            "invoiced_quantity": "1",
            "line_extension_amount": "10084.03",
            "free_of_charge_indicator": false,
            "allowance_charges": [{
                    "charge_indicator": false,
                    "allowance_charge_reason": "DESCUENTO GENERAL",
                    "amount": "0.00",
                    "base_amount": "12000.00"
                }
            ],
            "tax_totals": [{
                    "tax_id": 1,
                    "tax_amount": "1915.97",
                    "taxable_amount": "10084.03",
                    "percent": "19.00"
                }
            ],
            "description": "COMISION POR SERVICIOS",
            "code": "COMISION",
            "type_item_identification_id": 4,
            "price_amount": "10084.03",
            "base_quantity": "1"
        }, {
            "unit_measure_id": 70,
            "invoiced_quantity": "1",
            "line_extension_amount": "6722.69",
            "free_of_charge_indicator": false,
            "allowance_charges": [{
                    "charge_indicator": false,
                    "allowance_charge_reason": "DESCUENTO GENERAL",
                    "amount": "0.00",
                    "base_amount": "8000.00"
                }
            ],
            "tax_totals": [{
                    "tax_id": 1,
                    "tax_amount": "1277.31",
                    "taxable_amount": "6722.69",
                    "percent": "19.00"
                }
            ],
            "description": "BONOS POR SERVICIOS",
            "code": "BONOS",
            "type_item_identification_id": 4,
            "price_amount": "6722.69",
            "base_quantity": "1"
        }, {
            "unit_measure_id": 70,
            "invoiced_quantity": "1",
            "line_extension_amount": "15000.00",
            "free_of_charge_indicator": false,
            "allowance_charges": [{
                    "charge_indicator": false,
                    "allowance_charge_reason": "DESCUENTO GENERAL",
                    "amount": "0.00",
                    "base_amount": "15000.00"
                }
            ],
            "tax_totals": [{
                    "tax_id": 1,
                    "tax_amount": "0.00",
                    "taxable_amount": "15000.00",
                    "percent": "0.00"
                }
            ],
            "description": "CESANTIA MERCANTIL",
            "code": "CESANTIA",
            "type_item_identification_id": 4,
            "price_amount": "15000.00",
            "base_quantity": "1"
        }
    ]
}
```

---

## Factura a credito con descuento

`POST http://apidian2023.oo/api/ubl2.1/invoice`

ENVIO DE FACTURA CON PAGO A CREDITO Y DESCUENTO

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Este ejemplo ilustra como se debe utilizar la API para enviar una factura que incluya un pago a credito y ademas tenga descuento.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990000361,
	"type_document_id": 1,
	"date": "2021-08-17",
	"time": "04:36:32",
	"resolution_number": "18760000001",
	"prefix": "SETP",
	"customer": {
		"identification_number": 89008003,
		"name": "ALEXANDER OBANDO LONDONO",
		"phone": 3103891693,
		"address": "BRR LIMONAR MZ 6 CS 3 ET 1",
		"email": "alexander_obando@hotmail.com",
		"merchant_registration": "0000-00",
		"type_document_identification_id": 3,
		"type_organization_id": 2,
		"municipality_id": 149,
		"type_regime_id": 2
	},
	"payment_form": {
		"payment_form_id": 2,
		"payment_method_id": 10,
		"payment_due_date": "2021-09-17",
		"duration_measure": "30"
	},	
	"allowance_charges": [
		{
			"discount_id": 1,
			"charge_indicator": false,
			"allowance_charge_reason": "DESCUENTO GENERAL",
			"amount": "600.00",
			"base_amount": "8067.23"
		}
	],
	"legal_monetary_totals": {
		"line_extension_amount": "8067.23",
		"tax_exclusive_amount": "8067.23",
		"tax_inclusive_amount": "9600.00",
		"allowance_total_amount": "600.00",
		"charge_total_amount": "0.00",
		"payable_amount": "9000.00"
	},
	"tax_totals": 
	[
		{
			"tax_id": 1,
			"tax_amount": "1532.77",
			"percent": "19",
			"taxable_amount": "8067.23"
		}
	],
	"invoice_lines": 
	[
		{
			"unit_measure_id": 70,
			"invoiced_quantity": "8",
			"line_extension_amount": "8067.23",
			"free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": false,
					"allowance_charge_reason": "DESCUENTO GENERAL",
					"amount": "600.00",
					"base_amount": "9600.00"
				}
			],
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "1532.77",
					"taxable_amount": "8067.23",
					"percent": "19.00"
				}
			],
			"description": "MANZANA",
			"code": "MANZANA",
			"type_item_identification_id": 4,
			"price_amount": "1083.40",
			"base_quantity": "8"
		}
	
	]
}
```

---

## Factura con descuento en dos lineas

`POST http://apidian2023.oo/public/api/ubl2.1/invoice`

ENVIO DE FACTURA CON DOS LINEAS DE DETALLE Y DESCUENTO

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Este ejemplo ilustra como se debe utilizar la API para enviar una factura que incluya varias lineas de detalle y ademas tenga descuento.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990000362,
	"type_document_id": 1,
	"date": "2021-08-17",
	"time": "21:19:42",
	"resolution_number": "18760000001",
	"prefix": "SETP",
	"customer": {
		"identification_number": 89008003,
		"name": "ALEXANDER OBANDO LONDONO",
		"phone": 3103891693,
		"address": "BRR LIMONAR MZ 6 CS 3 ET 1",
		"email": "alexander_obando@hotmail.com",
		"merchant_registration": "0000-00",
		"type_document_identification_id": 3,
		"type_organization_id": 2,
		"municipality_id": 149,
		"type_regime_id": 2
	},
	"payment_form": {
		"payment_form_id": 1,
		"payment_method_id": 10,
		"payment_due_date": "2021-08-17",
		"duration_measure": "0"
	},	
	"allowance_charges": [
		{
			"discount_id": 1,
			"charge_indicator": false,
			"allowance_charge_reason": "DESCUENTO GENERAL",
			"amount": "230000.00",
			"base_amount": "9663865.54"
		}
	],
	"legal_monetary_totals": {
		"line_extension_amount": "9663865.54",
		"tax_exclusive_amount": "9663865.55",
		"tax_inclusive_amount": "11500000.00",
		"allowance_total_amount": "230000.00",
		"charge_total_amount": "0.00",
		"payable_amount": "11270000.00"
	},
	"tax_totals": 
	[

		{
			"tax_id": 1,
			"tax_amount": "1836134.45",
			"percent": "19",
			"taxable_amount": "9663865.55"
		}
	],
	"invoice_lines": 
	[

		{
			"unit_measure_id": 70,
			"invoiced_quantity": "1",
			"line_extension_amount": "1260504.20",
			"free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": false,
					"allowance_charge_reason": "DESCUENTO GENERAL",
					"amount": "30000.00",
					"base_amount": "1500000.00"
				}
			],
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "239495.80",
					"taxable_amount": "1260504.20",
					"percent": "19.00"
				}
			],
			"description": "BONOS POR SERVICIOS",
			"code": "BONOS",
			"type_item_identification_id": 4,
			"price_amount": "1290504.20",
			"base_quantity": "1"
		}
,
		{
			"unit_measure_id": 70,
			"invoiced_quantity": "1",
			"line_extension_amount": "8403361.34",
			"free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": false,
					"allowance_charge_reason": "DESCUENTO GENERAL",
					"amount": "200000.00",
					"base_amount": "10000000.00"
				}
			],
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "1596638.65",
					"taxable_amount": "8403361.34",
					"percent": "19.00"
				}
			],
			"description": "COMISION POR SERVICIOS",
			"code": "COMISION",
			"type_item_identification_id": 4,
			"price_amount": "8603361.34",
			"base_quantity": "1"
		}
		
	]
}
```

---

## Factura con anticipo (pago previo)

`POST http://apidian2023.oo/public/api/ubl2.1/invoice`

ENVIO DE FACTURA CON PREPAGO REALIZADO

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Este ejemplo ilustra como se debe utilizar la API para enviar una factura que incluya los campos del prepaid\_payment, es decir para especificar que ya se ha hecho un prepago a esta factura.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990000363,
	"dv":2,
	"type_document_id": 1,
	"date": "2021-08-17",
	"time": "06:08:12",
	"resolution_number": "18760000001",
	"prefix": "SETP",
	"customer": {
		"identification_number": 89008003,
		"name": "ALEXANDER OBANDO LONDONO",
		"phone": 3103891693,
		"address": "BRR LIMONAR MZ 6 CS 3 ET 1",
		"email": "alexander_obando@hotmail.com",
		"merchant_registration": "0000-00",
		"type_document_identification_id": 3,
		"type_organization_id": 2,
		"municipality_id": 149,
		"type_regime_id": 2
	},
	"payment_form": {
		"payment_form_id": 1,
		"payment_method_id": 10,
		"payment_due_date": "2021-08-17",
		"duration_measure": "0"
	},	
	"prepaid_payment": {
		"idpayment": "A3123856",
		"paidamount": "100000.00",
		"receiveddate": "2020-03-01",
		"paiddate": "2020-03-05",
		"instructionid": "PRUEBA DE PREPAGO RECIBIDO"
	},
	"allowance_charges": [
		{
			"discount_id": 1,
			"charge_indicator": false,
			"allowance_charge_reason": "DESCUENTO GENERAL",
			"amount": "0.00",
			"base_amount": "840336.13"
		}
	],
	"legal_monetary_totals": {
		"line_extension_amount": "840336.13",
		"tax_exclusive_amount": "840336.13",
		"tax_inclusive_amount": "1000000.00",
		"allowance_total_amount": "0.00",
		"charge_total_amount": "0.00",
		"pre_paid_amount": "100000.00",
		"payable_amount": "900000.00"
	},
	"tax_totals": 
	[
		{
			"tax_id": 1,
			"tax_amount": "159663.86",
			"percent": "19",
			"taxable_amount": "840336.13"
		}
	],
	"invoice_lines": 
	[

		{
			"unit_measure_id": 70,
			"invoiced_quantity": "1",
			"line_extension_amount": "840336.13",
			"free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": false,
					"allowance_charge_reason": "DESCUENTO GENERAL",
					"amount": "0.00",
					"base_amount": "1000000.00"
				}
			],
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "159663.86",
					"taxable_amount": "840336.13",
					"percent": "19.00"
				}
			],
			"description": "COMISION POR SERVICIOS",
			"code": "COMISION",
			"type_item_identification_id": 4,
			"price_amount": "840336.13",
			"base_quantity": "1"
		}
		
	]
}
```

---

## Factura con cargo en la linea

`POST http://apidian2024.oo/api/ubl2.1/invoice`

ENVIO DE FACTURA CON CARGOS

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Este ejemplo ilustra como se debe utilizar la API para enviar una factura que incluya un cargo por cualquier motivo, en el ejemplo se incluye un cargo por valor de consignacion bancaria.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990001107,
	"type_document_id": 1,
	"date": "2024-06-25",
	"time": "20:20:24",
	"resolution_number": "18760000001",
	"prefix": "SETP",
	"customer": {
		"identification_number": 89008003,
		"name": "ALEXANDER OBANDO LONDONO",
		"phone": "3103891693",
		"address": "BRR EL CARDAL MZ 4 CS 7 ET 1",
		"email": "alexander_obando@hotmail.com",
		"merchant_registration": "0000-00",
		"type_document_identification_id": 3,
		"type_organization_id": 2,
		"municipality_id": 149,
		"type_regime_id": 2
	},
	"payment_form": {
		"payment_form_id": 1,
		"payment_method_id": 10,
		"payment_due_date": "2024-06-25",
		"duration_measure": "0"
	},	
	"allowance_charges": [
		{
			"discount_id": 1,
			"charge_indicator": true,
			"allowance_charge_reason": "CARGO POR CONSIGNACION BANCARIA",
			"amount": "7000.00",
			"base_amount": "300000.00"
		}
	],
	"legal_monetary_totals": {
		"line_extension_amount": "300000.00",
		"tax_exclusive_amount": "300000.00",
		"tax_inclusive_amount": "357000.00",
		"allowance_total_amount": "0.00",
		"charge_total_amount": "7000.00",
		"payable_amount": "364000.00"
	},
	"tax_totals": 
	[
		{
			"tax_id": 1,
			"tax_amount": "57000.00",
			"percent": "19",
			"taxable_amount": "300000.00"
		}
	],
	"invoice_lines": 
	[

		{
			"unit_measure_id": 70,
			"invoiced_quantity": "1",
			"line_extension_amount": "300000.00",
			"free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": true,
					"allowance_charge_reason": "CARGO POR CONSIGNACION BANCARIA",
					"amount": "7000.00",
					"base_amount": "357000.00",
					"multiplier_factor_numeric": "1.96"
				}
			],
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "57000.00",
					"taxable_amount": "300000.00",
					"percent": "19.00"
				}
			],
			"description": "COMISION POR SERVICIOS",
			"code": "COMISION",
			"type_item_identification_id": 4,
			"price_amount": "293000.00",
			"base_quantity": "1"
		}
		
	]
}
```

---

## Factura con cargo en el encabezado

`POST http://apidian2024.oo/api/ubl2.1/invoice`

ENVIO DE FACTURA CON CARGOS EN EL ENCABEZADO

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Mismo caso del ejemplo anterior, pero el cargo se aplica a todo el documento y no a una linea: va en el arreglo allowance\_charges del encabezado con charge\_indicator en true.
* El valor del cargo debe quedar reflejado en charge\_total\_amount de legal\_monetary\_totals y sumado en el payable\_amount.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990001108,
	"type_document_id": 1,
	"date": "2024-06-25",
	"time": "20:20:24",
	"resolution_number": "18760000001",
	"prefix": "SETP",
	"customer": {
		"identification_number": 89008003,
		"name": "ALEXANDER OBANDO LONDONO",
		"phone": "3103891693",
		"address": "BRR EL CARDAL MZ 4 CS 7 ET 1",
		"email": "alexander_obando@hotmail.com",
		"merchant_registration": "0000-00",
		"type_document_identification_id": 3,
		"type_organization_id": 2,
		"municipality_id": 149,
		"type_regime_id": 2
	},
	"payment_form": {
		"payment_form_id": 1,
		"payment_method_id": 10,
		"payment_due_date": "2024-06-25",
		"duration_measure": "0"
	},	
	"allowance_charges": [
		{
			"discount_id": 1,
			"charge_indicator": true,
			"allowance_charge_reason": "CARGO POR CONSIGNACION BANCARIA",
			"amount": "7000.00",
			"base_amount": "300000.00"
		}
	],
	"legal_monetary_totals": {
		"line_extension_amount": "252100.84",
		"tax_exclusive_amount": "252100.84",
		"tax_inclusive_amount": "300000.00",
		"allowance_total_amount": "0.00",
		"charge_total_amount": "7000.00",
		"payable_amount": "307000.00"
	},
	"tax_totals": 
	[
		{
			"tax_id": 1,
			"tax_amount": "47899.16",
			"percent": "19",
			"taxable_amount": "252100.84"
		}
	],
	"invoice_lines": 
	[

		{
			"unit_measure_id": 70,
			"invoiced_quantity": "1",
			"line_extension_amount": "252100.84",
			"free_of_charge_indicator": false,
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "47899.16",
					"taxable_amount": "252100.84",
					"percent": "19.00"
				}
			],
			"description": "COMISION POR SERVICIOS",
			"code": "COMISION",
			"type_item_identification_id": 4,
			"price_amount": "300000.00",
			"base_quantity": "1"
		}
		
	]
}
```

---

## Factura con dos impuestos: telefonia celular

`POST http://apidian2023.oo/api/ubl2.1/invoice`

ENVIO DE FACTURA CON ARTICULOS QUE TENGAN DOS IMPUESTOS

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Este ejemplo ilustra como se debe utilizar la API para enviar una factura que incluya articulos que lleven dos impuestos, aunque esto es muy poco frecuente, se da en casos como la telefonia celular que tiene IVA e Impuesto al Consumo.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `host` | `apidian2021.oo` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990000365,
	"type_document_id": 1,
	"resolution_number": "18760000001",
    "prefix": "SETP",
	"date": "2021-08-17",
	"time": "04:07:12",
	"sendmail": false,
	"customer": {
		"identification_number": 73187745,
        "dv": null,
		"name": "Arnold Jose Perez",
		"phone": 3042484748,
		"address": "CLL 4 NRO 33-95",
		"email": "sr.arnoldt@gmail.com",
		"merchant_registration": "0000000-00",
		"type_document_identification_id": 3,
		"type_organization_id": 2,
		"municipality_id": 823,
		"type_regime_id": 2
	},
	"payment_form": {
		"payment_form_id": 1,
		"payment_method_id": 10, 
		"payment_due_date": "2021-08-17",
		"duration_measure": "0"
	},	
	"legal_monetary_totals": {
		"line_extension_amount": "142013.42",
		"tax_exclusive_amount": "142013.42",
		"tax_inclusive_amount": "169634.49",
		"allowance_total_amount": "0.00",
		"charge_total_amount": "0.00",
		"payable_amount": "169634.49"
	},
	"tax_totals": 
	[
		{
			"tax_id": 1,
			"tax_amount": "26982.55",
			"percent": "19",
			"taxable_amount": "142013.4"
		},
        {
			"tax_id": 4,
			"tax_amount": "638.52",
			"percent": "4",
			"taxable_amount": "15963.00"
		}
	],
	"invoice_lines": 
	[
		{
			"unit_measure_id": 70, 
			"invoiced_quantity": "1",
			"line_extension_amount": "15963.00",
			"free_of_charge_indicator": false,
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "3032.97",
					"taxable_amount": "15963.00",
					"percent": "19.00"
				},
                {
					"tax_id": 4,
					"tax_amount": "638.52",
					"taxable_amount": "15963.00",
					"percent": "4.00"
				}

			],
			"description": "Cadena tejido chino (peso 3.4gr)",
			"code": "Item",
			"type_item_identification_id": 4,
			"price_amount": "19634.49",
			"base_quantity": "1"
		},
        {
			"unit_measure_id": 70, 
			"invoiced_quantity": "1",
			"line_extension_amount": "126050.00",
			"free_of_charge_indicator": false,
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "23949.58",
					"taxable_amount": "126050.00",
					"percent": "19.00"
				}
			],
			"description": "Anillo chibcha (peso 43.5gr)",
			"code": "Item",
			"type_item_identification_id": 4,
			"price_amount": "150000.00",
			"base_quantity": "1"
		}
	]
}
```

---

## Factura con impuesto saludable: alimentos ultraprocesados

`POST http://apidian2024.oo/api/ubl2.1/invoice`

ENVIO DE FACTURA CON IMPUESTO SALUDABLE A ALIMENTOS ULTRAPROCESADOS (ICUI)

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Utilice este ejemplo cuando facture productos comestibles ultraprocesados, que ademas del IVA (tax\_id 1) llevan el ICUI (tax\_id 22).
* El ICUI se liquida como un porcentaje sobre la base gravable, por lo que en el tax\_total de la linea se envia percent y taxable\_amount.
* Los dos impuestos van como elementos separados del arreglo tax\_totals, tanto en la linea como en los totales del documento.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990000957,
	"type_document_id": 1,
	"resolution_number": "18760000001",
    "prefix": "SETP",
	"date": "2024-03-07",
	"time": "04:07:12",
	"sendmail": false,
	"customer": {
		"identification_number": 89008003,
        "dv": 2,
		"name": "ALEXANDER OBANDO LONDOÑO",
		"phone": "3103891693",
		"address": "CLL 11 NRO 21-73",
		"email": "alexander_obando@hotmail.com",
		"merchant_registration": "0000000-00",
		"type_document_identification_id": 3,
		"type_organization_id": 2,
		"municipality_id": 822,
		"type_regime_id": 2
	},
	"payment_form": {
		"payment_form_id": 1,
		"payment_method_id": 10, 
		"payment_due_date": "2024-03-07",
		"duration_measure": "0"
	},	
	"legal_monetary_totals": {
		"line_extension_amount": "141270.95",
		"tax_exclusive_amount": "141270.95",
		"tax_inclusive_amount": "169634.48",
		"allowance_total_amount": "0.00",
		"charge_total_amount": "0.00",
		"payable_amount": "169634.48"
	},
	"tax_totals": 
	[
		{
			"tax_id": 1,
			"tax_amount": "26841.48",
			"percent": "19",
			"taxable_amount": "141270.95"
		},
        {
			"tax_id": 22,
			"tax_amount": "1522.05",
			"percent": "10",
			"taxable_amount": "15220.53"
		}
	],
	"invoice_lines": 
	[
		{
			"unit_measure_id": 70, 
			"invoiced_quantity": "1",
			"line_extension_amount": "15220.53",
			"free_of_charge_indicator": false,
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "2891.90",
					"taxable_amount": "15220.53",
					"percent": "19.00"
				},
                {
					"tax_id": 22,
					"tax_amount": "1522.05",
					"taxable_amount": "15220.53",
					"percent": "10.00"
				}
			],
			"description": "PRODUCTO ALIMENTICIO ULTRAPROCESADO",
			"code": "ULTRAPROCESADO",
			"type_item_identification_id": 4,
			"price_amount": "19634.49",
			"base_quantity": "1"
		},
        {
			"unit_measure_id": 70, 
			"invoiced_quantity": "1",
			"line_extension_amount": "126050.42",
			"free_of_charge_indicator": false,
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "23949.58",
					"taxable_amount": "126050.42",
					"percent": "19.00"
				}
			],
			"description": "PRODUCTO ALIMENTICIO NO ULTRAPROCESADO",
			"code": "NOULTRAPROCESADO",
			"type_item_identification_id": 4,
			"price_amount": "150000.00",
			"base_quantity": "1"
		}
	]
}
```

---

## Factura con IVA e impuesto al consumo de licores

`POST http://apidian2024.oo/api/ubl2.1/invoice`

ENVIO DE FACTURA CON IMPUESTO AL CONSUMO DE LICORES (ICL)

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Utilice este ejemplo cuando facture licores, vinos, aperitivos y similares, que ademas del IVA (tax\_id 1) llevan el ICL (tax\_id 19).
* El ICL no se liquida con un porcentaje sobre el valor: en el tax\_total de la linea se envia unit\_measure\_id, per\_unit\_amount (valor por grado de alcohol) y base\_unit\_measure.
* En este ejemplo el IVA va al 0 %, el ICL se envia en tax\_totals y ademas se practica una retencion de renta del 2,5 % (tax\_id 6) en el arreglo with\_holding\_tax\_total, que es independiente de tax\_totals.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990001109,
	"type_document_id": 1,
	"date": "2024-06-28",
	"time": "04:08:12",
	"resolution_number": "18760000001",
	"prefix": "SETP",
    "sendmail": false,
    "sendmailtome": false,
    "send_customer_credentials": false,
    "notes": "ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA",
    "disable_confirmation_text": true,
    "establishment_name": "TORRE SOFTWARE",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "establishment_email": "alternate_email@alternate.com",
    "head_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL PIE DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
	"customer": {
		"identification_number": 89008003,
		"dv": 2,
		"name": "INVERSIONES DAVAL SAS",
		"phone": "3103891693",
		"address": "CLL 4 NRO 33-90",
		"email": "alexanderobandolondono@gmail.com",
		"merchant_registration": "0000000-00",
		"type_document_identification_id": 6,
		"type_organization_id": 1,
        "type_liability_id": 7,
		"municipality_id": 822,
		"type_regime_id": 1
	},
    "payment_form": {
        "payment_form_id": 2,
        "payment_method_id": 2,
        "payment_due_date": "2024-06-28",
        "duration_measure": 0
    },
    "legal_monetary_totals": {
        "line_extension_amount": "11512000.000",
        "tax_exclusive_amount": "11512000.000",
        "tax_inclusive_amount": "14500000.000",
        "allowance_total_amount": null,
        "charge_total_amount": "0",
        "payable_amount": "14500000.000"
    },
    "tax_totals": [{
            "tax_id": 1,
            "tax_amount": "0.000",
            "percent": "0.00",
            "taxable_amount": "11512000.000",
            "unit_measure_id": null,
            "per_unit_amount": null,
            "base_unit_measure": null
        }, {
            "tax_id": 19,
            "tax_amount": "2988000.000",
            "percent": "0",
            "taxable_amount": "0",
            "unit_measure_id": "70",
            "per_unit_amount": null,
            "base_unit_measure": null
        }
    ],
    "with_holding_tax_total": [{
            "tax_id": 6,
            "tax_amount": "287800.000",
            "percent": "2.500",
            "taxable_amount": "11512000.000",
            "unit_measure_id": null,
            "per_unit_amount": null,
            "base_unit_measure": null
        }
    ],
    "invoice_lines": [{
            "tax_totals": [{
                    "tax_id": 1,
                    "tax_amount": "0.000000",
                    "percent": "0.00",
                    "taxable_amount": "11512000.000",
                    "unit_measure_id": null,
                    "per_unit_amount": null,
                    "base_unit_measure": null
                }, {
                    "tax_id": 19,
                    "tax_amount": "2988000.000",
                    "percent": "0",
                    "taxable_amount": "0",
                    "unit_measure_id": "70",
                    "per_unit_amount": "250.000",
                    "base_unit_measure": "11952"
                }
            ],
            "unit_measure_id": 1076,
            "invoiced_quantity": "250.000",
            "line_extension_amount": "11512000.000",
            "free_of_charge_indicator": false,
            "description": "AGUILA RN 330CC X 30 ",
            "notes": "",
            "code": "100003",
            "type_item_identification_id": 4,
            "price_amount": "46048.000",
            "base_quantity": "1"
        }
    ]
}
```

---

## Factura con impuesto saludable: bebidas azucaradas

`POST http://apidian2024.oo/api/ubl2.1/invoice`

ENVIO DE FACTURA CON IMPUESTO SALUDABLE A BEBIDAS AZUCARADAS (IBUA)

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Utilice este ejemplo cuando facture bebidas ultraprocesadas azucaradas, que ademas del IVA (tax\_id 1) llevan el IBUA (tax\_id 21).
* El IBUA se liquida por mililitro segun el contenido de azucar, por lo que en el tax\_total de la linea se envia unit\_measure\_id, per\_unit\_amount y base\_unit\_measure en lugar de percent.
* Los dos impuestos van como elementos separados del arreglo tax\_totals, tanto en la linea como en los totales del documento.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990000960,
	"type_document_id": 1,
	"resolution_number": "18760000001",
    "prefix": "SETP",
	"date": "2024-03-07",
	"time": "04:07:12",
	"sendmail": false,
	"customer": {
		"identification_number": 89008003,
        "dv": 2,
		"name": "ALEXANDER OBANDO LONDOÑO",
		"phone": "3103891693",
		"address": "CLL 11 NRO 21-73",
		"email": "alexander_obando@hotmail.com",
		"merchant_registration": "0000000-00",
		"type_document_identification_id": 3,
		"type_organization_id": 2,
		"municipality_id": 822,
		"type_regime_id": 2
	},
	"payment_form": {
		"payment_form_id": 1,
		"payment_method_id": 10, 
		"payment_due_date": "2024-03-07",
		"duration_measure": "0"
	},	
	"legal_monetary_totals": {
		"line_extension_amount": "12255.04",
		"tax_exclusive_amount": "12605.04",
		"tax_inclusive_amount": "15000.00",
		"allowance_total_amount": "0.00",
		"charge_total_amount": "0.00",
		"payable_amount": "15000.00"
	},
	"tax_totals": 
	[
		{
			"tax_id": 1,
			"tax_amount": "2394.96",
			"percent": "19",
			"taxable_amount": "12605.04"
		},
        {
            "tax_id": 21,
            "unit_measure_id": "852",
            "tax_amount": "350.00",
            "taxable_amount": "8403.36",
            "percent": "0.00",
            "per_unit_amount": "35.00",
            "base_unit_measure": "1000.00"
		}
	],
	"invoice_lines": 
	[
		{
			"unit_measure_id": 70, 
			"invoiced_quantity": "1",
			"line_extension_amount": "8053.36",
			"free_of_charge_indicator": false,
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "1596.64",
					"taxable_amount": "8403.36",
					"percent": "19.00"
				},
                {
                    "tax_id": 21,
                    "unit_measure_id": "852",
                    "tax_amount": "350.00",
                    "taxable_amount": "8403.36",
                    "percent": "0.00",
                    "per_unit_amount": "35.00",
                    "base_unit_measure": "1000.00"
                }
			],
			"description": "BEBIDA AZUCARADA 1000 ML MAYOR DE 10 GR X 100 ML",
			"code": "AZUCARADA1000ML15GR100ML",
			"type_item_identification_id": 4,
			"price_amount": "10000.00",
			"base_quantity": "1"
		},
        {
			"unit_measure_id": 70, 
			"invoiced_quantity": "1",
			"line_extension_amount": "4201.68",
			"free_of_charge_indicator": false,
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "798.32",
					"taxable_amount": "4201.68",
					"percent": "19.00"
				}
			],
			"description": "BEBIDA NO AZUCARADA",
			"code": "NOAZUCARADA1000ML",
			"type_item_identification_id": 4,
			"price_amount": "5000.00",
			"base_quantity": "1"
		}
	]
}
```

---

## Factura con impuesto saludable: varias bebidas azucaradas

`POST http://apidian2024.oo/api/ubl2.1/invoice`

ENVIO DE FACTURA CON IMPUESTO SALUDABLE A BEBIDAS AZUCARADAS (IBUA) - VARIAS LINEAS

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Mismo caso del ejemplo anterior, pero con varias lineas gravadas con IBUA (tax\_id 21) y distintas tarifas por mililitro.
* Cuando varias lineas llevan el mismo impuesto, en los tax\_totals del documento se debe acumular un solo registro por tax\_id con la suma de los tax\_amount de las lineas.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990000960,
	"type_document_id": 1,
	"resolution_number": "18760000001",
    "prefix": "SETP",
	"date": "2024-03-07",
	"time": "04:07:12",
	"sendmail": false,
	"customer": {
	    "identification_number": "222222222222",
	    "name": "CONSUMIDOR FINAL ",
	    "merchant_registration": "0000000-00"
	},

	"payment_form":
	[{
	        "payment_form_id": 1,
	        "payment_method_id": "10",
	        "payment_due_date": "2024-04-25",
	        "duration_measure": "0"
	    }
	],

	"allowance_charges":
	[{
	        "discount_id": 10,
	        "charge_indicator": false,
	        "allowance_charge_reason": "DESCUENTO GENERAL ",
	        "allowance_charge_reason_code": "09",
	        "amount": "0.00",
	        "base_amount": 11663.87
	    }
	],

	"legal_monetary_totals": {
	    "line_extension_amount": 11663.87,
	    "tax_exclusive_amount": 11663.87,
	    "tax_inclusive_amount": 15000,
	    "allowance_total_amount": "0.00",
	    "charge_total_amount": "0.00",
	    "payable_amount": 15000
	},

	"tax_totals":
	[{
	        "tax_id": 1,
	        "percent": "19",
	        "tax_amount": 2216.13,
	        "taxable_amount": 11663.87
	    },
	    {
	        "tax_id": 21,
	        "unit_measure_id": 852,
	        "tax_amount": 840,
	        "taxable_amount": 7697.48,
	        "percent": "0.00",
	        "per_unit_amount": 28,
	        "base_unit_measure": 3000
	    },
	    {
	        "tax_id": 21,
	        "unit_measure_id": 852,
	        "tax_amount": 280,
	        "taxable_amount": 3966.39,
	        "percent": "0.00",
	        "per_unit_amount": 28,
	        "base_unit_measure": 1000
	    }
	],

	"invoice_lines":
	[{
	        "unit_measure_id": 70,
	        "invoiced_quantity": "1",
	        "line_extension_amount": 7697.48,
	        "free_of_charge_indicator": false,
	        "allowance_charges":
	        [{
	                "charge_indicator": false,
	                "allowance_charge_reason": "DESCUENTO PRODUCTO",
	                "amount": 0,
	                "base_amount": 7697.48
	            }
	        ],

	        "tax_totals":
	        [{
	                "tax_id": 1,
	                "tax_amount": 1462.52,
	                "taxable_amount": 7697.48,
	                "percent": "19"
	            },
	            {
	                "tax_id": 21,
	                "unit_measure_id": 852,
	                "tax_amount": 840,
	                "taxable_amount": 7697.48,
	                "percent": "0.00",
	                "per_unit_amount": 28,
	                "base_unit_measure": 3000
	            }
	        ],

	        "description": "GASEOSA FANTA",
	        "code": "PRO000006",
	        "type_item_identification_id": 4,
	        "price_amount": 10000,
	        "base_quantity": "1"
	    },
	    {
	        "unit_measure_id": 70,
	        "invoiced_quantity": "1",
	        "line_extension_amount": 3966.39,
	        "free_of_charge_indicator": false,
	        "allowance_charges":
	        [{
	                "charge_indicator": false,
	                "allowance_charge_reason": "DESCUENTO PRODUCTO",
	                "amount": 0,
	                "base_amount": 3966.39
	            }
	        ],

	        "tax_totals":
	        [{
	                "tax_id": 1,
	                "tax_amount": 753.61,
	                "taxable_amount": 3966.39,
	                "percent": "19"
	            },
	            {
	                "tax_id": 21,
	                "unit_measure_id": 852,
	                "tax_amount": 280,
	                "taxable_amount": 3966.39,
	                "percent": "0.00",
	                "per_unit_amount": 28,
	                "base_unit_measure": 1000
	            }
	        ],

	        "description": "GASEOSA COCA COLA PERSONAL",
	        "code": "PRO000001",
	        "type_item_identification_id": 4,
	        "price_amount": 5000,
	        "base_quantity": "1"
	    }
	]
}
```

---

## Factura con productos gratis (regalos)

`POST http://apidian2023.oo/public/api/ubl2.1/invoice`

ENVIO DE FACTURA CON PRODUCTOS GRATIS

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Este ejemplo ilustra como se debe utilizar la API para enviar una factura que incluya articulos que no seran cobrados, es decir obsequios, o productos gratis, el campo que especifica esta situacion es free\_of\_charge\_indicator

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "number": 990000367,
    "type_document_id": 1,
    "date": "2021-08-17",
    "time": "22:09:34",
    "resolution_number": "18760000001",
    "prefix": "SETP",
    "sendmail": false,
    "customer": {
        "identification_number": 1053005500,
        "dv": 8,
        "name": "DANIEL JOSÉ ACOSTA RODRIGUEZ",
        "phone": "0000000",
        "address": "Sin definir",
        "email": "sin_informacion@sin_informacion.com",
        "merchant_registration": "0000000-00",
        "type_document_identification_id": 3,
        "type_organization_id": 2,
        "municipality_id": 150,
        "type_regime_id": 2
    },
    "payment_form": {
        "payment_form_id": 1,
        "payment_method_id": 30,
        "payment_due_date": "2021-09-17",
        "duration_measure": 30
    },
    "allowance_charges": [{
            "discount_id": 12,
            "charge_indicator": false,
            "allowance_charge_reason": "BECA ESPECIAL  ",
            "amount": 438901.0,
            "base_amount": 438901.0
        }
    ],
    "legal_monetary_totals": {
        "line_extension_amount": 463992.0,
        "tax_exclusive_amount": 463992.0,
        "tax_inclusive_amount": 463992.0,
        "allowance_total_amount": 438901.0,
        "charge_total_amount": 0.0,
        "payable_amount": 25091.0
    },
    "tax_totals": [{
            "tax_id": 1,
            "tax_amount": 0.0,
            "percent": 0.0,
            "taxable_amount": 0.0
        }
    ],
    "invoice_lines": [{
            "unit_measure_id": 70,
            "invoiced_quantity": 1,
            "line_extension_amount": 4389.0,
            "free_of_charge_indicator": false,
            "tax_totals": [{
                    "tax_id": 1,
                    "tax_amount": 0.0,
                    "percent": 0.0,
                    "taxable_amount": 4389.0
                }
            ],
            "description": "ESTAMPILLA PREGRADO",
            "code": "000883",
            "type_item_identification_id": 4,
            "price_amount": 4389.0,
            "base_quantity": 1
        }, {
            "unit_measure_id": 70,
            "invoiced_quantity": 1,
            "line_extension_amount": 20702.0,
            "free_of_charge_indicator": false,
            "tax_totals": [{
                    "tax_id": 1,
                    "tax_amount": 0.0,
                    "percent": 0.0,
                    "taxable_amount": 20702.0
                }
            ],
            "description": "DERECHOS ESPERIALES PREGRADO",
            "code": "000882",
            "type_item_identification_id": 4,
            "price_amount": 20702.0,
            "base_quantity": 1
        }, {
            "unit_measure_id": 70,
            "invoiced_quantity": 1,
            "line_extension_amount": 438901.0,
            "allowance_charges": [{
                    "discount_id": 12,
                    "charge_indicator": false,
                    "allowance_charge_reason": "BECA ESPECIAL  ",
                    "amount": 438901.0,
                    "base_amount": 438901.0
                }
            ],
            "tax_totals": [{
                    "tax_id": 1,
                    "tax_amount": 0.0,
                    "percent": 0.0,
                    "taxable_amount": 438901.0
                }
            ],
            "description": "MATRICULA PREGRADO",
            "code": "000880",
            "type_item_identification_id": 4,
            "price_amount": 438901.0,
            "base_quantity": 1,
            "reference_price_id": 1,
            "free_of_charge_indicator": true
        }
    ]
}
```

---

## Factura con dos tarifas de impuestos y retenciones

`POST http://apidian2023.oo/public/api/ubl2.1/invoice`

ENVIO DE FACTURA CON DOS TARIFAS DE IMPUESTOS Y RETENCIONES

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Este ejemplo ilustra como se debe utilizar la API para enviar una factura que incluya dos tarifas de impuestos y ademas tenga retenciones, las retenciones se especifican dentro del grupo: with\_holding\_tax\_total

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "number": 990000369,
    "type_document_id": 1,
    "date": "2021-08-17",
    "time": "08:32:31",
    "resolution_number": "18760000001",
    "prefix": "SETP",
    "customer": {
        "identification_number": 89008003,
        "dv": 2,
        "name": "ALEXANDER OBANDO LONDONO",
        "phone": 3103891693,
        "address": "BRR LIMONAR MZ 6 CS 3 ET 1",
        "email": "alexander_obando@hotmail.com",
        "merchant_registration": "0000-00",
        "type_document_identification_id": 3,
        "type_organization_id": 2,
        "municipality_id": 149,
        "type_regime_id": 2
    },
    "payment_form": {
        "payment_form_id": 1,
        "payment_method_id": 10,
        "payment_due_date": "2021-08-17",
        "duration_measure": "0"
    },
    "allowance_charges": [{
            "discount_id": 1,
            "charge_indicator": false,
            "allowance_charge_reason": "DESCUENTO GENERAL",
            "amount": "0.00",
            "base_amount": "1140336.13"
        }
    ],
    "legal_monetary_totals": {
        "line_extension_amount": "1140336.13",
        "tax_exclusive_amount": "1140336.13",
        "tax_inclusive_amount": "1300000.00",
        "allowance_total_amount": "0.00",
        "charge_total_amount": "0.00",
        "payable_amount": "1300000.00"
    },
    "with_holding_tax_total": [{
            "tax_id": 5,
            "tax_amount": "126050.042",
            "percent": "15",
            "taxable_amount": "840336.13"
        }, {
            "tax_id": 6,
            "tax_amount": "29411.76",
            "percent": "3.50",
            "taxable_amount": "840336.13"
        }
    ],
    "tax_totals": [{
            "tax_id": 1,
            "tax_amount": "0.00",
            "percent": "0",
            "taxable_amount": "300000.00"
        }, {
            "tax_id": 1,
            "tax_amount": "159663.86",
            "percent": "19",
            "taxable_amount": "840336.13"
        }
    ],
    "invoice_lines": [{
            "unit_measure_id": 70,
            "invoiced_quantity": "1",
            "line_extension_amount": "300000.00",
            "free_of_charge_indicator": false,
            "allowance_charges": [{
                    "charge_indicator": false,
                    "allowance_charge_reason": "DESCUENTO GENERAL",
                    "amount": "0.00",
                    "base_amount": "300000.00"
                }
            ],
            "tax_totals": [{
                    "tax_id": 1,
                    "tax_amount": "0.00",
                    "taxable_amount": "300000.00",
                    "percent": "0.00"
                }
            ],
            "description": "CESANTIA MERCANTIL",
            "code": "CESANTIA",
            "type_item_identification_id": 4,
            "price_amount": "300000.00",
            "base_quantity": "1"
        }, {
            "unit_measure_id": 70,
            "invoiced_quantity": "1",
            "line_extension_amount": "840336.13",
            "free_of_charge_indicator": false,
            "allowance_charges": [{
                    "charge_indicator": false,
                    "allowance_charge_reason": "DESCUENTO GENERAL",
                    "amount": "0.00",
                    "base_amount": "1000000.00"
                }
            ],
            "tax_totals": [{
                    "tax_id": 1,
                    "tax_amount": "159663.86",
                    "taxable_amount": "840336.13",
                    "percent": "19.00"
                }
            ],
            "description": "COMISION POR SERVICIOS",
            "code": "COMISION",
            "type_item_identification_id": 4,
            "price_amount": "840336.13",
            "base_quantity": "1"
        }
    ]
}
```

---

## Factura con impuesto nacional al consumo (INC)

`POST http://facturalatam-apidian.oo/api/ubl2.1/invoice`

ENVIO DE FACTURA CON IMPUESTO AL CONSUMO (INC)

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Utilice este ejemplo cuando la factura lleve impuesto al consumo (tax\_id 2).
* El INC se liquida como un porcentaje sobre la base gravable, por lo que en el tax\_total de la linea se envia percent, tax\_amount y taxable\_amount.
* Es el caso tipico de restaurantes y bares, donde el INC del 8% reemplaza al IVA: la linea lleva el IVA en 0 y el INC con su tarifa, y los dos quedan en los tax\_totals del documento.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "number": 990060197,
    "customer": {
        "address": "CLL 4 NRO 33-90",
        "email": "gerencia@torresoftware.com",
        "identification_number": "900166483",
        "merchant_registration": "0000000-00",
        "municipality_id": 149,
        "name": "ALEXANDER OBANDO LONDO\u00d1O",
        "phone": "3103891693",
        "type_document_identification_id": 3,
        "type_liability_id": 117,
        "type_organization_id": 2,
        "type_regime_id": 2
    },
    "date": "2025-01-20",
    "establishment_address": "Carrera 12 #4-07",
    "establishment_email": "contacto@bandidos.co",
    "establishment_id": "Bandidos",
    "establishment_municipality_id": 832,
    "establishment_phone": "3386992",
    "invoice_lines": [
        {
            "base_quantity": "1",
            "code": "SUSHI001",
            "description": "[SUSHI001] Almuerzo Maki 18 pzas.",
            "free_of_charge_indicator": false,
            "invoiced_quantity": "1",
            "line_extension_amount": "10000.0",
            "price_amount": "10000.0",
            "tax_totals": [
                {
                    "tax_id": 1,
                    "tax_amount": 0.00,
                    "percent": 0,
                    "taxable_amount": 10000.0
                },
                {
                    "percent": 8.0,
                    "tax_amount": 800.0,
                    "tax_id": 2,
                    "taxable_amount": 10000.0
                }
            ],
            "type_item_identification_id": 4,
            "unit_measure_id": 70
        }
    ],
    "legal_monetary_totals": {
        "line_extension_amount": 10000.0,
        "payable_amount": 10800.0,
        "tax_exclusive_amount": 10000.0,
        "tax_inclusive_amount": 10800.0
    },
    "payment_forms": [
        {
            "duration_measure": 0,
            "payment_due_date": "2025-01-20",
            "payment_form_id": 1,
            "payment_method_id": 1
        }
    ],
    "prefix": "SETP",
    "resolution_number": "18760000001",
    "send_customer_credentials": false,
    "sendmail": false,
    "sendmailtome": false,
    "tax_totals": [
        {
            "tax_id": 1,
            "tax_amount": 0.00,
            "percent": 0,
            "taxable_amount": 10000.0
        },
        {
            "percent": 8.0,
            "tax_amount": 800.0,
            "tax_id": 2,
            "taxable_amount": 10000.0
        }
    ],
    "time": "10:51:46",
    "type_document_id": 1
}
```

---
