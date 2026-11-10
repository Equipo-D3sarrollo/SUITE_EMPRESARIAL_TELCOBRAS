# 02 - Primeros Envios

> Fuente: colección Postman pública «FacturaLatam ApiDianV2.1» (<https://documenter.getpostman.com/view/50442293/2sBYHUSfRJ>), descargada el 10-nov-2026. Tokens y secretos censurados; base64 largos recortados.

Aqui se encuentran los envios mas sencillos de documentos electronicos, por medio de estos podra realizar
las primeras pruebas con la DIAN

## 📁 Factura de venta

### 📁 Restaurante

#### Factura de restaurante con IVA e impuesto al consumo

`POST http://apidian2024.oo/api/ubl2.1/invoice`

PRIMER ENVIO DE FACTURA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
     "number": 991111111,
     "type_document_id": 1,
     "date": "2025-09-03",
     "time": "04:08:12",
     "resolution_number": "18760000001",
     "prefix": "SETP",
     "customer": {
         "identification_number": "900428042",
         "name": "TAMPAC TECNOLOGÍA EN AUTOMATIZACIÓN SAS"
     },
     "payment_form": {
         "payment_form_id": 1,
         "payment_method_id": 30,
         "payment_due_date": "2025-09-03",
         "duration_measure": "30"
     },
     "legal_monetary_totals": {
         "line_extension_amount": 1000.00,
         "tax_exclusive_amount": 1000.00,
         "tax_inclusive_amount": 1270.00,
         "payable_amount": 1270.00
     },
     "tax_totals": [
         {
             "tax_id": 2,
             "tax_amount": 80.00,
             "taxable_amount": 1000.00,
             "is_fixed_value": true,
             "per_unit_amount": 80.00,
             "base_unit_measure": 1,
             "unit_measure_id": 94
         },
         {
             "tax_id": 1,
             "tax_amount": 190.00,
             "taxable_amount": 1000.00,
             "percent": 19.00
         }
     ],
     "invoice_lines": [
         {
             "unit_measure_id": 70,
             "invoiced_quantity": 1,
             "line_extension_amount": 1000.00,
             "free_of_charge_indicator": false,
             "description": "Gaseosa 350ml",
             "code": "50202301",
             "type_item_identification_id": 4,
             "price_amount": 1000.00,
             "base_quantity": 1,
             "tax_totals": [
                 {
                     "tax_id": 2,
                     "tax_amount": 80.00,
                     "taxable_amount": 1000.00,
                     "is_fixed_value": true,
                     "per_unit_amount": 80.00,
                     "base_unit_measure": 1,
                     "unit_measure_id": 94
                 },
                 {
                     "tax_id": 1,
                     "tax_amount": 190.00,
                     "taxable_amount": 1000.00,
                     "percent": 19.00
                 }
             ]
         }
     ]
 }
```

---

#### Factura de restaurante con propina como cargo

`POST http://apidian2024.oo/api/ubl2.1/invoice`

PRIMER ENVIO DE FACTURA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "number": 994500269,
    "type_document_id": 1,
    "date": "2025-09-04",
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
        "payment_due_date": "2025-09-04",
        "duration_measure": "0"
    },	
    "allowance_charges": [
        {
            "type_discount_id": 4,//id para agregar propinas en las facturas
            "charge_indicator": true,
            "allowance_charge_reason": "propina",
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
    "tax_totals": [
        {
            "tax_id": 1,
            "tax_amount": "47899.16",
            "percent": "19",
            "taxable_amount": "252100.84"
        }
    ],
    "invoice_lines": [
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

### Factura de dos lineas con una tarifa de IVA

`POST http://coapi.test/api/ubl2.1/invoice`

PRIMER ENVIO DE FACTURA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
  "number": 994500239, // Número consecutivo de la factura
  "type_document_id": 1, // 1 = Factura electrónica
  "date": "2025-07-22", // Fecha de emisión
  "time": "04:08:12", // Hora de emisión
  "resolution_number": "18760000001", // Número de resolución de la DIAN
  "prefix": "SETP", // Prefijo autorizado

  "customer": {
    "identification_number": "900428042", // NIT del cliente
    "name": "TAMPAC TECNOLOGÍA EN AUTOMATIZACIÓN SAS", // Razón social del cliente
    "type_document_identification_id": 6, // (opcional:si es cedula ,si es otro tipo de documento es necesario enviarlo)
    "dv": 2 //se requiere cuando el tipo de documento es NIT=6},
  },
  "payment_form": {
    "payment_form_id": 1, // 1 = Contado, 2 = Crédito
    "payment_method_id": 30, // Método de pago, ej. 30 = Transferencia electrónica
    "payment_due_date": "2025-07-22", // Fecha de vencimiento del pago
    "duration_measure": "30" // Número de días de plazo para pagar
  },

  "legal_monetary_totals": {
    "line_extension_amount": "2000.00", // Subtotal (sin IVA)
    "tax_exclusive_amount": "2000.00", // Igual al subtotal si no hay cargos adicionales
    "tax_inclusive_amount": "2380.00", // Total con IVA incluido
    "payable_amount": "2380.00" // Valor total a pagar
  },

  "tax_totals": [
    {
      "tax_id": 1, // 1 = IVA
      "tax_amount": "380.00", // Valor total del impuesto
      "percent": "19", // Porcentaje aplicado
      "taxable_amount": "2000.00" // Base gravable del impuesto
    }
  ],

  "invoice_lines": [
    {
      "unit_measure_id": 70, // Unidad de medida (ej. 70 = unidad)
      "invoiced_quantity": "1", // Cantidad facturada
      "line_extension_amount": "1000.00", // Subtotal de la línea (sin IVA)
      "free_of_charge_indicator": false, // ¿Es gratuito? false = no
      "description": "Producto de prueba 1", // Descripción del producto o servicio
      "code": "PRUEBA1", // Código interno del producto
      "type_item_identification_id": 4, // Tipo de identificación del ítem
      "price_amount": "1000.00", // Precio unitario
      "base_quantity": "1", // Cantidad base para el precio

      "tax_totals": [
        {
          "tax_id": 1, // IVA
          "tax_amount": "190.00", // Valor del IVA para esta línea
          "taxable_amount": "1000.00", // Base gravable de esta línea
          "percent": "19.00" // Porcentaje de IVA
        }
      ]
    },

    {
      "unit_measure_id": 70,
      "invoiced_quantity": "1",
      "line_extension_amount": "1000.00",
      "free_of_charge_indicator": false,
      "description": "Producto de prueba 2",
      "code": "PRUEBA2",
      "type_item_identification_id": 4,
      "price_amount": "1000.00",
      "base_quantity": "1",

      "tax_totals": [
        {
          "tax_id": 1,
          "tax_amount": "190.00",
          "taxable_amount": "1000.00",
          "percent": "19.00"
        }
      ]
    }
  ]
}
```

**Respuesta de ejemplo — Dos Lineas,Una Tarifa de Iva (200 OK)**

```json
{
    "success": true,
    "message": "AttachedDocument #SETP994500239 generada con éxito",
    "send_email_success": false,
    "send_email_date_time": false,
    "urlinvoicexml": "FES-SETP994500239.xml",
    "urlinvoicepdf": "FES-SETP994500239.pdf",
    "urlinvoiceattached": "ad09018462800002500000166.xml",
    "cufe": "872e91994383cc40de612527df2c50c4811dda9ba126acaaacee953ecd72e74b2eb5d12a7a0d52adacd085cf3469a942",
    "QRStr": "https://catalogo-vpfe-hab.dian.gov.co/document/searchqr?documentkey=[CUFE DE EJEMPLO]",
    "certificate_days_left": 37,
    "resolution_days_left": 1642,
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
                        "Created": "2025-07-22T17:20:27.320Z",
                        "Expires": "2025-07-22T17:25:27.320Z"
                    }
                }
            },
            "Body": {
                "SendBillSyncResponse": {
                    "SendBillSyncResult": {
                        "ErrorMessage": {
                            "string": [
                                "Regla: FAK55, Notificación: Correo electrónico no informado",
                                "Regla: FAJ44b, Notificación: Nit o Documento de Identificación informado No corresponde al registrado en el RUT con respecto a la razón social o nombre comercial suministrado.",
                                "Regla: FAJ43b, Notificación: Nombre informado No corresponde al registrado en el RUT con respecto al Nit suminstrado."
                            ]
                        },
                        "IsValid": "true",
                        "StatusCode": "00",
                        "StatusDescription": "Procesado Correctamente.",
                        "StatusMessage": "La Factura electrónica SETP994500239, ha sido autorizada.",
                        "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiIHN0YW5kYWxv…[base64 recortado, 15736 caracteres]",
                        "XmlBytes": {
                            "_attributes": {
                                "nil": "true"
                            }
                        },
                        "XmlDocumentKey": "[CUFE DE EJEMPLO]",
                        "XmlFileName": "fv09018462800002500000166"
                    }
                }
            }
        }
    },
    "whatsapp_response": null,
    "invoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 24940 caracteres]",
    "zipinvoicexml": "[CENSURADO]",
    "unsignedinvoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 15512 caracteres]",
    "reqfe": "PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzb2FwOkVudmVsb3BlIHhtbG5zOnNv…[base64 recortado, 17544 caracteres]",
    "rptafe": "PHM6RW52ZWxvcGUgeG1sbnM6cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMy8w…[base64 recortado, 23460 caracteres]",
    "attacheddocument": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 54536 caracteres]"
}
```

---

### Factura con cliente de varias responsabilidades fiscales

`POST http://coapi.test/api/ubl2.1/invoice`

PRIMER ENVIO DE FACTURA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
  "number": 994500239, // Número consecutivo de la factura
  "type_document_id": 1, // 1 = Factura electrónica
  "date": "2025-07-22", // Fecha de emisión
  "time": "04:08:12", // Hora de emisión
  "resolution_number": "18760000001", // Número de resolución de la DIAN
  "prefix": "SETP", // Prefijo autorizado

  "customer": {
    "identification_number": "900428042", // NIT del cliente
    "name": "TAMPAC TECNOLOGÍA EN AUTOMATIZACIÓN SAS", // Razón social del cliente
    "type_liability_ids": [14, 7] // para informar varias responsabilidades
  },

  "payment_form": {
    "payment_form_id": 1, // 1 = Contado, 2 = Crédito
    "payment_method_id": 30, // Método de pago, ej. 30 = Transferencia electrónica
    "payment_due_date": "2025-07-22", // Fecha de vencimiento del pago
    "duration_measure": "30" // Número de días de plazo para pagar
  },

  "legal_monetary_totals": {
    "line_extension_amount": "2000.00", // Subtotal (sin IVA)
    "tax_exclusive_amount": "2000.00", // Igual al subtotal si no hay cargos adicionales
    "tax_inclusive_amount": "2380.00", // Total con IVA incluido
    "payable_amount": "2380.00" // Valor total a pagar
  },

  "tax_totals": [
    {
      "tax_id": 1, // 1 = IVA
      "tax_amount": "380.00", // Valor total del impuesto
      "percent": "19", // Porcentaje aplicado
      "taxable_amount": "2000.00" // Base gravable del impuesto
    }
  ],

  "invoice_lines": [
    {
      "unit_measure_id": 70, // Unidad de medida (ej. 70 = unidad)
      "invoiced_quantity": "1", // Cantidad facturada
      "line_extension_amount": "1000.00", // Subtotal de la línea (sin IVA)
      "free_of_charge_indicator": false, // ¿Es gratuito? false = no
      "description": "Producto de prueba 1", // Descripción del producto o servicio
      "code": "PRUEBA1", // Código interno del producto
      "type_item_identification_id": 4, // Tipo de identificación del ítem
      "price_amount": "1000.00", // Precio unitario
      "base_quantity": "1", // Cantidad base para el precio

      "tax_totals": [
        {
          "tax_id": 1, // IVA
          "tax_amount": "190.00", // Valor del IVA para esta línea
          "taxable_amount": "1000.00", // Base gravable de esta línea
          "percent": "19.00" // Porcentaje de IVA
        }
      ]
    },

    {
      "unit_measure_id": 70,
      "invoiced_quantity": "1",
      "line_extension_amount": "1000.00",
      "free_of_charge_indicator": false,
      "description": "Producto de prueba 2",
      "code": "PRUEBA2",
      "type_item_identification_id": 4,
      "price_amount": "1000.00",
      "base_quantity": "1",

      "tax_totals": [
        {
          "tax_id": 1,
          "tax_amount": "190.00",
          "taxable_amount": "1000.00",
          "percent": "19.00"
        }
      ]
    }
  ]
}
```

**Respuesta de ejemplo — Dos Lineas,Una Tarifa de Iva (200 OK)**

```json
{
    "success": true,
    "message": "AttachedDocument #SETP994500239 generada con éxito",
    "send_email_success": false,
    "send_email_date_time": false,
    "urlinvoicexml": "FES-SETP994500239.xml",
    "urlinvoicepdf": "FES-SETP994500239.pdf",
    "urlinvoiceattached": "ad09018462800002500000166.xml",
    "cufe": "872e91994383cc40de612527df2c50c4811dda9ba126acaaacee953ecd72e74b2eb5d12a7a0d52adacd085cf3469a942",
    "QRStr": "https://catalogo-vpfe-hab.dian.gov.co/document/searchqr?documentkey=[CUFE DE EJEMPLO]",
    "certificate_days_left": 37,
    "resolution_days_left": 1642,
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
                        "Created": "2025-07-22T17:20:27.320Z",
                        "Expires": "2025-07-22T17:25:27.320Z"
                    }
                }
            },
            "Body": {
                "SendBillSyncResponse": {
                    "SendBillSyncResult": {
                        "ErrorMessage": {
                            "string": [
                                "Regla: FAK55, Notificación: Correo electrónico no informado",
                                "Regla: FAJ44b, Notificación: Nit o Documento de Identificación informado No corresponde al registrado en el RUT con respecto a la razón social o nombre comercial suministrado.",
                                "Regla: FAJ43b, Notificación: Nombre informado No corresponde al registrado en el RUT con respecto al Nit suminstrado."
                            ]
                        },
                        "IsValid": "true",
                        "StatusCode": "00",
                        "StatusDescription": "Procesado Correctamente.",
                        "StatusMessage": "La Factura electrónica SETP994500239, ha sido autorizada.",
                        "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiIHN0YW5kYWxv…[base64 recortado, 15736 caracteres]",
                        "XmlBytes": {
                            "_attributes": {
                                "nil": "true"
                            }
                        },
                        "XmlDocumentKey": "[CUFE DE EJEMPLO]",
                        "XmlFileName": "fv09018462800002500000166"
                    }
                }
            }
        }
    },
    "whatsapp_response": null,
    "invoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 24940 caracteres]",
    "zipinvoicexml": "[CENSURADO]",
    "unsignedinvoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 15512 caracteres]",
    "reqfe": "PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzb2FwOkVudmVsb3BlIHhtbG5zOnNv…[base64 recortado, 17544 caracteres]",
    "rptafe": "PHM6RW52ZWxvcGUgeG1sbnM6cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMy8w…[base64 recortado, 23460 caracteres]",
    "attacheddocument": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 54536 caracteres]"
}
```

---

### Factura con referencia a documento de recepcion

`POST http://coapi.test/api/ubl2.1/invoice`

PRIMER ENVIO DE FACTURA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
  "number": 994500239, // Número consecutivo de la factura
  "type_document_id": 1, // 1 = Factura electrónica
  "date": "2025-07-22", // Fecha de emisión
  "time": "04:08:12", // Hora de emisión
  "resolution_number": "18760000001", // Número de resolución de la DIAN
  "prefix": "SETP", // Prefijo autorizado

  "customer": {
    "identification_number": "900428042", // NIT del cliente
    "name": "TAMPAC TECNOLOGÍA EN AUTOMATIZACIÓN SAS" // Razón social del cliente
  },

  "payment_form": {
    "payment_form_id": 1, // 1 = Contado, 2 = Crédito
    "payment_method_id": 30, // Método de pago, ej. 30 = Transferencia electrónica
    "payment_due_date": "2025-07-22", // Fecha de vencimiento del pago
    "duration_measure": "30" // Número de días de plazo para pagar
  },

  "legal_monetary_totals": {
    "line_extension_amount": "2000.00", // Subtotal (sin IVA)
    "tax_exclusive_amount": "2000.00", // Igual al subtotal si no hay cargos adicionales
    "tax_inclusive_amount": "2380.00", // Total con IVA incluido
    "payable_amount": "2380.00" // Valor total a pagar
  },

  "tax_totals": [
    {
      "tax_id": 1, // 1 = IVA
      "tax_amount": "380.00", // Valor total del impuesto
      "percent": "19", // Porcentaje aplicado
      "taxable_amount": "2000.00" // Base gravable del impuesto
    }
  ],

  "receipt_document_references": [
    {
      "id": "SETP-001", // Prefijo y Número del documento
      "issue_date": "2026-03-15" // Fecha de emisión
    },
    {
      "id": "SETP-002"
    }
  ],

  "invoice_lines": [
    {
      "unit_measure_id": 70, // Unidad de medida (ej. 70 = unidad)
      "invoiced_quantity": "1", // Cantidad facturada
      "line_extension_amount": "1000.00", // Subtotal de la línea (sin IVA)
      "free_of_charge_indicator": false, // ¿Es gratuito? false = no
      "description": "Producto de prueba 1", // Descripción del producto o servicio
      "code": "PRUEBA1", // Código interno del producto
      "type_item_identification_id": 4, // Tipo de identificación del ítem
      "price_amount": "1000.00", // Precio unitario
      "base_quantity": "1", // Cantidad base para el precio

      "tax_totals": [
        {
          "tax_id": 1, // IVA
          "tax_amount": "190.00", // Valor del IVA para esta línea
          "taxable_amount": "1000.00", // Base gravable de esta línea
          "percent": "19.00" // Porcentaje de IVA
        }
      ]
    },

    {
      "unit_measure_id": 70,
      "invoiced_quantity": "1",
      "line_extension_amount": "1000.00",
      "free_of_charge_indicator": false,
      "description": "Producto de prueba 2",
      "code": "PRUEBA2",
      "type_item_identification_id": 4,
      "price_amount": "1000.00",
      "base_quantity": "1",

      "tax_totals": [
        {
          "tax_id": 1,
          "tax_amount": "190.00",
          "taxable_amount": "1000.00",
          "percent": "19.00"
        }
      ]
    }
  ]
}
```

**Respuesta de ejemplo — Dos Lineas,Una Tarifa de Iva (200 OK)**

```json
{
    "success": true,
    "message": "AttachedDocument #SETP994500239 generada con éxito",
    "send_email_success": false,
    "send_email_date_time": false,
    "urlinvoicexml": "FES-SETP994500239.xml",
    "urlinvoicepdf": "FES-SETP994500239.pdf",
    "urlinvoiceattached": "ad09018462800002500000166.xml",
    "cufe": "872e91994383cc40de612527df2c50c4811dda9ba126acaaacee953ecd72e74b2eb5d12a7a0d52adacd085cf3469a942",
    "QRStr": "https://catalogo-vpfe-hab.dian.gov.co/document/searchqr?documentkey=[CUFE DE EJEMPLO]",
    "certificate_days_left": 37,
    "resolution_days_left": 1642,
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
                        "Created": "2025-07-22T17:20:27.320Z",
                        "Expires": "2025-07-22T17:25:27.320Z"
                    }
                }
            },
            "Body": {
                "SendBillSyncResponse": {
                    "SendBillSyncResult": {
                        "ErrorMessage": {
                            "string": [
                                "Regla: FAK55, Notificación: Correo electrónico no informado",
                                "Regla: FAJ44b, Notificación: Nit o Documento de Identificación informado No corresponde al registrado en el RUT con respecto a la razón social o nombre comercial suministrado.",
                                "Regla: FAJ43b, Notificación: Nombre informado No corresponde al registrado en el RUT con respecto al Nit suminstrado."
                            ]
                        },
                        "IsValid": "true",
                        "StatusCode": "00",
                        "StatusDescription": "Procesado Correctamente.",
                        "StatusMessage": "La Factura electrónica SETP994500239, ha sido autorizada.",
                        "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiIHN0YW5kYWxv…[base64 recortado, 15736 caracteres]",
                        "XmlBytes": {
                            "_attributes": {
                                "nil": "true"
                            }
                        },
                        "XmlDocumentKey": "[CUFE DE EJEMPLO]",
                        "XmlFileName": "fv09018462800002500000166"
                    }
                }
            }
        }
    },
    "whatsapp_response": null,
    "invoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 24940 caracteres]",
    "zipinvoicexml": "[CENSURADO]",
    "unsignedinvoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 15512 caracteres]",
    "reqfe": "PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzb2FwOkVudmVsb3BlIHhtbG5zOnNv…[base64 recortado, 17544 caracteres]",
    "rptafe": "PHM6RW52ZWxvcGUgeG1sbnM6cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMy8w…[base64 recortado, 23460 caracteres]",
    "attacheddocument": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 54536 caracteres]"
}
```

---

### Factura con descuento en linea y descuento global

`POST http://coapi.test/api/ubl2.1/invoice`

PRIMER ENVIO DE FACTURA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
  "number": 994500240, // Número consecutivo de la factura
  "type_document_id": 1, // 1 = Factura electrónica
  "date": "2025-07-22", // Fecha de emisión
  "time": "04:08:12", // Hora de emisión
  "resolution_number": "18760000001", // Número de resolución DIAN
  "prefix": "SETP", // Prefijo autorizado

  "customer": {
    "identification_number": "900428042", // NIT del cliente
    "name": "TAMPAC TECNOLOGÍA EN AUTOMATIZACIÓN SAS"
  },

  "payment_form": {
    "payment_form_id": 1, // Contado
    "payment_method_id": 30, // Transferencia electrónica
    "payment_due_date": "2025-07-22", // Fecha de vencimiento (igual a emisión si es contado)
    "duration_measure": "0" // Días de plazo 
  },

  "allowance_charges": [
    {
      "discount_id": 1,
      "charge_indicator": false, // false = es descuento, true = es recargo
      "allowance_charge_reason": "Descuento Global",
      "amount": "100.00", // Descuento global aplicado sobre el total
      "base_amount": "1900.00" // Base sobre la cual se calculó el descuento
    }
  ],

  "legal_monetary_totals": {
    "line_extension_amount": "1900.00", // Subtotal (suma de líneas con descuentos de línea aplicados)
    "tax_exclusive_amount": "1900.00", // Total sin IVA (antes del IVA, pero después de descuentos por línea)
    "tax_inclusive_amount": "2261.00", // Total con IVA incluido (1900 + 361 IVA)
    "allowance_total_amount": "100.00", // Descuento total informado en la sección global
    "charge_total_amount": "0.00", // Total de recargos (en este caso, ninguno)
    "payable_amount": "2161.00" // Total a pagar: 2261.00 - 100.00 (descuento global)
  },

  "tax_totals": [
    {
      "tax_id": 1, // 1 = IVA
      "tax_amount": "361.00", // IVA total sumando ambas líneas (180.50 + 180.50)
      "percent": "19.00", // Porcentaje de IVA
      "taxable_amount": "1900.00" // Base gravable total (suma de 950 + 950)
    }
  ],

  "invoice_lines": [
    {
      "unit_measure_id": 70, // Unidad de medida
      "invoiced_quantity": "1", // Cantidad facturada
      "line_extension_amount": "950.00", // Precio - descuento de línea (1000 - 50)
      "free_of_charge_indicator": false, // No es gratuito
      "description": "Producto de prueba 1",
      "code": "PRUEBA1",
      "type_item_identification_id": 4, // Código del tipo de ítem
      "price_amount": "1000.00", // Precio original antes de descuento
      "base_quantity": "1",

      "allowance_charges": [
        {
          "discount_id": 10,
          "charge_indicator": false,
          "allowance_charge_reason": "Descuento por promoción",
          "amount": "50.00", // Descuento de la línea
          "base_amount": "1000.00"
        }
      ],

      "tax_totals": [
        {
          "tax_id": 1,
          "tax_amount": "180.50", // IVA de esta línea: 950 x 0.19
          "taxable_amount": "950.00", // Base gravable después del descuento de línea
          "percent": "19.00"
        }
      ]
    },

    {
      "unit_measure_id": 70,
      "invoiced_quantity": "1",
      "line_extension_amount": "950.00", // 1000 - 50
      "free_of_charge_indicator": false,
      "description": "Producto de prueba 2",
      "code": "PRUEBA2",
      "type_item_identification_id": 4,
      "price_amount": "1000.00",
      "base_quantity": "1",

      "allowance_charges": [
        {
          "discount_id": 11,
          "charge_indicator": false,
          "allowance_charge_reason": "Descuento por volumen",
          "amount": "50.00",
          "base_amount": "1000.00"
        }
      ],

      "tax_totals": [
        {
          "tax_id": 1,
          "tax_amount": "180.50", // 950 x 0.19
          "taxable_amount": "950.00",
          "percent": "19.00"
        }
      ]
    }
  ]
}
```

**Respuesta de ejemplo — Dos Lineas,Una Tarifa de Iva,Descuento en linea y global (200 OK)**

```json
{
    "success": true,
    "message": "AttachedDocument #SETP994500240 generada con éxito",
    "send_email_success": false,
    "send_email_date_time": false,
    "urlinvoicexml": "FES-SETP994500240.xml",
    "urlinvoicepdf": "FES-SETP994500240.pdf",
    "urlinvoiceattached": "ad09018462800002500000165.xml",
    "cufe": "4901be62c46c40360490e10471884c9e88a6b1d0e9fc197e7a3f044ee5ab3284a4d93d2ec6da2cb69b041e97f7c5b198",
    "QRStr": "https://catalogo-vpfe-hab.dian.gov.co/document/searchqr?documentkey=[CUFE DE EJEMPLO]",
    "certificate_days_left": 37,
    "resolution_days_left": 1642,
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
                        "Created": "2025-07-22T17:19:01.851Z",
                        "Expires": "2025-07-22T17:24:01.851Z"
                    }
                }
            },
            "Body": {
                "SendBillSyncResponse": {
                    "SendBillSyncResult": {
                        "ErrorMessage": {
                            "string": [
                                "Regla: FAK55, Notificación: Correo electrónico no informado",
                                "Regla: FAJ44b, Notificación: Nit o Documento de Identificación informado No corresponde al registrado en el RUT con respecto a la razón social o nombre comercial suministrado.",
                                "Regla: FAJ43b, Notificación: Nombre informado No corresponde al registrado en el RUT con respecto al Nit suminstrado."
                            ]
                        },
                        "IsValid": "true",
                        "StatusCode": "00",
                        "StatusDescription": "Procesado Correctamente.",
                        "StatusMessage": "La Factura electrónica SETP994500240, ha sido autorizada.",
                        "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiIHN0YW5kYWxv…[base64 recortado, 15736 caracteres]",
                        "XmlBytes": {
                            "_attributes": {
                                "nil": "true"
                            }
                        },
                        "XmlDocumentKey": "[CUFE DE EJEMPLO]",
                        "XmlFileName": "fv09018462800002500000165"
                    }
                }
            }
        }
    },
    "whatsapp_response": null,
    "invoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 27020 caracteres]",
    "zipinvoicexml": "[CENSURADO]",
    "unsignedinvoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 17588 caracteres]",
    "reqfe": "PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzb2FwOkVudmVsb3BlIHhtbG5zOnNv…[base64 recortado, 17876 caracteres]",
    "rptafe": "PHM6RW52ZWxvcGUgeG1sbnM6cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMy8w…[base64 recortado, 23460 caracteres]",
    "attacheddocument": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 56612 caracteres]"
}
```

---

### Factura de una linea con descuento en la linea

`POST http://facturalatam-apidian.oo/api/ubl2.1/invoice`

PRIMER ENVIO DE FACTURA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990060186,
	"type_document_id": 1,
	"date": "2025-01-02",
	"time": "04:08:12",
	"resolution_number": "18760000001",
	"prefix": "SETP",
    "notes": "ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA",
    "disable_confirmation_text": true,
    "establishment_name": "TORRE SOFTWARE",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "establishment_email": "alternate_email@alternate.com",
	"sendmail": true,
    "sendmailtome": true,
    "seze": "2021-2017",
    "head_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL PIE DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
	"customer": {
		"identification_number": 900166483,
		"dv": 1,
		"name": "INVERSIONES DAVAL SAS",
		"phone": "3103891693",
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
		"payment_due_date": "2025-01-02",
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

### Factura de tres lineas con descuento en cada linea

`POST http://apidian2024.oo/api/ubl2.1/invoice`

PRIMER ENVIO DE FACTURA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "number": 990001134,
    "type_document_id": 1,
    "date": "2024-08-22",
    "time": "04:08:12",
    "resolution_number": "18760000001",
    "prefix": "SETP",
    "notes": "ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA",
    "disable_confirmation_text": true,
    "establishment_name": "TORRE SOFTWARE",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "establishment_email": "alternate_email@alternate.com",
    "sendmail": true,
    "sendmailtome": true,
    "seze": "2021-2017",
    "head_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL PIE DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "customer": {
        "identification_number": 900166483,
        "dv": 1,
        "name": "INVERSIONES DAVAL SAS",
        "phone": "3103891693",
        "address": "CLL 4 NRO 33-90",
        "email": "alexander_obando@hotmail.com",
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
        "payment_due_date": "2024-08-22",
        "duration_measure": "30"
    },
    "legal_monetary_totals": {
        "line_extension_amount": "7310924.175",
        "tax_exclusive_amount": "7310924.175",
        "tax_inclusive_amount": "8700000.00",
        "allowance_total_amount": "0.00",
        "payable_amount": "8700000.00"
    },
    "tax_totals":
    [{
            "tax_id": 1,
            "tax_amount": "1389075.630",
            "percent": "19",
            "taxable_amount": "7310924.175"
        }
    ],
    "invoice_lines": [
		{
            "unit_measure_id": 70,
            "invoiced_quantity": "1",
            "line_extension_amount": "798319.327",
            "free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": false,
					"allowance_charge_reason": "DESCUENTO GENERAL",
					"amount": "50000.00",
					"base_amount": "1000000.00"
				}
			],
            "tax_totals": [{
                    "tax_id": 1,
                    "tax_amount": "151680.673",
                    "taxable_amount": "798319.327",
                    "percent": "19.00"
                }
            ],
            "description": "ARTICULO NRO 1",
            "notes": "ESTA ES UNA PRUEBA DE NOTA DE DETALLE DE LINEA.",
            "code": "ART1",
            "type_item_identification_id": 4,
            "price_amount": "1000000.00",
            "base_quantity": "1"
        },
		{
            "unit_measure_id": 70,
            "invoiced_quantity": "1",
            "line_extension_amount": "1554621.848",
            "free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": false,
					"allowance_charge_reason": "DESCUENTO GENERAL",
					"amount": "150000.00",
					"base_amount": "2000000.00"
				}
			],
            "tax_totals": [{
                    "tax_id": 1,
                    "tax_amount": "295378.152",
                    "taxable_amount": "1554621.848",
                    "percent": "19.00"
                }
            ],
            "description": "ARTICULO NRO 2",
            "notes": "ESTA ES UNA PRUEBA DE NOTA DE DETALLE DE LINEA.",
            "code": "ART2",
            "type_item_identification_id": 4,
            "price_amount": "2000000.00",
            "base_quantity": "1"
        },
		{
            "unit_measure_id": 70,
            "invoiced_quantity": "2",
            "line_extension_amount": "4957983.193",
            "free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": false,
					"allowance_charge_reason": "DESCUENTO GENERAL",
					"amount": "100000.00",
					"base_amount": "6000000.00"
				}
			],
            "tax_totals": [{
                    "tax_id": 1,
                    "tax_amount": "942016.807",
                    "taxable_amount": "4957983.193",
                    "percent": "19.00"
                }
            ],
            "description": "ARTICULO NRO 3",
            "notes": "ESTA ES UNA PRUEBA DE NOTA DE DETALLE DE LINEA.",
            "code": "ART3",
            "type_item_identification_id": 4,
            "price_amount": "3000000.00",
            "base_quantity": "1"
        }
    ]
}
```

---

### Factura de una linea sin descuentos (la mas sencilla)

`POST http://apidian2024.oo/api/ubl2.1/invoice`

PRIMER ENVIO DE FACTURA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990001147,
	"type_document_id": 1,
	"date": "2024-08-31",
	"time": "04:08:12",
	"resolution_number": "18760000001",
	"prefix": "SETP",
    "notes": "ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA",
    "disable_confirmation_text": true,
    "establishment_name": "TORRE SOFTWARE",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "establishment_email": "alternate_email@alternate.com",
	"sendmail": true,
    "sendmailtome": true,
    "send_customer_credentials": false,
    "seze": "2021-2017",
    "email_cc_list": [
        {
            "email": "alexanderobandolondono@gmail.com"
        },
        {
            "email": "alexander_obando@hotmail.com"
        }
    ],
    "annexes": [
        {
            "document": "/9j/4AAQSkZJRgABAQEASABIAAD/4QwYRXhpZgAATU0AKgAAAAgABwESAAMA…[base64 recortado, 95432 caracteres]",
            "extension": "jpg"
        }
    ],
    "html_header": "<h1 style=\"color: #5e9ca0;\">Se&ntilde;or(es), XXXXXXXXXXXXXXXXXXX identificado con NIT 99999999-9</h1><h2 style=\"color: #2e6c80;\">Le informamos que ha recibido un documento electronico de: YYYYYYYYYYYYYYYYYYYYYYYYY</h2>",
    "html_buttons": "<table style=\"border-collapse: collapse; width: 100%;\" border=\"1\"><tbody><tr><td style=\"width: 100%;\"><h2><strong><span style=\"color: #008080;\">Puede descargar su factura mediante el siguiente enlace:</span></strong></h2></td></tr><tr><td style=\"width: 100%;\"><h4><a href=\"https://www.facilwebnube.com/apidian2021/public/index.php/api/download/88261176/FES-FE369.pdf\" target=\"_blank\">Haga click aqui para descargar su factura.</a></h4></td></tr></tbody></table>",
    "html_footer": "<table style=\"border-collapse: collapse; width: 100%;\" border=\"1\"><tbody><tr><td style=\"width: 100%;\"><h2><strong><span style=\"color: #008080;\">Previamente recibio un correo con las credenciales de ingreso a la plataforma.</span></strong></h2></td></tr><tr><td style=\"width: 100%;\"><div><h4><strong>Este es un sistema autom&aacute;tico de aviso, por favor no responda este mensaje de correo.</strong></h4></div></td></tr></tbody></table>",
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
	"tax_totals": 
	[
		{
			"tax_id": 1,
			"tax_amount": "159663.865",
			"percent": "19.00",
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

### Factura a credito (forma de pago 2)

`POST http://facturalatam-apidian.oo/api/ubl2.1/invoice`

PRIMER ENVIO DE FACTURA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990060190,
	"type_document_id": 1,
	"date": "2025-01-09",
	"time": "04:08:12",
	"resolution_number": "18760000001",
	"prefix": "SETP",
    "notes": "ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA",
    "disable_confirmation_text": true,
    "establishment_name": "TORRE SOFTWARE",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "establishment_email": "alternate_email@alternate.com",
	"sendmail": true,
    "sendmailtome": true,
    "send_customer_credentials": false,
    "seze": "2021-2017",
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
		"payment_due_date": "2025-01-19",
		"duration_measure": "10"
	},	
	"legal_monetary_totals": {
		"line_extension_amount": "840336.134",
		"tax_exclusive_amount": "840336.134",
		"tax_inclusive_amount": "1000000.00",
		"payable_amount": "1000000.00"
	},
	"tax_totals": 
	[
		{
			"tax_id": 1,
			"tax_amount": "159663.865",
			"percent": "19.00",
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

**Respuesta de ejemplo — Una Linea, Sin Descuentos, Una Tarifa de IVA, pago crédito (200 OK)**

```json
{
    "success": true,
    "message": "AttachedDocument #SETP990060190 generada con éxito",
    "send_email_success": true,
    "send_email_date_time": true,
    "urlinvoicexml": "FES-SETP990060190.xml",
    "urlinvoicepdf": "FES-SETP990060190.pdf",
    "urlinvoiceattached": "ad00890080030002500000006.xml",
    "cufe": "f8f9b5b42de551785f181d7fde6b3607f9404c4640ddd2f9de6b9cbc1641e2f1fde58dd007e6f3c8b4c8fb5940b53e75",
    "QRStr": "https://catalogo-vpfe-hab.dian.gov.co/document/searchqr?documentkey=[CUFE DE EJEMPLO]",
    "certificate_days_left": 416,
    "resolution_days_left": 1836,
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
                        "Created": "2025-01-09T14:53:19.728Z",
                        "Expires": "2025-01-09T14:58:19.728Z"
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
                        "StatusMessage": "La Factura electrónica SETP990060190, ha sido autorizada.",
                        "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiIHN0YW5kYWxv…[base64 recortado, 14752 caracteres]",
                        "XmlBytes": {
                            "_attributes": {
                                "nil": "true"
                            }
                        },
                        "XmlDocumentKey": "[CUFE DE EJEMPLO]",
                        "XmlFileName": "fv00890080030002500000006"
                    }
                }
            }
        }
    },
    "invoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 25232 caracteres]",
    "zipinvoicexml": "[CENSURADO]",
    "unsignedinvoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 15784 caracteres]",
    "reqfe": "PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzb2FwOkVudmVsb3BlIHhtbG5zOnNv…[base64 recortado, 17664 caracteres]",
    "rptafe": "PHM6RW52ZWxvcGUgeG1sbnM6cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMy8w…[base64 recortado, 21776 caracteres]",
    "attacheddocument": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 53864 caracteres]"
}
```

---

### Factura con varios metodos de pago

`POST http://apidian2024.oo/api/ubl2.1/invoice`

PRIMER ENVIO DE FACTURA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990001163,
	"type_document_id": 1,
	"date": "2024-10-17",
	"time": "04:08:12",
	"resolution_number": "18760000001",
	"prefix": "SETP",
    "actividadeconomica": "6201",
    "notes": "ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA",
    "disable_confirmation_text": true,
    "establishment_name": "TORRE SOFTWARE NRO 1",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "establishment_email": "alternate_email@alternate.com",
	"sendmail": true,
    "sendmailtome": false,
    "head_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL PIE DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
	"customer": {
		"identification_number": 41946692,
		"dv": 6,
		"name": "ELIZABETH CARDONA VILLADA",
		"phone": "3103891693",
		"address": "CLL 4 NRO 33-90",
		"email": "alexander_obando@hotmail.com",
		"merchant_registration": "0000000-00",
		"type_document_identification_id": 3,
		"type_organization_id": 2,
        "type_liability_id": 7,
		"municipality_id": 822,
		"type_regime_id": 1,
        "tax_id": 1
	},
	"payment_form": [
        {
    		"payment_form_id": 2,
	    	"duration_measure": "30",
		    "payment_due_date": "2024-11-17",
		    "payment_method_id": 30
	    },
        {
    		"payment_form_id": 2,
	    	"duration_measure": "30",
		    "payment_due_date": "2024-11-17",
		    "payment_method_id": 10
	    }
    ],	
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
	],
    "logo_empresa_emisora": "/9j/4AAQSkZJRgABAQEASABIAAD/4QnORXhpZgAATU0AKgAAAAgABwESAAMA…[base64 recortado, 25320 caracteres]"
}
```

---

### Factura de una linea con descuento global

`POST http://apidian2024.oo/api/ubl2.1/invoice`

PRIMER ENVIO DE FACTURA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990001163,
	"type_document_id": 1,
	"date": "2024-10-17",
	"time": "04:08:12",
	"resolution_number": "18760000001",
	"prefix": "SETP",
    "actividadeconomica": "6201",
    "notes": "ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA",
    "disable_confirmation_text": true,
    "establishment_name": "TORRE SOFTWARE NRO 1",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "establishment_email": "alternate_email@alternate.com",
	"sendmail": true,
    "sendmailtome": false,
    "head_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL PIE DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
	"customer": {
		"identification_number": 41946692,
		"dv": 6,
		"name": "ELIZABETH CARDONA VILLADA",
		"phone": "3103891693",
		"address": "CLL 4 NRO 33-90",
		"email": "alexander_obando@hotmail.com",
		"merchant_registration": "0000000-00",
		"type_document_identification_id": 3,
		"type_organization_id": 2,
        "type_liability_id": 7,
		"municipality_id": 822,
		"type_regime_id": 1,
        "tax_id": 1
	},
	"payment_form": [
        {
    		"payment_form_id": 2,
	    	"duration_measure": "30",
		    "payment_due_date": "2024-11-17",
		    "payment_method_id": 30
	    },
        {
    		"payment_form_id": 2,
	    	"duration_measure": "30",
		    "payment_due_date": "2024-11-17",
		    "payment_method_id": 10
	    }
    ],	
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
	],
    "logo_empresa_emisora": "/9j/4AAQSkZJRgABAQEASABIAAD/4QnORXhpZgAATU0AKgAAAAgABwESAAMA…[base64 recortado, 25320 caracteres]"
}
```

---

### Factura de tres lineas con descuento global

`POST http://apidian2024.oo/api/ubl2.1/invoice`

PRIMER ENVIO DE FACTURA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "number": 990001133,
    "type_document_id": 1,
    "date": "2024-08-22",
    "time": "04:08:12",
    "resolution_number": "18760000001",
    "prefix": "SETP",
    "actividadeconomica": "6201",
    "notes": "ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA",
    "disable_confirmation_text": true,
    "establishment_name": "TORRE SOFTWARE NRO 1",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "establishment_email": "alternate_email@alternate.com",
    "sendmail": true,
    "sendmailtome": false,
    "head_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL PIE DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "customer": {
        "identification_number": 41946692,
        "dv": 6,
        "name": "ELIZABETH CARDONA VILLADA",
        "phone": "3103891693",
        "address": "CLL 4 NRO 33-90",
        "email": "alexander_obando@hotmail.com",
        "merchant_registration": "0000000-00",
        "type_document_identification_id": 3,
        "type_organization_id": 2,
        "type_liability_id": 7,
        "municipality_id": 822,
        "type_regime_id": 1,
        "tax_id": 1
    },
    "payment_form": {
        "payment_form_id": 2,
        "payment_method_id": 30,
        "payment_due_date": "2024-08-22",
        "duration_measure": "0"
    },
    "allowance_charges": [{
            "discount_id": 1,
            "charge_indicator": false,
            "allowance_charge_reason": "DESCUENTO GENERAL",
            "amount": "300000.00",
            "base_amount": "9000000.00"
        }
    ],
    "legal_monetary_totals": {
        "line_extension_amount": "7563025.210",
        "tax_exclusive_amount": "7563025.210",
        "tax_inclusive_amount": "9000000.00",
        "allowance_total_amount": "300000.00",
        "payable_amount": "8700000.00"
    },
    "tax_totals": [
		{
            "tax_id": 1,
            "tax_amount": "1436974.790",
            "taxable_amount": "7563025.210",
            "percent": "19.00"
        }
    ],
    "invoice_lines": [
		{
            "unit_measure_id": 70,
            "invoiced_quantity": "1",
            "line_extension_amount": "840336.134",
            "free_of_charge_indicator": false,
            "tax_totals": [{
                    "tax_id": 1,
                    "tax_amount": "159663.865",
                    "taxable_amount": "840336.134",
                    "percent": "19.00"
                }
            ],
            "description": "ARTICULO NRO 1",
            "notes": "ESTA ES UNA PRUEBA DE NOTA DE DETALLE DE LINEA.",
            "code": "ART1",
            "type_item_identification_id": 4,
            "price_amount": "1000000.00",
            "base_quantity": "1"
        },
		{
            "unit_measure_id": 70,
            "invoiced_quantity": "1",
            "line_extension_amount": "1680672.269",
            "free_of_charge_indicator": false,
            "tax_totals": [{
                    "tax_id": 1,
                    "tax_amount": "319327.731",
                    "taxable_amount": "1680672.269",
                    "percent": "19.00"
                }
            ],
            "description": "ARTICULO NRO 2",
            "notes": "ESTA ES UNA PRUEBA DE NOTA DE DETALLE DE LINEA.",
            "code": "ART2",
            "type_item_identification_id": 4,
            "price_amount": "2000000.00",
            "base_quantity": "1"
        },
		{
            "unit_measure_id": 70,
            "invoiced_quantity": "2",
            "line_extension_amount": "5042016.806",
            "free_of_charge_indicator": false,
            "tax_totals": [{
                    "tax_id": 1,
                    "tax_amount": "957983.194",
                    "taxable_amount": "5042016.806",
                    "percent": "19.00"
                }
            ],
            "description": "ARTICULO NRO 3",
            "notes": "ESTA ES UNA PRUEBA DE NOTA DE DETALLE DE LINEA.",
            "code": "ART3",
            "type_item_identification_id": 4,
            "price_amount": "3000000.00",
            "base_quantity": "1"
        }
    ]
}
```

---

### Vista previa del PDF de la factura (sin enviar a la DIAN)

`POST http://apidian2024.oo/api/ubl2.1/invoice/preeliminar-view`

VISTA PRELIMINAR DE LA FACTURA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice/preeliminar-view>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Este endpoint no tiene parametros en la URL y no admite id del set de pruebas: no existe el modo sincrono ni el asincrono.
* Se envia el mismo JSON de la factura y la API devuelve unicamente la representacion grafica (PDF) en base64, sin firmarla, sin transmitirla a la DIAN y sin consumir consecutivo ni cupo del plan.
* Sirve para que el cliente revise como quedara la factura antes de enviarla.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990000802,
	"type_document_id": 1,
	"date": "2023-07-25",
	"time": "04:08:12",
	"resolution_number": "18760000001",
	"prefix": "SETP",
    "notes": "ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA",
    "disable_confirmation_text": true,
    "invoice_template": "one",
    "template_token": "[CENSURADO]",
    "establishment_name": "TORRE SOFTWARE NRO 1",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "establishment_email": "alternate_email@alternate.com",
	"sendmail": true,
    "sendmailtome": true,
    "seze": "2021-2017",
    "head_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL PIE DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
	"customer": {
		"identification_number": 41946692,
		"dv": 6,
		"name": "ELIZABETH CARDONA VILLADA",
		"phone": "3103891693",
		"address": "CLL 4 NRO 33-90",
		"email": "alexander_obando@hotmail.com",
		"merchant_registration": "0000000-00",
		"type_document_identification_id": 3,
		"type_organization_id": 2,
        "type_liability_id": 7,
		"municipality_id": 822,
		"type_regime_id": 1,
        "tax_id": 15
	},
	"payment_form": {
		"payment_form_id": 2,
		"payment_method_id": 30,
		"payment_due_date": "2023-08-25",
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

### Factura con dos tarifas de IVA y los dos tipos de descuento

`POST http://apidian2024.oo/api/ubl2.1/invoice`

PRIMER ENVIO DE FACTURA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "number": "990000932",
    "prefix": "SETP",
    "type_document_id": "1",
    "date": "2024-01-03",
    "time": "07:21:19",
    "resolution_number": "18760000001",
    "customer": {
        "identification_number": 89008003,
        "name": "ALEXANDER OBANDO LONDOÑO",
        "phone": "3103891693",
        "address": "VEREDA REGUEROS",
        "email": "gerencia@torresoftware.com",
        "merchant_registration": "0000-00",
        "type_document_identification_id": 3,
        "type_organization_id": 2,
        "municipality_id": 629,
        "type_regime_id": 2
    },
    "payment_form": {
            "duration_measure": "30",
            "payment_form_id": "2",
            "payment_method_id": "1",
            "payment_due_date": "2024-11-04"
    },
    "previous_balance": "0",
    "legal_monetary_totals": {
        "line_extension_amount": "89831.93",
        "tax_exclusive_amount": "89831.93",
        "tax_inclusive_amount": "105000.00",
        "charge_total_amount": "0.00",
        "payable_amount": "103000.00",
        "allowance_total_amount": "2000.00"
    },
    "allowance_charges": [{
            "discount_id": 1,
            "charge_indicator": false,
            "allowance_charge_reason": "Descuento General",
            "amount": "2000.00",
            "base_amount": "10000.00"
        }
    ],
    "tax_totals": [{
            "tax_id": "1",
            "tax_amount": "15168.06",
            "taxable_amount": "79831.93",
            "percent": "19.00"
        }, {
            "tax_id": "1",
            "tax_amount": "0.00",
            "taxable_amount": "10000.00",
            "percent": "0.00"
        }
    ],
    "invoice_lines": [{
            "unit_measure_id": 70,
            "invoiced_quantity": 1,
            "line_extension_amount": "79831.93",
            "free_of_charge_indicator": false,
            "tax_totals": [{
                    "tax_id": "1",
                    "tax_amount": "15168.06",
                    "taxable_amount": "79831.93",
                    "percent": "19.00"
                }
            ],
            "description": "Plan Int-RE-3M+: 3548K/800KPeríodo: 05/07/2022 al 04/08/2022Fecha de Corte : 09/08/2022",
            "code": "SERVICIO",
            "type_item_identification_id": 4,
            "price_amount": "100000.00",
            "base_quantity": 1,
            "allowance_charges": [{
                    "discount_id": 12,
                    "charge_indicator": false,
                    "allowance_charge_reason": "Descuento General",
                    "amount": "5000.00",
                    "base_amount": "100000.00"
                }
            ]
        }, {
            "unit_measure_id": 70,
            "invoiced_quantity": 1,
            "line_extension_amount": "10000.00",
            "free_of_charge_indicator": false,
            "tax_totals": [{
                    "tax_id": "1",
                    "tax_amount": "0.00",
                    "taxable_amount": "10000.00",
                    "percent": "0.00"
                }
            ],
            "description": "Reconexión del servicio por Corte (Comprobante vencido #00197020)",
            "code": "RECONEXION",
            "type_item_identification_id": 4,
            "price_amount": "10000.00",
            "base_quantity": 1
        }
    ]
}
```

---

### Factura con dos retenciones

`POST http://apidian2024.oo/api/ubl2.1/invoice`

PRIMER ENVIO DE FACTURA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "number": 990001148,
    "type_document_id": "1",
    "tarifaica": "0",
    "actividadeconomica": "6201",
    "date": "2024-10-03",
    "time": "21:15:11",
	"resolution_number": "18760000001",
    "establishment_name": "TORRE SOFTWARE",
	"prefix": "SETP",
    "sendmail": false,
    "notes": "Numero de Orden 48037 Fecha de Venta 20240802 211510",
    "payment_form": {
        "payment_form_id": "2",
        "payment_method_id": "10",
        "payment_due_date": "2024-10-03",
        "duration_measure": "0"
    },
    "customer": {
        "identification_number": "890001254",
        "name": "ESTRUCTURAS COYABRA SAS",
        "phone": "3116109981",
        "address": "CLL 11 NRO 21-73",
        "type_document_identification_id": 6,
        "type_regime_id": 2,
        "type_organization_id": 1,
        "municipality_id": 820,
        "dv": 8,
        "email": "coyabra.secretaria@gmail.com"
    },
    "order_reference": {
        "id_order": "A23061977FBC",
        "issue_date_order": "2020-10-01"
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
	"tax_totals": 
	[
		{
			"tax_id": 1,
			"tax_amount": "159663.865",
			"percent": "19",
			"taxable_amount": "840336.134"
		}
	],
    "invoice_lines":[
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
	],
    "logo_empresa_emisora": "/9j/4AAQSkZJRgABAQEAYABgAAD/4QBaRXhpZgAATU0AKgAAAAgABQMBAAUA…[base64 recortado, 4528 caracteres]"
}
```

---

## 📁 Nota credito

### Nota credito de una linea sin descuentos

`POST http://facturalatam-apidian.oo/api/ubl2.1/credit-note`

PRIMER ENVIO DE NOTA CREDITO

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/credit-note>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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
		"number": "SETP990000937",
		"uuid": "cf2f3415b1a3d90501df87a899640eeb86d02bbc40cdc56115e2fa885ccc81a2f318bcb7010dff4db4747719e2c95dd6",
		"issue_date": "2024-01-17"
	},
    "resolution_number": 4, //numero de resolucion necesario si tiene mas de una resolucion de nota de credito
	"discrepancyresponsecode": 2,
	"discrepancyresponsedescription": "PRUEBA DE MOTIVO NOTA CREDITO",
    "notes": "PRUEBA DE NOTA CREDITO",
    "prefix": "NC",
	"number": 72,
	"type_document_id": 4,
	"date": "2024-01-17",
	"time": "06:00:13",
    "establishment_name": "TORRE SOFTWARE",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "sendmail": true,
    "sendmailtome": true,
    "seze": "2021-2017",
    "head_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
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
	"tax_totals": [
		{
			"tax_id": 1,
			"tax_amount": "159663.865",
			"percent": "19",
			"taxable_amount": "840336.134"
		}
	],
	"legal_monetary_totals": {
		"line_extension_amount": "840336.134",
		"tax_exclusive_amount": "840336.134",
		"tax_inclusive_amount": "1000000.00",
		"payable_amount": "1000000.00"
	},
	"credit_note_lines": 
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
			"price_amount": "840336.134",
			"base_quantity": "1"
		}
	]
}
```

**Respuesta de ejemplo — 99 (200 OK)**

```json
{
    "message": "AttachedDocument #NC72 generada con éxito",
    "send_email_success": false,
    "send_email_date_time": false,
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
                        "Created": "2025-01-14T14:33:50.992Z",
                        "Expires": "2025-01-14T14:38:50.992Z"
                    }
                }
            },
            "Body": {
                "SendBillSyncResponse": {
                    "SendBillSyncResult": {
                        "ErrorMessage": {
                            "string": "Regla: 90, Rechazo: Documento procesado anteriormente."
                        },
                        "IsValid": "false",
                        "StatusCode": "99",
                        "StatusDescription": "Validación contiene errores en campos mandatorios.",
                        "StatusMessage": "Documento con errores en campos mandatorios.",
                        "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiIHN0YW5kYWxv…[base64 recortado, 14712 caracteres]",
                        "XmlBytes": {
                            "_attributes": {
                                "nil": "true"
                            }
                        },
                        "XmlDocumentKey": "[CUFE DE EJEMPLO]",
                        "XmlFileName": "nc00890080030002400000025"
                    }
                }
            }
        }
    },
    "invoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 24568 caracteres]",
    "zipinvoicexml": "[CENSURADO]",
    "unsignedinvoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 15120 caracteres]",
    "reqfe": "PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzb2FwOkVudmVsb3BlIHhtbG5zOnNv…[base64 recortado, 17684 caracteres]",
    "rptafe": "PHM6RW52ZWxvcGUgeG1sbnM6cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMy8w…[base64 recortado, 21656 caracteres]",
    "attacheddocument": "",
    "urlinvoicexml": "NCS-NC72.xml",
    "urlinvoicepdf": "NCS-NC72.pdf",
    "urlinvoiceattached": ".xml",
    "cude": "472384b4ae567be16ebd2812298aeef6b44febffabfe2debf8105ba29be6b5401d4e8d5e58cb5addebcb31249a99e502",
    "QRStr": "https://catalogo-vpfe-hab.dian.gov.co/document/searchqr?documentkey=[CUFE DE EJEMPLO]",
    "certificate_days_left": 411
}
```

---

### Nota credito con descuento global

`POST http://apidian2024.oo/api/ubl2.1/credit-note`

PRIMER ENVIO DE NOTA CREDITO

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/credit-note>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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
		"number": "SETP990000954",
		"uuid": "baa5ea24ceafc503fe51bbb69364e8516322b8243788108ae55ae4c03c4b92a4188281895ec8993bc363faf38b74ec53",
		"issue_date": "2024-02-20"
	},
    "resolution_number": 4,
	"discrepancyresponsecode": 2,
	"discrepancyresponsedescription": "PRUEBA DE MOTIVO NOTA CREDITO",
    "notes": "PRUEBA DE NOTA CREDITO",
    "prefix": "NC",
	"number": 71,
	"type_document_id": 4,
	"date": "2024-08-28",
	"time": "06:00:13",
    "establishment_name": "TORRE SOFTWARE",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "sendmail": true,
    "sendmailtome": true,
    "seze": "2021-2017",
    "head_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
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
	"credit_note_lines": 
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

### Nota credito con descuento en la linea

`POST http://apidian2023.oo/api/ubl2.1/credit-note`

PRIMER ENVIO DE NOTA CREDITO

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/credit-note>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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
		"number": "SETP990000355",
		"uuid": "01f957ca0ec2bbd972f13899166fc22386c0704ea2bed51272fcd13fd608daf3b57ceb30692abd764bbdad3529a9be73",
		"issue_date": "2021-08-17"
	},
	"discrepancyresponsecode": 2,
	"discrepancyresponsedescription": "PRUEBA DE MOTIVO NOTA CREDITO",
    "notes": "PRUEBA DE NOTA CREDITO",
    "resolution_number": "4",
    "prefix": "NC",
	"number": 34,
	"type_document_id": 4,
	"date": "2021-08-17",
	"time": "06:00:13",
    "establishment_name": "TORRE SOFTWARE",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "sendmail": true,
    "sendmailtome": true,
    "seze": "2021-2017",
    "head_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
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
	"legal_monetary_totals": {
		"line_extension_amount": "769500.00",
		"tax_exclusive_amount": "950000.00",
		"tax_inclusive_amount": "950000.00",
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
	"credit_note_lines": 
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

### Nota credito sin referencia a factura

`POST http://facturalatam-apidian.oo/api/ubl2.1/credit-note`

PRIMER ENVIO DE NOTA CREDITO

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/credit-note>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "resolution_number": 4,
	"discrepancyresponsecode": 1,
    "notes": "PRUEBA DE NOTA CREDITO SIN REFERENCIA A FACTURA",
    "prefix": "NC",
	"number": 194,
	"type_document_id": 4,
	"date": "2025-01-16",
	"time": "10:00:13",
    "type_operation_id": "8",
    "establishment_name": "TORRE SOFTWARE",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "sendmail": false,
    "sendmailtome": false,
    "seze": "2021-2017",
    "head_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
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
	"tax_totals": [
		{
			"tax_id": 1,
			"tax_amount": "159663.865",
			"percent": "19",
			"taxable_amount": "840336.134"
		}
	],
    "invoice_period": {
        "start_date": "2025-01-01",
        "end_date": "2025-01-15"
    },
	"legal_monetary_totals": {
		"line_extension_amount": "840336.134",
		"tax_exclusive_amount": "840336.134",
		"tax_inclusive_amount": "1000000.00",
		"payable_amount": "1000000.00"
	},
	"credit_note_lines": 
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
			"price_amount": "840336.134",
			"base_quantity": "1"
		}
	]
}
```

**Respuesta de ejemplo — 99 (200 OK)**

```json
{
    "message": "AttachedDocument #NC94 generada con éxito",
    "send_email_success": false,
    "send_email_date_time": false,
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
                        "Created": "2025-01-14T14:36:25.801Z",
                        "Expires": "2025-01-14T14:41:25.801Z"
                    }
                }
            },
            "Body": {
                "SendBillSyncResponse": {
                    "SendBillSyncResult": {
                        "ErrorMessage": {
                            "string": "Regla: 90, Rechazo: Documento procesado anteriormente."
                        },
                        "IsValid": "false",
                        "StatusCode": "99",
                        "StatusDescription": "Validación contiene errores en campos mandatorios.",
                        "StatusMessage": "Documento con errores en campos mandatorios.",
                        "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiIHN0YW5kYWxv…[base64 recortado, 14660 caracteres]",
                        "XmlBytes": {
                            "_attributes": {
                                "nil": "true"
                            }
                        },
                        "XmlDocumentKey": "[CUFE DE EJEMPLO]",
                        "XmlFileName": "nc00890080030002400000013"
                    }
                }
            }
        }
    },
    "invoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 24252 caracteres]",
    "zipinvoicexml": "[CENSURADO]",
    "unsignedinvoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 14804 caracteres]",
    "reqfe": "PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzb2FwOkVudmVsb3BlIHhtbG5zOnNv…[base64 recortado, 17564 caracteres]",
    "rptafe": "PHM6RW52ZWxvcGUgeG1sbnM6cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMy8w…[base64 recortado, 21584 caracteres]",
    "attacheddocument": "",
    "urlinvoicexml": "NCS-NC94.xml",
    "urlinvoicepdf": "NCS-NC94.pdf",
    "urlinvoiceattached": ".xml",
    "cude": "661bdd5a93a48eef23ea86484541cd5361227d25bf88a7f981f34df04743dafc794ba7e8ae03cb7bc7645c676a1cba2b",
    "QRStr": "https://catalogo-vpfe-hab.dian.gov.co/document/searchqr?documentkey=[CUFE DE EJEMPLO]",
    "certificate_days_left": 411
}
```

**Respuesta de ejemplo — 00 (200 OK)**

```json
{
    "message": "AttachedDocument #NC194 generada con éxito",
    "send_email_success": false,
    "send_email_date_time": false,
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
                        "Created": "2025-01-16T16:10:19.648Z",
                        "Expires": "2025-01-16T16:15:19.648Z"
                    }
                }
            },
            "Body": {
                "SendBillSyncResponse": {
                    "SendBillSyncResult": {
                        "ErrorMessage": {},
                        "IsValid": "true",
                        "StatusCode": "00",
                        "StatusDescription": "Procesado Correctamente.",
                        "StatusMessage": "La Nota de crédito electrónica NC194, ha sido autorizada.",
                        "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiIHN0YW5kYWxv…[base64 recortado, 14696 caracteres]",
                        "XmlBytes": {
                            "_attributes": {
                                "nil": "true"
                            }
                        },
                        "XmlDocumentKey": "[CUFE DE EJEMPLO]",
                        "XmlFileName": "nc00890080030002500000007"
                    }
                }
            }
        }
    },
    "invoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 24288 caracteres]",
    "zipinvoicexml": "[CENSURADO]",
    "unsignedinvoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 14836 caracteres]",
    "reqfe": "PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzb2FwOkVudmVsb3BlIHhtbG5zOnNv…[base64 recortado, 17572 caracteres]",
    "rptafe": "PHM6RW52ZWxvcGUgeG1sbnM6cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMy8w…[base64 recortado, 21496 caracteres]",
    "attacheddocument": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 52844 caracteres]",
    "urlinvoicexml": "NCS-NC194.xml",
    "urlinvoicepdf": "NCS-NC194.pdf",
    "urlinvoiceattached": "ad00890080030002500000007.xml",
    "cude": "caacf70a0791e85a98324c4fb748a7c3c7d80ed6e8ba188316f09c9dab8ced6e85ab0d37739312a2a60faeda420e5a52",
    "QRStr": "https://catalogo-vpfe-hab.dian.gov.co/document/searchqr?documentkey=[CUFE DE EJEMPLO]",
    "certificate_days_left": 409
}
```

---

## 📁 Nota debito

### Nota debito de una linea sin descuentos

`POST http://apidian2023.oo/api/ubl2.1/debit-note`

PRIMER ENVIO DE NOTA DEBITO

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/debit-note>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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
		"number": "SETP990000384",
		"uuid": "3a5c31e52d3ec72a3812c9daff32209f41022992875cd1ddd96fe1604615a5bbd64fed6d777a3abbd040328ea8abc192",
		"issue_date": "2021-08-17"
	},
    "resolution_number": 5, //numero de resolucion necesario si tiene mas de una resolucion de nota de debito
	"discrepancyresponsecode": 3,
	"discrepancyresponsedescription": "PRUEBA DE MOTIVO NOTA DEBITO",
    "notes": "PRUEBA DE NOTA DEBITO",
	"number": 37,
	"type_document_id": 5,
	"date": "2021-08-17",
	"time": "06:00:13",
    "establishment_name": "TORRE SOFTWARE",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "sendmail": true,
    "sendmailtome": true,
    "seze": "2021-2017",
    "head_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
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
	"allowance_charges": [
		{
			"discount_id": 1,
			"charge_indicator": false,
			"allowance_charge_reason": "DESCUENTO GENERAL",
			"amount": "50000.00",
			"base_amount": "1000000.00"
		}
	],
	"requested_monetary_totals": {
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
	"debit_note_lines": 
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

### Nota debito con descuento global

`POST http://apidian2024.oo/api/ubl2.1/debit-note`

PRIMER ENVIO DE NOTA DEBITO

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/debit-note>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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
		"number": "SETP990000597",
		"uuid": "808adf32c40eddf08a10a8c37c5cdb934994f0595bd97c3ac4ecb373b0f7924dde756836ab822d2d36c367214e56aec5",
		"issue_date": "2022-08-09"
	},
    "resolution_number": 5,
	"discrepancyresponsecode": 3,
	"discrepancyresponsedescription": "PRUEBA DE MOTIVO NOTA DEBITO",
    "notes": "PRUEBA DE NOTA DEBITO",
	"number": 41,
	"type_document_id": 5,
	"date": "2023-06-23",
	"time": "06:00:13",
    "establishment_name": "TORRE SOFTWARE",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "sendmail": true,
    "sendmailtome": true,
    "seze": "2021-2017",
    "head_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
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
	"tax_totals": [
		{
			"tax_id": 1,
			"tax_amount": "159663.865",
			"percent": "19",
			"taxable_amount": "840336.134"
		}
	],
	"requested_monetary_totals": {
		"line_extension_amount": "840336.134",
		"tax_exclusive_amount": "840336.134",
		"tax_inclusive_amount": "1000000.00",
		"payable_amount": "1000000.00"
	},
	"debit_note_lines": 
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
			"price_amount": "840336.134",
			"base_quantity": "1"
		}
	]
}
```

---

### Nota debito con descuento en la linea

`POST http://apidian2024.oo/api/ubl2.1/debit-note`

PRIMER ENVIO DE NOTA DEBITO

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/debit-note>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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
		"number": "SETP990000954",
		"uuid": "baa5ea24ceafc503fe51bbb69364e8516322b8243788108ae55ae4c03c4b92a4188281895ec8993bc363faf38b74ec53",
		"issue_date": "2024-02-20"
	},
    "resolution_number": 5,
	"discrepancyresponsecode": 3,
	"discrepancyresponsedescription": "PRUEBA DE MOTIVO NOTA DEBITO",
    "notes": "PRUEBA DE NOTA DEBITO",
	"number": 45,
	"type_document_id": 5,
	"date": "2024-02-22",
	"time": "06:00:13",
    "establishment_name": "TORRE SOFTWARE",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "sendmail": true,
    "sendmailtome": true,
    "seze": "2021-2017",
    "head_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
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
	"requested_monetary_totals": {
		"line_extension_amount": "769500.00",
		"tax_exclusive_amount": "950000.00",
		"tax_inclusive_amount": "950000.00",
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
	"debit_note_lines": 
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

### Nota debito sin referencia a factura

`POST http://apidian2024.oo/api/ubl2.1/debit-note`

PRIMER ENVIO DE NOTA DEBITO

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/debit-note>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "resolution_number": 5,
	"discrepancyresponsecode": 3,
    "notes": "PRUEBA DE NOTA DEBITO",
	"number": 44,
	"type_document_id": 5,
	"date": "2024-02-20",
	"time": "06:00:13",
    "establishment_name": "TORRE SOFTWARE",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "sendmail": true,
    "sendmailtome": true,
    "seze": "2021-2017",
    "type_operation_id": 5,
    "head_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
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
	"tax_totals": [
		{
			"tax_id": 1,
			"tax_amount": "159663.865",
			"percent": "19",
			"taxable_amount": "840336.134"
		}
	],
    "invoice_period": {
        "start_date": "2023-12-01",
        "end_date": "2023-12-31"
    },
	"requested_monetary_totals": {
		"line_extension_amount": "840336.134",
		"tax_exclusive_amount": "840336.134",
		"tax_inclusive_amount": "1000000.00",
		"payable_amount": "1000000.00"
	},
	"debit_note_lines": 
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
			"price_amount": "840336.134",
			"base_quantity": "1"
		}
	]
}
```

---

## 📁 Nomina electronica

### Nomina individual

`POST http://apidian2023.oo/api/ubl2.1/payroll/85d66719-3d34-4a53-9dca-e1a38a2a63fd`

PRIMER ENVIO DE NOMINA ELECTRONICA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"type_document_id": 9,
    "establishment_name": "TORRE SOFTWARE",
    "establishment_address": "CLL 11 NRO 21-73 BRR LA CABAÑA",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "establishment_email": "alternate_email@alternate.com",
    "head_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL PIE DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",  
    "novelty":{
        "novelty": false,
        "uuidnov": ""
    },
    "period":{
        "admision_date": "2018-10-10",// Fecha ingreso (AAAA-MM-DD)
        "settlement_start_date": "2021-07-01",// Inicio liquidación (AAAA-MM-DD)
        "settlement_end_date": "2021-07-31",// Fin liquidación (AAAA-MM-DD)
        "worked_time": "785.00",// Tiempo laborado en la empresa
        "issue_date": "2021-07-28"// Fecha de emisión (AAAA-MM-DD)
    },
    "sendmail": false,
    "sendmailtome": false,
	"worker_code": "41946692",
	"prefix": "NI",
	"consecutive": 100100,
    "payroll_period_id": 4,// Periodicidad nómina (mensual, quincenal, etc.)
    "notes": "PRUEBA DE ENVIO DE NOMINA ELECTRONICA",
	"worker": {
		"type_worker_id": 1,// Tipo de trabajador (ver tabla type_workers)
		"sub_type_worker_id": 1,// Subtipo de trabajador (ver tabla sub_type_workers)
		"payroll_type_document_identification_id": 3,// Tipo doc. ID (ver tabla correspondiente)
		"municipality_id": 822,
		"type_contract_id": 1,// Tipo de contrato (ver tabla type_contracts)
		"high_risk_pension": false,// ¿Pensión alto riesgo? (true/false)
		"identification_number": 41946692,
		"surname": "CARDONA",
        "second_surname": "VILLADA",
		"first_name": "ELIZABETH",
        "middle_name": null,
		"address": "BRR LIMONAR MZ 6 CS 3 ET 1",
        "integral_salarary": false,// ¿Salario integral? (true/false)
        "salary": "1500000.00",
        "email": "somemail@somehost.com"
	},
	"payment": {
		"payment_method_id": 10,
		"bank_name": "BANCO DAVIVIENDA",
		"account_type": "AHORROS",
		"account_number": "126070603280"
	},	
    "payment_dates": [
        {
            "payment_date": "2021-03-10"
        }
    ],    
	"accrued": {
		"worked_days": 30,
		"salary": "750000.00",
        "transportation_allowance": "115000.00",
        "accrued_total": "859000.00"
	},
	"deductions": {
		"eps_type_law_deductions_id": 1,
		"eps_deduction": "60000.00",
		"pension_type_law_deductions_id": 5,
		"pension_deduction": "60000.00",
        "deductions_total": "120000.00"
	}
}
```

**Respuesta de ejemplo — Error 99 (200 OK)**

```json
{
    "message": "AttachedDocument #NI100100 generada con éxito",
    "ResponseDian": {
        "Envelope": {
            "Header": {
                "Action": {
                    "_attributes": {
                        "mustUnderstand": "1"
                    },
                    "_value": "http://wcf.dian.colombia/IWcfDianCustomerServices/SendNominaSyncResponse"
                },
                "Security": {
                    "_attributes": {
                        "mustUnderstand": "1"
                    },
                    "Timestamp": {
                        "_attributes": {
                            "Id": "_0"
                        },
                        "Created": "2025-02-24T21:03:20.568Z",
                        "Expires": "2025-02-24T21:08:20.568Z"
                    }
                }
            },
            "Body": {
                "SendNominaSyncResponse": {
                    "SendNominaSyncResult": {
                        "ErrorMessage": {
                            "string": [
                                "Regla: NIE017, Rechazo: Se debe colocar el NIT sin guiones ni DV de la empresa dueña del Software que genera el Documento, debe estar registrado en la DIAN.",
                                "Regla: 92, Rechazo: El Emisor del Documento no se encuentra Habilitado en la Plataforma.",
                                "Regla: NIE033, Rechazo: Debe ir el NIT del Empleador sin guiones ni DV.",
                                "Regla: NIE020, Rechazo: Se debe indicar el Software Security Code según la definición establecida."
                            ]
                        },
                        "IsValid": "false",
                        "StatusCode": "99",
                        "StatusDescription": "Documento con errores en campos mandatorios.",
                        "StatusMessage": "Documento con errores en campos mandatorios.",
                        "XmlBase64Bytes": {
                            "_attributes": {
                                "nil": "true"
                            }
                        },
                        "XmlBytes": {
                            "_attributes": {
                                "nil": "true"
                            }
                        },
                        "XmlDocumentKey": "[CUFE DE EJEMPLO]",
                        "XmlFileName": "ni00890080030002500000002"
                    }
                }
            }
        }
    },
    "payrollxml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPE5vbWlu…[base64 recortado, 13316 caracteres]",
    "zippayrollxml": "UEsDBBQAAgAIAGWoWFpborFzfBEAAAEnAAAdAAAAbmkwMDg5MDA4MDAzMDAw…[base64 recortado, 6176 caracteres]",
    "unsignedpayrollxml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPE5vbWlu…[base64 recortado, 4036 caracteres]",
    "reqni": "PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzb2FwOkVudmVsb3BlIHhtbG5zOnNv…[base64 recortado, 15616 caracteres]",
    "rptani": "PHM6RW52ZWxvcGUgeG1sbnM6cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMy8w…[base64 recortado, 2604 caracteres]",
    "attacheddocument": "",
    "urlpayrollxml": "NIS-NI100100.xml",
    "urlpayrollpdf": "NIS-NI100100.pdf",
    "urlpayrollattached": ".xml",
    "cune": "342ca2443dd9bb3a1801740751eb09fcebb1d5a373e6ff9bf6c0d95a076838610fa78a79d914791e8af5b8ea51cf59e9",
    "QRStr": "https://catalogo-vpfe-hab.dian.gov.co/document/searchqr?documentkey=[CUFE DE EJEMPLO]",
    "certificate_days_left": 370
}
```

---

### Nota de ajuste de nomina - Reemplazar

`POST http://apidian2023.oo/api/ubl2.1/payroll-adjust-note/7047db8a-213e-4b08-b567-b06b7a83b50d`

PRIMER ENVIO DE NOMINA DE AJUSTE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"type_document_id": 10,
    "establishment_name": "TORRE SOFTWARE",
    "establishment_address": "CLL 11 NRO 21-73 BRR LA CABAÑA",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "establishment_email": "alternate_email@alternate.com",
    "head_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL PIE DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",    
    "type_note": 1,
    "predecessor": {
        "predecessor_number": 1,
        "predecessor_cune": "df06457cc64437d243d7c406f28471d08e623a160a0266fced43fe57b9a7601de0cdfd33fd3d374f726cc48fbaaf8468",
        "predecessor_issue_date": "2021-07-28"
    },
    "period":{
        "admision_date": "2021-01-01",
        "settlement_start_date": "2021-03-01",
        "settlement_end_date": "2021-03-31",
        "worked_time": 750,
        "issue_date": "2021-07-29"
    },
	"worker_code": "41946692",
	"prefix": "NA",
	"consecutive": 100020,
    "payroll_period_id": 4,
    "notes": "PRUEBA DE ENVIO DE NOMINA ELECTRONICA",
	"worker": {
		"type_worker_id": 1,
		"sub_type_worker_id": 1,
		"payroll_type_document_identification_id": 1,
		"municipality_id": 822,
		"type_contract_id": 1,
		"high_risk_pension": false,
		"identification_number": 41946692,
		"surname": "CARDONA",
        "second_surname": "VILLADA",
		"first_name": "ELIZABETH",
		"address": "BRR LIMONAR MZ 6 CS 3 ET 1",
        "integral_salarary": false,
        "salary": "1500000.00"
	},
	"payment": {
		"payment_method_id": 10,
		"bank_name": "BANCO DAVIVIENDA",
		"account_type": "AHORROS",
		"account_number": "126070603280"
	},	
    "payment_dates": [
        {
            "payment_date": "2021-03-10"
        },
        {
            "payment_date": "2021-03-15"
        }
    ],    
	"accrued": {
		"worked_days": 30,
		"salary": "750000.00",
		"transportation_allowance": "109000.00",
        "HEDs": [
            {
                "start_time": "2021-03-01T18:00:00",
                "end_time": "2021-03-01T19:00:00",
                "quantity": 1,
                "percentage": 1,
                "payment": "7812.50"
            },
            {
                "start_time": "2021-03-02T18:00:00",
                "end_time": "2021-03-02T19:00:00",
                "quantity": 1,
                "percentage": 1,
                "payment": "7812.50"
            }
        ],
        "HENs": [
            {
                "start_time": "2021-03-01T21:00:00",
                "end_time": "2021-03-01T22:00:00",
                "quantity": 1,
                "percentage": 2,
                "payment": "10937.50"
            }
        ],
        "HRNs": [
            {
                "start_time": "2021-03-01T21:00:00",
                "end_time": "2021-03-01T22:00:00",
                "quantity": 1,
                "percentage": 3,
                "payment": "8437.50"
            },
            {
                "start_time": "2021-03-02T21:00:00",
                "end_time": "2021-03-02T22:00:00",
                "quantity": 1,
                "percentage": 3,
                "payment": "8437.50"
            }
        ],
        "HEDDFs": [
            {
                "start_time": "2021-03-01T21:00:00",
                "end_time": "2021-03-01T22:00:00",
                "quantity": 1,
                "percentage": 4,
                "payment": "12500.00"
            }
        ],
        "HRDDFs": [
            {
                "start_time": "2021-03-01T16:00:00",
                "end_time": "2021-03-01T17:00:00",
                "quantity": 1,
                "percentage": 5,
                "payment": "10937.50"
            },
            {
                "start_time": "2021-03-02T16:00:00",
                "end_time": "2021-03-02T17:00:00",
                "quantity": 1,
                "percentage": 5,
                "payment": "10937.50"
            }
        ],
        "HENDFs": [
            {
                "start_time": "2021-03-01T21:00:00",
                "end_time": "2021-03-01T22:00:00",
                "quantity": 1,
                "percentage": 6,
                "payment": "15625.00"
            }
        ],
        "HRNDFs": [
            {
                "start_time": "2021-03-01T21:00:00",
                "end_time": "2021-03-01T22:00:00",
                "quantity": 1,
                "percentage": 7,
                "payment": "13125.00"
            }
        ],
        "common_vacation": [
            {
                "start_date": "2021-03-01",
                "end_date": "2021-03-10",
                "quantity": 10,
                "payment": "500000.00"
            }
        ],
        "paid_vacation": [
            {
                "quantity": 5,
                "payment": "250000.00"
            }
        ],
        "service_bonus": [
            {
                "quantity": 365,
                "payment": "1500000.00",
                "paymentNS": "250000.00"
            }
        ],
        "severance": [
            {
                "payment": "1500000.00",
                "percentage": "12",
                "interest_payment": "180000.00"
            }
        ],
        "work_disabilities": [
            {
                "start_date": "2021-03-05",
                "end_date": "2021-03-10",
                "type": 3,
                "quantity": 5,
                "payment": "250000.00"
            },
            {
                "start_date": "2021-03-11",
                "end_date": "2021-03-15",
                "type": 3,
                "quantity": 5,
                "payment": "250000.00"
            }
        ],
        "maternity_leave": [
            {
                "start_date": "2021-03-11",
                "end_date": "2021-03-15",
                "quantity": 5,
                "payment": "250000.00"
            }
        ],
        "paid_leave": [
            {
                "start_date": "2021-03-11",
                "end_date": "2021-03-15",
                "quantity": 5,
                "payment": "250000.00"
            }
        ],
        "non_paid_leave": [
            {
                "start_date": "2021-03-11",
                "end_date": "2021-03-15",
                "quantity": 5
            }
        ],
        "bonuses": [
            {
                "salary_bonus": "100000.00"
            },
            {
                "salary_bonus": "95000.00",
                "non_salary_bonus": "50000.00"
            }
        ],
        "aid": [
            {
                "salary_assistance": "95000.00",
                "non_salary_assistance": "50000.00"
            }
        ],
        "legal_strike": [
            {
                "start_date": "2021-03-01",
                "end_date": "2021-03-10",
                "quantity": 10
            }
        ],
        "other_concepts": [
            {
                "salary_concept": "35000",
                "non_salary_concept": "50000",
                "description_concept": "INGRESO POR OTROS CONCEPTOS"
            }
        ],
        "compensations": [
            {
                "ordinary_compensation": "135000",
                "extraordinary_compensation": "250000"
            }
        ],
        "epctv_bonuses": [
            {
                "paymentS": "135000",
                "paymentNS": "250000",
                "salary_food_payment": "135000",
                "non_salary_food_payment": "250000"
            }
        ],
        "commissions": [
            {
                "commission": "135000"
            },
            {
                "commission": "155000"
            }
        ],
        "third_party_payments": [
            {
                "third_party_payment": "155000"
            }
        ],
        "advances": [
            {
                "advance": "135000"
            },
            {
                "advance": "50000"
            }
        ],
        "endowment": "250000.00",
        "sustenance_support": "1350000.00",
        "telecommuting": "250000.00",
        "withdrawal_bonus": "250000.00",
        "compensation": "135000.00",
        "accrued_total": "5145562.50"
	},
	"deductions": {
		"eps_type_law_deductions_id": 1,
		"eps_deduction": "60000.00",
		"pension_type_law_deductions_id": 5,
		"pension_deduction": "60000.00",
        "fondossp_type_law_deductions_id": 3,
        "fondosp_deduction_SP": "60000.00",
        "fondossp_sub_type_law_deductions_id": 4,
        "fondosp_deduction_sub": "30000.00",
        "labor_union": [
            {
                "percentage": "2.00",
                "deduction": "30000.00"
            }
        ],
        "sanctions": [
            {
                "public_sanction": "300000.00",
                "private_sanction": "130000.00"
            }
        ],
        "orders": [
            {
                "description": "LIBRANZA POR PEDIDO NRO 34256 GRUPO EXITO",
                "deduction": "13000.00"
            }
        ],
        "third_party_payments": [
            {
                "third_party_payment": "155000"
            },
            {
                "third_party_payment": "59000"
            }
        ],
        "advances": [
            {
                "advance": "255000"
            },
            {
                "advance": "79000"
            }
        ],
        "other_deductions": [
            {
                "other_deduction": "133000"
            }
        ],
        "voluntary_pension": "158000.00",
        "withholding_at_source": "65000.00",
        "afc": "33500.00",
        "cooperative": "25000.00",
        "tax_liens": "38500.00",
        "supplementary_plan": "65000.00",
        "education": "59000.00",
        "refund": "47000.00",
        "debt": "39000",
        "deductions_total": "120000.00"
	}
}
```

---

### Nota de ajuste de nomina - Eliminar

`POST http://apidian2023.oo/api/ubl2.1/payroll-adjust-note/7047db8a-213e-4b08-b567-b06b7a83b50d`

PRIMER ENVIO DE NOMINA DE AJUSTE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "type_document_id": 10,
    "establishment_name": "TORRE SOFTWARE",
    "establishment_address": "CLL 11 NRO 21-73 BRR LA CABAÑA",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "establishment_email": "alternate_email@alternate.com",
    "head_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL PIE DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "type_note": 2,
    "predecessor": {
        "predecessor_number": 100003,
        "predecessor_cune": "f82fc0af4e13aa1b12e532471f437fa5e56595bfa99a36b7d102e70c827ff174cd20977fec3e0c5a904ff1c4c3a44364",
        "predecessor_issue_date": "2021-07-28"
    },
    "period":{
        "admision_date": "2018-10-10",
        "settlement_start_date": "2021-07-01",
        "settlement_end_date": "2021-07-15",
        "worked_time": "15.00",
        "issue_date": "2021-07-28"
    },
    "prefix": "NA",
    "consecutive": 100003,
    "payroll_period_id": 4,
    "notes": "PRUEBA DE ENVIO DE NOMINA DE AJUSTE ELECTRONICA - ELIMINAR"
}
```

---

## 📁 Documento soporte

### Documento soporte sencillo

`POST http://apidian2024.oo/api/ubl2.1/support-document`

PRIMER ENVIO DE DOCUMENTO SOPORTE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

#### Tipos de identificación del vendedor permitidos

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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 11,
	"type_document_id": 11,
	"date": "2023-08-09",
	"time": "12:09:38",
	"notes": "SIN OBSERVACIONES",
	"sendmail": false,
	"sendmailtome": false,
	"resolution_number": "18764053310988",
	"prefix": "DSP",
    "establishment_name": "ALEXANDER OBANDO LONDOÑO",	
    "tarifaica": "0",
    "actividadeconomica": "6201",
	"seller": {
		"identification_number": "41946692",
        "dv": "6",
		"name": "ELIZABETH CARDONA VILLADA",
		"phone": "3226563672",
		"address": "LIMONAR MZ 6 CS 3 ET 1 PISO 2",
		"email": "elizabethcardonav@gmail.com",
		"merchant_registration": "0000-00",
        "postal_zone_code": 630001,
		"type_document_identification_id": 6,
		"type_organization_id": 2,
		"municipality_id": 820,
		"type_liability_id": 117,
		"type_regime_id": 1
	},
	"payment_form": {
		"payment_form_id": 1,
		"payment_method_id": 10,
		"payment_due_date": "2023-08-09",
		"duration_measure": "0"
	},	
	"allowance_charges": [
		{
			"discount_id": 10,
			"charge_indicator": false,
			"allowance_charge_reason": "DESCUENTO GENERAL",
			"amount": "0.00",
			"base_amount": "200.00"
		}
	],
	"legal_monetary_totals": {
		"line_extension_amount": "200.00",
		"tax_exclusive_amount": "200.00",
		"tax_inclusive_amount": "200.00",
		"allowance_total_amount": "0.00",
		"charge_total_amount": "0.00",
		"payable_amount": "200.00"
	},
	"tax_totals": 
	[

		{
			"tax_id": 1,
			"tax_amount": "0.00",
			"percent": "0",
			"taxable_amount": "200.00"
		}
	
	],
	"invoice_lines": 
	[
		{
			"unit_measure_id": 70,
			"invoiced_quantity": "2.00",
			"line_extension_amount": "200.00",
			"free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": false,
					"allowance_charge_reason": "DESCUENTO GENERAL",
					"amount": "0.00",
					"base_amount": "200.00"
				}
			],
			"tax_totals": 
			[{
				"tax_id": 1,
				"tax_amount": "0.00",
				"percent": "0.00",
				"taxable_amount": "200.00"
			}],
			"description": "ARTICULO DE PRUEBAS",
            "notes": "",
			"code": "PRUEBA",
			"type_item_identification_id": 4,
			"price_amount": "100.00",
			"base_quantity": "2.00",
		    "type_generation_transmition_id": 1,
			"start_date": "2023-08-09"
		}

	],
    "logo_empresa_emisora": "/9j/4AAQSkZJRgABAQEAYABgAAD/4QBaRXhpZgAATU0AKgAAAAgABQMBAAUA…[base64 recortado, 4528 caracteres]"    
}
```

---

### Documento soporte con descuento

`POST http://apidian2023.oo/api/ubl2.1/support-document`

PRIMER ENVIO DE DOCUMENTO SOPORTE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

#### Tipos de identificación del vendedor permitidos

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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 13,
	"type_document_id": 11,
	"date": "2023-08-09",
	"time": "12:09:38",
	"notes": "SIN OBSERVACIONES",
	"foot_note": "Modalidad de Emision de Facturas Electronicas: SOFTWARE PROPIO - Fabricante Software: TORRE SOFTWARE - Nit: 89008003-2",
	"sendmail": false,
	"sendmailtome": false,
	"resolution_number": "18764053310988",
	"prefix": "DSP",
    "establishment_name": "ALEXANDER OBANDO LONDOÑO",	
	"seller": {
		"identification_number": "41946692",
        "dv": "6",
		"name": "ELIZABETH CARDONA VILLADA",
		"phone": "3226563672",
		"address": "LIMONAR MZ 6 CS 3 ET 1 PISO 2",
		"email": "elizabethcardonav@gmail.com",
		"merchant_registration": "0000-00",
        "postal_zone_code": 630001,
		"type_document_identification_id": 6,
		"type_organization_id": 2,
		"municipality_id": 820,
		"type_liability_id": 117,
		"type_regime_id": 1
	},
    "payment_form": {
        "payment_form_id": "1",
        "payment_method_id": "42",
        "payment_due_date": "2023-08-09",
        "duration_measure": "0"
    },
    "allowance_charges":
    [{
            "discount_id": 1,
            "charge_indicator": false,
            "allowance_charge_reason": "Descuento general",
            "amount": "1.00",
            "base_amount": "10.00"
        }
    ],
    "legal_monetary_totals": {
        "line_extension_amount": "10.00",
        "tax_exclusive_amount": "0.00",
        "tax_inclusive_amount": "10.00",
        "allowance_total_amount": "1.00",
        "charge_total_amount": "0.00",
        "payable_amount": "9.00"
    },
    "invoice_lines":
    [{
            "unit_measure_id": 70,
            "invoiced_quantity": "1.00",
            "line_extension_amount": "10.00",
            "free_of_charge_indicator": false,
            "allowance_charges":
            [{
                    "charge_indicator": false,
                    "allowance_charge_reason": "Descuento general",
                    "amount": "1.00",
                    "base_amount": "10.00"
                }
            ],
            "description": "DSE EL676 PRUEBA",
            "code": "51959501",
            "type_item_identification_id": 4,
            "price_amount": "10.00",
            "base_quantity": "1",
            "type_generation_transmition_id": 1,
            "start_date": "2023-08-09"
        }
    ]
}
```

---

### Documento soporte con descuento (variante 2)

`POST http://apidian2023.oo/api/ubl2.1/support-document`

PRIMER ENVIO DE DOCUMENTO SOPORTE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

#### Tipos de identificación del vendedor permitidos

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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 14,
	"type_document_id": 11,
	"date": "2023-08-09",
	"time": "12:09:38",
	"notes": "SIN OBSERVACIONES",
	"foot_note": "Modalidad de Emision de Facturas Electronicas: SOFTWARE PROPIO - Fabricante Software: TORRE SOFTWARE - Nit: 89008003-2",
	"sendmail": false,
	"sendmailtome": false,
	"resolution_number": "18764053310988",
	"prefix": "DSP",
    "establishment_name": "ALEXANDER OBANDO LONDOÑO",	
	"seller": {
		"identification_number": "41946692",
        "dv": "6",
		"name": "ELIZABETH CARDONA VILLADA",
		"phone": "3226563672",
		"address": "LIMONAR MZ 6 CS 3 ET 1 PISO 2",
		"email": "elizabethcardonav@gmail.com",
		"merchant_registration": "0000-00",
        "postal_zone_code": 630001,
		"type_document_identification_id": 6,
		"type_organization_id": 2,
		"municipality_id": 820,
		"type_liability_id": 117,
		"type_regime_id": 1
	},
    "payment_form": {
        "payment_form_id": "1",
        "payment_method_id": "20",
        "payment_due_date": "2023-08-09",
        "duration_measure": "0"
    },
    "legal_monetary_totals": {
        "line_extension_amount": "15997.00",
        "tax_exclusive_amount": "0.00",
        "tax_inclusive_amount": "15997.00",
        "allowance_total_amount": "0.00",
        "charge_total_amount": "0.00",
        "payable_amount": "15997.00"
    },
    "invoice_lines":
    [{
            "unit_measure_id": 70,
            "invoiced_quantity": "1.00",
            "line_extension_amount": "2660.00",
            "free_of_charge_indicator": false,
            "allowance_charges":
            [{
                    "charge_indicator": false,
                    "allowance_charge_reason": "Descuento por pronto pago",
                    "amount": "140.00",
                    "base_amount": "2800.00"
                }
            ],
            "description": "DSE EL680 PRUEBA SOPORTE PALMETTO",
            "code": "51251001",
            "type_item_identification_id": 4,
            "price_amount": "2800.00",
            "base_quantity": "1",
            "type_generation_transmition_id": 1,
            "start_date": "2023-08-09"
        }, {
            "unit_measure_id": 70,
            "invoiced_quantity": "1.00",
            "line_extension_amount": "5158.00",
            "free_of_charge_indicator": false,
            "allowance_charges":
            [{
                    "charge_indicator": false,
                    "allowance_charge_reason": "Descuento por pronto pago",
                    "amount": "272.00",
                    "base_amount": "5430.00"
                }
            ],
            "description": "DSE EL680 PRUEBA SOPORTE PALMETTO",
            "code": "51251001",
            "type_item_identification_id": 4,
            "price_amount": "5430.00",
            "base_quantity": "1",
            "type_generation_transmition_id": 1,
            "start_date": "2023-08-09"
        }, {
            "unit_measure_id": 70,
            "invoiced_quantity": "1.00",
            "line_extension_amount": "8179.00",
            "free_of_charge_indicator": false,
            "allowance_charges":
            [{
                    "charge_indicator": false,
                    "allowance_charge_reason": "Descuento por pronto pago",
                    "amount": "431.00",
                    "base_amount": "8610.00"
                }
            ],
            "description": "DSE EL680 PRUEBA SOPORTE PALMETTO",
            "code": "51251001",
            "type_item_identification_id": 4,
            "price_amount": "8610.00",
            "base_quantity": "1",
            "type_generation_transmition_id": 1,
            "start_date": "2023-08-09"
        }
    ]
}
```

---

### Documento soporte a proveedor extranjero (no residente)

`POST http://apidian2023.oo/api/ubl2.1/support-document`

PRIMER ENVIO DE DOCUMENTO SOPORTE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

#### Tipos de identificación del vendedor permitidos

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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 5,
	"type_document_id": 11,
	"date": "2022-08-22",
	"time": "12:09:38",
	"notes": "SIN OBSERVACIONES",
	"foot_note": "Modalidad de Emision de Facturas Electronicas: SOFTWARE PROPIO - Fabricante Software: TORRE SOFTWARE - Nit: 89008003-2",
	"sendmail": true,
	"sendmailtome": true,
	"resolution_number": "18764031884389",
	"prefix": "DS",
    "establishment_name": "ALEXANDER OBANDO LONDOÑO",	
    "type_operation_id": 24,
	"seller": {
		"identification_number": "899212809099911",
        "dv": "0",
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
		"type_regime_id": 2,
        "postal_zone_code": "630001"
	},
	"payment_form": {
		"payment_form_id": 2,
		"payment_method_id": 10,
		"payment_due_date": "2022-09-12",
		"duration_measure": "30"
	},	
	"allowance_charges": [
		{
			"discount_id": 10,
			"charge_indicator": false,
			"allowance_charge_reason": "DESCUENTO GENERAL",
			"amount": "0.00",
			"base_amount": "200.00"
		}
	],
	"legal_monetary_totals": {
		"line_extension_amount": "200.00",
		"tax_exclusive_amount": "200.00",
		"tax_inclusive_amount": "200.00",
		"allowance_total_amount": "0.00",
		"charge_total_amount": "0.00",
		"payable_amount": "200.00"
	},
	"tax_totals": 
	[

		{
			"tax_id": 1,
			"tax_amount": "0.00",
			"percent": "0",
			"taxable_amount": "200.00"
		}
	
	],
	"invoice_lines": 
	[

		{
			"unit_measure_id": 70,
			"invoiced_quantity": "2.00",
			"line_extension_amount": "200.00",
			"free_of_charge_indicator": false,
			"allowance_charges": [{
					"charge_indicator": false,
					"allowance_charge_reason": "DESCUENTO GENERAL",
					"amount": "0.00",
					"base_amount": "200.00"
				}
			],
			"tax_totals": 
			[{
				"tax_id": 1,
				"tax_amount": "0.00",
				"percent": "0.00",
				"taxable_amount": "200.00"
			}],
			"description": "ARTICULO DE PRUEBAS",
            "notes": "",
			"code": "PRUEBA",
			"type_item_identification_id": 4,
			"price_amount": "100.00",
			"base_quantity": "2.00",
		    "type_generation_transmition_id": 1,
			"start_date": "2022-08-22"
		}

	]
}
```

---

### Nota de ajuste de documento soporte

`POST http://apidian2023.oo/api/ubl2.1/sd-credit-note`

PRIMER ENVIO DE NOTA DE AJUSTE DE DOCUMENTO SOPORTE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/sd-credit-note>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

#### Tipos de identificación del vendedor permitidos

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
		"number": "DS8",
		"uuid": "1b991cbf678826d3f58b0814a824d46e8332635298f288b1d2ac978835692c53dd2479a9e128a0131c8665f3afeb3c5d",
		"issue_date": "2022-09-01"
	},
	"discrepancyresponsecode": 2,
	"discrepancyresponsedescription": "PRUEBA DE MOTIVO NOTA CREDITO",
    "notes": "PRUEBA DE NOTA CREDITO",
    "prefix": "NDS",
	"number": 5,
	"type_document_id": 13,
	"date": "2022-09-01",
	"time": "06:00:13",
    "establishment_name": "TORRE SOFTWARE",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "sendmail": true,
    "sendmailtome": true,
    "seze": "2021-2017",
    "head_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
	"seller": {
		"identification_number": "41946692",
        "dv": "6",
		"name": "ELIZABETH CARDONA VILLADA",
		"phone": "3226563672",
		"address": "LIMONAR MZ 6 CS 3 ET 1 PISO 2",
		"email": "elizabethcardonav@gmail.com",
		"merchant_registration": "0000-00",
        "postal_zone_code": 630001,
		"type_document_identification_id": 6,
		"type_organization_id": 2,
		"municipality_id": 820,
		"type_liability_id": 117,
		"type_regime_id": 1
	},
  	"tax_totals": [{
		"tax_id": 1,
		"tax_amount": "0.00",
		"taxable_amount": "200.00",
		"percent": "0.00"
	}],
    "allowance_charges": [{
        "discount_id": 1,
        "charge_indicator": false,
        "allowance_charge_reason": "DESCUENTO GENERAL",
        "amount": "0.00",
        "base_amount": "200.00"
    }],
    "legal_monetary_totals": {
        "line_extension_amount": "200.00",
        "tax_exclusive_amount": "200.00",
        "tax_inclusive_amount": "200.00",
        "allowance_total_amount": "0.00",
        "charge_total_amount": "0.00",
        "payable_amount": "200.00"
    },
	"credit_note_lines": [{
        "unit_measure_id": 70,
        "invoiced_quantity": "1",
        "line_extension_amount": "200.00",
        "free_of_charge_indicator": false,
        "allowance_charges": [{
            "charge_indicator": false,
            "allowance_charge_reason": "DESCUENTO GENERAL",
            "amount": "0.00",
            "base_amount": "200.00"
        }],
    	"tax_totals": [{
			"tax_id": 1,
			"tax_amount": "0.00",
			"taxable_amount": "200.00",
			"percent": "0.00"
		}],
        "description": "COMISION POR SERVICIOS",
        "code": "COMISION",
		"brandname": "FULLFIT",
    	"modelname": "1088",
        "type_item_identification_id": 4,
        "price_amount": "200.00",
        "base_quantity": "1"
    }]
}
```

---

### Documento soporte con impuesto

`POST http://facturalatam-apidian.oo/api/ubl2.1/support-document`

ENVIO DE DOCUMENTO SOPORTE CON IMPUESTO

* Aplica la misma documentacion que el PRIMER ENVIO DE DOCUMENTO SOPORTE de esta misma carpeta.
* Utilice este ejemplo cuando la compra al proveedor no responsable de IVA lleve impuestos: los tax\_totals van en cada linea y acumulados en los totales del documento.

**Headers**

| Header | Valor |
|---|---|
| `Accept` | `application/json` |
| `Content-Type` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 984100001,
	"type_document_id": 11,
	"date": "2025-01-30",
	"time": "12:09:38",
	"notes": "SIN OBSERVACIONES",
	"sendmail": false,
	"sendmailtome": false,
	"resolution_number": "18760000001",
	"prefix": "SEDS",
    "establishment_name": "ALEXANDER OBANDO LONDOÑO",	
    "tarifaica": "0",
    "actividadeconomica": "6201",
	"seller": {
		"identification_number": "41946692",
        "dv": "6",
		"name": "ELIZABETH CARDONA VILLADA",
		"phone": "3226563672",
		"address": "LIMONAR MZ 6 CS 3 ET 1 PISO 2",
		"email": "elizabethcardonav@gmail.com",
		"merchant_registration": "0000-00",
        "postal_zone_code": 630001,
		"type_document_identification_id": 3,
		"type_organization_id": 2,
		"municipality_id": 820,
		"type_liability_id": 117,
		"type_regime_id": 1
	},
	"payment_form": {
		"payment_form_id": 1,
		"payment_method_id": 10,
		"payment_due_date": "2025-01-30",
		"duration_measure": "0"
	},
	"legal_monetary_totals": {
		"line_extension_amount": "10.0",
		"tax_exclusive_amount": "10.0",
		"tax_inclusive_amount": "10.5",
		"payable_amount": "10.5"
	},
	"tax_totals": 
	[
		{
			"tax_id": 1,
			"tax_amount": "0.50",
			"percent": "5",
			"taxable_amount": "10.00"
		}
	],
	"invoice_lines": 
	[
		{
			"unit_measure_id": 70,
			"invoiced_quantity": "1.00",
			"line_extension_amount": "10.5",
			"free_of_charge_indicator": false,
			"tax_totals": 
			[{
				"tax_id": 1,
				"tax_amount": "0.50",
				"percent": "5.00",
				"taxable_amount": "10.00"
			}],
			"description": "ARTICULO DE PRUEBAS",
            "notes": "",
			"code": "PRUEBA",
			"type_item_identification_id": 6,
			"price_amount": "10.00",
			"base_quantity": "1.00",
		    "type_generation_transmition_id": 1,
			"start_date": "2025-01-30"
		}
	]
}
```

---

### Documento soporte exento con retencion del 11%

`POST http://facturalatam-apidian.oo/api/ubl2.1/support-document`

ENVIO DE DOCUMENTO SOPORTE CON IMPUESTO EXENTO Y RETENCION DEL 11%

* Aplica la misma documentacion que el PRIMER ENVIO DE DOCUMENTO SOPORTE de esta misma carpeta.
* Las lineas exentas se envian con tax\_id 1, percent en 0 y su taxable\_amount, para que el XML muestre la base exenta de IVA.
* La retencion se envia en el arreglo withholding\_tax\_total con su tax\_id, percent y taxable\_amount; en el documento soporte es el adquiriente quien practica la retencion al proveedor.

**Headers**

| Header | Valor |
|---|---|
| `Authorization` | `Bearer [TOKEN CENSURADO]` |
| `Cache-Control` | `no-cache` |
| `Postman-Token` | `<calculated when request is sent>` |
| `Content-Type` | `application/json` |
| `Content-Length` | `<calculated when request is sent>` |
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
    "date": "2022-01-31",
    "establishment_address": "la idreccion del establecimiento 123",
    "establishment_email": "alexander_obando@hotmail.com",
    "establishment_id": "Establecimiento 123",
    "establishment_municipality_id": 1,
    "establishment_phone": "234234234",
    "invoice_lines": [
        {
            "base_quantity": "1.0",
            "code": "prdctd",
            "description": "[prdctd] Etiqueta Odoo",
            "free_of_charge_indicator": false,
            "invoiced_quantity": "1.0",
            "line_extension_amount": "100.0",
            "price_amount": "100.0",
            "start_date": "2022-01-31",
            "type_generation_transmition_id": 1,
            "type_item_identification_id": 4,
            "unit_measure_id": 70,
            "tax_totals": [
                {
                    "tax_id": 1,
                    "percent": "0",
                    "tax_amount": "0.00",
                    "taxable_amount": "100.00"
                }
            ]
        }
    ],
    "legal_monetary_totals": {
        "line_extension_amount": 100,
        "payable_amount": 100,
        "tax_exclusive_amount": 100,
        "tax_inclusive_amount": 100.0
    },
    "number": "984100002",
    "prefix": "SEDS",
    "resolution_number": "18760000001",
    "seller": {
        "address": "CLL 4 NRO 33-90",
        "dv": 1,
        "email": "alexanderobandolondono@gmail.com",
        "identification_number": 900166483,
        "merchant_registration": "0000000-00",
        "municipality_id": 149,
        "name": "INVERSIONES DAVAL SAS",
        "phone": "3103891693",
        "postal_zone_code": "11001",
        "type_document_identification_id": 6,
        "type_liability_id": 7,
        "type_organization_id": 1,
        "type_regime_id": 1
    },
    "send_customer_credentials": false,
    "sendmail": false,
    "sendmailtome": false,
    "tax_totals": [],
    "time": "14:34:22",
    "type_document_id": 11,
    "with_holding_tax_total": [
        {
            "tax_id": 6,
            "tax_amount": "11",
            "percent": "11",
            "taxable_amount": "100"
        }
    ]
}
```

---

## 📁 Documentos equivalentes

### 📁 POS

#### Documento equivalente POS de una linea

`POST http://facturalatam-apidian.oo/api/ubl2.1/eqdoc`

PRIMER ENVIO DE DOCUMENTO EQUIVALENTE POS

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/eqdoc>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 49,
	"type_document_id": 15,
	"date": "2025-01-17",
	"time": "04:08:12",
    "postal_zone_code": "630003",
	"resolution_number": "18760000001",
	"prefix": "EPOS",
    "notes": "ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA",
	"sendmail": true,
    "sendmailtome": false,
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL PIE DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "software_manufacturer":{
        "name": "ALEXANDER OBANDO LONDONO",
        "business_name": "TORRE SOFTWARE",
        "software_name": "BABEL"
    },
    "buyer_benefits":{
        "code": "89008003",
        "name": "INVERSIONES DAVAL SAS",
        "points": "100"
    },
    "cash_information":{
        "plate_number": "DF-000-12345",
        "location": "HOTEL OVERLOOK RECEPCION",
        "cashier": "JACK TORRANCE",
        "cash_type": "CAJA PRINCIPAL",
        "sales_code": "EPOS1",
        "subtotal": "1000000.00"
    },
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
		"payment_form_id": 1,
		"payment_method_id": 30,
		"payment_due_date": "2025-01-17",
		"duration_measure": "0"
	},	
	"legal_monetary_totals": {
		"line_extension_amount": "840336.134",
		"tax_exclusive_amount": "840336.134",
		"tax_inclusive_amount": "1000000.00",
		"payable_amount": "1000000.00"
	},
	"tax_totals": 
	[
		{
			"tax_id": 1,
			"tax_amount": "159663.865",
			"percent": "19.00",
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

**Respuesta de ejemplo — 99 (200 OK)**

```json
{
    "message": "AttachedDocument #EPOS49 generada con éxito",
    "send_email_success": false,
    "send_email_date_time": false,
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
                        "Created": "2025-01-17T19:23:47.996Z",
                        "Expires": "2025-01-17T19:28:47.996Z"
                    }
                }
            },
            "Body": {
                "SendBillSyncResponse": {
                    "SendBillSyncResult": {
                        "ErrorMessage": {
                            "string": "Regla: 90, Rechazo: Documento procesado anteriormente."
                        },
                        "IsValid": "false",
                        "StatusCode": "99",
                        "StatusDescription": "Validación contiene errores en campos mandatorios.",
                        "StatusMessage": "Documento con errores en campos mandatorios.",
                        "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiIHN0YW5kYWxv…[base64 recortado, 14696 caracteres]",
                        "XmlBytes": {
                            "_attributes": {
                                "nil": "true"
                            }
                        },
                        "XmlDocumentKey": "[CUFE DE EJEMPLO]",
                        "XmlFileName": "pos00890080030002400000153"
                    }
                }
            }
        }
    },
    "invoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 27532 caracteres]",
    "zipinvoicexml": "[CENSURADO]",
    "unsignedinvoicexml": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 18084 caracteres]",
    "reqfe": "PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzb2FwOkVudmVsb3BlIHhtbG5zOnNv…[base64 recortado, 18236 caracteres]",
    "rptafe": "PHM6RW52ZWxvcGUgeG1sbnM6cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMy8w…[base64 recortado, 21636 caracteres]",
    "attacheddocument": "",
    "urlinvoicexml": "POSS-EPOS49.xml",
    "urlinvoicepdf": "POSS-EPOS49.pdf",
    "urlinvoiceattached": ".xml",
    "cufe": "4494da56976fa08696263cee3f20daae68d02078ace8ec566c3431972ca0f082d282d3eaca7ff2850b29f97ea68bab77",
    "QRStr": "https://catalogo-vpfe-hab.dian.gov.co/document/searchqr?documentkey=[CUFE DE EJEMPLO]",
    "certificate_days_left": 408,
    "resolution_days_left": 1828
}
```

---

#### Documento equivalente POS con impuesto al consumo (INC)

`POST http://apidian2024.oo/api/ubl2.1/eqdoc`

PRIMER ENVIO DE DOCUMENTO EQUIVALENTE POS

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/eqdoc>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 46,
	"type_document_id": 15,
	"date": "2024-08-14",
	"time": "04:08:12",
    "postal_zone_code": "630003",
	"resolution_number": "18760000001",
	"prefix": "EPOS",
    "notes": "ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA",
	"sendmail": true,
    "sendmailtome": false,
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL PIE DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "software_manufacturer":{
        "name": "ALEXANDER OBANDO LONDONO",
        "business_name": "TORRE SOFTWARE",
        "software_name": "BABEL"
    },
    "buyer_benefits":{
        "code": "89008003",
        "name": "INVERSIONES DAVAL SAS",
        "points": "100"
    },
    "cash_information":{
        "plate_number": "DF-000-12345",
        "location": "HOTEL OVERLOOK RECEPCION",
        "cashier": "JACK TORRANCE",
        "cash_type": "CAJA PRINCIPAL",
        "sales_code": "EPOS1",
        "subtotal": "1000000.00"
    },
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
		"payment_form_id": 1,
		"payment_method_id": 30,
		"payment_due_date": "2024-08-14",
		"duration_measure": "0"
	},	
	"legal_monetary_totals": {
		"line_extension_amount": "925925.925",
		"tax_exclusive_amount": "925925.925",
		"tax_inclusive_amount": "1000000.00",
		"payable_amount": "1000000.00"
	},
	"tax_totals": [
    	{
			"tax_id": 4,
			"tax_amount": "74074.074",
			"taxable_amount": "925925.925",
			"percent": "8.00"
		}
	],
	"invoice_lines": 
	[
		{
			"unit_measure_id": 70,
			"invoiced_quantity": "1",
			"line_extension_amount": "925925.925",
			"free_of_charge_indicator": false,
			"tax_totals": [
				{
					"tax_id": 4,
					"tax_amount": "74074.074",
					"taxable_amount": "925925.925",
					"percent": "8.00"
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

#### Documento equivalente POS de una linea (variante 2)

`POST http://apidian2024.oo/api/ubl2.1/eqdoc`

PRIMER ENVIO DE DOCUMENTO EQUIVALENTE POS

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/eqdoc>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 503,
	"type_document_id": 15,
	"date": "2024-05-28",
	"time": "04:08:12",
    "postal_zone_code": "630003",
	"resolution_number": "18760000001",
	"prefix": "EPOS",
    "notes": "ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA",
	"sendmail": true,
    "sendmailtome": true,
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL PIE DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "software_manufacturer":{
        "name": "ALEXANDER OBANDO LONDONO",
        "business_name": "TORRE SOFTWARE",
        "software_name": "BABEL"
    },
    "buyer_benefits":{
        "code": "89008003",
        "name": "INVERSIONES DAVAL SAS",
        "points": "100"
    },
    "cash_information":{
        "plate_number": "DF-000-12345",
        "location": "HOTEL OVERLOOK RECEPCION",
        "cashier": "JACK TORRANCE",
        "cash_type": "CAJA PRINCIPAL",
        "sales_code": "EPOS1",
        "subtotal": "1000000.00"
    },
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
		"payment_form_id": 1,
		"payment_method_id": 30,
		"payment_due_date": "2024-05-28",
		"duration_measure": "0"
	},	
	"legal_monetary_totals": {
		"line_extension_amount": "840336.134",
		"tax_exclusive_amount": "840336.134",
		"tax_inclusive_amount": "1000000.00",
		"payable_amount": "1000000.00"
	},
	"tax_totals": 
	[
		{
			"tax_id": 1,
			"tax_amount": "159663.865",
			"percent": "19.00",
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

#### Documento equivalente POS con impuesto a las bolsas

`POST http://apidian2024.oo/api/ubl2.1/eqdoc`

ENVIO DE DOCUMENTO EQUIVALENTE POS CON IMPUESTO A LA BOLSA

* Aplica la misma documentacion que el PRIMER ENVIO DE DOCUMENTO EQUIVALENTE POS de esta misma carpeta.
* Utilice este ejemplo cuando requiera incluir en el XML del documento equivalente POS el impuesto a la bolsa o INCBP.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 40,
	"type_document_id": 15,
	"date": "2024-07-02",
	"time": "04:08:12",
    "postal_zone_code": "630003",
	"resolution_number": "18760000001",
	"prefix": "EPOS",
    "notes": "ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA",
	"sendmail": true,
    "sendmailtome": true,
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL PIE DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "software_manufacturer":{
        "name": "ALEXANDER OBANDO LONDONO",
        "business_name": "TORRE SOFTWARE",
        "software_name": "BABEL"
    },
    "buyer_benefits":{
        "code": "89008003",
        "name": "INVERSIONES DAVAL SAS",
        "points": "100"
    },
    "cash_information":{
        "plate_number": "DF-000-12345",
        "location": "HOTEL OVERLOOK RECEPCION",
        "cashier": "JACK TORRANCE",
        "cash_type": "CAJA PRINCIPAL",
        "sales_code": "EPOS1",
        "subtotal": "1000000.00"
    },
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
		"payment_form_id": 1,
		"payment_method_id": 30,
		"payment_due_date": "2024-07-02",
		"duration_measure": "0"
	},	
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

### 📁 Transporte terrestre

#### Tiquete de transporte terrestre de pasajeros

`POST http://apidian2024.oo/api/ubl2.1/eqdoc`

PRIMER ENVIO DE DOCUMENTO EQUIVALENTE - TIQUETE DE TRANSPORTE TERRESTRE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/eqdoc>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Todos los documentos equivalentes se envian a este mismo endpoint; el tipo lo define el campo type\_document\_id. En este ejemplo es el 19, Tiquete de transporte de pasajeros Terrestre.
* Requiere el software de documentos equivalentes (Paso 1 de la seccion 01E) y la resolucion de transporte terrestre (Paso 3 de la misma seccion).
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 6,
	"type_document_id": 19,
	"date": "2024-04-23",
	"time": "04:08:12",
	"resolution_number": "DETP",
	"prefix": "DETP",
    "notes": "ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA",
	"sendmail": true,
    "sendmailtome": true,
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL PIE DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "software_manufacturer":{
        "name": "ALEXANDER OBANDO LONDONO",
        "business_name": "TORRE SOFTWARE",
        "software_name": "BABEL"
    },
    "transportation_information":{
        "transport_mode": "Terreste",
        "plate_number": "DKL990",
        "transport_mean": "TAXI COLECTIVO",
        "origin_place": "ARMENIA",
        "destination_place": "PEREIRA"
    },
	"customer": {
		"identification_number": 89008003,
		"dv": 2,
		"name": "ALEXANDER OBANDO LONDONO",
		"phone": "3103891693",
		"address": "CLL 4 NRO 33-90",
		"email": "alexanderobandolondono@gmail.com",
		"merchant_registration": "0000000-00",
		"type_document_identification_id": 3,
		"type_organization_id": 2,
        "type_liability_id": 117,
		"municipality_id": 822,
		"type_regime_id": 2
	},
	"payment_form": {
		"payment_form_id": 1,
		"payment_method_id": 30,
		"payment_due_date": "2024-04-23",
		"duration_measure": "0"
	},	
	"legal_monetary_totals": {
		"line_extension_amount": "8403.36134",
		"tax_exclusive_amount": "8403.36134",
		"tax_inclusive_amount": "10000.00",
		"payable_amount": "10000.00"
	},
	"tax_totals": 
	[
		{
			"tax_id": 1,
			"tax_amount": "1596.63865",
			"percent": "19.00",
			"taxable_amount": "8403.36134"
		}
	],
	"invoice_lines": 
	[
		{
			"unit_measure_id": 70,
			"invoiced_quantity": "1",
			"line_extension_amount": "8403.36134",
			"free_of_charge_indicator": false,
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "1596.63865",
					"taxable_amount": "8403.36134",
					"percent": "19.00"
				}
			],
			"description": "TIQUETE TRANSPORTE COLECTIVO RUTA ARMENIA PEREIRA",
            "notes": "ESTA ES UNA PRUEBA DE NOTA DE DETALLE DE LINEA.",
			"code": "TTR-ARM-PER",
			"type_item_identification_id": 4,
			"price_amount": "8403.36134",
			"base_quantity": "1"
		}
	]
}
```

---

### 📁 Boleta de ingreso a cine

#### Boleta de ingreso a cine

`POST http://apidian2024.oo/api/ubl2.1/eqdoc/ae2a998a-6ab9-48f2-8cac-89b6f3f0c424`

PRIMER ENVIO DE DOCUMENTO EQUIVALENTE - BOLETA DE INGRESO A CINE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/eqdoc>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Todos los documentos equivalentes se envian a este mismo endpoint; el tipo lo define el campo type\_document\_id. En este ejemplo es el 16, Boleta de ingreso a cine.
* Requiere el software de documentos equivalentes (Paso 1 de la seccion 01E) y la resolucion de boleta de ingreso a cine (Paso 4 de la misma seccion).
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 2,
	"type_document_id": 16,
	"date": "2024-08-22",
	"time": "04:08:12",
	"resolution_number": "CIN",
	"prefix": "CIN",
    "notes": "ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA",
	"sendmail": true,
    "sendmailtome": true,
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL PIE DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "software_manufacturer":{
        "name": "ALEXANDER OBANDO LONDONO",
        "business_name": "TORRE SOFTWARE",
        "software_name": "BABEL"
    },
    "show_room_information":{
        "show_room_name": "CINEMARK UNICENTRO",
        "address": "CC UNICENTRO PISO 3",
        "exhibition_room": "SALA 6",
        "total_chairs": "200",
        "name_function": "DEADPOOL Y WOLVERINE",
        "select_location": "G15",
        "date_function": "2024-08-22",
        "time_function": "16:30:00"
    },
	"customer": {
		"identification_number": 89008003,
		"dv": 2,
		"name": "ALEXANDER OBANDO LONDONO",
		"phone": "3103891693",
		"address": "CLL 4 NRO 33-90",
		"email": "alexanderobandolondono@gmail.com",
		"merchant_registration": "0000000-00",
		"type_document_identification_id": 3,
		"type_organization_id": 2,
        "type_liability_id": 117,
		"municipality_id": 822,
		"type_regime_id": 2
	},
	"payment_form": {
		"payment_form_id": 1,
		"payment_method_id": 30,
		"payment_due_date": "2024-08-22",
		"duration_measure": "0"
	},	
	"legal_monetary_totals": {
		"line_extension_amount": "8403.36134",
		"tax_exclusive_amount": "8403.36134",
		"tax_inclusive_amount": "10000.00",
		"allowance_total_amount": "0.00",
		"payable_amount": "10000.00"
	},
	"tax_totals": 
	[
		{
			"tax_id": 1,
			"tax_amount": "1596.63865",
			"percent": "19.00",
			"taxable_amount": "8403.36134"
		}
	],
	"invoice_lines": 
	[
		{
			"unit_measure_id": 70,
			"invoiced_quantity": "1",
			"line_extension_amount": "8403.36134",
			"free_of_charge_indicator": false,
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "1596.63865",
					"taxable_amount": "8403.36134",
					"percent": "19.00"
				}
			],
			"description": "BOLETA DE ENTRADA A CINE FUNCION 3 PM",
            "notes": "ESTA ES UNA PRUEBA DE NOTA DE DETALLE DE LINEA.",
			"code": "BOL3PM",
			"type_item_identification_id": 4,
			"price_amount": "8403.36134",
			"base_quantity": "1"
		}
	]
}
```

---

### 📁 Servicios publicos domiciliarios

#### Servicios publicos con servicio y complementos

`POST http://apidian2024.oo/api/ubl2.1/eqdoc`

PRIMER ENVIO DE DOCUMENTO EQUIVALENTE - SERVICIOS PUBLICOS

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/eqdoc>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Todos los documentos equivalentes se envian a este mismo endpoint; el tipo lo define el campo type\_document\_id. En este ejemplo es el 24, Documento Expedido para los Servicios Publicos y Domiciliarios.
* Requiere el software de documentos equivalentes (Paso 1 de la seccion 01E) y la resolucion de servicios publicos (Paso 4 de la misma seccion).
* Este ejemplo incluye el servicio principal y sus conceptos complementarios como lineas adicionales del mismo documento.
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 1,
	"type_document_id": 24,
    "type_operation_id": 28,
	"date": "2024-07-10",
	"time": "04:08:12",
	"resolution_number": "SPD",
	"prefix": "SPD",
    "notes": "ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA",
	"sendmail": true,
    "sendmailtome": true,
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL PIE DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "last_valid_payment_date": "2024-05-31",
    "payment_reference": "190242200835880000-107-010787002",
    "stratum_id": 3,
    "software_manufacturer":{
        "name": "ALEXANDER OBANDO LONDONO",
        "business_name": "TORRE SOFTWARE",
        "software_name": "BABEL"
    },
    "spd": 
    [
        {
            "agency_information": {
                "type_spd_id": 1,
                "office_lending_company": "OFICINA DE RECAUDO EFIGAS SA ESP",
                "contract_number": "ABC-000001",
                "issue_date": "2020-01",
                "note": "Esta es una nota de ejemplo."
            },
            "subscriber_party": {
                "party_name": "ALEXANDER OBANDO LONDONO",
                "street_name": "CLL 11 NRO 21-73",
                "additional_street_name": "BRR LA CABAÑA, PISO 2, HOTEL OVERLOOK",
                "municipality_id": 822,
                "stratum": "3-Residencial",
                "email": "alexanderobandolondono@gmail.com"
            },
            "subscriber_consumption": {
                "duration_of_the_billing_cycle": "1.00",
                "consumption_section_note": "Esta es una nota de seccion de consumo de ejemplo",
                "total_metered_unit_id": 864,
                "total_metered_quantity": "15.00",
                "consumption_payable_amount": "30000.00",
                "consumption_price_quantity": "15.00",
                "partial_line_extension_amount": "90000.00",
                "cargos_debito_al_item":
                [
                    {
                        "charge_reason": "Alumbrado Publico",
                        "amount": "4100"
                    },
                    {
                        "charge_reason": "XYZ",
                        "amount": "2000"
                    }
                ],
                "unstructured_price": {
                    "price_amount": "1960.10",
                    "base_quantity": "1.00"
                },
                "consumption_history": 
                [
                    {
                        "total_invoiced_quantity": "24.00",
                        "start_date": "2024-01-01",
                        "end_date": "2024-01-31",
                        "duration_measure": "31"
                    },
                    {
                        "total_invoiced_quantity": "20.00",
                        "start_date": "2024-02-01",
                        "end_date": "2024-02-28",
                        "duration_measure": "29"
                    },
                    {
                        "total_invoiced_quantity": "21.00",
                        "start_date": "2024-03-01",
                        "end_date": "2024-03-31",
                        "duration_measure": "31"
                    }
                ]
            }
        },
        {
            "agency_information": {
                "type_spd_id": 8,
                "office_lending_company": "EFIGAS S.A. E.S.P",
                "contract_number": "XYZ-000002",
                "issue_date": "2024-01",
                "note": "Esta es una nota de ejemplo."
            },
            "subscriber_party": {
                "party_name": "ALEXANDER OBANDO LONDONO",
                "street_name": "CLL 11 NRO 21-73",
                "additional_street_name": "BRR LA CABAÑA, PISO 2, HOTEL OVERLOOK",
                "municipality_id": 822,
                "stratum": "3-Residencial",
                "email": "alexanderobandolondono@gmail.com"
            },
            "subscriber_consumption": {
                "duration_of_the_billing_cycle": "1.00",
                "consumption_section_note": "Esta es una nota de seccion de consumo de ejemplo",
                "total_metered_unit_id": 864,
                "total_metered_quantity": "15.00",
                "consumption_payable_amount": "30000.00",
                "consumption_price_quantity": "15.00",
                "partial_line_extension_amount": "90000.00",
                "descuentos_credito_al_item":
                [
                    {
                        "allowance_reason": "Subsidio Alumbrado Publico",
                        "amount": "4100"
                    },
                    {
                        "allowance_reason": "Subsidio XYZ",
                        "amount": "2000"
                    }
                ],
                "unstructured_price": {
                    "price_amount": "2000.10",
                    "base_quantity": "1.00"
                },
                "utiliy_meter": {
                    "meter_number": "Tech_sirius_2016637401-7",
                    "previous_meter_reading_date": "2024-03-27",
                    "previous_meter_quantity": "1.360",
                    "latest_meter_reading_date": "2024-04-27",
                    "latest_meter_quantity": "1.382",
                    "meter_reading_method": "Directa al contador",
                    "duration_measure": "31"
                },
                "consumption_history": 
                [
                    {
                        "total_invoiced_quantity": "24.00",
                        "start_date": "2024-01-01",
                        "end_date": "2024-01-31",
                        "duration_measure": "31"
                    },
                    {
                        "total_invoiced_quantity": "20.00",
                        "start_date": "2024-02-01",
                        "end_date": "2024-02-28",
                        "duration_measure": "29"
                    },
                    {
                        "total_invoiced_quantity": "21.00",
                        "start_date": "2024-03-01",
                        "end_date": "2024-03-31",
                        "duration_measure": "31"
                    }
                ],
                "payment_agreements": 
                [
                    {
                        "contract_number": "IX900-abc-001",
                        "good_service_name": "Tuberias",
                        "description": "Instalacion de tuberias sin IVA",
                        "fees_to_pay": "36",
                        "paid_fees": "31",
                        "interest_rate": "0.77",
                        "balance_to_pay": "250000.00",
                        "transaction_description": "Cuota 32",
                        "fee_value_to_pay": "50000.00",
                        "item_credit_discount": "0.00",
                        "item_debit_charge": "0.00"
                    },
                    {
                        "contract_number": "IX900-abc-002",
                        "good_service_name": "Revision",
                        "description": "Revision anual de la instalacion",
                        "fees_to_pay": "36",
                        "paid_fees": "11",
                        "interest_rate": "0.77",
                        "balance_to_pay": "1250000.00",
                        "transaction_description": "Cuota 12",
                        "fee_value_to_pay": "55000.00",
                        "item_credit_discount": "0.00",
                        "item_debit_charge": "0.00"
                    }
                ]
            }
        }
    ],
	"customer": {
		"identification_number": 89008003,
		"dv": 2,
		"name": "ALEXANDER OBANDO LONDONO",
		"phone": "3103891693",
		"address": "CLL 4 NRO 33-90",
		"email": "alexanderobandolondono@gmail.com",
		"merchant_registration": "0000000-00",
		"type_document_identification_id": 3,
		"type_organization_id": 2,
        "type_liability_id": 117,
		"municipality_id": 820,
		"type_regime_id": 2
	},
	"payment_form": {
		"payment_form_id": 1,
		"payment_method_id": 30,
		"payment_due_date": "2024-07-10",
		"duration_measure": "0"
	},	
	"allowance_charges": [
		{
			"discount_id": 1,
			"charge_indicator": true,
			"allowance_charge_reason": "Acuerdo de Pago",
			"amount": "700.00",
			"base_amount": "10000.00"
		}
	],
	"legal_monetary_totals": {
		"line_extension_amount": "8403.36134",
		"tax_exclusive_amount": "8403.36134",
		"tax_inclusive_amount": "10000.00",
        "allowance_total_amount": "0.00",
        "charge_total_amount": "700.00",
		"payable_amount": "10700.00"
	},
	"tax_totals": 
	[
		{
			"tax_id": 1,
			"tax_amount": "1596.63865",
			"percent": "19.00",
			"taxable_amount": "8403.36134"
		}
	],
	"invoice_lines": 
	[
		{
			"unit_measure_id": 70,
			"invoiced_quantity": "1",
			"line_extension_amount": "8403.36134",
			"free_of_charge_indicator": false,
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "1596.63865",
					"taxable_amount": "8403.36134",
					"percent": "19.00"
				}
			],
			"description": "CONSUMO DE GAS",
            "seller_code": "0001",
			"code": "SPD-GAS",
			"type_item_identification_id": 4,
			"price_amount": "8403.36134",
			"base_quantity": "1"
		}
	]
}
```

---

#### Servicios publicos solo con el servicio

`POST http://apidian2024.oo/api/ubl2.1/eqdoc`

PRIMER ENVIO DE DOCUMENTO EQUIVALENTE - SERVICIOS PUBLICOS

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/eqdoc>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Todos los documentos equivalentes se envian a este mismo endpoint; el tipo lo define el campo type\_document\_id. En este ejemplo es el 24, Documento Expedido para los Servicios Publicos y Domiciliarios.
* Requiere el software de documentos equivalentes (Paso 1 de la seccion 01E) y la resolucion de servicios publicos (Paso 4 de la misma seccion).
* Este ejemplo cobra unicamente el servicio, sin conceptos complementarios.
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

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 1,
	"type_document_id": 24,
    "type_operation_id": 28,
	"date": "2024-07-11",
	"time": "04:08:12",
	"resolution_number": "SPD",
	"prefix": "SPD",
    "notes": "ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA",
	"sendmail": true,
    "sendmailtome": true,
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL PIE DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "last_valid_payment_date": "2024-05-31",
    "payment_reference": "190242200835880000-107-010787002",
    "stratum_id": 3,
    "software_manufacturer":{
        "name": "ALEXANDER OBANDO LONDONO",
        "business_name": "TORRE SOFTWARE",
        "software_name": "BABEL"
    },
    "spd": 
    [
        {
            "agency_information": {
                "type_spd_id": 8,
                "office_lending_company": "EFIGAS S.A. E.S.P",
                "contract_number": "XYZ-000002",
                "issue_date": "2024-01",
                "note": "Esta es una nota de ejemplo."
            },
            "subscriber_party": {
                "party_name": "ALEXANDER OBANDO LONDONO",
                "street_name": "CLL 11 NRO 21-73",
                "additional_street_name": "BRR LA CABAÑA, PISO 2, HOTEL OVERLOOK",
                "municipality_id": 822,
                "stratum": "3-Residencial",
                "email": "alexanderobandolondono@gmail.com"
            },
            "subscriber_consumption": {
                "duration_of_the_billing_cycle": "1.00",
                "consumption_section_note": "Esta es una nota de seccion de consumo de ejemplo",
                "total_metered_unit_id": 864,
                "total_metered_quantity": "15.00",
                "consumption_payable_amount": "30000.00",
                "consumption_price_quantity": "15.00",
                "partial_line_extension_amount": "90000.00",
                "descuentos_credito_al_item":
                [
                    {
                        "allowance_reason": "Subsidio Alumbrado Publico",
                        "amount": "4100"
                    },
                    {
                        "allowance_reason": "Subsidio XYZ",
                        "amount": "2000"
                    }
                ],
                "cargos_debito_al_item":
                [
                    {
                        "charge_reason": "Alumbrado Publico",
                        "amount": "4100"
                    },
                    {
                        "charge_reason": "XYZ",
                        "amount": "2000"
                    }
                ],
                "unstructured_price": {
                    "price_amount": "2000.10",
                    "base_quantity": "1.00"
                },
                "utiliy_meter": {
                    "meter_number": "Tech_sirius_2016637401-7",
                    "previous_meter_reading_date": "2024-03-27",
                    "previous_meter_quantity": "1.360",
                    "latest_meter_reading_date": "2024-04-27",
                    "latest_meter_quantity": "1.382",
                    "meter_reading_method": "Directa al contador",
                    "duration_measure": "31"
                },
                "consumption_history": 
                [
                    {
                        "total_invoiced_quantity": "24.00",
                        "start_date": "2024-01-01",
                        "end_date": "2024-01-31",
                        "duration_measure": "31"
                    },
                    {
                        "total_invoiced_quantity": "20.00",
                        "start_date": "2024-02-01",
                        "end_date": "2024-02-28",
                        "duration_measure": "29"
                    },
                    {
                        "total_invoiced_quantity": "21.00",
                        "start_date": "2024-03-01",
                        "end_date": "2024-03-31",
                        "duration_measure": "31"
                    }
                ],
                "payment_agreements": 
                [
                    {
                        "contract_number": "IX900-abc-001",
                        "good_service_name": "Tuberias",
                        "description": "Instalacion de tuberias sin IVA",
                        "fees_to_pay": "36",
                        "paid_fees": "31",
                        "interest_rate": "0.77",
                        "balance_to_pay": "250000.00",
                        "transaction_description": "Cuota 32",
                        "fee_value_to_pay": "50000.00",
                        "item_credit_discount": "0.00",
                        "item_debit_charge": "0.00"
                    },
                    {
                        "contract_number": "IX900-abc-002",
                        "good_service_name": "Revision",
                        "description": "Revision anual de la instalacion",
                        "fees_to_pay": "36",
                        "paid_fees": "11",
                        "interest_rate": "0.77",
                        "balance_to_pay": "1250000.00",
                        "transaction_description": "Cuota 12",
                        "fee_value_to_pay": "55000.00",
                        "item_credit_discount": "0.00",
                        "item_debit_charge": "0.00"
                    }
                ]
            }
        }
    ],
	"customer": {
		"identification_number": 89008003,
		"dv": 2,
		"name": "ALEXANDER OBANDO LONDONO",
		"phone": "3103891693",
		"address": "CLL 4 NRO 33-90",
		"email": "alexanderobandolondono@gmail.com",
		"merchant_registration": "0000000-00",
		"type_document_identification_id": 3,
		"type_organization_id": 2,
        "type_liability_id": 117,
		"municipality_id": 820,
		"type_regime_id": 2
	},
	"payment_form": {
		"payment_form_id": 1,
		"payment_method_id": 30,
		"payment_due_date": "2024-07-11",
		"duration_measure": "0"
	},	
	"allowance_charges": [
		{
			"discount_id": 1,
			"charge_indicator": true,
			"allowance_charge_reason": "Acuerdo de Pago",
			"amount": "700.00",
			"base_amount": "10000.00"
		}
	],
	"legal_monetary_totals": {
		"line_extension_amount": "8403.36134",
		"tax_exclusive_amount": "8403.36134",
		"tax_inclusive_amount": "10000.00",
        "allowance_total_amount": "0.00",
        "charge_total_amount": "700.00",
		"payable_amount": "10700.00"
	},
	"tax_totals": 
	[
		{
			"tax_id": 1,
			"tax_amount": "1596.63865",
			"percent": "19.00",
			"taxable_amount": "8403.36134"
		}
	],
	"invoice_lines": 
	[
		{
			"unit_measure_id": 70,
			"invoiced_quantity": "1",
			"line_extension_amount": "8403.36134",
			"free_of_charge_indicator": false,
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "1596.63865",
					"taxable_amount": "8403.36134",
					"percent": "19.00"
				}
			],
			"description": "CONSUMO DE GAS",
            "seller_code": "0001",
			"code": "SPD-GAS",
			"type_item_identification_id": 4,
			"price_amount": "8403.36134",
			"base_quantity": "1"
		}
	]
}
```

---

### Nota credito de documento equivalente

`POST http://apidian2024.oo/api/ubl2.1/credit-note`

PRIMER ENVIO DE NOTA CREDITO DE DOCUMENTO EQUIVALENTE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/credit-note>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* La nota credito de un documento equivalente se envia al mismo endpoint de las notas credito de factura, pero con is\_eqdoc en true y el type\_document\_id 26.
* El bloque billing\_reference identifica el documento equivalente que se esta corrigiendo (number, uuid y issue\_date) e incluye su type\_document\_id, por ejemplo 15 para el documento equivalente POS.
* Requiere la resolucion de NC de documentos equivalentes configurada en el Paso 5 de la seccion 01E.
* Este endpoint se puede utilizar de dos modos:

1. Asincrono:
   .../ubl2.1/credit-note/iddelsetdepruebasdeladian
2. Sincrono:
   .../ubl2.1/credit-note

* El modo sincrono no afecta al set de pruebas, pero la respuesta de la DIAN incluye posibles errores de validacion y el estado de la nota credito, valida o no valida.
* El modo asincrono, afecta el set de pruebas y en la respuesta no se incluye el resultado de la nota credito, solo se entrega un ZIP\_KEY el cual debe ser consultado mediante el endpoint:

.../ubl2.1/status/zip

de la seccion 03 - Consultas de estado para asi poder establecer si la nota credito fue valida o no y los errores de validacion.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "is_eqdoc": true,
	"billing_reference": {
		"number": "EPOS21",
		"uuid": "76afafcf1be434e7d9c128cb6f63159a2387067ee10effcd59827e992265f718078276a4d67b4b78d0b37123d268f090",
		"issue_date": "2024-04-13",
        "type_document_id": 15
	},
	"discrepancyresponsecode": 2,
    "notes": "PRUEBA DE NOTA CREDITO A DOCUMENTO EQUIVALENTE POS",
    "prefix": "NCP",
	"number": 2,
	"type_document_id": 26,
	"date": "2024-05-17",
	"time": "06:00:13",
    "establishment_name": "TORRE SOFTWARE",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "sendmail": false,
    "sendmailtome": false,
    "head_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
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
	"tax_totals": [
		{
			"tax_id": 1,
			"tax_amount": "15966.386",
			"percent": "19",
			"taxable_amount": "84033.614"
		}
	],
	"legal_monetary_totals": {
		"line_extension_amount": "84033.614",
		"tax_exclusive_amount": "84033.614",
		"tax_inclusive_amount": "100000.00",
		"payable_amount": "100000.00"
	},
	"credit_note_lines": 
	[
		{
			"unit_measure_id": 70,
			"invoiced_quantity": "1",
			"line_extension_amount": "84033.614",
			"free_of_charge_indicator": false,
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount": "15966.386",
					"taxable_amount": "84033.614",
					"percent": "19.00"
				}
			],
			"description": "COMISION POR SERVICIOS",
            "notes": "ESTA ES UNA PRUEBA DE NOTA DE DETALLE DE LINEA.",
			"code": "COMISION",
			"type_item_identification_id": 4,
			"price_amount": "100000.00",
			"base_quantity": "1"
		}
	]
}
```

---

### Nota debito de documento equivalente

`POST http://apidian2024.oo/api/ubl2.1/debit-note/936f14fb-3041-47c9-b194-e9bf81190d10`

PRIMER ENVIO DE NOTA DEBITO DE DOCUMENTO EQUIVALENTE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/debit-note>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* La nota debito de un documento equivalente se envia al mismo endpoint de las notas debito de factura, pero con is\_eqdoc en true y el type\_document\_id 25.
* El bloque billing\_reference identifica el documento equivalente que se esta corrigiendo (number, uuid y issue\_date) e incluye su type\_document\_id, por ejemplo 15 para el documento equivalente POS.
* Requiere la resolucion de ND de documentos equivalentes configurada en el Paso 6 de la seccion 01E.
* Este endpoint se puede utilizar de dos modos:

1. Asincrono:
   .../ubl2.1/debit-note/iddelsetdepruebasdeladian
2. Sincrono:
   .../ubl2.1/debit-note

* El modo sincrono no afecta al set de pruebas, pero la respuesta de la DIAN incluye posibles errores de validacion y el estado de la nota debito, valida o no valida.
* El modo asincrono, afecta el set de pruebas y en la respuesta no se incluye el resultado de la nota debito, solo se entrega un ZIP\_KEY el cual debe ser consultado mediante el endpoint:

.../ubl2.1/status/zip

de la seccion 03 - Consultas de estado para asi poder establecer si la nota debito fue valida o no y los errores de validacion.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "is_eqdoc": true,
	"billing_reference": {
		"number": "EPOS3",
		"uuid": "8d4a55f9396913e1e12a881f802c839eedb8ec1c6791ef86249ea657dfccf977c2570406352dec8279d5818ab85538b7",
		"issue_date": "2024-01-13",
        "type_document_id": 15
	},
	"discrepancyresponsecode": 3,
	"discrepancyresponsedescription": "PRUEBA DE MOTIVO NOTA DEBITO A DOCUMENTO EQUIVALENTE POS",
    "notes": "PRUEBA DE NOTA DEBITO",
    "prefix": "NDP",
	"number": 1,
	"type_document_id": 25,
	"date": "2024-01-17",
	"time": "06:00:13",
    "establishment_name": "TORRE SOFTWARE",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "sendmail": true,
    "sendmailtome": true,
    "seze": "2021-2017",
    "head_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
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
	"allowance_charges": [
		{
			"discount_id": 1,
			"charge_indicator": false,
			"allowance_charge_reason": "DESCUENTO GENERAL",
			"amount": "50000.00",
			"base_amount": "1000000.00"
		}
	],
	"requested_monetary_totals": {
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
	"debit_note_lines": 
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

## 📁 Contingencia tipo 4

### Enviar una factura de contingencia tipo 4

`POST http://apidian2024.oo/api/ubl2.1/invoice-contingency-4`

ENVIO DE FACTURA DE CONTINGENCIA TIPO 4

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice-contingency-4>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Es la contingencia que se utiliza cuando el facturador no tiene conexion con la DIAN: la factura se genera, se firma y se entrega al adquiriente con su CUFE, pero no se envia a la DIAN en el momento.
* Requiere la resolucion de contingencia tipo 4 configurada en el Paso 14 de esta misma carpeta.
* Este endpoint no tiene parametros en la URL y no recibe el id del set de pruebas.
* Los documentos quedan almacenados como pendientes de envio; cuando se restablece la conexion se transmiten con el request Contingencia Tipo 4 - Enviar Pendientes.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"number": 990001130,
	"type_document_id": 12,
	"date": "2024-07-31",
	"time": "04:08:12",
	"resolution_number": "18760000001",
	"prefix": "SETP",
    "notes": "ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA",
    "disable_confirmation_text": true,
    "establishment_name": "TORRE SOFTWARE NRO 1",
    "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
    "establishment_phone": "3226563672",
    "establishment_municipality": 600,
    "establishment_email": "alternate_email@alternate.com",
	"sendmail": false,
    "sendmailtome": false,
    "head_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
    "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL PIE DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
	"customer": {
		"identification_number": 41946692,
		"dv": 6,
		"name": "ELIZABETH CARDONA VILLADA",
		"phone": "3103891693",
		"address": "CLL 4 NRO 33-90",
		"email": "alexander_obando@hotmail.com",
		"merchant_registration": "0000000-00",
		"type_document_identification_id": 3,
		"type_organization_id": 2,
        "type_liability_id": 7,
		"municipality_id": 822,
		"type_regime_id": 1,
        "tax_id": 1
	},
	"payment_form": {
		"payment_form_id": 2,
		"payment_method_id": 30,
		"payment_due_date": "2024-07-31",
		"duration_measure": "0"
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

### Transmitir las facturas de contingencia pendientes

`POST http://apidian2024.oo/api/ubl2.1/invoice-contingency-4/send_pendings`

ENVIO DE LAS FACTURAS PENDIENTES DE CONTINGENCIA TIPO 4

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/invoice-contingency-4/send_pendings>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Transmite a la DIAN las facturas de contingencia tipo 4 que quedaron pendientes de envio, una vez restablecida la conexion.
* Sin parametros en la URL envia todas las pendientes. Tambien acepta dos parametros opcionales para transmitir una sola:

.../ubl2.1/invoice-contingency-4/send\_pendings/prefijo/numero

* La respuesta devuelve un ZIP\_KEY por cada documento transmitido, que debe ser consultado mediante el endpoint:

.../ubl2.1/status/zip

de la seccion 03 - Consultas de estado.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

---

### Crear la resolucion de contingencia tipo 4

`PUT http://apidian2024.oo/api/ubl2.1/config/resolution`

CONFIGURAR RESOLUCION DE CONTINGENCIA TIPO 4

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/resolution>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Este endpoint no tiene parametros en la URL.
* Se utiliza la misma URL de la resolucion de facturas; lo que define a cual numeracion corresponde es el campo type\_document\_id, que para la factura de contingencia tipo 4 es el 12 (Factura electronica de Venta - tipo 04).
* Es la numeracion que se consume cuando no hay conexion con la DIAN, por lo que debe tener su propio prefix y un rango distinto al de la facturacion normal.
* El campo technical\_key corresponde a la clave tecnica de la resolucion, en habilitacion siempre es el mismo dato: fc8eac422eba16e22ffd8c6f94b3f40a6e38162c, pero en produccion esta llave tecnica se debe consultar con el endpoint getnumberingrange de la seccion 06 - Paso a Produccion.
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
	"type_document_id": 12,
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
