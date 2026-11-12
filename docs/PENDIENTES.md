# Pendientes — OrveX.IA

| Campo | Valor |
|---|---|
| Fecha de corte | 5 de noviembre de 2026. Reorganizado el 12 de noviembre de 2026 con el orden de etapas definitivo de DataDian (enmienda de ADR-014) |
| Base | `docs/DOCUMENTO_MADRE_SUITE_TELCOBRAS.md` v1.4 |
| Uso | Lista única de lo que **no** está definido o hecho. Cuando un punto se resuelve, se marca aquí y se actualiza el documento madre, el ADR o la especificación de etapa correspondiente |

**Ruta vigente desde el 12-nov-2026** ([ADR-014](decisions/ADR-014-arquitectura-datadian-telco.md), enmienda del 12-nov-2026): etapa 1 cerrada; DataDian en las etapas 2 (base de datos), 3 (frontend), 4 (backend: Telco y API) y 5 (integración con Odoo 19); CRM y notificaciones en la 6; Integration Hub y LeadGen en la 7; puente Make y Automatización en la 8; analítica, planes, Panel Global y piloto en la 9; agentes propios en la 10.

**Especificaciones:** índice en [`docs/etapas/README.md`](etapas/README.md). DataDian: [ruta de trabajo](modules/documents/RUTA_DE_TRABAJO_DATADIAN.md) y documentos de arquitectura de [base de datos](modules/documents/ARQUITECTURA_DB_DATADIAN.md), [frontend](modules/documents/ARQUITECTURA_FRONTEND_DATADIAN.md) y [backend](modules/documents/ARQUITECTURA_BACKEND_DATADIAN.md); CRM, etapa 6, en [`ETAPA_6_ESPECIFICACION.md`](etapas/ETAPA_6_ESPECIFICACION.md) (decisiones E2-1 a E2-13).

**Lo que sí está definido** (no se repite aquí): visión, 12 módulos, decisiones D-01–D-06, D-08–D-13, D-15–D-17 y D-20–D-24 (ADR-001 a ADR-014), paleta y tipografía, layout de 5 zonas, modelo de datos conceptual, reglas de seguridad, requisitos de rendimiento (§19), ruta por etapas (§15) y las decisiones 1 a 9 de la base de datos de DataDian, aceptadas el 12-nov-2026 ([ruta de trabajo](modules/documents/RUTA_DE_TRABAJO_DATADIAN.md) §6).

## 1. Decisiones diferidas

| ID | Qué falta decidir | Quién | Bloquea |
|---|---|---|---|
| D-13 | Proveedor y región del VPS y del S3; transferencia internacional (Ley 1581) si quedan fuera de Colombia | Gerencia + arquitecto | Paso a producción de DataDian (subetapa 4.6) y producción de la suite (etapa 9) |
| D-14 | Figura ante la DIAN: PT tercero, mandato (evento 043), habilitación propia o solo descarga | Arquitecto + contabilidad/legal | Subetapa 4.4: registrar el software y enviar eventos RADIAN; `SignerRole` y `DianExtensions` (PV-11). Descargar el XML por CUFE (subetapas 4.2 y 4.3) solo necesita el certificado de la organización |
| D-16 | Versión exacta, edición y hosting de Odoo; si su RADIAN nativo duplica el módulo o envía eventos por su cuenta | Arquitecto | Etapa 5 (borrador en Odoo) y paso a producción de DataDian (subetapa 4.6) |
| D-18 | Lenguaje de los agentes (Python o TS), tracing propio, ZDR y retención con OpenAI | Arquitecto | Etapa 10 |
| D-19 | WhatsApp multi-tenant (WABA por organización o número compartido) | Arquitecto | Etapa 7+ |
| D-21 | Validación legal de las fuentes de LeadGen (RUES, datos de personas) | Arquitecto + legal | Etapa 7 (LeadGen) |
| D-25 | Modelo comercial: planes, límites y precios | Gerencia | Etapa 9 |

## 2. Información por conseguir

| Qué | Para qué |
|---|---|
| Acceso al repositorio de LeadGen (+ Harvey) | Inventario de stack, API, fuentes y datos (D-21) |
| Acceso a la herramienta RADIAN actual | Saber con qué figura opera hoy ante la DIAN (D-14) |
| Acceso de lectura a Make | Inventario de escenarios y credenciales; plan de salida |
| Datos de la instancia de Odoo 19 Online y el detalle de la petición HTTP del **escenario de Make.com** que hoy le envía datos y archivos (URL, modelo, campos, credencial). El acceso ya está confirmado; la suite replica esa lógica | D-16 y la etapa 5 |
| **Certificado digital `.pfx` (PKCS#12) de pruebas de Telcobras** y su contraseña | Etapa 4: cierre de la 4.1 con un certificado real y pruebas en habilitación de la 4.2, la 4.3 y la 4.4 (firma XAdES-EPES, WS-Security y entrada al portal con mTLS). Mientras tanto, la CI usa certificados de una CA de pruebas |
| **Registro del software propio ante la DIAN:** SoftwareID, PIN y set de pruebas de habilitación | Subetapa 4.4: el software registrado es el que envía los eventos y, según los informes, el PIN entra en el CUDE (PV-2). Paso a producción en la 4.6. Depende de D-14 |
| Certificado y software de pruebas para la CI nocturna contra habilitación, y quién custodia esos secretos | Subetapa 4.6 y backend §10.4 (decisión 14 del backend). Depende de D-14 |

## 3. Temas que el documento madre no define todavía

| Tema | Estado | Cuándo |
|---|---|---|
| Diseño responsive (tablet y móvil) | Diferido; solo escritorio ≥ 1280 px | Antes del piloto |
| Sidebar colapsable a 64 px | Mejora posterior; 256 px fijo | Posterior |
| Router, formularios y cliente API del frontend | Sin elegir | Al montar la etapa 1 |
| Lint y formato (ESLint/Prettier o Biome) | Sin elegir | Etapa 1 |
| Tiempo real: SSE o WebSocket, autenticación, reconexión | ✅ Resuelto: SSE (E2-4, `docs/etapas/ETAPA_6_ESPECIFICACION.md`). DataDian decide si adelanta un SSE propio en la 4.6 (decisión 11 del frontend y del backend) | Etapa 6 (o 4.6 para DataDian) |
| Bus de eventos: sobre, DLQ, retención | ✅ Resuelto: E2-13 (outbox + BullMQ + mensajes fallidos). La cola de Telco es una tabla de PostgreSQL (`telco_jobs`, aceptada el 12-nov-2026), con el mismo patrón de outbox | Subetapa 2.7 (cola de Telco) y etapa 6 (E2-13) |
| Búsqueda (Ctrl+K global, deduplicación de leads) | ✅ Resuelto: E2-6 y E2-3 | Etapa 6 |
| UI de notificaciones (más allá de la campana) | ✅ Resuelto: E2-5 (campana, bandeja, correo, preferencias) | Etapa 6 |
| Consentimiento y lista de supresión unificada (correo y WhatsApp, Ley 2300) | Sin definir | Etapa 7 |
| Dominios de envío por organización (SPF, DKIM, DMARC) y proveedor de correo | Sin definir | Etapa 7 |
| Retención legal del XML de las facturas recibidas, de los eventos RADIAN y de la auditoría | Sin definir. La base de datos de DataDian no permite borrar facturas, eventos ni archivos (punto 11 de la §11 de la arquitectura de base de datos); *Object Lock* propuesto | Antes de permitir cualquier borrado en DataDian |
| Certificados digitales por organización (custodia, vencimientos, XAdES-EPES) | Tabla `dian_certificates` con historial aceptada (subetapa 2.3); vault, validaciones y firma en la 4.1. El envío de eventos depende de D-14 | Subetapas 2.3 y 4.1 |
| Calendario de días hábiles y festivos de Colombia | ✅ Implementado en la subetapa 2.2 (2020 a 2035, en auditoría). Falta el cómputo exacto del plazo (PV-4) y contrastar cada año con el calendario oficial (`co_holiday_years.verified_at`) | Subetapas 2.2 y 4.5 |
| SSO corporativo (Okta/Entra) por organización | Diferido por D-09 | Posterior |
| TOTP obligatorio para administradores de organización y superadministradores | Sin implementar; hoy es opcional para todos (ADR-012) | Antes del piloto |
| Exigir TOTP también al entrar con Google: hoy quien tiene TOTP activo entra con Google sin el segundo factor, porque el hook de Better Auth solo cubre el código por correo y el callback de OAuth es una navegación (hay que redirigir a `/iniciar-sesion?paso=totp`) | Sin implementar; decidir si se corrige o si se acepta porque Google Workspace aplica su propia verificación (ADR-012) | Antes de habilitar Google en producción |
| Límite de envíos de códigos de acceso por cuenta y por hora; confirmar el límite por IP de Better Auth en producción (hoy 3 por minuto, solo activo en producción) | Sin definir (ADR-012) | Antes del piloto |
| Duración de la sesión (hoy 7 días por defecto de Better Auth) y una más corta para administradores | Sin definir (ADR-012) | Antes del piloto |
| Restablecimiento del TOTP por un administrador cuando la persona perdió la app y los códigos de respaldo | Sin definir (ADR-012) | Antes del piloto |
| Logo gráfico de OrveX.IA y eslogan propio: hoy el logotipo es solo texto animado (`apps/web/src/shell/zone0-topbar/logo.tsx`) y conserva el eslogan de Telcobras «Una nueva forma de entender las redes» | Pendiente del diseño de marca | Antes del piloto |
| NIT repetido al crear una organización: la base no lo impide (`organizations.nit` sin restricción única) y el formulario muestra un error genérico si la API rechaza la creación | Sin decidir si el NIT debe ser único y qué mensaje mostrar. En DataDian, `dian_settings.nit` sí será único (decisión aceptada) | Antes del piloto |
| Acceso a «Registrar otra organización» también desde el selector de organizaciones (hoy solo está en el menú de usuario) | Mejora opcional | Posterior |
| Suplantación del superadmin: duración, aviso, quién autoriza | Solo el principio (auditada) | Etapa 9 |
| Facturación electrónica de la propia suite | Sin definir | Etapa 9 |
| Herramienta de analítica (réplica, vistas, almacén) | Sin definir (D-20 cubre el alcance) | Etapa 9 |
| Responsable del "NOC 24/7" y SLA de soporte | Sin definir | Etapa 9 |
| Respuesta a incidentes y notificación de brechas a la SIC | Sin definir | Etapa 9 |
| Agentes: herramientas, evaluación, memoria/RAG, costos por organización | Solo conceptual | Etapa 10 |
| Presupuestos de rendimiento (§19.4) y timeouts | Punto de partida sin datos reales | Ajustar en la subetapa 3.8 (con mocks) y en la 4.6 (con la primera interfaz con datos reales) |
| Administración de miembros y roles en la interfaz (invitar con un rol limitado desde la web) | Criterio de salida de la etapa 1 no verificado; la API de invitaciones ya existe (ADR-013) | Antes del piloto |
| E2E autenticado (registro → login → cambiar de organización → menú según el rol) | Criterio de salida de la etapa 1 no verificado (ADR-013) | Antes del piloto |
| Lighthouse móvil con Slow 4G y presupuestos de §19.4 en la CI | Criterio de salida de la etapa 1 no verificado (ADR-013) | Antes del piloto |
| Etapas que muestran las vistas de reserva (`apps/web/src/features/module-placeholder/stages.ts`) | **Desalineado:** el código sigue la primera versión de ADR-014 (comercial 9, LeadGen e integraciones 10, automatización 11, analítica y ayuda 12, IA 13). Con el orden definitivo debe quedar: DataDian 2; comercial 6; LeadGen, integraciones y «Estado de red» 7; automatización 8; analítica, ayuda, «Métricas rápidas», «Resumen de operaciones» y «Suscripción» 9; IA 10 | Próxima intervención que toque `apps/web` |

## 4. Verificaciones pendientes

| Qué | Por qué |
|---|---|
| Versiones, fechas y normas de la auditoría web (Node 26, NestJS 12, retiro de MinIO, Assistants API, Res. DIAN 000227/2025, Odoo 20, licencia n8n) | Sin verificación cruzada: confirmar en la fuente oficial al usarlas. Lo de la DIAN está en §7.1 (PV-6) |
| React Compiler estable y compatible | Requisito de §19.1 sin confirmar |
| Licencia de n8n para el uso interno | Confirmar por escrito con n8n |

## 5. Pantallas de Stitch

La carpeta se eliminó el 4-nov-2026. Solo 6 pantallas tuvieron ficha detallada (layouts y dashboard); las otras 17 quedaron con inventario de títulos, columnas y botones (documento madre §4, §12, §18-A). El detalle visual fino de esas pantallas se diseña de nuevo al construir cada módulo, con la paleta oficial.

## 6. Entorno y repositorio

| Qué | Estado |
|---|---|
| Docker Desktop (WSL2) | ✅ Instalado (Docker 29.9.2, Compose v5.6.1) |
| pnpm | ✅ Instalado (12.16.1) |
| `CLAUDE.md` de graphify | ✅ Versionado. Se borró por accidente el 12-nov-2026 y se restauró sin cambios |
| Grafo de graphify | ✅ Generado en `graphify-out/` tras iniciar la implementación |
| Cambios sin commit | Al 12-nov-2026 hay muchos cambios sin commit: retiro de la vía anterior de DataDian, migraciones `0009` y `0010`, rol `app_worker`, documentos de arquitectura y esta reorganización. Revisarlos y agruparlos antes de commitear |

## 7. DataDian y Telco: pendientes por etapa

Ruta en [RUTA_DE_TRABAJO_DATADIAN.md](modules/documents/RUTA_DE_TRABAJO_DATADIAN.md); arquitectura en [ARQUITECTURA_DATADIAN_TELCO.md](modules/documents/ARQUITECTURA_DATADIAN_TELCO.md) y en los documentos por etapa; decisión en [ADR-014](decisions/ADR-014-arquitectura-datadian-telco.md); blueprint oficial en [`docs/modules/documents/DataDian/`](<modules/documents/DataDian/arquitectura Eventos RADIAN DIAN.md>). Lo que el blueprint afirma y otra fuente contradice no se toma como hecho: queda en §7.1 hasta verificarlo contra fuentes primarias (anexo técnico, WSDL y normas de la DIAN).

### 7.1 Puntos por verificar contra fuentes primarias

Numeración de [ARQUITECTURA_BACKEND_DATADIAN.md](modules/documents/ARQUITECTURA_BACKEND_DATADIAN.md) §14 (Back), que es la misma de [ARQUITECTURA_FRONTEND_DATADIAN.md](modules/documents/ARQUITECTURA_FRONTEND_DATADIAN.md) §12 (Front). La columna "BD" remite a [ARQUITECTURA_DB_DATADIAN.md](modules/documents/ARQUITECTURA_DB_DATADIAN.md) §11 y "Gral." a [ARQUITECTURA_DATADIAN_TELCO.md](modules/documents/ARQUITECTURA_DATADIAN_TELCO.md) §10. Fuentes primarias: anexo técnico T5.1 de la **Resolución 000227 de 2025**, WSDL de `WcfDianCustomerServices.svc`, política de firma v2, **Resolución 085 de 2022** y [`Instructivo-RADIAN.pdf`](Instructivo-RADIAN.pdf) (en el repositorio, sin contrastar).

| ID | Punto | Lo que falta | Fuente primaria | Referencias | Bloquea |
|---|---|---|---|---|---|
| PV-1 | Operación de envío de eventos | Los informes dicen `SendEvent`; la referencia de APIDIAN usa `SendEventUpdateStatus` y `GetStatusEvent`. Confirmar nombres, `wsa:Action` y campos de la respuesta | WSDL | Back 1, Front 1, BD 1, Gral. 1 | 4.2, 4.4 |
| PV-2 | Fórmula del CUDE de eventos | La lista del blueprint parece la del CUFE; «Automatización» da otra. Tomarla del anexo con sus vectores | Anexo T5.1 | Back 2, Front 2, BD 2, Gral. 2 | 4.4 |
| PV-3 | Código del evento: `CustomizationID` o `ResponseCode`, y concepto del reclamo | Los informes se contradicen; la plantilla de referencia usa `CustomizationID` = 1, el código en `ResponseCode` y el concepto en `listID` | Anexo T5.1 y XSD | Back 3, Front 3, BD 3, Gral. 3 | 4.4 |
| PV-4 | "72 horas" frente a "3 días hábiles" | Desde qué instante corre, hora de corte, sábado y festivos. Mientras tanto rige la regla por defecto aceptada (3 días hábiles desde el registro del 032) | Código de Comercio art. 773, Decreto 1074 de 2015 (mod. 1154 de 2020), Resolución 085 de 2022 | Back 4, Front 4, BD 4, Gral. 4 | 4.5 (con valor por defecto) |
| PV-5 | Si el 031 exige el 032 | Se siembra que sí (decisión aceptada) hasta verificarlo | Anexo T5.1, Instructivo de RADIAN | Back 5, Front 5, BD 5, Gral. 5 | — |
| PV-6 | Normativa vigente | Los informes citan el anexo 1.9 y proyectos de 2019. Contrastar cada regla con la 000227 de 2025 y la 085 de 2022, y el Instructivo | Resoluciones 000227 de 2025 y 085 de 2022 | Back 6, Front 6, BD 6, Gral. 6 | Todas |
| PV-7 | Acceso automatizado al portal | Bloqueo de robots desde el 28-jul-2026 (comunicado del 23-jul-2026); revisión legal abierta. **No se resuelven captchas con terceros** ni se evade una comprobación humana | Revisión legal, términos de uso, prueba en habilitación | Back 7, Front 7, Gral. 7 | 4.3 en producción |
| PV-8 | Eventos solo en ventas a crédito | Ubicar la forma de pago (`cac:PaymentMeans/cbc:ID`) y decidir qué hace la suite con las de contado, en los eventos y en Odoo | Anexo T5.1 | Back 8, Front 8, BD 8, Gral. 8 | — (Etapas 3 y 5 deciden qué mostrar y si van a Odoo) |
| PV-9 | URI de firma XAdES | El informe del `.pfx` escribe `#rsasha256`; lo correcto (RFC 6931) es `#rsa-sha256`, `#rsa-sha384` y `#rsa-sha512` | RFC 6931, política de firma v2 | Back 9, Front 9, Gral. §10.10 | 4.1 |
| PV-10 | Hora legal colombiana | La publica el INM (Decreto 4175 de 2011), no la SIC | Decreto 4175 de 2011 | Back 10, Front 10 | 4.1 |
| PV-11 | `SignerRole` del adquirente y `DianExtensions` del evento | Depende de D-14 | Política de firma v2, anexo T5.1 | Back 11, Front 11 | 4.4 |
| PV-12 | Datos de la persona en el 030 y el 032 | La referencia envía `issuer_party`. **Si se confirma, cambia la Etapa 2** (§7.2) | Anexo T5.1 | Back 12, Front 12 | 4.4 |
| PV-13 | `cbc:ID` del evento y nomenclatura del ZIP y del XML | Si exige consecutivo, **cambia la Etapa 2** (§7.2) | Anexo T5.1 | Back 13, Front 13 | 4.4 |
| PV-14 | `SoftwareSecurityCode` del evento | Si aplica y cómo se calcula | Anexo T5.1 | Back 14 | 4.4 |
| PV-15 | Formato y ventana de `wsu:Timestamp`; `PrefixList` de la transformación | Los informes difieren (5 minutos, milisegundos, `"soap wcf"`) | WSDL y prueba en habilitación | Back 15 | 4.2 |
| PV-16 | Canonicalización del `SignedInfo` de XAdES, `KeyInfo` y algoritmo del `SigPolicyHash` | C14N inclusiva o exclusiva; SHA-256 o SHA-512 | Política de firma v2 | Back 16 | 4.1 |
| PV-17 | Ubicación del NIT en el certificado | Varía por entidad certificadora | Prácticas de certificación de cada entidad | Back 17 | 4.1 |
| PV-18 | Formato de las respuestas de la DIAN | Campos (`XmlBytesBase64`, `Code`, `IsValid`, `StatusMessage`, `ErrorMessage`) y códigos (`ZE02`, `FAC03`, `AAH10`); cómo consultar los eventos de una factura | WSDL y anexo T5.1 | Back 18, BD 13 | 4.2 |
| PV-19 | Catálogo de conceptos del reclamo | `01` a `04` según la referencia, corregidos por el rechazo `AAH10` | Anexo T5.1 | Back 19, Front 19, BD 3 | 4.4 |
| PV-20 | Servidor NTP oficial y tolerancia | `NTP_SERVERS` y `CLOCK_MAX_SKEW_MS` configurables | INM | Back 20 | 4.1 |

**Puntos solo de la base de datos** (§11 de su documento; el diseño ya los absorbe): BD 9 (formato del CUFE en facturas antiguas: `CHECK` `NOT VALID`), BD 10 (set de pruebas de eventos en habilitación: `test_set_id` nulable), BD 11 (retención legal del XML y del PDF: sin `DELETE`, ver §3) y BD 12 (autenticación IMAP: `password` u `oauth2`).

**Otros puntos que vienen de las fichas retiradas** (en [`ETAPA_4_BACKEND.md`](etapas/ETAPA_4_BACKEND.md)): raíces de confianza aceptadas por la DIAN; si la DIAN entrega el documento solo cuando el NIT del certificado es parte de él y si consultar exige algo más que el certificado; CUFE disponible en habilitación; columnas exactas del listado del portal; si el descubrimiento incluye documentos emitidos; si la DIAN publica una hoja XSLT oficial ([`ETAPA_3_FRONTEND.md`](etapas/ETAPA_3_FRONTEND.md)); si, vencido el plazo sin 034, todavía se puede enviar el 033 o el 031 ([`ETAPA_2_BASE_DE_DATOS.md`](etapas/ETAPA_2_BASE_DE_DATOS.md)).

### 7.2 Pendientes por etapa

| Etapa | Pendiente | Estado |
|---|---|---|
| 2 | **Auditar las subetapas 2.1 y 2.2** (rol `app_worker`, migración `0010`) y continuar con la 2.3 | En curso |
| 2 | **Operativo:** antes de aplicar la `0010` en cualquier entorno existente, correr `infra/compose/postgres/app-worker.sql` con `APP_WORKER_PASSWORD` (crea o completa `app_worker`; sin la variable, `init.sql` lo deja `NOLOGIN`) | Pendiente en cada entorno existente |
| 2 | `drizzle-kit generate` falla si `apps/api/src/database/migrations/meta/README.md` está dentro de `meta/`. Problema previo a DataDian; hay que moverlo o excluirlo antes de generar la `0011` | Sin corregir |
| 2 | Prueba de reversos en una base desechable de la CI (aplicar, revertir y volver a aplicar `0010` a `0017`). En la 2.2 el reverso se probó dentro de una transacción | Subetapa 2.9 |
| 2 | **Posibles cambios si se confirman PV-12 y PV-13:** columna para los datos de la persona que firma el 030 y el 032 en `radian_events` (identificación, nombres, cargo, dependencia) y secuencia por organización para el consecutivo `cbc:ID` del evento. Lo que no esté confirmado al llegar a la 2.6 entra como columna nulable o se deja para una migración de la Etapa 4 (decisión 16 del backend) | Abierto |
| 2 | Contraer el esquema anterior (`received_document_imports`, `import_id`, columnas del Excel y `odoo_*`) cuando el código nuevo deje de usarlo; no es reversible y exige respaldo previo (decisión 8 aceptada) | Etapa 4 o 5 |
| 3 | Decisiones abiertas de la §13 del frontend ([ruta](modules/documents/RUTA_DE_TRABAJO_DATADIAN.md) §7.1) | Abiertas |
| 3 | **La paleta oficial no tiene naranja** para el botón del 032 que pide el blueprint. Se propone el amarillo y las variantes `info` y `accent` en `@telcobras/ui` (decisión 4 del frontend) | Por confirmar |
| 4 | Decisiones abiertas de la §15 del backend ([ruta](modules/documents/RUTA_DE_TRABAJO_DATADIAN.md) §7.2) | Abiertas |
| 4 | **La API tiene la KEK:** con el cifrado envolvente de la Etapa 2, la API puede descifrar la llave de datos del `.pfx` aunque no la use. La decisión 6 del backend propone un sobre sellado asimétrico, que cambia el formato de `pfx_data_key` (Etapa 2): conviene decidirla antes de la subetapa 2.3 | Por decidir |
| 4 | Certificado `.pfx` de pruebas de Telcobras (§2) | Pendiente del usuario |
| 4 | Registro del software ante la DIAN: SoftwareID, PIN y habilitación (§2) | Pendiente; depende de D-14 |
| 4 | D-14 (§1); PV-1, PV-2, PV-3, PV-11 a PV-14 y PV-19 antes de la 4.4 | Pendiente |
| 4 | **Revisión legal del acceso automatizado al catálogo de la DIAN (PV-7)**; mientras tanto, RPA bloqueado en producción e ingesta por IMAP y carga manual | Abierta; bloquea la 4.3 en producción |
| 4 | Riesgo del código conservado: objeto huérfano en S3 si se revierte la transacción (la subida ocurre dentro de la transacción en `received-documents.service.ts`). Aplica a todo archivo nuevo de DataDian (XML, respuestas de la DIAN) | Sin corregir; se resuelve en la 4.3 para el XML y en la 5 para Odoo |
| 4 | D-13 para el paso a producción (subetapa 4.6) | Pendiente |
| 2 a 4 | Contrastar [`Instructivo-RADIAN.pdf`](Instructivo-RADIAN.pdf) con los documentos de arquitectura (PV-6) | Sin revisar |
| 5 | D-16 (§1) y detalle del escenario de Make.com (§2) | Pendiente |
| 5 | Disparador del borrador en Odoo: propuesto el 033 aceptado por la DIAN | Pendiente de confirmar con el usuario |
| 5 | **Riesgo del código conservado: llamada a Odoo dentro de una transacción de la base de datos** (`sendToOdoo` en `received-documents.service.ts`, dentro de `withTenant`): un Odoo lento retiene la transacción y la conexión, y un rollback deja el borrador en Odoo sin registro en la suite | Sin corregir |
| 5 | **Riesgo del código conservado: SSRF por la URL de Odoo configurable** (`saveOdoo` en `documents-settings.service.ts` acepta cualquier host; solo exige `https://` en producción) | Sin corregir |
| — | Mapa de etapas de `stages.ts` desalineado con el orden definitivo (§3) | Sin corregir |

### 7.3 Calidad del repositorio: fallos previos que DataDian no causó

La verificación del 12-nov-2026 dejó `pnpm typecheck` y las pruebas en verde. Estos comandos fallan por problemas que ya existían antes del trabajo de DataDian:

| Comando | Fallo | Dónde |
|---|---|---|
| `pnpm lint` (`biome check .`) | Errores previos | `Background_effects/` y `apps/web/src/components/interactive-backgrounds/` (según la bitácora del 11-nov-2026, también `.vscode/`) |
| `pnpm knip` | Hallazgos previos | `apps/web/src/shell/no-modules-view.tsx` y el kit de fondos interactivos. En una corrida del 12-nov-2026 knip terminó además con `RangeError: Array buffer allocation failed` (memoria del equipo) |
| `pnpm check:palette` | 7 colores fuera de la paleta | `apps/web/src/components/interactive-backgrounds/effects.js` (`hsla()`), `engine.js` (`#4f5ef0`), `apps/web/test/interactive-backgrounds.engine.test.ts` y `packages/ui/src/styles/theme.css:50` (`--color-tb-azul-claro: #a0d8f5`) |
