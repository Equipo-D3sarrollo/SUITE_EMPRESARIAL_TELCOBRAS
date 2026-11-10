# 12 - API RIPS

> Fuente: colección Postman pública «FacturaLatam ApiDianV2.1» (<https://documenter.getpostman.com/view/50442293/2sBYHUSfRJ>), descargada el 10-nov-2026. Tokens y secretos censurados; base64 largos recortados.

Servicios que conectan con apirips-docker (API externa)

#### Requisitos

* URL de apirips-docker (API externa que debe ser desplegada si no posee una URL)
* credenciales de usuario de sector salud
* Nit de empresa

#### Manuales

* Habilitacion: <https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/OT/manual-usuario-cliente-servidor-fev-rips.pdf>
* Producción: <https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/OT/manual-consumo-api-docker-fev-rips.pdf>

> es posible que cambien constantemente debido a las actualizaciones de versiones por lo que puede ir a la pagina principal de sispro <https://www.sispro.gov.co/central-financiamiento/Pages/facturacion-electronica.aspx>

## 📁 Estado del servicio

Listado de servicios que muestran detalles de la versión instalada de apirips-docker

### Consultar la version del API RIPS

`GET https://apirips.facturapro.co/BasicHealth`

Muestra los datos de la version actual del apirips-docker

**Autenticación:** `noauth`

**Respuesta de ejemplo — 200 (200 OK)**

```json
ApplicationName: FVE.WebAPILocal
Version: 5.4.1.0
EnvironmentName: DockerStage
DateTime: 2025-05-19 02:42:19.304 PM
TimeZone: Coordinated Universal Time
```

---

## 📁 Autenticacion

Servicios de acceso y obtención de token para el consumo de apirps-docker

### Obtener el token del API RIPS

`POST https://apirips.facturapro.co/api/auth/LoginSISPRO`

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

**Autenticación:** `noauth`

**Body**

```json
{
    "persona": {
        "identificacion": {
            "tipo": "CC",
            "numero": "16602426"
        }
    },
    "clave": "[CENSURADO]",
    "nit": "901355357"
}
```

**Respuesta de ejemplo — aceptado (200 OK)**

```json
{
    "token": "[CENSURADO]",
    "login": true,
    "registrado": true,
    "errors": null
}
```

**Respuesta de ejemplo — error de validación (200 OK)**

```json
{
    "token": null,
    "login": false,
    "registrado": false,
    "errors": [
        "Sus Credenciales de Usuario no son validas"
    ]
}
```

---

## 📁 Envio de RIPS y consulta de CUV

Listado de servicios que reciben RIPS en sus diferentes formatos

### RIPS sin factura

`POST https://apirips.facturapro.co/api/PaquetesFevRips/CargarRipsSinFactura`

RIPS sin factura

* el json es similar a un RIPS con factura pero el acmpo "xmlFevFile" debe quedar **null**
* debe utilizar RS en el campo TipoNota haciendo referencia al documento no electrónico y su numeración (numNota)

**Autenticación:** `bearer`

**Body**

```json
{
    "rips": {
        "numDocumentoIdObligado": "901355357",
        "numFactura": null,
        "tipoNota": "RS",
        "numNota": "1",
        "usuarios": [
            {
                "tipoDocumentoIdentificacion": "CC",
                "numDocumentoIdentificacion": "1127606374",
                "tipoUsuario": "12",
                "fechaNacimiento": "1988-07-07",
                "codSexo": "M",
                "codPaisResidencia": "170",
                "codMunicipioResidencia": "76001",
                "codZonaTerritorialResidencia": "01",
                "incapacidad": "NO",
                "codPaisOrigen": "170",
                "consecutivo": 1,
                "servicios": {
                    "consultas": [
                        {
                            "codPrestador": "760011269401",
                            "fechaInicioAtencion": "2025-04-09 09:37",
                            "numAutorizacion": null,
                            "codConsulta": "890201",
                            "modalidadGrupoServicioTecSal": "01",
                            "grupoServicios": "02",
                            "codServicio": 748,
                            "finalidadTecnologiaSalud": "15",
                            "causaMotivoAtencion": "38",
                            "codDiagnosticoPrincipal": "Z012",
                            "codDiagnosticoRelacionado1": null,
                            "codDiagnosticoRelacionado2": null,
                            "codDiagnosticoRelacionado3": null,
                            "tipoDiagnosticoPrincipal": "01",
                            "tipoDocumentoIdentificacion": "CC",
                            "numDocumentoIdentificacion": "29126774",
                            "vrServicio": 0,
                            "conceptoRecaudo": "05",
                            "valorPagoModerador": 0,
                            "numFEVPagoModerador": null,
                            "consecutivo": 1
                        }
                    ]
                }
            }
        ]
    },
    "xmlFevFile": null
}
```

**Respuesta de ejemplo — aceptado (200 OK)**

```json
{
    "ResultState": true,
    "ProcesoId": 8,
    "NumFactura": "1",
    "CodigoUnicoValidacion": "712cf437a5ac5a6a1503905ed9566f431cc425f4a55f0ebead67f0e816d88b30e6e2546dc90ba36abf3747cf8512b0d6",
    "FechaRadicacion": "2025-04-10T21:22:25.7325877+00:00",
    "RutaArchivos": null,
    "ResultadosValidacion": [
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC017",
            "Descripcion": "El código de CUPS puede ser validado que corresponda a la cobertura o plan de beneficios informada en la factura electrónica de venta.",
            "Observaciones": "Verificar tabla de referencia Dato (890201)",
            "PathFuente": "usuarios[0].servicios.consultas[0].codConsulta",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC019",
            "Descripcion": "El código de CUPS se puede validar con el diagnóstico principal.",
            "Observaciones": "Verificar tabla de referencia Dato (890201)",
            "PathFuente": "usuarios[0].servicios.consultas[0].codConsulta",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC059",
            "Descripcion": "El código de CUPS puede ser validado con el grupo de servicio, servicio, finalidad o causa.",
            "Observaciones": "Verificar tabla de referencia CodConsulta (890201) - Finalidad (15)",
            "PathFuente": "usuarios[0].servicios.consultas[0].codConsulta",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC051",
            "Descripcion": "La finalidad informada se puede validar con el sexo y la edad del usuario.",
            "Observaciones": "Finalidad 15 - sexo del usuario M",
            "PathFuente": "usuarios[0].servicios.consultas[0].finalidadTecnologiaSalud",
            "Fuente": "Rips"
        }
    ]
}
```

**Respuesta de ejemplo — rechazo (400 Bad Request)**

```json
{
    "resultState": false,
    "procesoId": 0,
    "numFactura": "",
    "codigoUnicoValidacion": "-",
    "codigoUnicoValidacionToShow": "No aplica a paquetes procesados en estado [RECHAZADO] o validaciones realizadas antes del envío al Ministerio de Salud y Protección Social",
    "fechaRadicacion": "2025-04-10T21:23:27.5220794+00:00",
    "rutaArchivos": null,
    "resultadosValidacion": [
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVG01",
            "Descripcion": "Solo se podrá validar los RIPS si cumplen con la estructura establecida.",
            "Observaciones": "La propiedad [codPrestador] no cumple con el formato o tipo de dato requerido, Dato enviado [76001126940]",
            "PathFuente": "rips.usuarios[0].servicios.consultas[0].codPrestador",
            "Fuente": "Rips"
        }
    ]
}
```

---

### RIPS con factura - un paciente con pago moderador

`POST https://apirips.facturapro.co/api/PaquetesFevRips/CargarFevRips`

RIPS con factura

* el campo "xmlFevFile" esta relacionado con el campo "attacheddocument" de la respuesta de una factura (aceptada) en el API

  + tambien cuenta con servicios para obtener el valor
  + si posee el zip, puede convertirlo en Base64 y añadir el string obtenido
* el campo "numFactura" debe contener el correlativo y numeración juntos, sin caracteres especiales

**Autenticación:** `bearer`

**Body**

```json
{
    "rips": {
        "numDocumentoIdObligado": "901355357",
        "numFactura": "SETP990000103",
        "tipoNota": null,
        "numNota": null,
        "usuarios": [
            {
                "tipoDocumentoIdentificacion": "CC",
                "numDocumentoIdentificacion": "1127606374",
                "tipoUsuario": "12",
                "fechaNacimiento": "1988-07-07",
                "codSexo": "M",
                "codPaisResidencia": "170",
                "codMunicipioResidencia": "76001",
                "codZonaTerritorialResidencia": "01",
                "incapacidad": "NO",
                "codPaisOrigen": "170",
                "consecutivo": 1,
                "servicios": {
                    "procedimientos": [
                        {
                            "codPrestador": "760010858901",
                            "fechaInicioAtencion": "2025-04-09 09:22",
                            "idMIPRES": null,
                            "numAutorizacion": null,
                            "codProcedimiento": "870114",
                            "viaIngresoServicioSalud": "01",
                            "modalidadGrupoServicioTecSal": "01",
                            "grupoServicios": "02",
                            "codServicio": 748,
                            "finalidadTecnologiaSalud": "15",
                            "tipoDocumentoIdentificacion": "CC",
                            "numDocumentoIdentificacion": "29126774",
                            "codDiagnosticoPrincipal": "Z012",
                            "codDiagnosticoRelacionado": null,
                            "codComplicacion": null,
                            "vrServicio": 5000,
                            "conceptoRecaudo": "05",
                            "valorPagoModerador": 15000,
                            "numFEVPagoModerador": "SETP9900001023",
                            "consecutivo": 1
                        }
                    ]
                }
            }
        ]
    },
    // factura con pago moderador, ejemplo en 09 - Otros tipos de Facturas / Sector Salud / Health Pago Moderador
    // en la respuesta del API; copiar el campo "attacheddocument"
    "xmlFevFile": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 58240 caracteres]"
}
```

**Respuesta de ejemplo — rechazado (200 OK)**

```json
{
    "ResultState": false,
    "ProcesoId": 0,
    "NumFactura": "SETP990000103",
    "CodigoUnicoValidacion": "No aplica a paquetes procesados en estado [RECHAZADO] o validaciones realizadas antes del envío al Ministerio de Salud y Protección Social",
    "FechaRadicacion": "2025-05-27T20:13:33.7193203+00:00",
    "RutaArchivos": null,
    "ResultadosValidacion": [
        {
            "Clase": "RECHAZADO",
            "Codigo": "CFR003",
            "Descripcion": "Se encontraron errores al procesar el archivo Json de Fev",
            "Observaciones": "",
            "PathFuente": "",
            "Fuente": "FacturaElectronica"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVC012",
            "Descripcion": "El código del prestador de servicios de salud o del obligado a reportar debe estar relacionado con el numDocumentoIdObligado.",
            "Observaciones": "Verificar tablas de referencia, datos  (Código Prestador:760010858901 - Nit: 901355357)",
            "PathFuente": "usuarios[0].servicios.procedimientos[0].codPrestador",
            "Fuente": "Rips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVC011",
            "Descripcion": "El código del facturador electrónico en salud se debe encontrar en la tabla 'IPSCodHabilitación' para prestadores de servicios de salud o en 'IPSnoREPS' para prestadores exceptuados del registro en REPS.",
            "Observaciones": "El código de prestador en salud informado en el documento electrónico no coincide con los datos de autenticación. Valor Reportado Xml: [AF-0000500-85-XX-002] -> Código(s) de Prestador(es) Habilitado(s): [7600112694]",
            "PathFuente": "rips",
            "Fuente": "FevRips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVC001",
            "Descripcion": "Se requiere que el número de NIT del facturador electrónico en salud coincida con el número de NIT registrado en la factura electrónica de venta.",
            "Observaciones": "Los datos de los RIPS deben coincidir con los registrados en la factura electrónica de venta, NIT RIPS (901355357) NIT Xml de FEV (901846280)",
            "PathFuente": "numDocumentoIdObligado",
            "Fuente": "FevRips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVC061",
            "Descripcion": "Cuando no aplique pago moderador se debe informar cero (0).",
            "Observaciones": "Valor pago moderador [15000] concepto recaudo [05]",
            "PathFuente": "usuarios[0].servicios.procedimientos[0].valorPagoModerador",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC019",
            "Descripcion": "El código de CUPS se puede validar con el diagnóstico principal.",
            "Observaciones": "Verificar tabla de referencia Dato (870114)",
            "PathFuente": "usuarios[0].servicios.procedimientos[0].codProcedimiento",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC017",
            "Descripcion": "El código de CUPS puede ser validado que corresponda a la cobertura o plan de beneficios informada en la factura electrónica de venta.",
            "Observaciones": "Verificar tabla de referencia Dato (870114)",
            "PathFuente": "usuarios[0].servicios.procedimientos[0].codProcedimiento",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC051",
            "Descripcion": "La finalidad informada se puede validar con el sexo y la edad del usuario.",
            "Observaciones": "Finalidad 15 - sexo del usuario M",
            "PathFuente": "usuarios[0].servicios.procedimientos[0].finalidadTecnologiaSalud",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC033",
            "Descripcion": "El código de CIE no puede ser de factores que influyen en el estado de salud y contacto con los servicios sanitarios (CIE10: Z00-Z99 o su equivalente en la CIE vigente).",
            "Observaciones": "El CIE10 [Z012] no es válido.",
            "PathFuente": "usuarios[0].servicios.procedimientos[0].codDiagnosticoPrincipal",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC059",
            "Descripcion": "El código de CUPS puede ser validado con el grupo de servicio, servicio, finalidad o causa.",
            "Observaciones": "Verificar tabla de referencia codProcedimiento (870114) - Finalidad (15)",
            "PathFuente": "usuarios[0].servicios.procedimientos[0].codProcedimiento",
            "Fuente": "Rips"
        }
    ]
}
```

---

### RIPS con factura - varios pacientes y varios pagos

`POST https://apirips.facturapro.co/api/PaquetesFevRips/CargarFevRips`

RIPS con factura

* el campo "xmlFevFile" esta relacionado con el campo "attacheddocument" de la respuesta de una factura (aceptada) en el API

  + tambien cuenta con servicios para obtener el valor
  + si posee el zip, puede convertirlo en Base64 y añadir el string obtenido
* el campo "numFactura" debe contener el correlativo y numeración juntos, sin caracteres especiales

**Autenticación:** `bearer`

**Body**

```json
{
    "rips": {
        "numDocumentoIdObligado": "901355357",
        "numFactura": "SETP9900001023",
        "tipoNota": "",
        "numNota": "",
        "usuarios": [
            {
                "consecutivo": 1,
                "tipoDocumentoIdentificacion": "CC",
                "numDocumentoIdentificacion": "11223344",
                "fechaNacimiento": "1990-01-01",
                "codSexo": "F",
                "tipoUsuario": "12",
                "codPaisResidencia": "170",
                "codPaisOrigen": "170",
                "codMunicipioResidencia": "11001",
                "codZonaTerritorialResidencia": "01",
                "incapacidad": "NO",
                "servicios": {
                    "consultas": [
                        {
                            "consecutivo": 1,
                            "codPrestador": "760011269401",
                            "tipoDocumentoIdentificacion": "CC",
                            "numDocumentoIdentificacion": "11223344",
                            "fechaInicioAtencion": "2025-05-26 09:00",
                            "codConsulta": "890202",
                            "codServicio": 478,
                            "vrServicio": 40000,
                            "valorPagoModerador": 5000,
                            "conceptoRecaudo": "01",
                            "numFEVPagoModerador": "SETP9900001023",
                            "finalidadTecnologiaSalud": "10",
                            "grupoServicios": "01",
                            "modalidadGrupoServicioTecSal": "01",
                            "causaMotivoAtencion": "10",
                            "tipoDiagnosticoPrincipal": "01",
                            "codDiagnosticoPrincipal": "Z000",
                            "codDiagnosticoRelacionado1": null,
                            "codDiagnosticoRelacionado2": null,
                            "codDiagnosticoRelacionado3": null,
                            "numAutorizacion": null
                        }
                    ]
                }
            },
            {
                "consecutivo": 2,
                "tipoDocumentoIdentificacion": "CC",
                "numDocumentoIdentificacion": "55667788",
                "fechaNacimiento": "1985-05-10",
                "codSexo": "M",
                "tipoUsuario": "12",
                "codPaisResidencia": "170",
                "codPaisOrigen": "170",
                "codMunicipioResidencia": "05001",
                "codZonaTerritorialResidencia": "01",
                "incapacidad": "NO",
                "servicios": {
                    "consultas": [
                        {
                            "consecutivo": 1,
                            "codPrestador": "760011269401",
                            "tipoDocumentoIdentificacion": "CC",
                            "numDocumentoIdentificacion": "55667788",
                            "fechaInicioAtencion": "2025-05-26 10:00",
                            "codConsulta": "890203",
                            "codServicio": 478,
                            "vrServicio": 40000,
                            "valorPagoModerador": 4000,
                            "conceptoRecaudo": "02",
                            "numFEVPagoModerador": "SETP9900001023",
                            "finalidadTecnologiaSalud": "10",
                            "grupoServicios": "01",
                            "modalidadGrupoServicioTecSal": "01",
                            "causaMotivoAtencion": "10",
                            "tipoDiagnosticoPrincipal": "01",
                            "codDiagnosticoPrincipal": "Z001",
                            "codDiagnosticoRelacionado1": null,
                            "codDiagnosticoRelacionado2": null,
                            "codDiagnosticoRelacionado3": null,
                            "numAutorizacion": null
                        }
                    ]
                }
            },
            {
                "consecutivo": 3,
                "tipoDocumentoIdentificacion": "CC",
                "numDocumentoIdentificacion": "99887766",
                "fechaNacimiento": "2000-09-15",
                "codSexo": "F",
                "tipoUsuario": "12",
                "codPaisResidencia": "170",
                "codPaisOrigen": "170",
                "codMunicipioResidencia": "76001",
                "codZonaTerritorialResidencia": "01",
                "incapacidad": "NO",
                "servicios": {
                    "consultas": [
                        {
                            "consecutivo": 1,
                            "codPrestador": "760011269401",
                            "tipoDocumentoIdentificacion": "CC",
                            "numDocumentoIdentificacion": "99887766",
                            "fechaInicioAtencion": "2025-05-26 11:00",
                            "codConsulta": "890201",
                            "codServicio": 478,
                            "vrServicio": 40000,
                            "valorPagoModerador": 0,
                            "conceptoRecaudo": "05",
                            "numFEVPagoModerador": "SETP9900001023",
                            "finalidadTecnologiaSalud": "10",
                            "grupoServicios": "01",
                            "modalidadGrupoServicioTecSal": "01",
                            "causaMotivoAtencion": "10",
                            "tipoDiagnosticoPrincipal": "01",
                            "codDiagnosticoPrincipal": "Z002",
                            "codDiagnosticoRelacionado1": null,
                            "codDiagnosticoRelacionado2": null,
                            "codDiagnosticoRelacionado3": null,
                            "numAutorizacion": null
                        }
                    ]
                }
            }
        ]
    },
    // en la respuesta del API; copiar el campo "attacheddocument"
    "xmlFevFile": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 58240 caracteres]"
}
```

**Respuesta de ejemplo — rechazado (200 OK)**

```json
{
    "ResultState": false,
    "ProcesoId": 0,
    "NumFactura": "SETP990000103",
    "CodigoUnicoValidacion": "No aplica a paquetes procesados en estado [RECHAZADO] o validaciones realizadas antes del envío al Ministerio de Salud y Protección Social",
    "FechaRadicacion": "2025-05-27T20:27:24.0552028+00:00",
    "RutaArchivos": null,
    "ResultadosValidacion": [
        {
            "Clase": "RECHAZADO",
            "Codigo": "CFR003",
            "Descripcion": "Se encontraron errores al procesar el archivo Json de Fev",
            "Observaciones": "",
            "PathFuente": "",
            "Fuente": "FacturaElectronica"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVC004",
            "Descripcion": "El número de la factura informado en RIPS debe coincidir con el informado en la factura electrónica de venta.",
            "Observaciones": "Los datos de los RIPS deben coincidir con los registrados en la factura electrónica de venta, número de factura RIPS (SETP9900001023) número factura Xml de FEV (SETP990000103)",
            "PathFuente": "numFactura",
            "Fuente": "FevRips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVC014",
            "Descripcion": "La fecha del servicio no debe encontrarse por fuera del periodo de facturación según los datos de la factura electrónica de venta.",
            "Observaciones": "Dato reportado: 05/26/2025 09:00:00, Periodo (2025-04-01 - 2025-04-30)",
            "PathFuente": "usuarios[0].servicios.consultas[0].fechaInicioAtencion",
            "Fuente": "Rips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVC014",
            "Descripcion": "La fecha del servicio no debe encontrarse por fuera del periodo de facturación según los datos de la factura electrónica de venta.",
            "Observaciones": "Dato reportado: 05/26/2025 10:00:00, Periodo (2025-04-01 - 2025-04-30)",
            "PathFuente": "usuarios[1].servicios.consultas[0].fechaInicioAtencion",
            "Fuente": "Rips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVC014",
            "Descripcion": "La fecha del servicio no debe encontrarse por fuera del periodo de facturación según los datos de la factura electrónica de venta.",
            "Observaciones": "Dato reportado: 05/26/2025 11:00:00, Periodo (2025-04-01 - 2025-04-30)",
            "PathFuente": "usuarios[2].servicios.consultas[0].fechaInicioAtencion",
            "Fuente": "Rips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVG06",
            "Descripcion": "El dato informado no corresponde al contenido requerido.",
            "Observaciones": "Verificar tabla de referencia, dato (478)",
            "PathFuente": "usuarios[0].servicios.consultas[0].codServicio",
            "Fuente": "Rips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVG06",
            "Descripcion": "El dato informado no corresponde al contenido requerido.",
            "Observaciones": "Verificar tabla de referencia, dato (10)",
            "PathFuente": "usuarios[0].servicios.consultas[0].finalidadTecnologiaSalud",
            "Fuente": "Rips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVG06",
            "Descripcion": "El dato informado no corresponde al contenido requerido.",
            "Observaciones": "El Código causa motivo atención [10] no es válido, por favor verificar tabla de referencia.",
            "PathFuente": "usuarios[0].servicios.consultas[0].causaMotivoAtencion",
            "Fuente": "Rips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVG06",
            "Descripcion": "El dato informado no corresponde al contenido requerido.",
            "Observaciones": "Verificar tabla de referencia, dato (478)",
            "PathFuente": "usuarios[1].servicios.consultas[0].codServicio",
            "Fuente": "Rips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVG06",
            "Descripcion": "El dato informado no corresponde al contenido requerido.",
            "Observaciones": "Verificar tabla de referencia, dato (10)",
            "PathFuente": "usuarios[1].servicios.consultas[0].finalidadTecnologiaSalud",
            "Fuente": "Rips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVG06",
            "Descripcion": "El dato informado no corresponde al contenido requerido.",
            "Observaciones": "El Código causa motivo atención [10] no es válido, por favor verificar tabla de referencia.",
            "PathFuente": "usuarios[1].servicios.consultas[0].causaMotivoAtencion",
            "Fuente": "Rips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVG06",
            "Descripcion": "El dato informado no corresponde al contenido requerido.",
            "Observaciones": "Verificar tabla de referencia, dato (478)",
            "PathFuente": "usuarios[2].servicios.consultas[0].codServicio",
            "Fuente": "Rips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVG06",
            "Descripcion": "El dato informado no corresponde al contenido requerido.",
            "Observaciones": "Verificar tabla de referencia, dato (10)",
            "PathFuente": "usuarios[2].servicios.consultas[0].finalidadTecnologiaSalud",
            "Fuente": "Rips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVG06",
            "Descripcion": "El dato informado no corresponde al contenido requerido.",
            "Observaciones": "El Código causa motivo atención [10] no es válido, por favor verificar tabla de referencia.",
            "PathFuente": "usuarios[2].servicios.consultas[0].causaMotivoAtencion",
            "Fuente": "Rips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVG08",
            "Descripcion": "El valor reportado en los servicios debe coincidir con el valor de la factura electrónica de venta y demás documentos electrónicos.",
            "Observaciones": "La sumatoria de los valores de los servicios prestados no corresponde al valor informado en la factura electrónica de venta - El valor total factura ¤5,000.00 - Valor total RIPS ¤120,000.00",
            "PathFuente": "",
            "Fuente": "FevRips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVC011",
            "Descripcion": "El código del facturador electrónico en salud se debe encontrar en la tabla 'IPSCodHabilitación' para prestadores de servicios de salud o en 'IPSnoREPS' para prestadores exceptuados del registro en REPS.",
            "Observaciones": "El código de prestador en salud informado en el documento electrónico no coincide con los datos de autenticación. Valor Reportado Xml: [AF-0000500-85-XX-002] -> Código(s) de Prestador(es) Habilitado(s): [7600112694]",
            "PathFuente": "rips",
            "Fuente": "FevRips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVC001",
            "Descripcion": "Se requiere que el número de NIT del facturador electrónico en salud coincida con el número de NIT registrado en la factura electrónica de venta.",
            "Observaciones": "Los datos de los RIPS deben coincidir con los registrados en la factura electrónica de venta, NIT RIPS (901355357) NIT Xml de FEV (901846280)",
            "PathFuente": "numDocumentoIdObligado",
            "Fuente": "FevRips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVG09",
            "Descripcion": "El valor reportado en las cuotas moderadoras o pagos moderadores debe coincidir con el valor reportado en la factura electrónica de venta.",
            "Observaciones": "El valor total de los copagos en RIPS (¤5,000.00), no es igual al valor reportado en la Factura de Venta (¤0.00)",
            "PathFuente": "rips",
            "Fuente": "FevRips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVG09",
            "Descripcion": "El valor reportado en las cuotas moderadoras o pagos moderadores debe coincidir con el valor reportado en la factura electrónica de venta.",
            "Observaciones": "El valor total de las cuotas moderadoras en RIPS (¤4,000.00), no es igual al valor reportado en la Factura de Venta (¤0.00)",
            "PathFuente": "rips",
            "Fuente": "FevRips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC019",
            "Descripcion": "El código de CUPS se puede validar con el diagnóstico principal.",
            "Observaciones": "Verificar tabla de referencia Dato (890202)",
            "PathFuente": "usuarios[0].servicios.consultas[0].codConsulta",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC019",
            "Descripcion": "El código de CUPS se puede validar con el diagnóstico principal.",
            "Observaciones": "Verificar tabla de referencia Dato (890203)",
            "PathFuente": "usuarios[1].servicios.consultas[0].codConsulta",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC019",
            "Descripcion": "El código de CUPS se puede validar con el diagnóstico principal.",
            "Observaciones": "Verificar tabla de referencia Dato (890201)",
            "PathFuente": "usuarios[2].servicios.consultas[0].codConsulta",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC017",
            "Descripcion": "El código de CUPS puede ser validado que corresponda a la cobertura o plan de beneficios informada en la factura electrónica de venta.",
            "Observaciones": "Verificar tabla de referencia Dato (890202)",
            "PathFuente": "usuarios[0].servicios.consultas[0].codConsulta",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC017",
            "Descripcion": "El código de CUPS puede ser validado que corresponda a la cobertura o plan de beneficios informada en la factura electrónica de venta.",
            "Observaciones": "Verificar tabla de referencia Dato (890203)",
            "PathFuente": "usuarios[1].servicios.consultas[0].codConsulta",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC017",
            "Descripcion": "El código de CUPS puede ser validado que corresponda a la cobertura o plan de beneficios informada en la factura electrónica de venta.",
            "Observaciones": "Verificar tabla de referencia Dato (890201)",
            "PathFuente": "usuarios[2].servicios.consultas[0].codConsulta",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC051",
            "Descripcion": "La finalidad informada se puede validar con el sexo y la edad del usuario.",
            "Observaciones": "Finalidad 10 - sexo del usuario F",
            "PathFuente": "usuarios[0].servicios.consultas[0].finalidadTecnologiaSalud",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC051",
            "Descripcion": "La finalidad informada se puede validar con el sexo y la edad del usuario.",
            "Observaciones": "Finalidad 10 - Edad del usuario 35",
            "PathFuente": "usuarios[0].servicios.consultas[0].finalidadTecnologiaSalud",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC051",
            "Descripcion": "La finalidad informada se puede validar con el sexo y la edad del usuario.",
            "Observaciones": "Finalidad 10 - sexo del usuario M",
            "PathFuente": "usuarios[1].servicios.consultas[0].finalidadTecnologiaSalud",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC051",
            "Descripcion": "La finalidad informada se puede validar con el sexo y la edad del usuario.",
            "Observaciones": "Finalidad 10 - Edad del usuario 40",
            "PathFuente": "usuarios[1].servicios.consultas[0].finalidadTecnologiaSalud",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC051",
            "Descripcion": "La finalidad informada se puede validar con el sexo y la edad del usuario.",
            "Observaciones": "Finalidad 10 - sexo del usuario F",
            "PathFuente": "usuarios[2].servicios.consultas[0].finalidadTecnologiaSalud",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC051",
            "Descripcion": "La finalidad informada se puede validar con el sexo y la edad del usuario.",
            "Observaciones": "Finalidad 10 - Edad del usuario 24",
            "PathFuente": "usuarios[2].servicios.consultas[0].finalidadTecnologiaSalud",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC028",
            "Descripcion": "El código de CIE se puede validar según el sexo y la edad del paciente.",
            "Observaciones": "El campo código diagnóstico principal no es valido, verificar tabla de referencia, Código diagnostico (Z001) - Código Sexo (M) - Edad (40)  ",
            "PathFuente": "usuarios[1].servicios.consultas[0].codDiagnosticoPrincipal",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC028",
            "Descripcion": "El código de CIE se puede validar según el sexo y la edad del paciente.",
            "Observaciones": "El campo código diagnóstico principal no es valido, verificar tabla de referencia, Código diagnostico (Z002) - Código Sexo (F) - Edad (24)  ",
            "PathFuente": "usuarios[2].servicios.consultas[0].codDiagnosticoPrincipal",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC035",
            "Descripcion": "Solamente se puede cobrar cuota moderadora a afiliados del régimen contributivo.",
            "Observaciones": "Tipo usuario [12] concepto recaudo [02]",
            "PathFuente": "usuarios[1].servicios.consultas[0].conceptoRecaudo",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC059",
            "Descripcion": "El código de CUPS puede ser validado con el grupo de servicio, servicio, finalidad o causa.",
            "Observaciones": "Verificar tabla de referencia CodConsulta (890202) - Finalidad (10)",
            "PathFuente": "usuarios[0].servicios.consultas[0].codConsulta",
            "Fuente": "Rips"
      
…[recortado: 15845 caracteres en total]
```

---

### RIPS de nota credito

`POST https://apirips.facturapro.co/api/PaquetesFevRips/CargarNC`

RIPS de una nota credito

* se usa cuando se corrige parcialmente una factura ya validada con RIPS: se cargan solo los servicios que se ajustan
* el campo "numFactura" es el de la factura que se corrige y "numNota" el de la nota credito, ambos con correlativo y numeración juntos, sin caracteres especiales
* el campo "tipoNota" debe ser **NC**
* el campo "xmlFevFile" esta relacionado con el campo "attacheddocument" de la respuesta de la nota credito (aceptada) en el API

**Autenticación:** `bearer`

**Body**

```json
{
    "rips": {
        "numDocumentoIdObligado": "901355357",
        "numFactura": "SETP990000103",
        "numNota": "NC1",
        "tipoNota": "NC",
        "usuarios": [
            {
                "tipoDocumentoIdentificacion": "CC",
                "numDocumentoIdentificacion": "1111111111",
                "tipoUsuario": "02",
                "fechaNacimiento": "1990-08-17",
                "codSexo": "M",
                "codPaisResidencia": "170",
                "codMunicipioResidencia": "11001",
                "codZonaTerritorialResidencia": "02",
                "incapacidad": "NO",
                "codPaisOrigen": "170",
                "consecutivo": 1,
                "servicios": {
                    "consultas": [
                        {
                            "codPrestador": "760011269401",
                            "fechaInicioAtencion": "2024-06-22 00:00",
                            "numAutorizacion": "",
                            "codConsulta": "890702",
                            "modalidadGrupoServicioTecSal": "01",
                            "grupoServicios": "01",
                            "codServicio": 328,
                            "finalidadTecnologiaSalud": "25",
                            "causaMotivoAtencion": "38",
                            "codDiagnosticoPrincipal": "S934",
                            "codDiagnosticoRelacionado1": "S903",
                            "codDiagnosticoRelacionado2": null,
                            "codDiagnosticoRelacionado3": null,
                            "tipoDiagnosticoPrincipal": "02",
                            "tipoDocumentoIdentificacion": "CC",
                            "numDocumentoIdentificacion": "98798797",
                            "vrServicio": 700,
                            "valorPagoModerador": 0,
                            "numFEVPagoModerador": "",
                            "conceptoRecaudo": "05",
                            "consecutivo": 1
                        }
                    ]
                }
            }
        ]
    },
    "xmlFevFile": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iV"
}
```

**Respuesta de ejemplo — rechazado (400 Bad Request)**

```json
{
    "ResultState": false,
    "ProcesoId": 0,
    "NumFactura": "",
    "CodigoUnicoValidacion": "-",
    "CodigoUnicoValidacionToShow": "No aplica a paquetes procesados en estado [RECHAZADO] o validaciones realizadas antes del envío al Ministerio de Salud y Protección Social",
    "FechaRadicacion": "2025-05-27T20:38:13.0766104+00:00",
    "RutaArchivos": null,
    "ResultadosValidacion": [
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVG06",
            "Descripcion": "El dato informado no corresponde al contenido requerido.",
            "Observaciones": "Object reference not set to an instance of an object.",
            "PathFuente": "Estructura general",
            "Fuente": "Rips"
        }
    ]
}
```

---

### RIPS de nota credito total

`POST https://apirips.facturapro.co/api/PaquetesFevRips/CargarNCTotal`

RIPS de una nota credito total

* se usa cuando la nota credito anula la factura completa: al no quedar servicios por reportar, el campo "rips" va en **null** y solo se envia el "xmlFevFile"
* el campo "xmlFevFile" esta relacionado con el campo "attacheddocument" de la respuesta de la nota credito (aceptada) en el API

  + tambien cuenta con servicios para obtener el valor
  + si posee el zip, puede convertirlo en Base64 y añadir el string obtenido

**Autenticación:** `bearer`

**Body**

```json
{
    "rips": null,
    "xmlFevFile": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGc3N1ZURhdGU++ODAwMTk3MjY4P…[base64 recortado, 867 caracteres]"
}
```

---

### RIPS de capita inicial

`POST https://apirips.facturapro.co/api/PaquetesFevRips/CargarCapitaInicial`

RIPS de capita inicial

* es el primer envio de un contrato por capitacion: la factura no reporta atencion de pacientes, por lo que el campo "rips" va en **null** y solo se envia el "xmlFevFile"
* el campo "xmlFevFile" esta relacionado con el campo "attacheddocument" de la respuesta de una factura (aceptada) en el API
* se puede utilizar el JSON dentro de **09 - Otros tipos de Facturas** ejemplo: \*\*"\*\*SendInvoice-TestSetId Health SS-recaudo | Capita inicial"
* los servicios efectivamente prestados se reportan despues con CargarCapitaPeriodo

**Autenticación:** `bearer`

**Body**

```json
{
    "rips": null,
    // JSON API: 09-otros tipos de facturas / Sector Salud / Health SS-recaudo | Capita inicial
    "xmlFevFile": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 54360 caracteres]"
}
```

**Respuesta de ejemplo — rechazado (200 OK)**

```json
{
    "ResultState": false,
    "ProcesoId": 0,
    "NumFactura": "SETP990070004",
    "CodigoUnicoValidacion": "No aplica a paquetes procesados en estado [RECHAZADO] o validaciones realizadas antes del envío al Ministerio de Salud y Protección Social",
    "FechaRadicacion": "2025-06-16T16:08:54.2497436+00:00",
    "RutaArchivos": null,
    "ResultadosValidacion": [
        {
            "Clase": "RECHAZADO",
            "Codigo": "CIN001",
            "Descripcion": "La fecha de la factura no corresponde al periodo reportado.",
            "Observaciones": "La Fecha de Emisión esta fuera del periodo reportado. Periodo reportado: [01/05/2025-29/05/2025] Fecha Factura: [16/06/2025]",
            "PathFuente": "",
            "Fuente": "CapitaInicial"
        }
    ]
}
```

---

### RIPS de capita del periodo

`POST https://apirips.facturapro.co/api/PaquetesFevRips/CargarCapitaPeriodo`

RIPS de capita por periodo

* reporta los servicios efectivamente prestados durante el periodo de un contrato por capitacion, por eso si lleva el bloque "rips" con los usuarios atendidos
* el campo "xmlFevFile" esta relacionado con el campo "attacheddocument" de la respuesta de una factura (aceptada) en el API
* se puede utilizar el JSON dentro de **09 - Otros tipos de Facturas** ejemplo: \*\*"\*\*SendInvoice-TestSetId Health SS-cufe| Capita Periodo"

**Autenticación:** `bearer`

**Body**

```json
{
    "rips": {
        "numDocumentoIdObligado": "901355357",
        "numFactura": "SETP9900001023",
        "tipoNota": "",
        "numNota": "",
        "usuarios": [
            {
                "consecutivo": 1,
                "tipoDocumentoIdentificacion": "CC",
                "numDocumentoIdentificacion": "11223344",
                "fechaNacimiento": "1990-01-01",
                "codSexo": "F",
                "tipoUsuario": "12",
                "codPaisResidencia": "170",
                "codPaisOrigen": "170",
                "codMunicipioResidencia": "11001",
                "codZonaTerritorialResidencia": "01",
                "incapacidad": "NO",
                "servicios": {
                    "consultas": [
                        {
                            "consecutivo": 1,
                            "codPrestador": "760011269401",
                            "tipoDocumentoIdentificacion": "CC",
                            "numDocumentoIdentificacion": "11223344",
                            "fechaInicioAtencion": "2025-05-26 09:00",
                            "codConsulta": "890202",
                            "codServicio": 478,
                            "vrServicio": 40000,
                            "valorPagoModerador": 5000,
                            "conceptoRecaudo": "01",
                            "numFEVPagoModerador": "SETP9900001023",
                            "finalidadTecnologiaSalud": "10",
                            "grupoServicios": "01",
                            "modalidadGrupoServicioTecSal": "01",
                            "causaMotivoAtencion": "10",
                            "tipoDiagnosticoPrincipal": "01",
                            "codDiagnosticoPrincipal": "Z000",
                            "codDiagnosticoRelacionado1": null,
                            "codDiagnosticoRelacionado2": null,
                            "codDiagnosticoRelacionado3": null,
                            "numAutorizacion": null
                        }
                    ]
                }
            },
            {
                "consecutivo": 2,
                "tipoDocumentoIdentificacion": "CC",
                "numDocumentoIdentificacion": "55667788",
                "fechaNacimiento": "1985-05-10",
                "codSexo": "M",
                "tipoUsuario": "12",
                "codPaisResidencia": "170",
                "codPaisOrigen": "170",
                "codMunicipioResidencia": "05001",
                "codZonaTerritorialResidencia": "01",
                "incapacidad": "NO",
                "servicios": {
                    "consultas": [
                        {
                            "consecutivo": 1,
                            "codPrestador": "760011269401",
                            "tipoDocumentoIdentificacion": "CC",
                            "numDocumentoIdentificacion": "55667788",
                            "fechaInicioAtencion": "2025-05-26 10:00",
                            "codConsulta": "890203",
                            "codServicio": 478,
                            "vrServicio": 40000,
                            "valorPagoModerador": 4000,
                            "conceptoRecaudo": "02",
                            "numFEVPagoModerador": "SETP9900001023",
                            "finalidadTecnologiaSalud": "10",
                            "grupoServicios": "01",
                            "modalidadGrupoServicioTecSal": "01",
                            "causaMotivoAtencion": "10",
                            "tipoDiagnosticoPrincipal": "01",
                            "codDiagnosticoPrincipal": "Z001",
                            "codDiagnosticoRelacionado1": null,
                            "codDiagnosticoRelacionado2": null,
                            "codDiagnosticoRelacionado3": null,
                            "numAutorizacion": null
                        }
                    ]
                }
            },
            {
                "consecutivo": 3,
                "tipoDocumentoIdentificacion": "CC",
                "numDocumentoIdentificacion": "99887766",
                "fechaNacimiento": "2000-09-15",
                "codSexo": "F",
                "tipoUsuario": "12",
                "codPaisResidencia": "170",
                "codPaisOrigen": "170",
                "codMunicipioResidencia": "76001",
                "codZonaTerritorialResidencia": "01",
                "incapacidad": "NO",
                "servicios": {
                    "consultas": [
                        {
                            "consecutivo": 1,
                            "codPrestador": "760011269401",
                            "tipoDocumentoIdentificacion": "CC",
                            "numDocumentoIdentificacion": "99887766",
                            "fechaInicioAtencion": "2025-05-26 11:00",
                            "codConsulta": "890201",
                            "codServicio": 478,
                            "vrServicio": 40000,
                            "valorPagoModerador": 0,
                            "conceptoRecaudo": "05",
                            "numFEVPagoModerador": "SETP9900001023",
                            "finalidadTecnologiaSalud": "10",
                            "grupoServicios": "01",
                            "modalidadGrupoServicioTecSal": "01",
                            "causaMotivoAtencion": "10",
                            "tipoDiagnosticoPrincipal": "01",
                            "codDiagnosticoPrincipal": "Z002",
                            "codDiagnosticoRelacionado1": null,
                            "codDiagnosticoRelacionado2": null,
                            "codDiagnosticoRelacionado3": null,
                            "numAutorizacion": null
                        }
                    ]
                }
            }
        ]
    },
    // JSON API: 09-otros tipos de facturas / Sector Salud / Health SS-cufe | Capita Periodo
    "xmlFevFile": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 60964 caracteres]"
}
```

**Respuesta de ejemplo — rechazado (200 OK)**

```json
{
    "ResultState": false,
    "ProcesoId": 0,
    "NumFactura": "0",
    "CodigoUnicoValidacion": "No aplica a paquetes procesados en estado [RECHAZADO] o validaciones realizadas antes del envío al Ministerio de Salud y Protección Social",
    "FechaRadicacion": "2025-06-16T16:17:51.5391596+00:00",
    "RutaArchivos": null,
    "ResultadosValidacion": [
        {
            "Clase": "RECHAZADO",
            "Codigo": "FEV006",
            "Descripcion": "Elemento desconocido de la estructura del Xml",
            "Observaciones": "[Línea 1] Nodo: GroupType - Elemento: Collection - Value: CODIGO_PRESTADOR900123457MODALIDAD_PAGOPago por evento.COBERTURA_PLAN_BENEFICIOSPlan complementario en saludNUMERO_CONTRATONUMERO_POLIZACOPAGO0CUOTA_MODERADORA4000PAGOS_COMPARTIDOS0ANTICIPO",
            "PathFuente": "",
            "Fuente": "FacturaElectronica"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "FEV006",
            "Descripcion": "Elemento desconocido de la estructura del Xml",
            "Observaciones": "[Línea 1] Nodo: GroupType - Elemento: Collection - Value: CODIGO_PRESTADOR900123458MODALIDAD_PAGOPago por evento.COBERTURA_PLAN_BENEFICIOSPlan complementario en saludNUMERO_CONTRATONUMERO_POLIZACOPAGO0CUOTA_MODERADORA0PAGOS_COMPARTIDOS0ANTICIPO",
            "PathFuente": "",
            "Fuente": "FacturaElectronica"
        }
    ]
}
```

---

### RIPS de capita final

`POST https://apirips.facturapro.co/api/PaquetesFevRips/CargarCapitaFinal`

RIPS de capita final

* cierra el contrato por capitacion: reporta los ultimos servicios prestados, por lo que lleva el bloque "rips" con los usuarios atendidos
* el campo "xmlFevFile" esta relacionado con el campo "attacheddocument" de la respuesta de la factura de cierre (aceptada) en el API
* el campo "numFactura" debe contener el correlativo y numeración juntos, sin caracteres especiales

**Autenticación:** `bearer`

**Body**

```json
{
    "rips": {
        "numDocumentoIdObligado": "901355357",
        "numFactura": "SETP9900001023",
        "tipoNota": "",
        "numNota": "",
        "usuarios": [
            {
                "consecutivo": 1,
                "tipoDocumentoIdentificacion": "CC",
                "numDocumentoIdentificacion": "11223344",
                "fechaNacimiento": "1990-01-01",
                "codSexo": "F",
                "tipoUsuario": "12",
                "codPaisResidencia": "170",
                "codPaisOrigen": "170",
                "codMunicipioResidencia": "11001",
                "codZonaTerritorialResidencia": "01",
                "incapacidad": "NO",
                "servicios": {
                    "consultas": [
                        {
                            "consecutivo": 1,
                            "codPrestador": "760011269401",
                            "tipoDocumentoIdentificacion": "CC",
                            "numDocumentoIdentificacion": "11223344",
                            "fechaInicioAtencion": "2025-05-26 09:00",
                            "codConsulta": "890202",
                            "codServicio": 478,
                            "vrServicio": 40000,
                            "valorPagoModerador": 5000,
                            "conceptoRecaudo": "01",
                            "numFEVPagoModerador": "SETP9900001023",
                            "finalidadTecnologiaSalud": "10",
                            "grupoServicios": "01",
                            "modalidadGrupoServicioTecSal": "01",
                            "causaMotivoAtencion": "10",
                            "tipoDiagnosticoPrincipal": "01",
                            "codDiagnosticoPrincipal": "Z000",
                            "codDiagnosticoRelacionado1": null,
                            "codDiagnosticoRelacionado2": null,
                            "codDiagnosticoRelacionado3": null,
                            "numAutorizacion": null
                        }
                    ]
                }
            },
            {
                "consecutivo": 2,
                "tipoDocumentoIdentificacion": "CC",
                "numDocumentoIdentificacion": "55667788",
                "fechaNacimiento": "1985-05-10",
                "codSexo": "M",
                "tipoUsuario": "12",
                "codPaisResidencia": "170",
                "codPaisOrigen": "170",
                "codMunicipioResidencia": "05001",
                "codZonaTerritorialResidencia": "01",
                "incapacidad": "NO",
                "servicios": {
                    "consultas": [
                        {
                            "consecutivo": 1,
                            "codPrestador": "760011269401",
                            "tipoDocumentoIdentificacion": "CC",
                            "numDocumentoIdentificacion": "55667788",
                            "fechaInicioAtencion": "2025-05-26 10:00",
                            "codConsulta": "890203",
                            "codServicio": 478,
                            "vrServicio": 40000,
                            "valorPagoModerador": 4000,
                            "conceptoRecaudo": "02",
                            "numFEVPagoModerador": "SETP9900001023",
                            "finalidadTecnologiaSalud": "10",
                            "grupoServicios": "01",
                            "modalidadGrupoServicioTecSal": "01",
                            "causaMotivoAtencion": "10",
                            "tipoDiagnosticoPrincipal": "01",
                            "codDiagnosticoPrincipal": "Z001",
                            "codDiagnosticoRelacionado1": null,
                            "codDiagnosticoRelacionado2": null,
                            "codDiagnosticoRelacionado3": null,
                            "numAutorizacion": null
                        }
                    ]
                }
            },
            {
                "consecutivo": 3,
                "tipoDocumentoIdentificacion": "CC",
                "numDocumentoIdentificacion": "99887766",
                "fechaNacimiento": "2000-09-15",
                "codSexo": "F",
                "tipoUsuario": "12",
                "codPaisResidencia": "170",
                "codPaisOrigen": "170",
                "codMunicipioResidencia": "76001",
                "codZonaTerritorialResidencia": "01",
                "incapacidad": "NO",
                "servicios": {
                    "consultas": [
                        {
                            "consecutivo": 1,
                            "codPrestador": "760011269401",
                            "tipoDocumentoIdentificacion": "CC",
                            "numDocumentoIdentificacion": "99887766",
                            "fechaInicioAtencion": "2025-05-26 11:00",
                            "codConsulta": "890201",
                            "codServicio": 478,
                            "vrServicio": 40000,
                            "valorPagoModerador": 0,
                            "conceptoRecaudo": "05",
                            "numFEVPagoModerador": "SETP9900001023",
                            "finalidadTecnologiaSalud": "10",
                            "grupoServicios": "01",
                            "modalidadGrupoServicioTecSal": "01",
                            "causaMotivoAtencion": "10",
                            "tipoDiagnosticoPrincipal": "01",
                            "codDiagnosticoPrincipal": "Z002",
                            "codDiagnosticoRelacionado1": null,
                            "codDiagnosticoRelacionado2": null,
                            "codDiagnosticoRelacionado3": null,
                            "numAutorizacion": null
                        }
                    ]
                }
            }
        ]
    },
    // No requiere
    "xmlFevFile": ""
}
```

**Respuesta de ejemplo — rechazado (200 OK)**

```json
{
    "ResultState": false,
    "ProcesoId": 0,
    "NumFactura": "SETP9900001023",
    "CodigoUnicoValidacion": "No aplica a paquetes procesados en estado [RECHAZADO] o validaciones realizadas antes del envío al Ministerio de Salud y Protección Social",
    "FechaRadicacion": "2025-06-16T16:20:21.2129742+00:00",
    "RutaArchivos": null,
    "ResultadosValidacion": [
        {
            "Clase": "RECHAZADO",
            "Codigo": "CFR003",
            "Descripcion": "Se encontraron errores al procesar el archivo Json de Fev",
            "Observaciones": "",
            "PathFuente": "",
            "Fuente": "CapitaFinal"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVC034",
            "Descripcion": "Diligenciar el valor mayor a cero (0) si la modalidad de pago corresponde a 'Pago por evento'. Para las demás modalidades informar cero (0).",
            "Observaciones": "El campo valor servicio [40000] no es valido, para el tipo de modalidad de pago [03]",
            "PathFuente": "usuarios[0].servicios.consultas[0].vrServicio",
            "Fuente": "Rips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVC034",
            "Descripcion": "Diligenciar el valor mayor a cero (0) si la modalidad de pago corresponde a 'Pago por evento'. Para las demás modalidades informar cero (0).",
            "Observaciones": "El campo valor servicio [40000] no es valido, para el tipo de modalidad de pago [03]",
            "PathFuente": "usuarios[1].servicios.consultas[0].vrServicio",
            "Fuente": "Rips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVC034",
            "Descripcion": "Diligenciar el valor mayor a cero (0) si la modalidad de pago corresponde a 'Pago por evento'. Para las demás modalidades informar cero (0).",
            "Observaciones": "El campo valor servicio [40000] no es valido, para el tipo de modalidad de pago [03]",
            "PathFuente": "usuarios[2].servicios.consultas[0].vrServicio",
            "Fuente": "Rips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVG06",
            "Descripcion": "El dato informado no corresponde al contenido requerido.",
            "Observaciones": "Para facturas por modalidad de pago CAPITA, el valor total reportado en los servicos de ser igual a cero (0)",
            "PathFuente": "rips",
            "Fuente": "Rips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVG06",
            "Descripcion": "El dato informado no corresponde al contenido requerido.",
            "Observaciones": "Verificar tabla de referencia, dato (478)",
            "PathFuente": "usuarios[0].servicios.consultas[0].codServicio",
            "Fuente": "Rips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVG06",
            "Descripcion": "El dato informado no corresponde al contenido requerido.",
            "Observaciones": "Verificar tabla de referencia, dato (10)",
            "PathFuente": "usuarios[0].servicios.consultas[0].finalidadTecnologiaSalud",
            "Fuente": "Rips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVG06",
            "Descripcion": "El dato informado no corresponde al contenido requerido.",
            "Observaciones": "El Código causa motivo atención [10] no es válido, por favor verificar tabla de referencia.",
            "PathFuente": "usuarios[0].servicios.consultas[0].causaMotivoAtencion",
            "Fuente": "Rips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVG06",
            "Descripcion": "El dato informado no corresponde al contenido requerido.",
            "Observaciones": "Verificar tabla de referencia, dato (478)",
            "PathFuente": "usuarios[1].servicios.consultas[0].codServicio",
            "Fuente": "Rips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVG06",
            "Descripcion": "El dato informado no corresponde al contenido requerido.",
            "Observaciones": "Verificar tabla de referencia, dato (10)",
            "PathFuente": "usuarios[1].servicios.consultas[0].finalidadTecnologiaSalud",
            "Fuente": "Rips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVG06",
            "Descripcion": "El dato informado no corresponde al contenido requerido.",
            "Observaciones": "El Código causa motivo atención [10] no es válido, por favor verificar tabla de referencia.",
            "PathFuente": "usuarios[1].servicios.consultas[0].causaMotivoAtencion",
            "Fuente": "Rips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVG06",
            "Descripcion": "El dato informado no corresponde al contenido requerido.",
            "Observaciones": "Verificar tabla de referencia, dato (478)",
            "PathFuente": "usuarios[2].servicios.consultas[0].codServicio",
            "Fuente": "Rips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVG06",
            "Descripcion": "El dato informado no corresponde al contenido requerido.",
            "Observaciones": "Verificar tabla de referencia, dato (10)",
            "PathFuente": "usuarios[2].servicios.consultas[0].finalidadTecnologiaSalud",
            "Fuente": "Rips"
        },
        {
            "Clase": "RECHAZADO",
            "Codigo": "RVG06",
            "Descripcion": "El dato informado no corresponde al contenido requerido.",
            "Observaciones": "El Código causa motivo atención [10] no es válido, por favor verificar tabla de referencia.",
            "PathFuente": "usuarios[2].servicios.consultas[0].causaMotivoAtencion",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC019",
            "Descripcion": "El código de CUPS se puede validar con el diagnóstico principal.",
            "Observaciones": "Verificar tabla de referencia Dato (890202)",
            "PathFuente": "usuarios[0].servicios.consultas[0].codConsulta",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC019",
            "Descripcion": "El código de CUPS se puede validar con el diagnóstico principal.",
            "Observaciones": "Verificar tabla de referencia Dato (890203)",
            "PathFuente": "usuarios[1].servicios.consultas[0].codConsulta",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC019",
            "Descripcion": "El código de CUPS se puede validar con el diagnóstico principal.",
            "Observaciones": "Verificar tabla de referencia Dato (890201)",
            "PathFuente": "usuarios[2].servicios.consultas[0].codConsulta",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC017",
            "Descripcion": "El código de CUPS puede ser validado que corresponda a la cobertura o plan de beneficios informada en la factura electrónica de venta.",
            "Observaciones": "Verificar tabla de referencia Dato (890202)",
            "PathFuente": "usuarios[0].servicios.consultas[0].codConsulta",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC017",
            "Descripcion": "El código de CUPS puede ser validado que corresponda a la cobertura o plan de beneficios informada en la factura electrónica de venta.",
            "Observaciones": "Verificar tabla de referencia Dato (890203)",
            "PathFuente": "usuarios[1].servicios.consultas[0].codConsulta",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC017",
            "Descripcion": "El código de CUPS puede ser validado que corresponda a la cobertura o plan de beneficios informada en la factura electrónica de venta.",
            "Observaciones": "Verificar tabla de referencia Dato (890201)",
            "PathFuente": "usuarios[2].servicios.consultas[0].codConsulta",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC051",
            "Descripcion": "La finalidad informada se puede validar con el sexo y la edad del usuario.",
            "Observaciones": "Finalidad 10 - sexo del usuario F",
            "PathFuente": "usuarios[0].servicios.consultas[0].finalidadTecnologiaSalud",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC051",
            "Descripcion": "La finalidad informada se puede validar con el sexo y la edad del usuario.",
            "Observaciones": "Finalidad 10 - Edad del usuario 35",
            "PathFuente": "usuarios[0].servicios.consultas[0].finalidadTecnologiaSalud",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC051",
            "Descripcion": "La finalidad informada se puede validar con el sexo y la edad del usuario.",
            "Observaciones": "Finalidad 10 - sexo del usuario M",
            "PathFuente": "usuarios[1].servicios.consultas[0].finalidadTecnologiaSalud",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC051",
            "Descripcion": "La finalidad informada se puede validar con el sexo y la edad del usuario.",
            "Observaciones": "Finalidad 10 - Edad del usuario 40",
            "PathFuente": "usuarios[1].servicios.consultas[0].finalidadTecnologiaSalud",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC051",
            "Descripcion": "La finalidad informada se puede validar con el sexo y la edad del usuario.",
            "Observaciones": "Finalidad 10 - sexo del usuario F",
            "PathFuente": "usuarios[2].servicios.consultas[0].finalidadTecnologiaSalud",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC051",
            "Descripcion": "La finalidad informada se puede validar con el sexo y la edad del usuario.",
            "Observaciones": "Finalidad 10 - Edad del usuario 24",
            "PathFuente": "usuarios[2].servicios.consultas[0].finalidadTecnologiaSalud",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC028",
            "Descripcion": "El código de CIE se puede validar según el sexo y la edad del paciente.",
            "Observaciones": "El campo código diagnóstico principal no es valido, verificar tabla de referencia, Código diagnostico (Z001) - Código Sexo (M) - Edad (40)  ",
            "PathFuente": "usuarios[1].servicios.consultas[0].codDiagnosticoPrincipal",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC028",
            "Descripcion": "El código de CIE se puede validar según el sexo y la edad del paciente.",
            "Observaciones": "El campo código diagnóstico principal no es valido, verificar tabla de referencia, Código diagnostico (Z002) - Código Sexo (F) - Edad (24)  ",
            "PathFuente": "usuarios[2].servicios.consultas[0].codDiagnosticoPrincipal",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC035",
            "Descripcion": "Solamente se puede cobrar cuota moderadora a afiliados del régimen contributivo.",
            "Observaciones": "Tipo usuario [12] concepto recaudo [02]",
            "PathFuente": "usuarios[1].servicios.consultas[0].conceptoRecaudo",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC059",
            "Descripcion": "El código de CUPS puede ser validado con el grupo de servicio, servicio, finalidad o causa.",
            "Observaciones": "Verificar tabla de referencia CodConsulta (890202) - Finalidad (10)",
            "PathFuente": "usuarios[0].servicios.consultas[0].codConsulta",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC059",
            "Descripcion": "El código de CUPS puede ser validado con el grupo de servicio, servicio, finalidad o causa.",
            "Observaciones": "Verificar tabla de referencia CodConsulta (890203) - Finalidad (10)",
            "PathFuente": "usuarios[1].servicios.consultas[0].codConsulta",
            "Fuente": "Rips"
        },
        {
            "Clase": "NOTIFICACION",
            "Codigo": "RVC059",
            "Descripcion": "El código de CUPS puede ser validado con el grupo de servicio, servicio, finalidad o causa.",
            "Observaciones": "Verificar tabla de referencia CodConsulta (890201) - Finalidad (10)",
            "PathFuente": "usuarios[2].servicios.consultas[0].codConsulta",
            "Fuente": "Rips"
        }
    ]
}
```

---

### RIPS de nota debito

`POST https://apirips.facturapro.co/api/PaquetesFevRips/CargarND`

RIPS de una nota debito

* se usa cuando la nota debito aumenta el valor de una factura ya validada con RIPS
* el campo "numFactura" es el de la factura que se corrige y "numNota" el de la nota debito, ambos con correlativo y numeración juntos, sin caracteres especiales
* el campo "tipoNota" debe ser **ND**
* el campo "xmlFevFile" esta relacionado con el campo "attacheddocument" de la respuesta de la nota debito (aceptada) en el API

**Autenticación:** `bearer`

**Body**

```json
{
    "rips": {
        "numDocumentoIdObligado": "901355357",
        "numFactura": "COR176187",
        "tipoNota": "ND",
        "numNota": "2ND1",
        "usuarios": [
            {
                "tipoDocumentoIdentificacion": "CC",
                "numDocumentoIdentificacion": "52100200",
                "tipoUsuario": "02",
                "fechaNacimiento": "2000-01-01",
                "codSexo": "M",
                "codPaisResidencia": "170",
                "codMunicipioResidencia": "05134",
                "codZonaTerritorialResidencia": "01",
                "incapacidad": "SI",
                "consecutivo": 1,
                "codPaisOrigen": "170",
                "servicios": {
                    "consultas": [
                        {
                            "codPrestador": "192030405001",
                            "fechaInicioAtencion": "2023-06-21 00:00",
                            "numAutorizacion": "nan",
                            "codConsulta": "890201",
                            "modalidadGrupoServicioTecSal": "01",
                            "grupoServicios": "01",
                            "codServicio": 328,
                            "finalidadTecnologiaSalud": "44",
                            "causaMotivoAtencion": "26",
                            "codDiagnosticoPrincipal": "T784",
                            "codDiagnosticoRelacionado1": null,
                            "codDiagnosticoRelacionado2": null,
                            "codDiagnosticoRelacionado3": null,
                            "tipoDiagnosticoPrincipal": "01",
                            "tipoDocumentoIdentificacion": "CC",
                            "numDocumentoIdentificacion": "6817195",
                            "vrServicio": 46400,
                            "conceptoRecaudo": "05",
                            "valorPagoModerador": 0,
                            "numFEVPagoModerador": null,
                            "consecutivo": 3
                        }
                    ]
                }
            }
        ]
    },
    "xmlFevFile": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxv…[base64 recortado, 58240 caracteres]"
}
```

---

### RIPS de nota de ajuste

`POST https://apirips.facturapro.co/api/PaquetesFevRips/CargarNotaAjuste`

RIPS de una nota de ajuste

* se usa para corregir los datos de los RIPS de una factura ya validada, sin que cambie su valor
* el campo "numFactura" es el de la factura que se ajusta y "numNota" el de la nota de ajuste, ambos con correlativo y numeración juntos, sin caracteres especiales
* el campo "tipoNota" debe ser **NA**
* el campo "xmlFevFile" esta relacionado con el campo "attacheddocument" de la respuesta de la factura (aceptada) en el API

**Autenticación:** `bearer`

**Body**

```json
{
    "rips": {
        "numDocumentoIdObligado": "530520110",
        "numFactura": "BTA4444778",
        "tipoNota": "NA",
        "numNota": "NA0002",
        "usuarios": [
            {
                "tipoDocumentoIdentificacion": "CC",
                "numDocumentoIdentificacion": "52817285",
                "tipoUsuario": "02",
                "fechaNacimiento": "1983-06-21",
                "codSexo": "F",
                "codPaisResidencia": "170",
                "codMunicipioResidencia": "11001",
                "codZonaTerritorialResidencia": "02",
                "incapacidad": "SI",
                "codPaisOrigen": "170",
                "consecutivo": 1,
                "servicios": {
                    "consultas": [
                        {
                            "codPrestador": "192030405001",
                            "fechaInicioAtencion": "2023-06-22 00:00",
                            "numAutorizacion": "",
                            "codConsulta": "890701",
                            "modalidadGrupoServicioTecSal": "01",
                            "grupoServicios": "01",
                            "codServicio": 328,
                            "finalidadTecnologiaSalud": "44",
                            "causaMotivoAtencion": "38",
                            "codDiagnosticoPrincipal": "S934",
                            "codDiagnosticoRelacionado1": "S903",
                            "codDiagnosticoRelacionado2": null,
                            "codDiagnosticoRelacionado3": null,
                            "tipoDiagnosticoPrincipal": "02",
                            "tipoDocumentoIdentificacion": "CC",
                            "numDocumentoIdentificacion": "79315652",
                            "vrServicio": 65700,
                            "conceptoRecaudo": "05",
                            "valorPagoModerador": 0,
                            "numFEVPagoModerador": "",
                            "consecutivo": 1
                        }
                    ]
                }
            }
        ]
    },
    "xmlFevFile": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiySUQ+VW5pZGFkIEVzcGVjaWFsIERpcmVjY2nDs24gZGUgSW1wdWVzdG9zIHkgQWR1YW5hcyBOYWNpb25hbGVzPC9jYmM6VmFsaWRhdG9ySUQ+CgkJCQk8Y2JjOlZhbGlkYXRpb25SZXN1bHRDb2RlPjAyPC9jYmM6VmFsaW"
}
```

---

### RIPS de nota credito por acuerdo de voluntades

`POST https://apirips.facturapro.co/api/PaquetesFevRips/CargarNCAcuerdoVoluntades`

RIPS de una nota credito por acuerdo de voluntades

* se usa cuando la nota credito corresponde a un acuerdo entre el prestador y la entidad responsable de pago, no a una correccion de los servicios
* al no cambiar los servicios reportados, el campo "rips" va en **null** y solo se envia el "xmlFevFile"
* el campo "xmlFevFile" esta relacionado con el campo "attacheddocument" de la respuesta de la nota credito (aceptada) en el API

**Autenticación:** `bearer`

**Body**

```json
{
    "rips": null,
    "xmlFevFile": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGc3N1ZURhdGU++ODAwMTk3MjY4PC9zdHM6QXV0aG9yaXphdGlvblByb3ZpZGVySUQ+CiAgICAgICAgICA8L3N0czpBdXRob3JpemF0aW9uUHJvdmlkZXI+CiAgICAgICAgPC9zdHM6RGlhbkV4dGVuc2lvbnM+CiAgICAgIDwvZXh0OkV4dGVuc2lvbkNvbnRlbnQ+CiAgICA8L2V4dDpVQkxFeHRlbnNpb24gICAgICA8Y2JjOklEPjAxPC9jYmM6SUQ+CiAgICAgICAgPGNiYzpOYW1lPklWQTwvY2JjOk5hbWU+lwdGlvb"
}
```

---

### Consultar el CUV de una factura

`POST https://apirips.facturapro.co/api/ConsultasFevRips/ConsultarCUV`

CONSULTAR UN CUV

* consulta el estado de un paquete de RIPS ya cargado, usando el Codigo Unico de Validacion (CUV) que devolvio el servicio de carga
* el unico campo del cuerpo es "codigoUnicoValidacion"
* va al grupo ConsultasFevRips y no al de PaquetesFevRips:

.../api/ConsultasFevRips/ConsultarCUV

* usa el mismo token que los servicios de carga, el que devuelve el Login de la carpeta Auth

**Autenticación:** `bearer`

**Body**

```json
{
    "codigoUnicoValidacion": "712cf437a5ac5a6a1503905ed9566f431cc425f4a55f0ebead67f0e816d88b30e6e2546dc90ba36abf3747cf8512b0d6"
}
```

**Respuesta de ejemplo — aceptado (200 OK)**

```json
{
    "ProcesoId": 814591,
    "EsValido": true,
    "CodigoUnicoValidacion": "712cf437a5ac5a6a1503905ed9566f431cc425f4a55f0ebead67f0e816d88b30e6e2546dc90ba36abf3747cf8512b0d6",
    "FechaValidacion": "2025-04-10T16:22:24.7522165",
    "NumDocumentoIdObligado": "901355357",
    "NumeroDocumento": null,
    "FechaEmision": null,
    "TotalFactura": 0,
    "CantidadUsuarios": 1,
    "CantidadAtenciones": 1,
    "TotalValorServicios": 0,
    "IdentificacionAdquiriente": null,
    "CodigoPrestador": "",
    "ModalidadPago": "",
    "NumDocumentoReferenciado": null,
    "UrlJson": null,
    "UrlXml": null,
    "JsonFile": null,
    "XmlFileBase64": null,
    "ResultadosValidacion": []
}
```

---

### Descargar los archivos del CUV

`POST https://apirips.facturapro.co/api/ConsultasFevRips/DescargarArchivosFevRipsCUV`

DESCARGAR LOS ARCHIVOS DE UN CUV

* descarga el paquete que quedo registrado para un Codigo Unico de Validacion (CUV): el JSON de los RIPS y el XML de la factura
* el unico campo del cuerpo es "codigoUnicoValidacion"
* va al grupo ConsultasFevRips y no al de PaquetesFevRips:

.../api/ConsultasFevRips/DescargarArchivosFevRipsCUV

* usa el mismo token que los servicios de carga, el que devuelve el Login de la carpeta Auth

**Autenticación:** `bearer`

**Body**

```json
{
    "codigoUnicoValidacion": "712cf437a5ac5a6a1503905ed9566f431cc425f4a55f0ebead67f0e816d88b30e6e2546dc90ba36abf3747cf8512b0d6"
}
```

**Respuesta de ejemplo — aceptado (200 OK)**

```json
{
    "ProcesoId": 814591,
    "EsValido": true,
    "CodigoUnicoValidacion": "712cf437a5ac5a6a1503905ed9566f431cc425f4a55f0ebead67f0e816d88b30e6e2546dc90ba36abf3747cf8512b0d6",
    "FechaValidacion": "2025-04-10T16:22:24.7522165",
    "NumDocumentoIdObligado": "901355357",
    "NumeroDocumento": null,
    "FechaEmision": null,
    "TotalFactura": 0,
    "CantidadUsuarios": 1,
    "CantidadAtenciones": 1,
    "TotalValorServicios": 0,
    "IdentificacionAdquiriente": null,
    "CodigoPrestador": "",
    "ModalidadPago": "",
    "NumDocumentoReferenciado": null,
    "UrlJson": null,
    "UrlXml": null,
    "JsonFile": null,
    "XmlFileBase64": null,
    "ResultadosValidacion": []
}
```

---

### Recuperar el CUV de una factura ya validada

`POST https://apirips.facturapro.co/api/ConsultasFevRips/RecuperarCUV`

RECUPERAR UN CUV

* devuelve el Codigo Unico de Validacion (CUV) de un paquete que ya fue cargado, cuando se perdio la respuesta original del servicio de carga
* el unico campo del cuerpo es "codigoUnicoValidacion"
* va al grupo ConsultasFevRips y no al de PaquetesFevRips:

.../api/ConsultasFevRips/RecuperarCUV

* usa el mismo token que los servicios de carga, el que devuelve el Login de la carpeta Auth

**Autenticación:** `bearer`

**Body**

```json
{
    "codigoUnicoValidacion": "712cf437a5ac5a6a1503905ed9566f431cc425f4a55f0ebead67f0e816d88b30e6e2546dc90ba36abf3747cf8512b0d6"
}
```

**Respuesta de ejemplo — aceptado (200 OK)**

```json
{
    "ResultState": true,
    "ProcesoId": 814591,
    "NumFactura": "1",
    "CodigoUnicoValidacion": "712cf437a5ac5a6a1503905ed9566f431cc425f4a55f0ebead67f0e816d88b30e6e2546dc90ba36abf3747cf8512b0d6",
    "CodigoUnicoValidacionToShow": "712cf437a5ac5a6a1503905ed9566f431cc425f4a55f0ebead67f0e816d88b30e6e2546dc90ba36abf3747cf8512b0d6",
    "FechaRadicacion": "2025-04-10T16:22:24.7522165",
    "RutaArchivos": null,
    "ResultadosValidacion": []
}
```

---
