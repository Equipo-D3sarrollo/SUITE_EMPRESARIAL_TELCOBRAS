# 07 - Otros tipos de Facturas

> Fuente: colección Postman pública «FacturaLatam ApiDianV2.1» (<https://documenter.getpostman.com/view/50442293/2sBYHUSfRJ>), descargada el 10-nov-2026. Tokens y secretos censurados; base64 largos recortados.

Se incluyen otros tipos de facturas como AIU, Mandato, Exportacion y Contingencia.

## 📁 Sector salud

#### TABLAS

* tipos de documento de identificacion

| ID | Código | Descripción |
| --- | --- | --- |
| 1 | CC | Cédula de ciudadanía |
| 2 | CE | Cédula de extranjería |
| 3 | CD | Carné diplomático |
| 4 | PA | Pasaporte |
| 5 | SC | Salvoconducto |
| 6 | PE | Permiso especial de permanencia |
| 7 | RC | Registro civil de nacimiento |
| 8 | TI | Tarjeta de identidad |
| 9 | CN | Certificado de nacido vivo |
| 10 | AS | Adulto sin identificar |
| 11 | MS | Menor sin identificar |
| 12 | DE | Documento extranjero |
| 13 | SI | Sin identificación |

* tipos de usuario sector salud

| ID | Name |
| --- | --- |
| 1 | Contributivo cotizante |
| 2 | Contributivo beneficiario |
| 3 | Contributivo adicional |
| 4 | Subsidiado |
| 5 | Sin régimen |
| 6 | Especiales o de Excepción cotizante |
| 7 | Especiales o de Excepción beneficiario |
| 8 | Particular |
| 9 | Tomador/Amparado ARL |
| 10 | Tomador/Amparado SOAT |
| 11 | Tomador/Amparado Planes voluntarios de salud |

* metodos de pago de contrato

| ID | Name |
| --- | --- |
| 1 | Pago individual por caso / Conjunto integral de at... |
| 2 | Pago global prospectivo. |
| 3 | Pago por capitación. |
| 4 | Pago por evento. |
| 5 | Otra modalidad (específica) |
| 6 | Pago por tipo de servicio |
| 7 | Pago global prospectivo por episodio |
| 8 | Pago global prospectivo por grupo de riesgo |
| 9 | Pago global prospectivo por especialidad |
| 10 | Pago global prospectivo por nivel de complejidad |
| 11 | Capacitación |
| 12 | Por servicio |

* tipos de covertura

| ID | Name |
| --- | --- |
| 1 | Plan de beneficios en salud financiado con UPC |
| 2 | Presupuesto máximo |
| 3 | Prima EPS/EOC, no asegurados SOAT |
| 4 | Cobertura Póliza SOAT |
| 5 | Cobertura ARL |
| 6 | Cobertura ADRES |
| 7 | Cobertura Salud Pública |
| 8 | Cobertura entidad territorial, recursos de oferta |
| 9 | Urgencias población migrante |
| 10 | Plan complementario en salud |
| 11 | Plan medicina prepagada |
| 12 | Otras pólizas en salud |
| 13 | Cobertura Régimen Especial o Excepción |
| 14 | Cobertura Fondo Nacional de Salud de las Personas ... |
| 15 | Particular |

### Factura del sector salud

`POST http://facturalatam-apidian.oo/api/ubl2.1/invoice`

##### ENVIO DE FACTURA SECTOR SALUD

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Este ejemplo ilustra como se debe utilizar la API para enviar una factura para EL SECTOR SALUD, se utliza para este fin los campos en el grupo health\_fields

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990060206,
	"type_document_id": 1,
	"date": "2025-01-29",
	"time": "04:08:12",
	"resolution_number": "18760000001",
	"prefix": "SETP",
    "disable_confirmation_text": true,
    "establishment_name": "TORRE SOFTWARE",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "atacheddocument_name_prefix": "FES-SETP990000244-",
    "establishment_email": "alternate_email@alternate.com",
	"sendmail": true,
    "seze": "2021-2017",
    "health_fields": {
        "invoice_period_start_date": "2025-01-01",
        "invoice_period_end_date": "2025-01-29",
        "health_type_operation_id": 1,
        "print_users_info_to_pdf": true, // mostrar informacion de pacientes en el PDF
        "users_info":[ // pacientes
            {
                "provider_code": "AF-0000500-85-XX-001", //  codigo proveedor
                "health_type_document_identification_id": 1, // tipo de documento de identificacion
                "identification_number": "A89008003", // numero de documento de identificacion
                "surname": "OBANDO",
                "second_surname": "LONDOÑO",
                "first_name": "ALEXANDER",
                "middle_name": "ANDRES",
                "health_type_user_id": 1, // tipo de usuario sector salud
                "health_contracting_payment_method_id": 2, // metodo de pago del contrato
                "health_coverage_id": 5, // tipo de covertura
                "autorization_numbers": "A12345;604567;AX-2345", // numero de autorizacion
                "mipres": "RNA3D345;664FF04567;ARXXX-2765345",
                "mipres_delivery": "RN6645G-345;6-064XX54FF04567;XXX-2-OO-987D65345",
                "contract_number": "1000-2021-0005698", // numero de contracto
                "policy_number": "1045-2FG01-0567228", // numero de poliza
                "co_payment": "3300.00", // copago
                "moderating_fee": "5800.00", // cuota moderadora
                "recovery_fee": "105000.00", // cuota de recuperacion
                "shared_payment": "225000.00" // pago compartido
            },
            {
                "provider_code": "AF-0000500-85-XX-002",
                "identification_number": "41946692",
                "health_contracting_payment_method_id": 3,
                "health_coverage_id": 3,
                "autorization_numbers": "A12345;604567;AX-2345",
                "mipres": "RNA3D345;664FF04567;ARXXX-2765345",
                "mipres_delivery": "RN6645G-345;6-064XX54FF04567;XXX-2-OO-987D65345",
                "contract_number": "1000-2021-0005698",
                "policy_number": "1045-2FG01-0567228",
                "co_payment": "3300.00",
                "moderating_fee": "5800.00",
                "recovery_fee": "105000.00",
                "shared_payment": "225000.00"
            }
        ]
    },
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
		"payment_due_date": "2025-01-29",
		"duration_measure": "30"
	},	
	"prepaid_payment": {
		"idpayment": "A3123856",
        "prepaid_payment_type_id": 1,
		"paidamount": "100000.00",
		"receiveddate": "2025-01-28",
		"paiddate": "2025-01-28",
		"instructionid": "PRUEBA DE PREPAGO RECIBIDO"
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
		"pre_paid_amount": "100000.00",
		"payable_amount": "11170000.00"
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
            "notes": "ESTA ES UNA PRUEBA DE NOTA DE DETALLE DE LINEA.",
			"code": "COMISION",
			"type_item_identification_id": 4,
			"price_amount": "8603361.34",
			"base_quantity": "1"
		}
		
	]
}
```

**Respuesta de ejemplo — SendInvoice-TestSetId Health (200 OK)**

```json
{
    "success": true,
    "message": "AttachedDocument #SETP990060206 generada con éxito",
    "send_email_success": true,
    "send_email_date_time": true,
    "urlinvoicexml": "FES-SETP990060206.xml",
    "urlinvoicepdf": "FES-SETP990060206.pdf",
    "urlinvoiceattached": "FES-SETP990000244-ad00890080030002500000044.xml",
    "cufe": "753d904d453bdd59e832a1a912da0f5a2fa5490bbc9a3a40b261349c59fec5cc22e2b0a3171422c2c930cb5fcf4d1673",
    "QRStr": "https://catalogo-vpfe-hab.dian.gov.co/document/searchqr?documentkey=[CUFE DE EJEMPLO]",
    "certificate_days_left": 396,
    "resolution_days_left": 1816,
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
                        "Created": "2025-01-29T16:04:25.045Z",
                        "Expires": "2025-01-29T16:09:25.045Z"
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
                        "StatusMessage": "La Factura electrónica SETP990060206, ha sido autorizada.",
                        "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiIHN0YW5kYWxv…[base64 recortado, 14752 caracteres]",
                        "XmlBytes": {
                            "_attributes": {
                                "nil": "true"
                            }
                        },
                        "XmlDocumentKey": "[CUFE DE EJEMPLO]",
                        "XmlFileName": "fv00890080030002500000044"
                    }
                }
            }
        }
    },
    "invoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 34932 caracteres]",
    "zipinvoicexml": "[CENSURADO]",
    "unsignedinvoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 25480 caracteres]",
    "reqfe": "PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzb2FwOkVudmVsb3BlIHhtbG5zOnNv…[base64 recortado, 19312 caracteres]",
    "rptafe": "PHM6RW52ZWxvcGUgeG1sbnM6cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMy8w…[base64 recortado, 21776 caracteres]",
    "attacheddocument": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 63564 caracteres]"
}
```

---

### Factura de salud sin contrato

`POST http://facturalatam-apidian.oo/api/ubl2.1/invoice`

##### ENVIO DE FACTURA SECTOR SALUD

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Este ejemplo ilustra como se debe utilizar la API para enviar una factura para EL SECTOR SALUD, se utliza para este fin los campos en el grupo health\_fields

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
  "type_document_id": 1,
  "prefix": "SETP",
  "number": 994900176,
  "resolution_number": "18760000001",
  "date": "2026-06-11",
  "time": "09:51:05",
  "type_operation_id": 10,
  "notes": "SERVICIO MÉDICO PRESTADO - FACTURA SECTOR SALUD",
  "document_currency_code": "COP",

  "seller": {
    "identification_number": "900368327",
    "dv": "8",
    "name": "MEDICAL HOMECARE S.A.S.",
    "phone": "6015840999",
    "address": "CL 16 B 9 49",
    "email": "medicalhomecaresas@gmail.com",
    "type_document_identification_id": 8,
    "type_organization_id": 1,
    "type_regime_id": 2,
    "type_liability_id": 7,
    "municipality_id": 404,
    "merchant_registration": "Régimen Común"
  },

  "customer": {
    "identification_number": "824001398",
    "dv": "1",
    "name": "ASOCIACION DE CABILDOS INDIGENAS DEL CESAR Y LA GUAJIRA - DUSAKAWI EPSI",
    "phone": "5700373",
    "address": "Calle 8 No 17 – 17 Barrio Pontevedra",
    "email": "facturacionelectronica@dusakawiepsi.com",
    "type_document_identification_id": 6,
    "type_organization_id": 1,
    "type_regime_id": 2,
    "type_liability_id": 7,
    "municipality_id": 404
  },

  "payment_form": {
    "payment_form_id": 1,
    "payment_method_id": 10,
    "payment_due_date": "2026-04-01",
    "duration_measure": 30
  },

  "tax_totals": [
    {
      "tax_id": 1,
      "tax_amount": 0,
      "taxable_amount": "21390000.00",
      "percent": 0
    }
  ],

  "legal_monetary_totals": {
    "line_extension_amount": "21390000.00",
    "tax_exclusive_amount": "21390000.00",
    "tax_inclusive_amount": "21390000.00",
    "allowance_total_amount": 0,
    "charge_total_amount": 0,
    "payable_amount": "21390000.00"
  },

  "invoice_lines": [
    {
      "unit_measure_id": 94,
      "invoiced_quantity": "1.000000",
      "line_extension_amount": "21390000.00",
      "free_of_charge_indicator": false,
      "description": "INTERNACION DE PACIENTE CRONICO TERMINAL CON VENTILADOR COMPLEJIDAD MEDIANA",
      "code": "133M01",
      "type_item_identification_id": 4,
      "price_amount": "21390000.00",
      "base_quantity": "1.000000",
      "tax_totals": [
        {
          "tax_id": 1,
          "tax_amount": 0,
          "taxable_amount": "21390000.00",
          "percent": 0
        }
      ]
    }
  ],

  "health_fields": {
    "invoice_period_start_date": "2026-03-03",
    "invoice_period_end_date": "2026-03-03",
    "health_type_operation_id": 7,
    "health_contracting_payment_method_id": 1,
    "print_users_info_to_pdf": true,
    "users_info": [
        {
        "provider_code": "AF-00000002",
        "identification_number": "1065684560",
        "first_name": "JOSE",
        "surname": "",
        "health_contracting_payment_method_id": 4,
        "health_coverage_id": 6,
        "contract_number": "",
        "health_invoice_without_contract_id": 1, //id contrato sin factura
        "co_payment": 0,
        "moderating_fee": 0,
        "recovery_fee": 0,
        "shared_payment": 0,
        "advance_payment": 0
        }
    ]
  },

  "additional_fields": {
    "responsable": "url www.minsalud.gov.co",
    "tipo_identificador_ano_acto": "Resolución 506:2021"
  }
}
```

**Respuesta de ejemplo — SendInvoice-TestSetId Health (200 OK)**

```json
{
    "success": true,
    "message": "AttachedDocument #SETP990060206 generada con éxito",
    "send_email_success": true,
    "send_email_date_time": true,
    "urlinvoicexml": "FES-SETP990060206.xml",
    "urlinvoicepdf": "FES-SETP990060206.pdf",
    "urlinvoiceattached": "FES-SETP990000244-ad00890080030002500000044.xml",
    "cufe": "753d904d453bdd59e832a1a912da0f5a2fa5490bbc9a3a40b261349c59fec5cc22e2b0a3171422c2c930cb5fcf4d1673",
    "QRStr": "https://catalogo-vpfe-hab.dian.gov.co/document/searchqr?documentkey=[CUFE DE EJEMPLO]",
    "certificate_days_left": 396,
    "resolution_days_left": 1816,
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
                        "Created": "2025-01-29T16:04:25.045Z",
                        "Expires": "2025-01-29T16:09:25.045Z"
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
                        "StatusMessage": "La Factura electrónica SETP990060206, ha sido autorizada.",
                        "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiIHN0YW5kYWxv…[base64 recortado, 14752 caracteres]",
                        "XmlBytes": {
                            "_attributes": {
                                "nil": "true"
                            }
                        },
                        "XmlDocumentKey": "[CUFE DE EJEMPLO]",
                        "XmlFileName": "fv00890080030002500000044"
                    }
                }
            }
        }
    },
    "invoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 34932 caracteres]",
    "zipinvoicexml": "[CENSURADO]",
    "unsignedinvoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 25480 caracteres]",
    "reqfe": "PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzb2FwOkVudmVsb3BlIHhtbG5zOnNv…[base64 recortado, 19312 caracteres]",
    "rptafe": "PHM6RW52ZWxvcGUgeG1sbnM6cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMy8w…[base64 recortado, 21776 caracteres]",
    "attacheddocument": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 63564 caracteres]"
}
```

---

### Factura de salud con varios pacientes

`POST http://facturalatam-apidian.oo/api/ubl2.1/invoice`

ENVIO DE FACTURA SECTOR SALUD

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Este ejemplo ilustra como se debe utilizar la API para enviar una factura para EL SECTOR SALUD de tipo SS-recaudo donde se informa el tercero responsable del recaudo

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
  "number": 9900001023,
  "type_document_id": 1,
  "prefix": "SETP",
  "resolution_number": "18760000001",
  "customer": {
    "identification_number": "900123456",
    "name": "Proveedor Ejemplo S.A.S.",
    "phone": "3001234567",
    "address": "Calle Falsa 123",
    "email": "contacto@proveedorejemplo.com",
    "merchant_registration": "000001",
    "type_document_identification_id": 3,
    "type_organization_id": 2,
    "municipality_id_fact": 11001,
    "type_regime_id": 2,
    "type_liability_id": 117
  },
  "tax_totals": [],
  "legal_monetary_totals": {
    "line_extension_amount": "120000.00",
    "tax_exclusive_amount": "120000.00",
    "tax_inclusive_amount": "120000.00",
    "allowance_total_amount": "0.00",
    "charge_total_amount": "0.00",
    "payable_amount": "120000.00"
  },
  "allowance_charges": [],
  "invoice_lines": [
    {
      "unit_measure_id": "70",
      "invoiced_quantity": 3,
      "line_extension_amount": "120000.00",
      "notes": null,
      "free_of_charge_indicator": false,
      "allowance_charges": [],
      "tax_totals": [],
      "description": "Consultas médicas",
      "code": "CONS01",
      "type_item_identification_id": 4,
      "price_amount": "40000.00",
      "base_quantity": 3
    }
  ],
  "with_holding_tax_total": [],
  "health_fields": {
    "invoice_period_start_date": "2025-05-01",
    "invoice_period_end_date": "2025-05-31",
    "health_type_operation_id": 1,
    "print_users_info_to_pdf": true,
    "users_info": [
      {
        "provider_code": "900123456",
        "health_type_document_identification_id": 1,
        "identification_number": "11223344",
        "surname": "Apellido1",
        "second_surname": "Apellido2",
        "first_name": "Nombre1",
        "middle_name": "Nombre2",
        "health_type_user_id": 4,
        "health_contracting_payment_method_id": 4,
        "health_coverage_id": 10,
        "co_payment": 5000,
        "moderating_fee": "0",
        "recovery_fee": 0,
        "shared_payment": 0
      },
      {
        "provider_code": "900123456",
        "health_type_document_identification_id": 1,
        "identification_number": "55667788",
        "surname": "Apellido3",
        "second_surname": "Apellido4",
        "first_name": "Nombre3",
        "middle_name": "Nombre4",
        "health_type_user_id": 4,
        "health_contracting_payment_method_id": 4,
        "health_coverage_id": 10,
        "co_payment": 0,
        "moderating_fee": "4000",
        "recovery_fee": 0,
        "shared_payment": 0
      },
      {
        "provider_code": "900123456",
        "health_type_document_identification_id": 1,
        "identification_number": "99887766",
        "surname": "Apellido5",
        "second_surname": "Apellido6",
        "first_name": "Nombre5",
        "middle_name": "Nombre6",
        "health_type_user_id": 4,
        "health_contracting_payment_method_id": 4,
        "health_coverage_id": 10,
        "co_payment": 0,
        "moderating_fee": "0",
        "recovery_fee": 0,
        "shared_payment": 0
      }
    ]
  }
}
```

---

### Factura de salud con recaudo (SS-Recaudo)

`POST http://facturalatam-apidian.oo/api/ubl2.1/invoice`

ENVIO DE FACTURA SECTOR SALUD

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Este ejemplo ilustra como se debe utilizar la API para enviar una factura para EL SECTOR SALUD de tipo SS-recaudo donde se informa el tercero responsable del recaudo

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "number": 990070003,
    "type_document_id": 1,
    "date": "2025-05-05",
    "time": "09:09:12",
    "resolution_number": "18760000001",
    "prefix": "SETP",
    "notes": "ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA",
    "disable_confirmation_text": true,
    "establishment_name": "TORRE SOFTWARE",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "establishment_email": "alternate_email@alternate.com",
    "sendmail": false,
    "sendmailtome": false,
    "send_customer_credentials": false,
    "seze": "2021-2017",
    "email_cc_list": [],
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
        "payment_method_id": 30,
        "payment_due_date": "2024-08-31",
        "duration_measure": "0"
    },
    "legal_monetary_totals": {
        "line_extension_amount": "840336.134",
        "tax_exclusive_amount": "840336.134",
        "tax_inclusive_amount": "1000000.00",
        "payable_amount": "1000000.00"
    },
    "tax_totals": [
        {
            "tax_id": 1,
            "tax_amount": "159663.865",
            "percent": "19.00",
            "taxable_amount": "840336.134"
        }
    ],
    "invoice_lines": [
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
            "base_quantity": "1",
            "agentparty": 900166483,
            "agentparty_dv": 1
        }
    ]
}
```

---

### Factura de salud por capita inicial

`POST http://facturalatam-apidian.oo/api/ubl2.1/invoice`

ENVIO DE FACTURA SECTOR SALUD TIPO CAPITA INICIAL

* no contiene atencion de pacientes
* se utiliza tipo SS-RECAUDO con modalidad de **Inicio de contrato por cápita**
* el XML cuenta con la seccion "InformationContentProviderParty"
* el attacheddocument debe usarse en el rips como en el ejemplo **RIPS Capita inicial**

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "number": 990070004,
    "type_document_id": 1,
    "date": "2025-06-16",
    "time": "09:09:12",
    "resolution_number": "18760000001",
    "prefix": "SETP",
    "disable_confirmation_text": true,
    "establishment_name": "TORRE SOFTWARE",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "establishment_email": "alternate_email@alternate.com",
    "sendmail": false,
    "sendmailtome": false,
    "send_customer_credentials": false,
    "seze": "2021-2017",
    "email_cc_list": [],
    "customer": {
        "identification_number": 900166483,
        "dv": 1,
        "name": "INVERSIONES DAVAL SAS",
        "phone": "3103891693",
        "address": "CLL 4 NRO 33-90",
        "email": "alexanderobandolondonos@gmail.com",
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
		"payment_due_date": "2025-06-13",
		"duration_measure": "0"
	},
    "legal_monetary_totals": {
        "line_extension_amount": "840336.134",
        "tax_exclusive_amount": "840336.134",
        "tax_inclusive_amount": "1000000.00",
        "payable_amount": "1000000.00"
    },
    "tax_totals": [
        {
            "tax_id": 1,
            "tax_amount": "159663.865",
            "percent": "19.00",
            "taxable_amount": "840336.134"
        }
    ],
    "invoice_lines": [
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
            "description": "RECAUDO INICIAL",
            "notes": "RECAUDO INICIAL POR PERIODO DE CAPITACIÓN MAYO 2025",
            "code": "RECAUDO",
            "type_item_identification_id": 4,
            "price_amount": "1000000.00",
            "base_quantity": "1"
        }
    ],
    "health_fields": {
        "invoice_period_start_date": "2025-05-01",
        "invoice_period_end_date": "2025-05-29",
        "health_type_operation_id": 5,
        "print_users_info_to_pdf": false,
        "users_info":[]
    }
}
```

**Respuesta de ejemplo — aceptada (200 OK)**

```json
{
    "success": true,
    "message": "AttachedDocument #SETP990070004 generada con éxito",
    "send_email_success": false,
    "send_email_date_time": false,
    "urlinvoicexml": "FES-SETP990070004.xml",
    "urlinvoicepdf": "FES-SETP990070004.pdf",
    "urlinvoiceattached": "ad09018462800002500000014.xml",
    "cufe": "000e82a758bd4eaf7aeefe75489f6004f54a8b1bf9777439349c5d6f497f6adb1141cd0cbfee204d14f89c2a6fe456c1",
    "QRStr": "https://catalogo-vpfe-hab.dian.gov.co/document/searchqr?documentkey=[CUFE DE EJEMPLO]",
    "certificate_days_left": 73,
    "resolution_days_left": 1678,
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
                        "Created": "2025-06-16T16:03:17.045Z",
                        "Expires": "2025-06-16T16:08:17.045Z"
                    }
                }
            },
            "Body": {
                "SendBillSyncResponse": {
                    "SendBillSyncResult": {
                        "ErrorMessage": {
                            "string": [
                                "Regla: FAJ44b, Notificación: Nit o Documento de Identificación informado No corresponde al registrado en el RUT con respecto a la razón social o nombre comercial suministrado.",
                                "Regla: FAJ43b, Notificación: Nombre informado No corresponde al registrado en el RUT con respecto al Nit suminstrado."
                            ]
                        },
                        "IsValid": "true",
                        "StatusCode": "00",
                        "StatusDescription": "Procesado Correctamente.",
                        "StatusMessage": "La Factura electrónica SETP990070004, ha sido autorizada.",
                        "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiIHN0YW5kYWxv…[base64 recortado, 15316 caracteres]",
                        "XmlBytes": {
                            "_attributes": {
                                "nil": "true"
                            }
                        },
                        "XmlDocumentKey": "[CUFE DE EJEMPLO]",
                        "XmlFileName": "fv09018462800002500000014"
                    }
                }
            }
        }
    },
    "whatsapp_response": null,
    "invoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 25200 caracteres]",
    "zipinvoicexml": "[CENSURADO]",
    "unsignedinvoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 15772 caracteres]",
    "reqfe": "PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzb2FwOkVudmVsb3BlIHhtbG5zOnNv…[base64 recortado, 17984 caracteres]",
    "rptafe": "PHM6RW52ZWxvcGUgeG1sbnM6cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMy8w…[base64 recortado, 22792 caracteres]",
    "attacheddocument": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 54360 caracteres]"
}
```

---

### Factura de salud por capita del periodo

`POST http://facturalatam-apidian.oo/api/ubl2.1/invoice`

ENVIO DE FACTURA SECTOR SALUD TIPO CAPITA PERIODO

* contiene atencion de pacientes
* se utiliza tipo SS-CUFE
* el JSON y el XML son similares a los ejemplos de la factura de Salud
* el attacheddocument debe usarse en el rips como en el ejemplo **RIPS Capita Periodo**

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "number": 990070006,
    "type_document_id": 1,
    "date": "2025-06-16",
    "time": "09:09:12",
    "resolution_number": "18760000001",
    "prefix": "SETP",
    "disable_confirmation_text": true,
    "establishment_name": "TORRE SOFTWARE",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "establishment_email": "alternate_email@alternate.com",
    "sendmail": false,
    "sendmailtome": false,
    "send_customer_credentials": false,
    "seze": "2021-2017",
    "email_cc_list": [],
    "customer": {
        "identification_number": 900166483,
        "dv": 1,
        "name": "INVERSIONES DAVAL SAS",
        "phone": "3103891693",
        "address": "CLL 4 NRO 33-90",
        "email": "alexanderobandolondonos@gmail.com",
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
        "payment_due_date": "2025-06-13",
        "duration_measure": "0"
    },
    "legal_monetary_totals": {
        "line_extension_amount": "840336.134",
        "tax_exclusive_amount": "840336.134",
        "tax_inclusive_amount": "1000000.00",
        "payable_amount": "1000000.00"
    },
    "tax_totals": [
        {
            "tax_id": 1,
            "tax_amount": "159663.865",
            "percent": "19.00",
            "taxable_amount": "840336.134"
        }
    ],
    "invoice_lines": [
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
            "description": "RECAUDO PERIODO",
            "notes": "RECAUDO PERIODO POR PERIODO DE CAPITACIÓN MAYO 2025",
            "code": "RECAUDO",
            "type_item_identification_id": 4,
            "price_amount": "1000000.00",
            "base_quantity": "1"
        }
    ],
    "health_fields": {
        "invoice_period_start_date": "2025-05-01",
        "invoice_period_end_date": "2025-05-31",
        "health_type_operation_id": 1,
        "print_users_info_to_pdf": true,
        "users_info": [
            {
                "provider_code": "900123456",
                "health_type_document_identification_id": 1,
                "identification_number": "11223344",
                "surname": "Apellido1",
                "second_surname": "Apellido2",
                "first_name": "Nombre1",
                "middle_name": "Nombre2",
                "health_type_user_id": 4,
                "health_contracting_payment_method_id": 4,
                "health_coverage_id": 10,
                "co_payment": 5000,
                "moderating_fee": "0",
                "recovery_fee": 0,
                "shared_payment": 0
            },
            {
                "provider_code": "900123457",
                "health_type_document_identification_id": 1,
                "identification_number": "55667788",
                "surname": "Apellido3",
                "second_surname": "Apellido4",
                "first_name": "Nombre3",
                "middle_name": "Nombre4",
                "health_type_user_id": 4,
                "health_contracting_payment_method_id": 4,
                "health_coverage_id": 10,
                "co_payment": 0,
                "moderating_fee": "4000",
                "recovery_fee": 0,
                "shared_payment": 0
            },
            {
                "provider_code": "900123458",
                "health_type_document_identification_id": 1,
                "identification_number": "99887766",
                "surname": "Apellido5",
                "second_surname": "Apellido6",
                "first_name": "Nombre5",
                "middle_name": "Nombre6",
                "health_type_user_id": 4,
                "health_contracting_payment_method_id": 4,
                "health_coverage_id": 10,
                "co_payment": 0,
                "moderating_fee": "0",
                "recovery_fee": 0,
                "shared_payment": 0
            }
        ]
    }
}
```

**Respuesta de ejemplo — aceptada (200 OK)**

```json
{
    "success": true,
    "message": "AttachedDocument #SETP990070006 generada con éxito",
    "send_email_success": false,
    "send_email_date_time": false,
    "urlinvoicexml": "FES-SETP990070006.xml",
    "urlinvoicepdf": "FES-SETP990070006.pdf",
    "urlinvoiceattached": "ad09018462800002500000011.xml",
    "cufe": "27b3bfca273fbbdf5f031952b5447977d7b87f3087d9127379044ba4855532b78baa8d8a0e1d572703a6bb9cf388c7ff",
    "QRStr": "https://catalogo-vpfe-hab.dian.gov.co/document/searchqr?documentkey=[CUFE DE EJEMPLO]",
    "certificate_days_left": 73,
    "resolution_days_left": 1678,
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
                        "Created": "2025-06-16T15:17:59.486Z",
                        "Expires": "2025-06-16T15:22:59.486Z"
                    }
                }
            },
            "Body": {
                "SendBillSyncResponse": {
                    "SendBillSyncResult": {
                        "ErrorMessage": {
                            "string": [
                                "Regla: FAJ44b, Notificación: Nit o Documento de Identificación informado No corresponde al registrado en el RUT con respecto a la razón social o nombre comercial suministrado.",
                                "Regla: FAJ43b, Notificación: Nombre informado No corresponde al registrado en el RUT con respecto al Nit suminstrado."
                            ]
                        },
                        "IsValid": "true",
                        "StatusCode": "00",
                        "StatusDescription": "Procesado Correctamente.",
                        "StatusMessage": "La Factura electrónica SETP990070006, ha sido autorizada.",
                        "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiIHN0YW5kYWxv…[base64 recortado, 15316 caracteres]",
                        "XmlBytes": {
                            "_attributes": {
                                "nil": "true"
                            }
                        },
                        "XmlDocumentKey": "[CUFE DE EJEMPLO]",
                        "XmlFileName": "fv09018462800002500000011"
                    }
                }
            }
        }
    },
    "whatsapp_response": null,
    "invoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 31808 caracteres]",
    "zipinvoicexml": "[CENSURADO]",
    "unsignedinvoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 22376 caracteres]",
    "reqfe": "PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzb2FwOkVudmVsb3BlIHhtbG5zOnNv…[base64 recortado, 18544 caracteres]",
    "rptafe": "PHM6RW52ZWxvcGUgeG1sbnM6cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMy8w…[base64 recortado, 22792 caracteres]",
    "attacheddocument": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 60964 caracteres]"
}
```

---

### Factura de salud con pago moderador

`POST http://facturalatam-apidian.oo/api/ubl2.1/invoice`

ENVIO DE FACTURA SECTOR SALUD

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Este ejemplo ilustra como se debe utilizar la API para enviar una factura para EL SECTOR SALUD de tipo SS-recaudo donde se informa el tercero responsable del recaudo

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "number": 990000103,
    "type_document_id": 1,
    "prefix": "SETP",
    "resolution_number": "18760000001",
    "customer": {
        "identification_number": "900166483",
        "name": "INVERSIONES DAVAL S A S",
        "phone": "7685856785",
        "address": "CLL 4 NRO 33-90",
        "email": "inversiones@daval.com",
        "merchant_registration": "000000",
        "type_document_identification_id": 3,
        "type_organization_id": 2,
        "municipality_id_fact": 12667,
        "type_regime_id": 2,
        "type_liability_id": 117
    },
    "tax_totals": [
        {
            "tax_id": 1,
            "tax_amount": "238.1",
            "percent": "5.00",
            "taxable_amount": "4761.9047619047615"
        }
    ],
    "legal_monetary_totals": {
        "line_extension_amount": "4761.9047619047615",
        "tax_exclusive_amount": "4761.9047619047615",
        "tax_inclusive_amount": "5000.004761904762",
        "allowance_total_amount": "0.00",
        "charge_total_amount": "0.00",
        "payable_amount": "5000.004761904762"
    },
    "allowance_charges": [
        {
            "discount_id": 1,
            "charge_indicator": false,
            "allowance_charge_reason": "DESCUENTO GENERAL",
            "amount": "0.00",
            "base_amount": "4761.9047619047615"
        }
    ],
    "invoice_lines": [
        {
            "unit_measure_id": "70",
            "invoiced_quantity": 1,
            "line_extension_amount": "4761.9047619047615",
            "notes": null,
            "free_of_charge_indicator": false,
            "allowance_charges": [
                {
                    "charge_indicator": false,
                    "allowance_charge_reason": "DESCUENTO GENERAL",
                    "amount": "0.00",
                    "base_amount": "4761.9047619047615"
                }
            ],
            "tax_totals": [
                {
                    "tax_id": 1,
                    "tax_amount": "238.10",
                    "taxable_amount": "4761.9047619047615",
                    "percent": "5.00"
                }
            ],
            "description": "Arepa",
            "code": "arp01",
            "type_item_identification_id": 4,
            "price_amount": "5000.004761904762",
            "base_quantity": 1
        }
    ],
    "with_holding_tax_total": [],
    "health_fields": {
        "invoice_period_start_date": "2025-04-01",
        "invoice_period_end_date": "2025-04-30",
        "health_type_operation_id": 1,
        "print_users_info_to_pdf": true,
        "users_info":[
            {
                "provider_code": "AF-0000500-85-XX-002",
                "health_type_document_identification_id": 1,
                "identification_number": "A89008003",
                "surname": "OBANDO",
                "second_surname": "LONDOÑO",
                "first_name": "ALEXANDER",
                "middle_name": "ANDRES",
                "health_type_user_id": 4,
                "health_contracting_payment_method_id": 4,
                "health_coverage_id": 10,
                "autorization_numbers": "234456",
                "mipres": null,
                "mipres_delivery": null,
                "contract_number": null,
                "policy_number": null,
                "co_payment": 0, // copago
                "moderating_fee": "15000", // pago moderador
                "recovery_fee": 0,
                "shared_payment": 0
            }
        ]
    }
}
```

---

## Factura con productos exentos de IVA

`POST http://facturalatam-apidian.oo/api/ubl2.1/invoice`

ENVIO DE FACTURA ARTICULOS EXCENTOS DE IVA

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Este ejemplo ilustra como se debe utilizar la API para enviar una factura excenta de IVA, es de aclarar que excenta de IVA, es diferente de excluida de IVA.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990000519,
	"type_document_id": 1,
	"date": "2022-04-25",
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
	"payment_form": {
		"payment_form_id": 2,
		"payment_method_id": 30,
		"payment_due_date": "2022-05-25",
		"duration_measure": "30"
	},	
	"allowance_charges": [
		{
			"discount_id": 1,
			"charge_indicator": false,
			"allowance_charge_reason": "DESCUENTO GENERAL",
			"amount": "0.00",
			"base_amount": "1000000.00"
		}
	],
	"legal_monetary_totals": {
		"line_extension_amount": "1000000.00",
		"tax_exclusive_amount": "0.00",
		"tax_inclusive_amount": "1000000.00",
		"allowance_total_amount": "0.00",
		"charge_total_amount": "0.00",
		"payable_amount": "1000000.00"
	},
	"invoice_lines": 
	[
		{
			"unit_measure_id": 70,
			"invoiced_quantity": "1",
			"line_extension_amount": "1000000.00",
			"free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": false,
					"allowance_charge_reason": "DESCUENTO GENERAL",
					"amount": "0.00",
					"base_amount": "1000000.00"
				}
			],
			"description": "COMISION POR SERVICIOS",
			"code": "COMISION",
			"type_item_identification_id": 4,
			"price_amount": "1000000.00",
			"base_quantity": "1"
		}
	]
}
```

---

## Factura con productos exentos e IVA 0%

`POST http://apidian2023.oo/api/ubl2.1/invoice`

ENVIO DE FACTURA CON ARTICULOS EXCENTOS E IVA 0

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Este ejemplo ilustra como se debe utilizar la API para enviar una factura que tenga articulos excentos de IVA y articulos excluidos de IVA.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990000373,
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
	"allowance_charges": [
		{
			"discount_id": 1,
			"charge_indicator": false,
			"allowance_charge_reason": "DESCUENTO GENERAL",
			"amount": "0.00",
			"base_amount": "1000000.00"
		}
	],
	"legal_monetary_totals": {
		"line_extension_amount": "1002400.00",
		"tax_exclusive_amount": "2400.00",
		"tax_inclusive_amount": "1002400.00",
		"allowance_total_amount": "0.00",
		"charge_total_amount": "0.00",
		"payable_amount": "1002400.00"
	},
	"tax_totals": [
    	{
	    	"tax_id": 1,
		    "tax_amount": "0.00",
    		"taxable_amount": "2400.00",
	    	"percent": "0.00"
    	}
	],
	"invoice_lines": 
	[
		{
			"unit_measure_id": 70,
			"invoiced_quantity": "1",
			"line_extension_amount": "1000000.00",
			"free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": false,
					"allowance_charge_reason": "DESCUENTO GENERAL",
					"amount": "0.00",
					"base_amount": "1000000.00"
				}
			],
			"description": "COMISION POR SERVICIOS",
			"code": "COMISION",
			"type_item_identification_id": 4,
			"price_amount": "1000000.00",
			"base_quantity": "1"
		},
		{
			"unit_measure_id": 70,
			"invoiced_quantity": "1",
			"line_extension_amount": "2400.00",
			"free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": false,
					"allowance_charge_reason": "DESCUENTO GENERAL",
					"amount": "0.00",
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
			"price_amount": "2400.00",
			"base_quantity": "1"
		}		
	]
}
```

---

## Factura con productos exentos e IVA 19%

`POST http://apidian2023.oo/api/ubl2.1/invoice`

ENVIO DE FACTURA ARTICULOS EXCENTOS E IVA 19

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Este ejemplo ilustra como se debe utilizar la API para enviar una factura con articulos que lleven articulos excentos de IVA y a la vez articulos con tarifa de IVA 19%, aunque tambien se puede usar para otras tarifas de IVA.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990000375,
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
	"allowance_charges": [
		{
			"discount_id": 1,
			"charge_indicator": false,
			"allowance_charge_reason": "DESCUENTO GENERAL",
			"amount": "0.00",
			"base_amount": "1000000.00"
		}
	],
	"legal_monetary_totals": {
		"line_extension_amount": "1002400.00",
		"tax_exclusive_amount": "2400.00",
		"tax_inclusive_amount": "1002856.00",
		"allowance_total_amount": "0.00",
		"charge_total_amount": "0.00",
		"payable_amount": "1002856.00"
	},
	"tax_totals": [
    	{
	    	"tax_id": 1,
		    "tax_amount": "456.00",
    		"taxable_amount": "2400.00",
	    	"percent": "19.00"
    	}
	],
	"invoice_lines": 
	[
		{
			"unit_measure_id": 70,
			"invoiced_quantity": "1",
			"line_extension_amount": "1000000.00",
			"free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": false,
					"allowance_charge_reason": "DESCUENTO GENERAL",
					"amount": "0.00",
					"base_amount": "1000000.00"
				}
			],
			"description": "COMISION POR SERVICIOS",
			"code": "COMISION",
			"type_item_identification_id": 4,
			"price_amount": "1000000.00",
			"base_quantity": "1"
		},
		{
			"unit_measure_id": 70,
			"invoiced_quantity": "1",
			"line_extension_amount": "2400.00",
			"free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": false,
					"allowance_charge_reason": "DESCUENTO GENERAL",
					"amount": "0.00",
					"base_amount": "2400.00"
				}
			],
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "456.00",
					"taxable_amount": "2400.00",
					"percent": "19.00"
				}
			],
			"description": "CURUBA",
			"code": "CURUBA",
			"type_item_identification_id": 4,
			"price_amount": "2856.00",
			"base_quantity": "1"
		}		
	]
}
```

---

## Factura con productos exentos, IVA 19% y 0%

`POST http://apidian2023.oo/api/ubl2.1/invoice`

ENVIO DE FACTURA CON ARTICULOS EXCENTOS, IVA 0 E IVA 19

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Este ejemplo ilustra como se debe utilizar la API para enviar una factura con articulos que lleven articulos excentos de IVA y a la vez articulos con tarifa de IVA 19% y tarifa de IVA 0%.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990000376,
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
	"allowance_charges": [
		{
			"discount_id": 1,
			"charge_indicator": false,
			"allowance_charge_reason": "DESCUENTO GENERAL",
			"amount": "0.00",
			"base_amount": "1000000.00"
		}
	],
	"legal_monetary_totals": {
		"line_extension_amount": "1005800.00",
		"tax_exclusive_amount": "5800.00",
		"tax_inclusive_amount": "1006256.00",
		"allowance_total_amount": "0.00",
		"charge_total_amount": "0.00",
		"payable_amount": "1006256.00"
	},
	"tax_totals": [
    	{
	    	"tax_id": 1,
		    "tax_amount": "456.00",
    		"taxable_amount": "2400.00",
	    	"percent": "19.00"
    	},
    	{
	    	"tax_id": 1,
		    "tax_amount": "0.00",
    		"taxable_amount": "3400.00",
	    	"percent": "0.00"
    	}
	],
	"invoice_lines": 
	[
		{
			"unit_measure_id": 70,
			"invoiced_quantity": "1",
			"line_extension_amount": "1000000.00",
			"free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": false,
					"allowance_charge_reason": "DESCUENTO GENERAL",
					"amount": "0.00",
					"base_amount": "1000000.00"
				}
			],
			"description": "COMISION POR SERVICIOS",
			"code": "COMISION",
			"type_item_identification_id": 4,
			"price_amount": "1000000.00",
			"base_quantity": "1"
		},
		{
			"unit_measure_id": 70,
			"invoiced_quantity": "1",
			"line_extension_amount": "2400.00",
			"free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": false,
					"allowance_charge_reason": "DESCUENTO GENERAL",
					"amount": "0.00",
					"base_amount": "2400.00"
				}
			],
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "456.00",
					"taxable_amount": "2400.00",
					"percent": "19.00"
				}
			],
			"description": "MANZANA",
			"code": "MANZANA",
			"type_item_identification_id": 4,
			"price_amount": "2856.00",
			"base_quantity": "1"
		},
		{
			"unit_measure_id": 70,
			"invoiced_quantity": "1",
			"line_extension_amount": "3400.00",
			"free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": false,
					"allowance_charge_reason": "DESCUENTO GENERAL",
					"amount": "0.00",
					"base_amount": "3400.00"
				}
			],
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "0.00",
					"taxable_amount": "3400.00",
					"percent": "0.00"
				}
			],
			"description": "CURUBA",
			"code": "CURUBA",
			"type_item_identification_id": 4,
			"price_amount": "3400.00",
			"base_quantity": "1"
		}		
	]
}
```

---

## Factura de mandato

`POST http://facturalatam-apidian.oo/api/ubl2.1/invoice-mandate`

ENVIO DE FACTURA MANDATO

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Este ejemplo ilustra como se debe utilizar la API para enviar una factura tipo MANDATO, este tipo de facturas se utiliza mucho en inmobiliarias, donde el valor del arrendamiento de un bien se recibe a nombre de un tercero, este tercero se especifica en los campos agentpary y agentparty\_dv.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "type_document_id": 1,
    "number": 990070004,
    "dv": 2,
    "date": "2025-05-05",
    "time": "06:44:45",
    "resolution_number": "18760000001",
    "prefix": "SETP",
    "notes": "SIN OBSERVACIONES",
    "customer": {
        "identification_number": 89008003,
        "dv": 2,
        "name": "ALEXANDER OBANDO LONDONO",
        "phone": "3103891693",
        "address": "BRR LIMONAR MZ 6 CS 3 ET 1",
        "email": "alexander_obando@hotmail.com",
        "merchant_registration": "0000-00",
        "type_document_identification_id": 6,
        "type_organization_id": 2,
        "municipality_id": 149,
        "type_regime_id": 2
    },
    "payment_form": {
        "payment_form_id": 1,
        "payment_method_id": 10,
        "payment_due_date": "2025-05-05",
        "duration_measure": "0"
    },
    "allowance_charges": [
        {
            "discount_id": 1,
            "charge_indicator": false,
            "allowance_charge_reason": "DESCUENTO GENERAL",
            "amount": "0.00",
            "base_amount": "1704201.68"
        }
    ],
    "legal_monetary_totals": {
        "line_extension_amount": "1704201.68",
        "tax_exclusive_amount": "1704201.68",
        "tax_inclusive_amount": "1800000.00",
        "allowance_total_amount": "0.00",
        "charge_total_amount": "0.00",
        "payable_amount": "1800000.00"
    },
    "tax_totals": [
        {
            "tax_id": 1,
            "tax_amount": "0.00",
            "percent": "0",
            "taxable_amount": "1200000.00"
        },
        {
            "tax_id": 1,
            "tax_amount": "95798.32",
            "percent": "19",
            "taxable_amount": "504201.68"
        }
    ],
    "invoice_lines": [
        {
            "unit_measure_id": 70,
            "invoiced_quantity": "1",
            "line_extension_amount": "600000.00",
            "free_of_charge_indicator": false,
            "allowance_charges": [
                {
                    "charge_indicator": false,
                    "allowance_charge_reason": "DESCUENTO GENERAL",
                    "amount": "0.00",
                    "base_amount": "600000.00"
                }
            ],
            "tax_totals": [
                {
                    "tax_id": 1,
                    "tax_amount": "0.00",
                    "taxable_amount": "600000.00",
                    "percent": "0.00"
                }
            ],
            "description": "PRUEBA MANDATO",
            "code": "PRUEBA1",
            "type_item_identification_id": 4,
            "price_amount": "600000.00",
            "base_quantity": "1"
        },
        {
            "unit_measure_id": 70,
            "invoiced_quantity": "1",
            "line_extension_amount": "600000.00",
            "free_of_charge_indicator": false,
            "allowance_charges": [
                {
                    "charge_indicator": false,
                    "allowance_charge_reason": "DESCUENTO GENERAL",
                    "amount": "0.00",
                    "base_amount": "600000.00"
                }
            ],
            "tax_totals": [
                {
                    "tax_id": 1,
                    "tax_amount": "0.00",
                    "taxable_amount": "600000.00",
                    "percent": "0.00"
                }
            ],
            "description": "PRUEBA MANDATO",
            "code": "PRUEBA2",
            "type_item_identification_id": 4,
            "price_amount": "600000.00",
            "base_quantity": "1"
        },
        {
            "unit_measure_id": 70,
            "invoiced_quantity": "1",
            "line_extension_amount": "504201.68",
            "free_of_charge_indicator": false,
            "allowance_charges": [
                {
                    "charge_indicator": false,
                    "allowance_charge_reason": "DESCUENTO GENERAL",
                    "amount": "0.00",
                    "base_amount": "600000.00"
                }
            ],
            "tax_totals": [
                {
                    "tax_id": 1,
                    "tax_amount": "95798.32",
                    "taxable_amount": "504201.68",
                    "percent": "19.00"
                }
            ],
            "description": "PRUEBA MANDATO",
            "agentparty": 900468658,
            "agentparty_dv": 1,
            "code": "PRUEBA3",
            "type_item_identification_id": 4,
            "price_amount": "504201.68",
            "base_quantity": "1"
        }
    ]
}
```

---

## Factura AIU (administracion, imprevistos y utilidad)

`POST http://apidian2024.oo/api/ubl2.1/invoice-aiu`

ENVIO DE FACTURA CON AIU

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Este ejemplo ilustra como se debe utilizar la API para enviar una factura AIU, este tipo de factura tiene como caracteristica que incluye las lineas ADMINISTRACION, IMPREVISTO y UTILIDAD, pero solo se cobra impuesto sobre el campo UTILIDAD, es muy utilizada por contratistas del area de la construccion.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "number": 990000606,
    "type_document_id": 1,
    "date": "2024-01-04",
    "time": "14:20:49",
    "notes": "SIN OBSERVACIONES",
    "noteAIU": "PARA PROYECTO DE PAVIMENTACION VIA SAN CARLOS - GRANADA",
    "sendmail": false,
    "resolution_number": "18760000001",
    "customer": {
        "identification_number": 18387250,
        "dv": 1,
        "name": "CARLOS MARIO CARMONA PATI\u00d1O",
        "phone": "3176364715",
        "address": "CRA 98 B 48 164 AP 203",
        "email": "alexanderobandolondon@gmail.com",
        "merchant_registration": "0000-00",
        "type_document_identification_id": 3,
        "type_organization_id": 2,
        "municipality_id": 1006,
        "type_regime_id": 2
    },
    "payment_form": {
        "payment_form_id": 1,
        "payment_method_id": 10,
        "payment_due_date": "2024-01-04",
        "duration_measure": "0"
    },
    "allowance_charges": [{
            "discount_id": 1,
            "charge_indicator": false,
            "allowance_charge_reason": "DESCUENTO GENERAL",
            "amount": "0.00",
            "base_amount": "42136609.22"
        }
    ],
    "legal_monetary_totals": {
        "line_extension_amount": "42136609.22",
        "tax_exclusive_amount": "42136609.22",
        "tax_inclusive_amount": "42487747.65",
        "allowance_total_amount": "0.00",
        "charge_total_amount": "0.00",
        "payable_amount": "42487747.65"
    },
    "tax_totals": [{
            "tax_id": 1,
            "tax_amount": "0.00",
            "percent": "0",
            "taxable_amount": "40288512.22"
        }, {
            "tax_id": 1,
            "tax_amount": "351138.43",
            "percent": "19",
            "taxable_amount": "1848097.00"
        }
    ],
    "invoice_lines": [{
            "unit_measure_id": 70,
            "invoiced_quantity": "1.00",
            "line_extension_amount": "2956955.00",
            "free_of_charge_indicator": false,
            "allowance_charges": [{
                    "charge_indicator": false,
                    "allowance_charge_reason": "DESCUENTO GENERAL",
                    "amount": "0.00",
                    "base_amount": "2956955.00"
                }
            ],
            "tax_totals": [{
                    "tax_id": 1,
                    "tax_amount": "0.00",
                    "taxable_amount": "2956955.00",
                    "percent": "0.00"
                }
            ],
            "description": "Administraci\u00f3n",
            "code": "ADMINIST",
            "type_item_identification_id": 4,
            "price_amount": "2956955.00",
            "base_quantity": "1.00"
        }, {
            "unit_measure_id": 70,
            "invoiced_quantity": "1915.30",
            "line_extension_amount": "36961938.22",
            "free_of_charge_indicator": false,
            "allowance_charges": [{
                    "charge_indicator": false,
                    "allowance_charge_reason": "DESCUENTO GENERAL",
                    "amount": "0.00",
                    "base_amount": "36961938.22"
                }
            ],
            "tax_totals": [{
                    "tax_id": 1,
                    "tax_amount": "0.00",
                    "taxable_amount": "36961938.22",
                    "percent": "0.00"
                }
            ],
            "description": "AFIRMADO X M3",
            "code": "ND10002B",
            "type_item_identification_id": 4,
            "price_amount": "19298.25",
            "base_quantity": "1915.30"
        }, {
            "unit_measure_id": 70,
            "invoiced_quantity": "1.00",
            "line_extension_amount": "369619.00",
            "free_of_charge_indicator": false,
            "allowance_charges": [{
                    "charge_indicator": false,
                    "allowance_charge_reason": "DESCUENTO GENERAL",
                    "amount": "0.00",
                    "base_amount": "369619.00"
                }
            ],
            "tax_totals": [{
                    "tax_id": 1,
                    "tax_amount": "0.00",
                    "taxable_amount": "369619.00",
                    "percent": "0.00"
                }
            ],
            "description": "Imprevisto",
            "code": "IMPREVIS",
            "type_item_identification_id": 4,
            "price_amount": "369619.00",
            "base_quantity": "1.00"
        }, {
            "unit_measure_id": 70,
            "invoiced_quantity": "1.00",
            "line_extension_amount": "1848097.00",
            "free_of_charge_indicator": false,
            "allowance_charges": [{
                    "charge_indicator": false,
                    "allowance_charge_reason": "DESCUENTO GENERAL",
                    "amount": "0.00",
                    "base_amount": "2199235.43"
                }
            ],
            "tax_totals": [{
                    "tax_id": 1,
                    "tax_amount": "351138.43",
                    "taxable_amount": "1848097.00",
                    "percent": "19.00"
                }
            ],
            "description": "Utilidad",
            "code": "UTILIDAD",
            "type_item_identification_id": 4,
            "price_amount": "1848097.00",
            "base_quantity": "1.00"
        }
    ]
}
```

---

## Factura de contingencia (tipo 03)

`POST http://apidian2024.oo/api/ubl2.1/invoice-contingency`

ENVIO DE FACTURA DE CONTINGENCIA

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Este ejemplo ilustra como se debe utilizar la API para enviar una factura de contingencia, se debe especificar los datos de la factura a la cual se hace referencia en los campos AdditionalDocumentReferenceID, AdditionalDocumentReferenceDate y AdditionalDocumentReferenceTypeDocument .

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990000963,
	"type_document_id": 3,
	"AdditionalDocumentReferenceID": "CN36",
	"AdditionalDocumentReferenceDate": "2024-03-17",
	"AdditionalDocumentReferenceTypeDocument": "01",
	"date": "2024-03-18",
	"time": "06:08:12",
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
		"payment_due_date": "2024-03-18",
		"duration_measure": "0"
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

## Factura de exportacion

`POST http://apidian2024.oo/api/ubl2.1/invoice-export`

ENVIO DE FACTURA DE EXPORTACION

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Este ejemplo ilustra como se debe utilizar la API para enviar una factura de exportacion, se envia al endpoint .../ubl2.1/invoice-export y el type\_document\_id corresponde al 2.
* El bloque k\_supplement contiene los datos del certificado de embarque: responsible\_incharge (responsable del despacho), departure\_place (lugar de salida), conveyance (medio de transporte), transport\_document\_type y transport\_document\_number (tipo y numero del documento de transporte), transporter\_processor (transportador), merchandise\_origin\_country (pais de origen de la mercancia), destination (destino), payment\_means, insurance\_carrier y observations.
* El mismo bloque lleva los valores reexpresados en pesos colombianos (FctConvCop con la tasa de cambio aplicada, MonedaCop, SubTotalCop, TotalBrutoFacturaCop, TotIvaCop, MntImpCop y los demas totales Cop), tal como lo exige la DIAN para las facturas en moneda extranjera.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990000965,
	"type_document_id": 2,
	"date": "2024-03-18",
	"time": "04:25:44",
	"notes": "SIN OBSERVACIONES",
	"sendmail": true,
	"resolution_number": "18760000001",
	"prefix": "SETP",
    "k_supplement": {
        "responsible_incharge": "JACK TORRANCE",
        "departure_place": "PEREIRA",
        "conveyance": "AVION",
        "transport_document_type": "MATRICULA",
        "transport_document_number": "HK-45089632",
        "transporter_processor": "AVIANCA",
        "merchandise_origin_country": "COLOMBIA",
        "destination": "MIAMI",
        "payment_means": "CONTADO",
        "insurance_carrier": "SURAMERICANA SEGUROS",
        "observations": "NINGUNA",
        "FctConvCop": "3890",
        "MonedaCop": "USD",
        "SubTotalCop": "200.00",
        "DescuentoDetalleCop": "0.00",
        "RecargoDetalleCop": "0.00",
        "TotalBrutoFacturaCop": "200.00",
        "TotIvaCop": "38.00",
        "TotIncCop": "0.00",
        "TotBolCop": "0.00",
        "ImpOtroCop": "0.00",
        "MntImpCop": "38.00",
        "TotalNetoFacturaCop": "238.00",
        "MntDctoCop": "0.00",
        "MntRcgoCop": "0.00",
        "VlrPagarCop": "238.00",
        "ReteFueCop": "0.00",
        "ReteIvaCop": "0.00",
        "ReteIcaCop": "0.00",
        "TotAnticiposCop": "0.00"
    },
	"customer": {
		"identification_number": "FR42128XD090",
		"name": "BLANCA NUBIA ALVAREZ ALZATE ",
		"phone": "3148931130",
		"address": "CR 14 BIS 31 B 37 BRR SAN NICOLAS",
		"email": "blancanubiaa@hotmail.com",
		"merchant_registration": "0000-00",
		"type_document_identification_id": 8,
		"type_organization_id": 2,
        "country_id": 65,
        "municipality_name": "MIAMI",
        "state_name": "FLORIDA",
		"type_liability_id": 117,
		"type_regime_id": 2
	},
    "deliveryterms": {
        "special_terms": "COSTO SEGURO Y FLETE",
        "loss_risk_responsibility_code": "CIF",
        "loss_risk": "COSTO SEGURO Y FLETE"
	},		
	"payment_form": {
		"payment_form_id": 2,
		"payment_method_id": 10,
		"payment_due_date": "2024-04-18",
		"duration_measure": "30"
	},	
	"allowance_charges": [
		{
			"discount_id": 10,
			"charge_indicator": false,
			"allowance_charge_reason": "DESCUENTO GENERAL",
			"amount": "0.00",
			"base_amount": "15840.00"
		},
		{
			"charge_indicator": true,
			"allowance_charge_reason": "CARGO POR FLETES/FREIGHT CHARGE",
			"amount": "200.00",
			"base_amount": "15840.00"
		}
	],
	"legal_monetary_totals": {
		"line_extension_amount": "15840.00",
		"tax_exclusive_amount": "15840.00",
		"tax_inclusive_amount": "15840.00",
		"allowance_total_amount": "0.00",
		"charge_total_amount": "200.00",
		"payable_amount": "16040.00"
	},
	"tax_totals": 
	[

		{
			"tax_id": 1,
			"tax_amount": "0.00",
			"percent": "0",
			"taxable_amount": "15840.00"
		}
	],
	"invoice_lines": 
	[

		{
			"unit_measure_id": 70,
			"invoiced_quantity": "5.00",
			"line_extension_amount": "4950.00",
			"free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": false,
					"allowance_charge_reason": "DESCUENTO GENERAL",
					"amount": "0.00",
					"base_amount": "4950.00"
				}
			],
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "0.00",
					"taxable_amount": "4950.00",
					"percent": "0.00"
				}
			],
			"description": "LEGGINS DE DAMA REF 1032",
			"brandname": "FULLFIT",
			"modelname": "1032",
			"code": "1032",
			"type_item_identification_id": 4,
			"price_amount": "990.00",
			"base_quantity": "5.00"
		}
,
		{
			"unit_measure_id": 70,
			"invoiced_quantity": "6.00",
			"line_extension_amount": "5940.00",
			"free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": false,
					"allowance_charge_reason": "DESCUENTO GENERAL",
					"amount": "0.00",
					"base_amount": "5940.00"
				}
			],
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "0.00",
					"taxable_amount": "5940.00",
					"percent": "0.00"
				}
			],
			"description": "LEGGINS DE DAMA REF 1087",
			"brandname": "FULLFIT",
			"modelname": "1087",
			"code": "1087",
			"type_item_identification_id": 4,
			"price_amount": "990.00",
			"base_quantity": "6.00"
		}
,
		{
			"unit_measure_id": 70,
			"invoiced_quantity": "5.00",
			"line_extension_amount": "4950.00",
			"free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": false,
					"allowance_charge_reason": "DESCUENTO GENERAL",
					"amount": "0.00",
					"base_amount": "4950.00"
				}
			],
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "0.00",
					"taxable_amount": "4950.00",
					"percent": "0.00"
				}
			],
			"description": "LEGGINS DE DAMA REF 1088",
			"brandname": "FULLFIT",
			"modelname": "1088",
			"code": "1088",
			"type_item_identification_id": 4,
			"price_amount": "990.00",
			"base_quantity": "5.00"
		}
		
	]
}
```

---

## Factura de transporte de carga

`POST http://apidian2023.oo/api/ubl2.1/invoice-transport`

ENVIO DE FACTURA DE TRANSPORTE

* Aplica la misma documentacion que el PRIMER ENVIO DE FACTURA de la seccion 02 - PRIMEROS ENVIOS.
* Este ejemplo ilustra como se debe utilizar la API para enviar una factura de transporte de carga, se envia al endpoint .../ubl2.1/invoice-transport y es la que deben utilizar las empresas de transporte que facturan remesas registradas en el RNDC.
* En las lineas que correspondan a una remesa del RNDC se debe enviar is\_RNDC en true junto con los campos RNDC\_consignment\_number (numero de la remesa en el RNDC), internal\_consignment\_number (numero interno de la remesa), value\_consignment (valor de la remesa), unit\_measure\_consignment\_id y quantity\_consignment (unidad de medida y cantidad de la carga).
* En las lineas que no hacen parte de una remesa se envia is\_RNDC en false y no se incluyen los campos anteriores.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 991500412,
	"dv": 2,
	"type_document_id": 1,
	"date": "2023-10-25",
	"time": "06:44:45",
	"resolution_number": "18760000001",
	"prefix": "SETP",
	"notes": "SIN OBSERVACIONES",
	"customer": {
		"identification_number": 89008003,
		"dv": 2,
		"name": "ALEXANDER OBANDO LONDONO",
		"phone": "3103891693",
		"address": "BRR LIMONAR MZ 6 CS 3 ET 1",
		"email": "alexander_obando@hotmail.com",
		"merchant_registration": "0000-00",
		"type_document_identification_id": 6,
		"type_organization_id": 2,
		"municipality_id": 149,
		"type_regime_id": 2
	},
	"payment_form": {
		"payment_form_id": 1,
		"payment_method_id": 10,
		"payment_due_date": "2023-10-25",
		"duration_measure": "0"
	},	
	"allowance_charges": [
		{
			"discount_id": 1,
			"charge_indicator": false,
			"allowance_charge_reason": "DESCUENTO GENERAL",
			"amount": "0.00",
			"base_amount": "1704201.68"
		}
	],
	"legal_monetary_totals": {
		"line_extension_amount": "1704201.68",
		"tax_exclusive_amount": "1704201.68",
		"tax_inclusive_amount": "1800000.00",
		"allowance_total_amount": "0.00",
		"charge_total_amount": "0.00",
		"payable_amount": "1800000.00"
	},
	"tax_totals": 
	[
		{
			"tax_id": 1,
			"tax_amount": "0.00",
			"percent": "0",
			"taxable_amount": "1200000.00"
		}
,
		{
			"tax_id": 1,
			"tax_amount": "95798.32",
			"percent": "19",
			"taxable_amount": "504201.68"
		}
	],
	"invoice_lines": 
	[
		{
            "is_RNDC": true,
            "RNDC_consignment_number": "95000912001",
            "internal_consignment_number": "REM000001",
            "value_consignment": "600000",
            "unit_measure_consignment_id": 767,
            "quantity_consignment": "200.00",
			"unit_measure_id": 70,
			"invoiced_quantity": "1",
			"line_extension_amount": "600000.00",
			"free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": false,
					"allowance_charge_reason": "DESCUENTO GENERAL",
					"amount": "0.00",
					"base_amount": "600000.00"
				}
			],
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "0.00",
					"taxable_amount": "600000.00",
					"percent": "0.00"
				}
			],
			"description": "PRUEBA TRANSPORTE",
			"code": "PRUEBA1",
			"type_item_identification_id": 4,
			"price_amount": "600000.00",
			"base_quantity": "1"
		}
,
		{
            "is_RNDC": false,
			"unit_measure_id": 70,
			"invoiced_quantity": "1",
			"line_extension_amount": "600000.00",
			"free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": false,
					"allowance_charge_reason": "DESCUENTO GENERAL",
					"amount": "0.00",
					"base_amount": "600000.00"
				}
			],
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "0.00",
					"taxable_amount": "600000.00",
					"percent": "0.00"
				}
			],
			"description": "PRUEBA TRANSPORTE",
			"code": "PRUEBA2",
			"type_item_identification_id": 4,
			"price_amount": "600000.00",
			"base_quantity": "1"
		}
,
		{
            "is_RNDC": false,
			"unit_measure_id": 70,
			"invoiced_quantity": "1",
			"line_extension_amount": "504201.68",
			"free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": false,
					"allowance_charge_reason": "DESCUENTO GENERAL",
					"amount": "0.00",
					"base_amount": "600000.00"
				}
			],
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "95798.32",
					"taxable_amount": "504201.68",
					"percent": "19.00"
				}
			],
			"description": "PRUEBA TRANSPORTE",
			"code": "PRUEBA3",
			"type_item_identification_id": 4,
			"price_amount": "504201.68",
			"base_quantity": "1"
		}	
	]
}
```

---
