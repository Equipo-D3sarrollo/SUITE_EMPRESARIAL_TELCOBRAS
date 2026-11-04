# Documento madre — Suite Empresarial Telcobras

| Campo | Valor |
|---|---|
| Versión | 1.1 — aprobada para iniciar |
| Fecha | 4 de noviembre de 2026 |
| Estado | Aprobada por el arquitecto del producto (decisiones en §14, ADR en `docs/decisions/`) |
| Elaborado | Con Claude Code, a partir de las fuentes de `docs/Arquitectura/` |
| Alcance | Fuente única de verdad del proyecto. Las fuentes originales quedan como referencia |

## Resumen ejecutivo

- **Qué es:** una plataforma SaaS multiempresa de Telcobras. Reúne en una sola aplicación web un núcleo de identidad y permisos, CRM, LeadGen (prospección), RADIAN/DIAN (documentos electrónicos con aprobación humana hacia Odoo), un Integration Hub, gestión documental, notificaciones, analítica, planes y consumo. Los agentes de IA propios llegan en la última etapa.
- **Interfaz:** shell de 5 zonas (0 topbar, 1 sidebar con 10 módulos, 2 workspace ~72 %, 3 panel contextual ~28 %, 4 barra de estado). Al cambiar de submódulo no se recarga la página.
- **No partimos de cero:** el repositorio es nuevo, pero LeadGen (Python), la herramienta RADIAN, la automatización Make→Odoo y los agentes en Make ya existen (~80 %). El PDF prohíbe reescribirlos sin inspeccionarlos (H-01).
- **Las fuentes se contradicen en lo esencial:** framework frontend (H-02), estilo de backend (H-03), tecnología de agentes (H-04), papel de n8n (H-05), momento de los agentes (H-06), roles, pipeline y estados fijos frente a configurables (H-07), autenticación (H-08), infraestructura y SLA (H-09) y marca (H-15).
- **Riesgos críticos de la auditoría web** (sin verificación cruzada):
  - La Assistants API de OpenAI ya fue retirada (H-04).
  - MinIO Community está archivado (H-10).
  - Odoo 16 y XML-RPC están sin soporte o deprecados (H-11).
  - El flujo RADIAN del blueprint mezcla roles (H-12).
  - Para registrar eventos por terceros hace falta ser proveedor tecnológico (PT), tener un mandato o tener software habilitado (H-13).
  - El diseñador n8n para clientes exige licencia Enterprise (H-05).
  - Next 14.2.5 tiene un CVE crítico (H-14).
- **Decisiones (estado al 4-nov-2026):** 20 cerradas por el arquitecto (§14), registradas como ADR en `docs/decisions/`. Siguen abiertas:
  - D-07 (ORM), que se resuelve con la prueba de concepto de RLS de la etapa 0;
  - el proveedor y la región del VPS (D-13);
  - D-14, la figura ante la DIAN, que el arquitecto está averiguando;
  - el inventario de Odoo (D-16);
  - D-18, D-19 y D-25 (modelo comercial), que se deciden más adelante.

  **Ninguna bloquea la etapa 1.** El arquitecto decidió **diferirlas** y empezar con lo que ya está decidido.
- **Rendimiento (§19):** los estándares de frontend, red, base de datos, monitoreo y pruebas en móvil y con red lenta son obligatorios desde la etapa 1. Se descartan SSR/SSG por chocar con D-02.
- **Ruta propuesta** (§15, sin fechas):
  0. Decisiones y descubrimiento.
  1. Fundaciones.
  2. CRM y documentos.
  3. Integration Hub, Odoo y LeadGen.
  4. RADIAN y puente Make.
  5. Analítica, planes, panel global y piloto.
  6. Agentes propios.

## Tabla de contenido

0. Control del documento · 1. Visión y principios · 2. Activos existentes · 3. Mapa de módulos · 4. Especificación funcional · 5. Arquitectura técnica · 6. Stack consolidado · 7. Modelo de datos · 8. Seguridad y cumplimiento · 9. Infraestructura · 10. Integraciones · 11. Reglas de ingeniería y para Claude Code · 12. Frontend y UX · 13. Hallazgos · 14. Decisiones pendientes · 15. Ruta de abordaje · 16. Estructura documental · 17. Glosario · 18. Anexos · 19. Rendimiento, escalabilidad y calidad

---

## 0. Control del documento

### 0.1 Fuentes consolidadas

| Código | Archivo | Versión / fecha | Qué aporta |
|---|---|---|---|
| PDF | `Informe Maestro de Arquitectura.pdf` | v0.1, 3-nov-2026, 54 págs. | Visión, 12 módulos, reglas, decisiones acordadas/propuestas/pendientes (§26–§27), instrucciones para Claude Code (§29) |
| BP | `blueprint_t_cnico_y_arquitectura_suite_empresarial_telcobras.md` | "4.8.2-Enterprise-Release", sin fecha | Capas C4, matriz de 5 zonas por módulo, SQL inicial, flujo RADIAN, seguridad, roadmap de 12 semanas |
| LIB | `listado_tecnolog_as_y_librer_as_frontend_suite_telcobras.md` | sin fecha | Stack frontend, clases del layout, librerías, tokens, `package.json` |
| GUIA | `prompt_gu_a_para_claude_code_replicaci_n_suite_telcobras.md` | sin fecha | Comandos de instalación, layout en TSX, store Zustand, mapa de 10 módulos, reglas visuales |
| STITCH | `stitch_telcobras_enterprise_suite_demo/` | 23 pantallas únicas + DESIGN.md + 4 imágenes | Diseño visual de cada pantalla y design system "Telco Enterprise Core" |
| CAPT | `screenshot_20261103_*` | 3-nov-2026 23:36 y 23:59 | Prototipo del dashboard (canvas) con las zonas anotadas a mano por el usuario |
| MARCA | Manual de marca Telcobras 2026 (resumen interno) | 2026 | Colores, tipografía, logo y eslogan oficiales |
| AUD | Auditoría web de tecnologías del 4-nov-2026 | 5 categorías | Estado actual de versiones, licencias y normas. **Sin verificación cruzada**: confirmar antes de convertirla en ADR |

### 0.2 Jerarquía de fuentes (D-01)

> **Decisión del arquitecto (4-nov-2026):** los conflictos se resuelven **caso por caso**, cada uno en su D-xx de §14. El orden de abajo queda solo como orientación, no como regla.

1. **PDF** para alcance, límites de módulos, principios y estado de cada decisión (acordado, propuesta o pendiente). Es el más reciente, el más completo y está dirigido a Claude Code.
2. **STITCH + CAPT + GUIA/LIB** para la intención visual y de UX. Las afirmaciones técnicas que aparecen dentro de las pantallas no son especificación (H-16).
3. **BP** para la matriz de zonas por módulo y como insumo técnico. Su stack, infraestructura y roadmap son propuestas que ceden ante el PDF cuando chocan.
4. **MARCA** para la identidad corporativa. Su aplicación a la UI quedó decidida en D-04 (§12.4.1).
5. Ante conflicto, decide el arquitecto del producto (PDF §29). Claude Code no decide de forma unilateral.

### 0.3 Convenciones

- **Etiquetas:**
  - [ACORDADO]: decisión expresa del PDF §26/§27.
  - [PROPUESTA]: aún no aprobada.
  - [PENDIENTE]: decisión abierta, con su D-xx.
  - [CONFLICTO]: fuentes que se contradicen, con su H-xx.
  - [EJEMPLO]: dato ficticio del prototipo.
  - [REC]: recomendación de esta auditoría.
- **Citas:** (PDF §4.4), (BP §3), (LIB §5), (GUIA §6), (STITCH: pantalla), (MARCA §5), (AUD).

### 0.4 Uso y mantenimiento

Este documento manda sobre las fuentes originales. Cada cambio de decisión se registra como ADR en `docs/decisions/` (§16) y se actualiza aquí.

---

## 1. Visión, objetivos y principios

**Qué es (PDF §1.1).** Una plataforma de software empresarial que centraliza la gestión comercial, la captación de prospectos, la administración documental, la automatización y la IA. No es un CRM suelto ni un conjunto de automatizaciones sueltas: es un ecosistema de módulos especializados que comparten información, servicios, infraestructura y reglas, con una aplicación web central por organización.

**Objetivos (PDF §1.1):**
1. Centralizar las herramientas en una plataforma.
2. Integrar LeadGen.
3. Incorporar RADIAN/DIAN.
4. Incorporar un CRM.
5. Integrar Odoo, WhatsApp, correo y almacenamiento documental.
6. Más adelante, sumar agentes de IA por industria.
7. Que varias empresas la usen de forma independiente y segura.
8. Mantener la arquitectura modular.
9. Reducir la dependencia de plataformas externas de automatización.
10. Convertir las herramientas actuales en activos tecnológicos integrados.

**Principio fundamental (PDF §1.2):** un sistema central que coordina módulos especializados. Ni monolito mezclado ni aplicaciones aisladas. Esto implica:
- responsabilidades delimitadas;
- ningún módulo lee la base de datos interna de otro;
- comunicación por APIs y eventos controlados;
- identidad y permisos comunes;
- la web es la interfaz central;
- los procesos especializados pueden correr en servicios aparte;
- se pueden sumar módulos sin romper los existentes.

**Principios del BP §1** [PROPUESTA]:
- reactividad de 5 zonas sin recargas;
- aislamiento multi-tenant por NIT con cifrado AES-256 en reposo;
- colas con reintentos exponenciales para DIAN y Odoo;
- auditoría inmutable de accesos por IP y RBAC;
- latencia de UI < 20 ms.

**Cinco ideas que no se negocian (PDF §31):**
1. La suite es el producto; los módulos son sus capacidades.
2. Los activos existentes se aprovechan.
3. La interoperabilidad es el valor: LeadGen → CRM → oportunidad → agente → Odoo.
4. Los agentes son una capacidad propia, no una dependencia de Make o n8n.
5. Crecer sin perder el control: la documentación, los contratos, las pruebas y los ADR pesan más porque el desarrollo es asistido por IA.

---

## 2. Punto de partida: activos existentes (PDF §2)

| Activo | Estado conocido | Objetivo en la suite | Restricción |
|---|---|---|---|
| LeadGen | Funcional en local, ~80 %. Python (stack completo sin inspeccionar), backend y API propios, varias integraciones. No está en la nube. Se está unificando con **Harvey** (captación y contacto por correo) | Módulo de inteligencia comercial que entrega prospectos enriquecidos al CRM | No reescribir antes de inspeccionar repo, API, dependencias y funciones (PDF §2.1, §29.1) |
| RADIAN / DIAN | Herramienta funcional que descarga facturas y documentos. Escenario Make que recibe → extrae → procesa → envía a Odoo → crea **borradores** que se aprueban a mano. ~80 %. Stack y conexión con la DIAN sin confirmar | Módulo de inteligencia documental y automatización administrativa | La aprobación humana se mantiene; una extracción por IA no autoriza una operación contable (PDF §2.2) |
| Agentes en Make | Escenarios independientes, ~80 %: atención, ventas, consultas, CRM, ERP, Shopify, Drive/OneDrive, BD, Odoo, WhatsApp | Se conectan temporalmente vía webhooks/HTTPS. Al final se reconstruyen como agentes propios | Los usuarios no construyen agentes; Telcobras controla plantillas y capacidades (PDF §2.3, §27) |

**"Proyecto desde cero" frente a "no partimos de cero"** [CONFLICTO H-01]: el **repositorio de la suite** sí empieza desde cero (shell, núcleo, CRM, hub). Los tres activos se **integran por contrato** después de inspeccionarlos. Se necesita acceso a sus repositorios y a la cuenta de Make (inventario de la etapa 0, `PLAN_IMPLEMENTACION_INICIAL.md` §0.2).

---

## 3. Mapa de dominios, módulos y dependencias

```
                    SUITE EMPRESARIAL TELCOBRAS
      NÚCLEO CENTRAL        INTELIGENCIA COMERCIAL     OPERACIONES DOCUMENTALES
  orgs, usuarios, auth,     LeadGen, investigación,    RADIAN, DIAN, facturas,
  roles, permisos,          enriquecimiento, scoring,  extracción, validaciones,
  multiempresa, config      prospección, campañas, CRM Odoo, aprobaciones
                 └──────────── CAPA DE SERVICIOS ────────────┘
                     API HUB · EVENTOS · INTEGRACIONES
                    AGENT MANAGEMENT → RUNTIME / EXECUTION
                     MAKE (existentes) · n8n (validación) · DOCKER (propios → OpenAI Agents SDK → modelos)
```

**Módulos del PDF ↔ módulos de la UI ↔ pantallas de Stitch**

| Módulo (PDF) | Módulo UI (sidebar) | Pantalla Stitch | Motor del BP |
|---|---|---|---|
| 1 Núcleo central | 09 Administración (+ registro/onboarding) | roles_y_permisos, registro_y_acceso, registro_simple, inicio_de_sesion_recurrente, configuracion_inicial, configuracion_simplificada | Gateway + RBAC |
| 2 CRM | 02 Comercial | crm_pipeline_kanban | Core CRM Engine |
| 3 LeadGen | 03 Intel. Comercial | leadgen_inteligencia_comercial | LeadGen Algorítmico |
| 4 RADIAN / Document Intelligence | 04 Documentos | radian_facturas_dian_y_aprobaciones | RADIAN/DIAN Engine |
| 5 Integration Hub | 05 Integraciones | hub_de_integraciones | Integration Hub |
| 6 API Gateway | (transversal) | — | Capa 2 |
| 7 Agent Management (final) | 07 Intel. Artificial | agent_management_runtime_layer | AI Agent Sandboxes |
| 8 Document Management | 04 Documentos › Centro Documental | centro_documental | (MinIO/S3) |
| 9 Notificaciones | Campana de la Zona 0 (sin módulo) | — | — |
| 10 Analítica | 08 Analítica + 01 Inicio | dashboard_general_1/2, dashboard_ejecutivo | Analytics/BI |
| 11 Suscripciones | 09 › Suscripción y Licencias; Panel Global | panel_administrativo_global | — |
| 12 Futuro ERP | — | — | — |
| (no está en el PDF) | 06 Automatización | flujos_de_proceso_y_automatizacion | Workflow Engine n8n |
| (no está en el PDF) | 10 Ayuda | centro_de_ayuda | NOC & Telemetría |

**Dependencias (PDF §19):**

| Módulo | Depende de | Se relaciona con |
|---|---|---|
| Core | Base de datos | Todos |
| Identity | Core | Módulos protegidos |
| Organization Mgmt | Core | CRM, LeadGen, RADIAN, agentes |
| RBAC | Identity | Todas las operaciones |
| CRM | Core, Identity | LeadGen, notificaciones, analítica, agentes |
| LeadGen | Core, Integration Hub | CRM, campañas, analítica |
| RADIAN | Core, Document Mgmt | DIAN, Odoo, aprobaciones, analítica |
| Integration Hub | Core, Credential Manager | CRM, LeadGen, RADIAN, agentes |
| Document Mgmt | Core, Storage | RADIAN, CRM, agentes |
| Notifications | Core | CRM, RADIAN, integraciones, agentes |
| Analytics | Core, fuentes autorizadas | Todos |
| Agent Mgmt | Core, Identity | CRM, Hub, documentos |
| Runtime Layer | Agent Mgmt | Make, n8n, Docker |
| Agentes propios | Runtime, Tools, Models | CRM, Odoo, documentos, canales |
| Suscripciones | Core | Todo lo que consume recursos |

**Regla:** no hay dependencias circulares. LeadGen no llama al CRM por dentro: entrega por API o evento contractual, y el CRM decide qué crear o actualizar.

---

## 4. Especificación funcional por módulo

### 4.1 Núcleo central (PDF §4)

- **Organizaciones (tenants):**
  - **Campos:** id único, nombre comercial, razón social, NIT u otro identificador, contacto, configuración regional, zona horaria, estado, módulos habilitados y configuración particular.
  - **Aislamiento:** obligatorio en backend y base de datos, no solo en el frontend, para clientes, prospectos, usuarios, documentos, conversaciones, configuraciones, integraciones, credenciales, agentes, historiales y reportes. RLS de PostgreSQL actúa como segunda barrera.
- **Usuarios:**
  - **Campos:** id, nombre, correo, estado, organización, roles, fecha de creación y último acceso.
  - Todo usuario pertenece a una organización, salvo las cuentas internas de Telcobras.
  - **[DECIDIDO D-08]** Membresías usuario–organización: un usuario puede estar en varias organizaciones. Stitch muestra "Cambiar de empresa · 2 disp.".
- **Autenticación (funcional):**
  - **Funciones:** inicio y cierre de sesión, recuperación, sesiones, renovación de tokens, verificación de identidad y control de acceso.
  - **[DECIDIDO D-09]** Better Auth, sin contraseña: Google o correo + passkey, con TOTP (§8). La "recuperación de contraseña" del PDF §4.3 se reemplaza por la recuperación de acceso (nueva passkey verificada por correo y TOTP).
- **RBAC (PDF §4.4):**
  - **Roles de ejemplo:** Superadministrador Telcobras, Administrador de empresa, Gerente, Comercial, Administrativo, Contador, Operador y Usuario básico.
  - Los roles son **configurables**, no nombres fijos.
  - La autorización es por **recurso y acción**: consultar, crear, modificar o eliminar cliente; consultar o aprobar documentos; ejecutar agente; administrar integraciones.
  - Stitch agrega **alcances** ("propio equipo", "territorio"), **separación de funciones (SoD, 14 reglas)**, **cuotas** y una firma para confirmar cambios de permisos (STITCH: roles_y_permisos). Eso ya es autorización por atributos (H-07).
- **Configuración de organización:** datos generales, preferencias, zona horaria, moneda, notificaciones, integraciones, módulos habilitados, políticas internas y preferencias de agentes.
- **Auditoría** (PDF §4.6):
  - Registra quién creó o modificó, quién aprobó, qué agente o integración actuó, fecha y hora, y resultado.
  - **Auditoría ≠ logs técnicos.**

### 4.2 CRM (PDF §5)

- **Contactos:** nombre, apellido, correo, teléfono, cargo, empresa, origen, estado, etiquetas y observaciones.
- **Empresas:** nombre, razón social, NIT, sector, tamaño, dirección, web, contactos y estado comercial.
- **Leads:**
  - **Origen:** LeadGen, formularios web, importación, campañas, integraciones o registro manual.
  - **Detección de duplicados obligatoria.**
- **Oportunidades:**
  - **Pipeline [CONFLICTO H-07]:**
    - PDF: NUEVO LEAD → CONTACTADO → CALIFICADO → REUNIÓN → PROPUESTA → NEGOCIACIÓN → GANADO / PERDIDO, **configurable**.
    - BP: CALIFICACION, PROPUESTA, NEGOCIACION, CIERRE_GANADO, PERDIDO, con CHECK fijo.
    - UI: Calificación, Propuesta, Negociación, Cierre.
  - **[REC]** Etapas como datos (`pipeline_stages`), no como CHECK.
- **Actividades:** llamadas, correos, reuniones, seguimientos, tareas, notas y compromisos.
- **Historial de interacción:** incluye las conversaciones de agentes de IA.
- **Reportes:** leads obtenidos, contactados y calificados; oportunidades abiertas, ganadas y perdidas; tasa de conversión; tiempo medio de cierre; origen de prospectos.
- **UI (STITCH: crm_pipeline_kanban):**
  - Pestañas Kanban / Empresas / Contactos.
  - Contadores: Oportunidades 40, Empresas 148, Contactos 392, Actividades pendientes 18 [EJEMPLO].
  - Tabla: Razón social y NIT | Sector | Servicio principal | Ejecutivo | Monto estimado | Acción.
  - Acciones: "Ficha 360°", "Programar nueva actividad", "Exportar (Excel/PDF)", "Nueva Oportunidad".
  - Drag & drop entre columnas.
  - Zona 3 (BP): cuota del mes (82 % [EJEMPLO]), top ejecutivos y tasa de conversión.

### 4.3 LeadGen / Inteligencia comercial (PDF §6)

- **Responsabilidades:**
  1. Recibir criterios.
  2. Identificar fuentes.
  3. Consultarlas.
  4. Extraer.
  5. Normalizar.
  6. Deduplicar.
  7. Enriquecer.
  8. Clasificar.
  9. Puntuar, si existe modelo.
  10. Entregar al CRM.
  11. Permitir campañas de contacto autorizadas.
- **Separación:** LeadGen descubre; el CRM administra la relación.
- **Arquitectura conceptual:** API de investigación → motor de búsqueda → (fuentes externas, web pública, servicios integrados) → extracción → normalización → enriquecimiento → clasificación → deduplicación → resultados → CRM. La arquitectura real depende del repositorio existente.
- **Contrato con el CRM:** ejemplo, no definitivo.
  ```json
  {"source":"leadgen","company":{"name":"Empresa Ejemplo","website":"https://example.com","industry":"Servicios"},
   "contact":{"name":"Contacto Ejemplo","email":"contacto@example.com"},
   "classification":{"score":85,"category":"high_potential"}}
  ```
- **Campañas de contacto:**
  - Van separadas de la investigación.
  - **Requisitos:** plantillas, personalización, registro de envíos, control de frecuencia, estado de entrega, rebotes, respuestas, exclusiones, y consentimiento o base legal.
  - No se permite envío masivo sin límites.
- **Ley 1581 de 2012:** aplica sin importar la tecnología, y la SIC la extiende a la IA (Circular SIC 002/2024, AUD).
- **UI (STITCH: leadgen_inteligencia_comercial):**
  - Formulario "Configuración de nueva exploración B2B" con el botón "Iniciar investigación automatizada".
  - Tabla de prospectos: Empresa/Razón social | Industria y sede | Tomador de decisión | Contacto validado | Score afinidad Telco | Acción.
  - Acciones "Enviar a CRM" y "Enviar N seleccionados".
  - Detalle con pestañas Información empresarial / Fuentes consultadas / Infraestructura estimada / Historial.
  - Zona 3: filtros sectoriales y prospectos rastreados (1.428 [EJEMPLO]).
- **[CONFLICTO H-17]:** el BP propone "Web Scraping & RUES" y "Scoring IA (OpenAI)". Según AUD, el RUES no tiene API pública y sus términos restringen el acceso; la alternativa legal son los datos abiertos de Confecámaras (datos.gov.co, CC BY-SA 4.0). **[DECIDIDO D-21]** Primero se inventaría lo que usa LeadGen hoy y se valida con legal; no se agrega scraping nuevo.

### 4.4 RADIAN / Document Intelligence (PDF §7)

- **Responsabilidades:**
  - Consultar y descargar por mecanismos autorizados.
  - Organizar, extraer, normalizar y validar.
  - Detectar inconsistencias.
  - Asociar con empresas y terceros.
  - Enviar a sistemas administrativos.
  - Mantener trazabilidad.
  - Permitir revisión y aprobación humana.
- **Flujo:** obtención → almacenamiento → extracción → normalización → validación → reglas de negocio → (válido | inconsistencia → revisión humana) → integración Odoo → **borrador contable → aprobación humana** → operación final.
- **Submódulos:**
  - **A. Conector DIAN/RADIAN:** su forma depende del código existente.
  - **B. Document Manager:** id, tipo, organización, origen, fecha, estado, ubicación y hash.
  - **C. Extraction Engine:** lectura estructurada, XML, texto, OCR, e IA solo para casos específicos. *La IA no reemplaza las validaciones determinísticas.*
  - **D. Validation Engine:** campos obligatorios, identificadores, fechas, valores, coherencia, duplicados y reglas.
  - **E. Odoo Connector:** no depende de las tablas internas de Odoo.
  - **F. Human Approval.**
- **Dos máquinas de estado distintas** [CONFLICTO H-12]:
  - **Procesamiento interno** (PDF §7.4): RECIBIDO → PROCESANDO → EXTRAÍDO → VALIDADO → PENDIENTE DE APROBACIÓN → (RECHAZADO) → APROBADO → ENVIADO A ODOO → REGISTRADO.
  - **Eventos DIAN** (BP): RECIBIDA, ACUSE_030, RECIBO_032, ACEPTADA_034, RECHAZADA.
  - **Corrección de AUD:**
    - Como receptora, la suite registra 030 (acuse), 032 (recibo del bien o servicio) y luego 033 (aceptación expresa) o 031 (reclamo).
    - El **034 (aceptación tácita) lo registra el emisor**, a los 3 días hábiles sin reclamo.
    - Los eventos de título valor van del 035 al 051.
    - Norma compilada en la Resolución Única DIAN 000227 de 2025, que incluye la Res. 000085/2022 y la 000165/2023.
  - **[REC]** Modelar los eventos RADIAN como una tabla de eventos, aparte del estado interno.
- **UI (STITCH: radian_facturas_dian_y_aprobaciones):**
  - Filtros Todos / Pendiente aprobación / Aprobados / Sincronizados Odoo.
  - Tabla: No. factura y CUFE | Emisor/NIT | Fechas (emisión/vencimiento) | Monto total | Estado RADIAN/Odoo | Acciones.
  - Acción "Aprobar seleccionados", modal "Inspección de documento" y "Confirmar asiento contable".
  - Historial de auditoría RADIAN/Odoo.
  - Zona 3: tasa de aprobación fiscal (99,2 % [EJEMPLO]) y semáforo de pendientes.
  - Zona 4: certificado vigente y ping DIAN.

### 4.5 Integration Hub (PDF §8)

- **Sistemas:** Odoo (ERP), DIAN/RADIAN, WhatsApp, Google Drive, OneDrive, Shopify, correo, PostgreSQL autorizadas y APIs externas.
- **Componentes:** Connector Registry, Credential Manager (nunca en texto plano), Integration Configuration (por organización), Integration Execution e Integration Logs (solicitud, destino, fecha, resultado, tiempo, errores, id de ejecución).
- **Regla:** ningún módulo se conecta por su cuenta a un sistema externo compartido; se usan conectores reutilizables.
- **UI (STITCH: hub_de_integraciones):**
  - Tarjetas: Odoo ERP v17, WhatsApp Cloud API, Google Drive y GCS, OneDrive/SharePoint, Shopify B2B, SMTP/SendGrid, APIs REST y webhooks, PostgreSQL y pgvector.
  - Bóveda de secretos y latencia por servicio.
  - Log de peticiones: Timestamp | Servicio | Endpoint | Método | Código HTTP | Latencia | Carga útil | Acción.
  - Acciones "Verificar conexiones", "Probar conexión", "Configurar mapeos", "Plantillas HSM", "Verificar token" y "Gestionar permisos".

### 4.6 API Gateway y comunicación interna (PDF §9)

- **Gateway:** enrutamiento, validación de autenticación, control de acceso, rate limiting, versionado, registro, control de errores y correlación de peticiones.
- **Comunicación:**
  - **Síncrona:** REST sobre HTTPS, para respuestas inmediatas.
  - **Asíncrona:** cola de trabajos, para investigaciones masivas, procesamiento documental, campañas, agentes y reportes. **[DECIDIDO D-10]** BullMQ + Valkey + outbox. Valkey **no** sustituye a PostgreSQL como fuente de datos (PDF §17.5).
- **Eventos de negocio (ilustrativos):** `lead.created`, `lead.qualified`, `customer.created`, `document.received`, `document.validated`, `document.approval_requested`, `document.approved`, `integration.failed`, `agent.execution.started`, `agent.execution.completed`.

### 4.7 Document Management transversal (PDF §12)

- **Tipos:** contratos, propuestas, certificados, documentos comerciales, archivos de clientes, manuales, conocimiento para agentes, facturas y soportes.
- **Funciones:** almacenamiento, clasificación, metadatos, asociación con entidades, permisos, versiones, búsqueda, descarga, historial y control de acceso.
- **Separación:** los archivos van en almacenamiento de objetos; la base de datos guarda metadatos y referencias.
- **UI (STITCH: centro_documental):**
  - Categorías: Facturas RADIAN, Contratos, Propuestas, Certificados y pólizas, Administrativos.
  - Tabla: Documento/Folio | Empresa asociada | Origen | Fecha de carga | Estado | Acciones.
  - Acciones "Carga masiva", "Ingesta directa", "Sincronizar RADIAN/DIAN" y "Exportar".
  - Visor de XML.

### 4.8 Notificaciones (PDF §13)

- **Canales:** interna, correo, WhatsApp y alertas administrativas.
- **Ejemplos:** nuevo lead, documento pendiente de aprobación, error de integración, agente desconectado, nueva oportunidad y proceso documental finalizado.
- Notifications **entrega** los avisos; la decisión de negocio la toma cada módulo.
- En la UI solo existe la campana de la Zona 0. Falta diseño (H-18).

### 4.9 Analítica y reportes (PDF §14)

- **Indicadores:**
  - **Comerciales:** leads, calificados, conversión, ventas, oportunidades abiertas.
  - **Documentales:** procesados, pendientes, errores de extracción, aprobaciones pendientes.
  - **Automatización:** ejecuciones, completados, fallidos, tiempo.
  - **IA:** ejecuciones, consumo por organización, modelos, herramientas, tiempos, intervenciones humanas.
- Siempre respetan el aislamiento.
- **[DECIDIDO D-20]** Analítica separada: cada organización ve solo la suya. MRR, CAC, LTV, NDR y "Junta Directiva" (BP y STITCH: dashboard_ejecutivo) van solo en el Panel Global de Telcobras.

### 4.10 Suscripciones, planes y consumo (PDF §15)

- **Por organización:** plan, estado, módulos habilitados, límites, consumo y configuración comercial.
- **Se mide:** usuarios, documentos procesados, investigaciones, ejecuciones de agentes, mensajes y almacenamiento.
- **No confundir** con la facturación electrónica de los clientes.
- **UI:** "Licencias 24/30" y "Suscripción y licencias" en 09; columna "Consumo del período" en el Panel Global.

### 4.11 Automatización (módulo 06 de la UI; no está en el PDF)

- **BP:** "Diseñador y monitor de workflows n8n", ejecuciones, triggers y colas BullMQ.
- **PDF §10.3/§27:** n8n **solo para construir y validar**; no es motor de producción.
- **AUD (licencia):** la Sustainable Use License de n8n **prohíbe que los clientes externos construyan o configuren workflows**, incluso con una UI propia; eso exige Enterprise.
- **[DECIDIDO D-17]:** el módulo 06 es el **catálogo de procesos gobernados por Telcobras** que ya muestra Stitch (flujos_de_proceso), no un diseñador n8n.
  - **Procesos:** ingesta DIAN/RADIAN, sincronización CRM–Odoo, enriquecimiento de leads, alertas SLA por WhatsApp y respaldo KMS.
  - **Historial:** ID | Proceso | Disparador | Timestamp COT | Duración | Estado | Payload | Acciones.
  - **Acciones:** "Solicitar flujo personalizado" y "Políticas de concurrencia".

### 4.12 Agent Management y agentes de IA — ETAPA FINAL (PDF §10, §11, §27)

**Decisiones que no deben cambiarse** [ACORDADO]:
1. Los agentes propios son la última gran etapa.
2. Primero debe funcionar el resto.
3. Los agentes de Make se conectan temporalmente por webhooks o HTTPS.
4. n8n sirve para construir y validar.
5. n8n no es el motor de producción.
6. Los agentes validados se reconstruyen como aplicaciones propias.
7. Se construyen con **OpenAI Agents SDK**.
8. Corren en Docker.
9. La suite habla con ellos a través de Agent Management y la Runtime Layer.
10. Los usuarios no construyen agentes.
11. Telcobras controla plantillas, versiones, capacidades y herramientas.
12. Las organizaciones personalizan solo parámetros autorizados.

**Capacidades del Agents SDK que se usarán (PDF §11.1):** definición de agentes, instrucciones, herramientas, function calling, transferencias entre agentes, guardrails, sesiones, intervención humana, trazabilidad y orquestación multiagente. El ciclo del agente corre dentro de la aplicación de Telcobras, no en Make ni en n8n.

**Responsabilidades del módulo:**
- **Administra:** catálogo, plantillas, versiones, instancias por organización, configuraciones, permisos, canales, herramientas, conocimiento, disponibilidad, historial, consumo y motor asignado.
- **Plantilla, instancia y configuración:** dos organizaciones pueden usar la misma plantilla sin mezclar conversaciones, credenciales, documentos ni historiales.
- **Parámetros configurables:** nombre, tono, instrucciones dentro de límites, documentos de conocimiento, horarios, canales, integraciones, herramientas y parámetros comerciales.

**Cómo funciona un agente:**
- **Runtime:** Make (temporal) · n8n (validación) · Docker (definitivo).
- **Arquitectura interna:** definición (instrucciones, modelo, herramientas) → runner (guardrails, memoria, handoffs) → ejecución de herramientas (CRM, Odoo, WhatsApp) → resultado.
- **Capa de modelos:** proveedor, modelo, parámetros, límites, credenciales, disponibilidad y política de selección. No acoplarse a un solo modelo.
- **Tipos de agente por industria:** jurídico, comercio electrónico, servicios profesionales, contabilidad, educación e inmobiliario. Son conceptuales.

**Herramientas, memoria y observabilidad:**
- **Herramientas autorizadas:** por ejemplo `consultar_cliente()`, `buscar_productos()`, `registrar_interaccion()`, `crear_oportunidad()` y `enviar_mensaje()`. Nunca SQL libre.
- **Memoria:** conversacional, persistente y datos empresariales. La memoria **no** es fuente oficial; el saldo de una factura se consulta en el ERP.
- **Docker:** un runtime compartido es válido si hay aislamiento, límites y controles.
- **Observabilidad:** agente, organización, versión, modelo, herramientas, resultado, duración, errores y consumo.

**Correcciones de AUD:**
- El BP usa "OpenAI **Assistants** SDK": esa API **fue retirada el 26-ago-2026** [CONFLICTO H-04]. El Agents SDK trabaja sobre la Responses API.
- **El tracing del Agents SDK envía datos a OpenAI por defecto:** hay que desactivarlo o usar un exportador propio con `tenant_id` (Ley 1581).
- Los modelos citados en Stitch (gpt-4o-2024-*) se apagan el 14-ene-2027. Los modelos se configuran; no van fijos en el código.

**Ejemplos del BP:** LeadScout, Auditor RADIAN, CRM Sync. Stitch agrega Conciliador RADIAN, Asistente WhatsApp B2B y Soporte NOC.

### 4.13 Ayuda y soporte (módulo 10 de la UI)

- **Contenido (STITCH: centro_de_ayuda):**
  - Base de conocimiento por módulo y guías rápidas.
  - Recursos de desarrollador (API v3.1).
  - Mesa de ayuda "NOC 24/7", tickets, línea dedicada y "sesión por AnyDesk/Meet".
  - Estado de servicios.
- No está en el PDF. Falta definir quién atiende y con qué SLA real (H-20).

### 4.14 Superadministración SaaS / Panel Global

- **Acceso:** conmutador "Espacio Cliente | Panel Global" en la Zona 0.
- **STITCH (panel_administrativo_global):**
  - Tabla de organizaciones: Organización y NIT | Plan y SLA | Módulos | Usuarios/cupo | Consumo | Estado | Acciones.
  - Acciones "Aprovisionar nueva organización" e **"Impersonate"** (entrar como el cliente).
  - Salud de clústeres y conectores, auditoría global, informe forense CSV.
- El PDF solo nombra el rol Superadministrador Telcobras.
- **[REC]:** la suplantación necesita autorización, límite de tiempo, auditoría y aviso al cliente (D-09).

### 4.15 Futuro ERP (PDF §16)

- **Posibles funciones:** facturación, cartera, compras, inventario, proveedores, gastos, conciliación y reportes financieros.
- **No se construye ahora.** Se integra Odoo por el Hub. Si algún día se construye, será un dominio independiente.

---

## 5. Arquitectura técnica

### 5.1 Vista por capas

**BP (4 capas)** [PROPUESTA]:
1. **Cliente:** Next.js + Tailwind + Radix + Zustand + Recharts, en 5 zonas.
2. **Gateway:** NGINX/Cloudflare Enterprise, TLS 1.3, WAF, rate limiting, SSO Google/OAuth2 + OTP, JWT RS256 con rotación de 15 min y middleware RBAC.
3. **Servicios:** Node (NestJS/Fastify) + Python (FastAPI). Los 8 motores son Core CRM, RADIAN/DIAN, LeadGen, Integration Hub, Workflow (n8n + BullMQ), AI Sandboxes, Analytics/BI y NOC/Telemetría.
4. **Datos:** PostgreSQL 16 con RLS, Redis Cluster y MinIO/S3.

**PDF §18** (más simple):

```
Usuario → Web React+TS → API Gateway → Backend central Node/NestJS
  → {Core/Identity, CRM, Configuration} → Integration Hub → {LeadGen Python, RADIAN existente, Odoo externo}
  → PostgreSQL → Redis/cola → workers → [Agent Management (final) → Runtime → Make | n8n | Docker → Agents SDK → modelos]
```

"No implica microservicios desde el primer momento."

### 5.2 Estilo arquitectónico [DECIDIDO D-06: monolito modular NestJS]

- **El conflicto [CONFLICTO H-03]:** el BP propone microservicios con gRPC interno. El PDF dice: "no convertir todos los módulos en servicios independientes sin justificación", "no Kubernetes", "no una BD por módulo sin analizar" (§26, §29.6).
- **[DECIDIDO D-06]** Un **monolito modular en NestJS**, con un módulo por dominio y fronteras estrictas (ningún módulo toca las tablas de otro).
  - No se introducen Python y Node indiscriminadamente: Python solo donde ya existe o donde sea claramente conveniente, como LeadGen, el procesamiento documental existente o los agentes si D-18 elige Python (PDF §17.3).
  - El frontend no contiene lógica de negocio sensible ni se conecta a la base de datos: todo pasa por APIs autorizadas (PDF §17.1).
  - Los **servicios Python existentes** (LeadGen, RADIAN) quedan aparte, detrás de contratos HTTP o eventos.
  - **REST + OpenAPI** para la comunicación síncrona y **SSE o WebSocket** para el tiempo real.
  - gRPC-Web se descarta, porque el PDF §9.2 pide REST (AUD).

### 5.3 Comunicación

| Tipo | Uso | Tecnología [REC] |
|---|---|---|
| Síncrona | Consultas y acciones de la UI | REST/HTTPS versionado + OpenAPI; errores estructurados |
| Asíncrona | Investigación, documentos, campañas, agentes, reportes | Cola (D-10) + **outbox** en PostgreSQL, porque la entrega es "al menos una vez" |
| Eventos | Desacoplar módulos | Sobre con id, organización, versión y correlación; consumidores idempotentes |
| Tiempo real | Zonas 2–4 | SSE o WebSocket autenticados por organización |

**Idempotencia (PDF §25.7):** un webhook recibido dos veces no puede crear dos facturas. Se garantiza con UNIQUE por (organización, CUFE) o por id de webhook.

### 5.4 Flujos técnicos

- **Factura (BP §5):** el cliente o proveedor emite XML UBL 2.1 → webhook o servicio DIAN → validación del esquema y la firma (AUD: **XAdES-EPES**, no BES) → eventos RADIAN (con la corrección de §4.4) → sincronización asíncrona con Odoo → evento en tiempo real. Ahí la Zona 2 agrega la fila "Sincronizado", la Zona 3 actualiza el donut y el feed, y la Zona 4 incrementa el contador.
- **Captación (PDF §21.1):** solicitud → LeadGen → búsqueda → extracción → enriquecimiento → normalización y validación → duplicados → resultados → CRM → registro de leads → calificación → oportunidades → seguimiento.
- **Documental (PDF §21.2):** DIAN/RADIAN → obtención → Document Management → extracción → validación → (OK: borrador | error: revisión humana) → Odoo → aprobación → registro final.
- **Agente (PDF §21.3, etapa final):** mensaje → WhatsApp → runtime → Agents SDK → interpretación → herramientas (CRM, Odoo) → respuesta. El agente nunca tiene acceso libre a la base de datos.
- **Ecosistema (PDF §20):** inicio de sesión → autenticación → identificación del tenant → permisos → dashboard → CRM / LeadGen / RADIAN → analítica.

---

## 6. Stack tecnológico consolidado

Columnas: lo que dicen las fuentes, el estado verificado por AUD (4-nov-2026, sin verificación cruzada) y la recomendación.

### 6.1 Frontend

| Tecnología | Fuentes | Estado según AUD | [REC] |
|---|---|---|---|
| Framework | PDF: React+TS+Vite [PROPUESTA]; GUIA: Next.js 14 "obligatorio"; LIB: next 14.2.5 o Vite; opción 2: Nuxt/Vue [CONFLICTO H-02] | next 14.x sin soporte y con CVE-2025-29927 (bypass de middleware); Next vigente 16.x | **[DECIDIDO D-02] SPA React + Vite + TS.** Next.js descartado |
| React | 18.3.1 | 19.x | 19 |
| TypeScript | 5.x | 7.0 (compilador nativo) | Versión actual, comprobando que typescript-eslint la soporte |
| Estilos | PDF: Bootstrap; LIB/GUIA: Tailwind 3.4 | Tailwind 4.x (tokens en `@theme`; Safari ≥16.4) | Tailwind v4 (D-03) |
| Primitivos | Radix (accordion, popover, switch, dropdown, dialog) o shadcn/ui | shadcn usa Base UI por defecto desde jul-2026; falta `react-dialog` en el package.json | shadcn con Radix fijado de forma explícita |
| Iconos | GUIA: solo lucide; Stitch: Material Symbols [CONFLICTO H-21] | lucide 1.x ya no trae iconos de marca | **[DECIDIDO D-05]** lucide + SVG oficiales para los logos de terceros |
| Estado | zustand 4.5 | 5.x | zustand 5 **solo para el estado de UI**; **la URL es la fuente de verdad del módulo activo** (deep links e historial) |
| Gráficos | recharts 2.12 | 3.x | recharts 3 |
| Tablas | TanStack Table 8 | 9.x; no virtualiza | + paginación en servidor y `@tanstack/react-virtual` |
| Drag & drop | LIB: @dnd-kit; GUIA: @hello-pangea/dnd [CONFLICTO] | hello-pangea sin versiones desde feb-2025 | @dnd-kit |
| Animación | framer-motion 11 | ahora se llama `motion` | `motion` |
| Command bar | cmdk 1.0 | vigente | cmdk |
| Fuentes | Plus Jakarta Sans (+ Inter en DESIGN.md); MARCA: Arial Rounded + Poppins | — | **[DECIDIDO D-04c]** Poppins local, 3 pesos (§19.1) |
| Utilidades | clsx + tailwind-merge | — | sí |
| Datos y rendimiento | §19 | — | **Decidido en §19:** TanStack Query, React Compiler, @tanstack/react-virtual, knip, Lighthouse CI + Playwright |
| Vacíos | — | — | Router (TanStack Router o React Router), formularios (react-hook-form + zod), cliente generado desde OpenAPI, lint/format; se eligen al montar la etapa 1 |

**Referencia histórica:** el `package.json` de LIB §9 (next 14.2.5, react 18.3.1, tailwindcss 3.4.7, lucide 0.417, zustand 4.5.4, recharts 2.12.7, TanStack Table 8.19, dnd-kit core 6.1 / sortable 8, framer-motion 11.3, fontsource 5) y el `npm install` de GUIA §1 quedan **desactualizados**. No se usan tal cual.

### 6.2 Backend, datos e infraestructura

| Tecnología | Fuentes | Estado según AUD | [REC] |
|---|---|---|---|
| Runtime | Node | Node 26 LTS (desde 28-oct-2026); 24 en mantenimiento | Node 24 o 26 LTS |
| Backend | PDF: NestJS [PROPUESTA]; BP: NestJS/Fastify | NestJS 12.x (ESM) | NestJS sobre Fastify, monolito modular |
| Python | BP: FastAPI; PDF: solo donde ya existe | FastAPI 0.16x | Lo define la inspección de LeadGen y RADIAN |
| Base de datos | PDF: PostgreSQL [PROPUESTA fuerte]; BP: 16 | 18 estable (EOL 2030) | **PostgreSQL 18** |
| ORM y migraciones | ninguna | — | POC con RLS (D-07): Drizzle, Prisma o Kysely |
| Caché y cola | BP: Redis Cluster + BullMQ; PDF: cola pendiente; Stitch: Celery+RabbitMQ [CONFLICTO] | Redis 8 (AGPL/RSAL/SSPL), Valkey 9 (BSD); BullMQ 6.x tiene SDK Python | **[DECIDIDO D-10]** Una instancia de Valkey + BullMQ + outbox |
| Objetos | BP: MinIO/S3; PDF: pendiente | **MinIO Community archivado (25-abr-2026)** [H-10] | **[DECIDIDO D-11]** S3 gestionado vía API S3; en local, un contenedor S3-compatible |
| Tiempo real | BP: WebSocket; gRPC-Web | — | SSE o WebSocket (Socket.IO 4.8) |
| Contenedores | PDF: Docker + Compose [ACORDADO Docker; Compose PROPUESTA] | Compose v5 | Compose; sin Kubernetes (PDF §29.6) |
| Perímetro | BP: NGINX + Cloudflare Enterprise | Pro/Business ya traen WAF y rate limiting | Caddy (compresión y TLS, §19) + Cloudflare Pro/Business |
| Secretos | BP: Vault/KMS | Vault en BSL (IBM); OpenBao (MPL) | **[DECIDIDO D-12]** Cifrado envolvente en la app; llave maestra fuera de la BD |
| Backups | BP: RPO < 1 min, RTO < 15 min | pgBackRest revivió en may-2026; WAL-G 3.x | WAL-G o pgBackRest con PITR y restauración probada |
| Observabilidad | no definida (OTLP solo en Stitch) | — | OpenTelemetry + logs estructurados + Sentry |
| CI/CD | no definido | — | Pipeline con pruebas de aislamiento entre organizaciones desde el primer módulo |

### 6.3 IA y automatización

| Tecnología | Fuentes | Estado según AUD | [REC] |
|---|---|---|---|
| OpenAI Agents SDK | PDF [ACORDADO] | Python 0.24 / JS 0.21 (MIT, aún 0.x); el tracing a OpenAI viene activo por defecto | Etapa final; lenguaje en D-18; tracing propio |
| Assistants SDK | BP | **Retirada el 26-ago-2026** | Eliminar del BP |
| n8n | PDF: validación [ACORDADO]; BP: motor productivo [CONFLICTO H-05] | n8n 3.0 (27-oct-2026); licencia SUL | Solo laboratorio interno; confirmar por escrito con n8n |
| Make | PDF: temporal [ACORDADO] | Webhooks con límites y cola máx. 10.000 elementos; cobro por créditos | Adaptador asíncrono con idempotencia; inventario y plan de salida |
| Seguridad LLM | PDF §23.4–23.5 | OWASP LLM Top 10 2025 | Controles concretos en la etapa 6 |

---

## 7. Modelo de datos

### 7.1 Entidades conceptuales (PDF §22)

- **Núcleo:** ORGANIZATION → USERS, ROLES, PERMISSIONS, SUBSCRIPTIONS, INTEGRATIONS, AUDIT_LOGS.
- **CRM:** COMPANIES → CONTACTS; LEADS → ACTIVITIES; OPPORTUNITIES → PIPELINE_STAGES, ACTIVITIES.
- **Documentos:** DOCUMENTS → DOCUMENT_VERSIONS, DOCUMENT_METADATA; EXTRACTION_RESULTS; VALIDATION_RESULTS; APPROVAL_REQUESTS.
- **Integraciones:** CONNECTORS, INTEGRATION_CONFIGURATIONS, CREDENTIAL_REFERENCES, INTEGRATION_EXECUTIONS.
- **Agentes (futuro):** AGENT_TEMPLATE → AGENT_VERSIONS, AGENT_INSTANCES → AGENT_CONFIGURATIONS, AGENT_EXECUTIONS, AGENT_SESSIONS, AGENT_TOOLS.
- **Regla:** toda entidad de negocio tiene un vínculo inequívoco con su organización.

### 7.2 Esquema SQL del BP §4 [PROPUESTA]

| Tabla | Columnas |
|---|---|
| `empresas` (tenant) | id UUID, nit VARCHAR(20) UNIQUE, razon_social, sector, plan_suscripcion DEFAULT 'ENTERPRISE', creado_en |
| `usuarios` | id, empresa_id FK ON DELETE CASCADE, email UNIQUE, nombre, rol CHECK (SUPER_ADMIN, DIRECTOR_OPS, COMERCIAL, FINANZAS, NOC_SOPORTE), ultimo_acceso, ip_origen |
| `oportunidades_comerciales` | id, empresa_id FK, cliente_nombre, valor_estimado_cop NUMERIC(15,2), etapa CHECK (CALIFICACION…PERDIDO), probabilidad_porcentaje 0–100, ejecutivo_id FK, actualizado_en |
| `facturas_radian` | id, empresa_id FK, cufe VARCHAR(100) UNIQUE, prefijo_folio, emisor_razon_social, emisor_nit, total_cop NUMERIC(15,2), estado_dian CHECK (RECIBIDA, ACUSE_030, RECIBO_032, ACEPTADA_034, RECHAZADA), sincronizado_odoo, odoo_invoice_id, fecha_emision |
| `integraciones_config` | id, empresa_id FK, tipo_conector CHECK (DIAN_SOAP, ODOO_XMLRPC, WHATSAPP_CLOUD, OPENAI_SDK), activo, ultima_sincronizacion, estado_latencia_ms |

### 7.3 Problemas del esquema del BP (H-07, H-22)

1. `empresa_id` acepta nulos en las tablas de negocio, así que un registro puede quedar sin organización.
2. `usuarios.email` es UNIQUE global, así que un usuario no puede pertenecer a dos organizaciones.
3. `cufe` es UNIQUE global, así que dos organizaciones (la emisora y la receptora) no pueden registrar la misma factura. Debe ser UNIQUE (organización, cufe).
4. Los CHECK de rol, etapa, estado y conector impiden la configurabilidad que exige el PDF.
5. La tabla `empresas` confunde al tenant con las empresas del CRM (COMPANIES).
6. No hay políticas RLS, ni credenciales, auditoría, leads, contactos, actividades ni documentos.
7. Mezcla nombres en español y en inglés (D-22).

### 7.4 Reglas obligatorias del esquema físico [REC]

- Columna `organization_id NOT NULL` en todas las tablas de negocio.
- RLS con FORCE ROW LEVEL SECURITY y un rol de aplicación sin BYPASSRLS. El tenant se fija con `set_config(..., true)` por transacción.
- Roles, etapas y estados se guardan como datos.
- Membresías usuario–organización.
- Restricciones UNIQUE compuestas por organización.
- Tabla de eventos RADIAN separada.
- Auditoría append-only.
- Los archivos van en almacenamiento de objetos y solo sus metadatos en la base de datos.
- Las pruebas de aislamiento entre organizaciones van en la CI.

---

## 8. Seguridad, privacidad y cumplimiento

- **Aislamiento (PDF §23.1):** se aplica en backend, base de datos, APIs, archivos, integraciones, memoria de agentes, historiales y reportes.
- **Autorización (PDF §23.2):** en cada petición se verifica la organización, el rol, el recurso, la operación y el permiso sobre ese recurso. El riesgo n.° 1 es BOLA/IDOR entre organizaciones (OWASP API Top 10 2023).
- **Autenticación [DECIDIDO D-09]** (antes, CONFLICTO H-08):

  | Fuente | Modelo |
  |---|---|
  | BP | Google Workspace SSO (OAuth 2.0) + OTP de 6 dígitos (5 min, 3 intentos por IP) + JWT RS256 con rotación de 15 min |
  | PDF | Login, logout, recuperación de contraseña, tokens de acceso y renovación; proveedor pendiente |
  | Stitch | Contraseña, "Magic Code", Google, SSO Azure AD/Okta SAML, "recordar 30 días" |

  - El PDF §29.6 prohíbe tener dos sistemas de autenticación.
  - **AUD (NIST SP 800-63B-4):** el OTP por correo no sirve como autenticador fuera de banda, los límites van por cuenta y no solo por IP, y no se imponen reglas de composición de contraseña.
  - **Decisión:** Better Auth embebido; Google OIDC o correo + passkey; TOTP; sesión en cookie httpOnly; límites de intentos por cuenta. Sin contraseñas ni OTP por correo como factor.
- **Roles:** PDF (8, configurables) vs BP capa 2 (Super-Admin, Director Ops, DIAN Auditor, NOC) vs BP SQL (5) [CONFLICTO H-07].
- **Credenciales (PDF §23.3):** nunca en el frontend, en archivos públicos, en Git, en logs ni en texto plano en tablas. El BP pide AES-256 y Vault/KMS para las API keys de OpenAI, los tokens de WhatsApp y los secretos de Odoo (D-12).
- **Agentes (PDF §23.4–23.5):**
  - Las operaciones de alto impacto llevan validación y aprobación humana.
  - El contenido de documentos y mensajes es información, no instrucciones.
  - Herramientas mínimas con parámetros validados.
  - Los permisos no dependen del modelo.
- **Cifrado:** TLS 1.3 + HSTS en tránsito; AES-256 en reposo (BP).
- **Cumplimiento:**
  - DIAN: Resolución Única 000227/2025, que incluye la 000085/2022 de RADIAN (AUD).
  - **Ley 1581/2012:** la SIC la aplica a la IA.
  - **Transferencia internacional** a OpenAI, Meta, Make y la nube: no está tratada (H-23).
  - Ley 2300/2023: horarios de contacto.
  - Stitch muestra afirmaciones sin respaldo: "PT autorizado DIAN #0049-2023", ISO 27001, SOX, FIPS, SLA 99,99 %. Deben retirarse (H-16).
- **Disponibilidad:** el BP proponía 99,98 %, RPO < 1 min, RTO < 15 min y balanceo geodistribuido, que no es alcanzable con Compose en un solo host (H-09). **[DECIDIDO D-13]** Piloto en VPS con meta de 99,5 %, respaldos con PITR y restauración probada.

---

## 9. Infraestructura, despliegue y operación (PDF §24)

```
Internet → reverse proxy → frontend web → API gateway → {backend, LeadGen, RADIAN} → PostgreSQL → Redis/Valkey → workers → almacenamiento documental
```

- **Ambientes:** desarrollo local, pruebas, staging y producción, cada uno con credenciales propias. No se usan datos reales en pruebas sin autorización.
- **Contenedores:** imagen reproducible, dependencias controladas, variables de entorno, health checks, logs, política de reinicio, red y límites de recursos.
- **Orquestación:** Compose basta al inicio; algo más complejo solo con justificación.
- **[DECIDIDO D-13]** VPS alquilado con Docker Compose, SLO del piloto de 99,5 %.
- **Pendientes:**
  - proveedor y región del VPS (Ley 1581), diferido;
  - backups con restauración probada (etapa 1);
  - observabilidad y alertas: ¿quién atiende el "NOC 24/7"?;
  - CI/CD con escaneo de secretos, dependencias e imágenes.

---

## 10. Integraciones externas

| Sistema | Uso | Estado y riesgos (AUD) | Pendiente |
|---|---|---|---|
| DIAN / RADIAN | Descarga de documentos, eventos 030–034 y título valor | Para registrar eventos por terceros hace falta **PT habilitado, mandato (evento 043) o software habilitado por NIT** [H-13]. Firma XAdES-EPES y CUFE SHA-384. Calendario de días hábiles | D-14, D-15 |
| Odoo | ERP y borradores contables | **v16 sin soporte**; hoy tienen soporte 18, 19 y 20. XML-RPC/JSON-RPC deprecados (se eliminan en Odoo 22); el reemplazo es JSON-2 con API key. En Odoo Online, la API exige el plan Custom. **Odoo 19 ya trae eventos RADIAN nativos** [H-11] | D-16 |
| WhatsApp Cloud API | Notificaciones, agentes | La v18 de Stitch venció; vigente v26. Cobro por mensaje. **Desde el 15-ene-2026 están prohibidos los chatbots de IA de propósito general** | D-19 |
| Google Drive / OneDrive | Documentos | Scopes mínimos; verificación CASA | Etapa 3+ |
| Shopify | Pedidos | Versión de API fija vencida en Stitch (2024-04) | Etapa 3+ |
| Correo | Campañas, notificaciones | Requisitos de Google, Yahoo y Microsoft: SPF, DKIM, DMARC, baja con un clic; separar prospección de transaccional | Etapa 3+ |
| Make | Agentes existentes, RADIAN→Odoo | Límites de webhooks; cobro por créditos | Inventario y plan de salida |
| n8n | Laboratorio de agentes | Licencia (§4.11) | D-17 |
| OpenAI | Agentes | Retención de 30 días por defecto; ZDR con aprobación; sin región en Latinoamérica | D-18 |
| RUES / fuentes de LeadGen | Datos empresariales | Sin API pública; datos abiertos de Confecámaras | D-21 |

**Regla [REC]:** las versiones de las APIs externas van en configuración, nunca fijas en el código. La disponibilidad concreta de cada conector depende de sus APIs, permisos y condiciones comerciales (PDF §8.1).

---

## 11. Principios de ingeniería y reglas para Claude Code

**Principios (PDF §25):**
1. Modularidad.
2. Bajo acoplamiento.
3. Contratos de API.
4. Multi-tenancy desde el inicio.
5. Seguridad por defecto.
6. Trazabilidad.
7. Idempotencia.
8. Errores estructurados.
9. Procesamiento asíncrono.
10. Datos separados de archivos.
11. Configuración externa.
12. Versionamiento.
13. Pruebas unitarias, de integración y de flujos críticos.
14. Documentación.

**Reglas para Claude Code (PDF §29 y pág. 54):**
- No asumir que el repositorio está vacío: inspeccionar LeadGen, RADIAN, Make, Odoo y cualquier frontend o backend existente.
- No construir toda la suite de una vez ni inventar prioridades o cronogramas.
- No confundir una propuesta con una decisión. Ante una propuesta: investigar → comparar → evaluar → ventajas y desventajas → recomendar → **esperar aprobación**.
- Mantener los ADR y `/docs`.
- No mezclar módulos por comodidad.
- No crear complejidad innecesaria: sin Kubernetes por usar Docker, sin decenas de microservicios, sin APIs duplicadas, sin dos sistemas de autenticación, sin una base de datos por módulo sin análisis.
- **Verificar siempre:** aislamiento, autenticación, autorización, validación de entradas, credenciales, errores, auditoría, acceso a documentos, seguridad de integraciones y herramientas de agentes.
- Usar documentación oficial y versiones actuales.
- **Agent Management va al final.**

**Reglas visuales (GUIA §6), ajustadas a D-04 y D-05:**
- Un solo set de iconos: lucide.
- Curva AreaChart monotone en azul #2491CC con degradado a transparente.
- Donut 60/80 con las series en verde, azul, amarillo y gris; nunca colores fuera de la paleta (§12.4.1).
- Montos en COP.
- IDs con el formato FE-10928 y CUFE.
- Eventos con código y nombre.
- Fade de 0,15 s al cambiar de submódulo.

---

## 12. Frontend y experiencia de usuario

### 12.1 Layout maestro de 5 zonas

| Zona | Especificación (LIB/GUIA/BP) | Observaciones (Stitch/CAPT/DESIGN.md) |
|---|---|---|
| Contenedor | `h-screen w-screen overflow-hidden flex flex-col`; sin scroll global | No define responsive (H-24) |
| 0 Topbar | `h-14` (56 px), `z-30`: logo + pill "SUITE", selector de organización (nombre + NIT + punto verde), buscador Ctrl+K (cmdk), "Servicios Operativos", campana, popover de usuario estilo Google | Stitch agrega el conmutador **Espacio Cliente / Panel Global**, "Cambiar de empresa", "Gestionar tu cuenta" y "Cerrar sesión en todos los dispositivos" |
| 1 Sidebar | `w-64` (256 px), acordeón `type="single" collapsible`, filtro de módulos arriba | DESIGN.md: 240 px, colapsable a 64 px. [REC] Se usa 256 px; colapsar a 64 px queda como mejora posterior |
| 2 Workspace | `w-[72%]`, scroll propio, `p-6 space-y-6` | CAPT: el usuario marca la zona 2 como el área principal grande |
| 3 Contexto | `w-[28%]`, scroll propio, `border-l p-5`. Fondo blanco con borde gris, porque `slate-50` está fuera de la paleta (D-04) | Donut, rankings, feed en vivo |
| 4 Estado | `h-12` (48 px), `z-20`: latencia, DIAN, sync Odoo, WhatsApp, pool del crawler | **[DECIDIDO D-05]** Barra de 48 px; al hacer clic despliega las tarjetas por conector del prototipo (RADIAN/DIAN, Odoo, WhatsApp, LeadGen Crawler, Agent Runtime) |

**Comportamiento:** al elegir un submódulo en la Zona 1 cambian las Zonas 2, 3 y 4, sin recargar, con un fade (`opacity 0→1, y 4→0, 0.15 s`). [REC] La ruta va en la URL.

### 12.2 Navegación (árbol reconciliado [REC]; fuente: Stitch explorador, que coincide con CAPT)

| Módulo | Submódulos (Stitch / prototipo) | GUIA §5 (difiere) |
|---|---|---|
| 1. Inicio | Dashboard General · Métricas Rápidas · Resumen Operativo | Dashboard General |
| 2. Comercial | CRM Empresas · Contactos · Leads · Oportunidades · Actividades · Pipeline Kanban | CRM Kanban, Contactos, Oportunidades |
| 3. Inteligencia Comercial | LeadGen & Prospección · Campañas · Enriquecimiento de Datos | "Enriquecimiento IA" |
| 4. Documentos | Centro Documental · RADIAN / DIAN Facturas · Aprobaciones Odoo | igual |
| 5. Integraciones | Hub de Conectores · Odoo ERP · WhatsApp Cloud API · Webhooks & Logs | Odoo v16, WhatsApp, DIAN SOAP |
| 6. Automatización | Flujos de Proceso · Disparadores en Vivo · Colas y Monitoreo | Flujos n8n, Colas BullMQ, Logs (ver D-17) |
| 7. Inteligencia Artificial | Agent Management · Runtime Docker · Logs del Agents SDK | Agentes Docker, OpenAI SDK |
| 8. Analítica | Dashboard Ejecutivo · Reportes Transversales · Exportación BI | BI Financiero, Reportes Junta |
| 9. Administración | Configuración Empresa · Roles y Permisos · Suscripción y Licencias (+ Usuarios) | RBAC, Usuarios, Licencias |
| 10. Ayuda | Centro de Ayuda & Docs · Soporte NOC 24/7 · Estado de Red y Conectores | NOC, API Docs, Tickets |

### 12.3 Matriz de zonas por módulo (BP §3)

| Módulo | Zona 2 | Zona 3 | Zona 4 |
|---|---|---|---|
| 01 Inicio | 4 KPIs ($845.2M COP [EJEMPLO]), curva de captación, facturas recientes | Donut por industria, feed en vivo | Latencia 18 ms, DIAN 100 %, sync Odoo 12 s |
| 02 Comercial | Kanban con drag & drop | Cuota del mes (82 %), top ejecutivos, conversión | WebSockets activos, eventos del pipeline |
| 03 Intel. Comercial | Prospectos con score IA (98 %, 94 %), "empuje a CRM" | Filtros sectoriales, rastreados del día (1.428) | Estado del crawler, pool |
| 04 Documentos | Consola RADIAN, visor XML, validación | Aprobación fiscal 99,2 %, semáforo, alertas | Certificado vigente, ping SOAP 12 ms |
| 05 Integraciones | Matriz de conectores con interruptores | Cuota de APIs, logs HTTP | Sync de Odoo (JSON-2 según D-16, no XML-RPC), WhatsApp 32 msg/min |
| 06 Automatización | Monitor de flujos, 14.210 ejecuciones | Triggers, tiempo medio, 100 % de éxito | Colas, workers |
| 07 IA | Consola de agentes, logs | Memoria por contenedor, tokens | Agentes activos 3/4, sandbox |
| 08 Analítica | MRR $482.5M, CAC, LTV, filtros por sede, exportación | Resumen para junta, NDR | Caché, tiempo de render |
| 09 Administración | Matriz RBAC, usuarios, auditoría de accesos por IP | Licencias 24/30, políticas | SSO activo, sesiones |
| 10 Ayuda | Base de conocimiento, explorador de endpoints, contacto NOC | Ticket prioritario, SLA 99,98 % | Salud de los servicios |

Todas las cifras son [EJEMPLO].

### 12.4 Design system

| Token | LIB | GUIA | DESIGN.md (Stitch) | MARCA |
|---|---|---|---|---|
| Primario | `telco.primary` #0A66C2 | `telco.blue` #0A66C2 | primary #004e99 / container #0a66c2; botón hover #08549E, activo #06437E | **Azul #008AC7** (escrito: #2491CC) |
| Primario oscuro / texto | #004182 / slate #0F172A | blue-dark #004182 / #0F172A | navy #0B2545, on-surface #001c3b | Negro #000000 |
| Éxito | #10B981 | #10B981 | secondary #006c4a; prosa #059669 | **Verde #20AE67** (#88BD4C) |
| Alerta | #F59E0B | #F59E0B | tertiary #704600; prosa #F59E0B | **Amarillo #F3D02A** (no se usa en texto) |
| Fondo | surface #F8FAFC | canvas #F8FAFC | #F8FAFC / surface #f9f9ff | Blanco |
| Superficie / borde | — | #FFFFFF / #E2E8F0 | #FFFFFF / #E2E8F0, foco #94A3B8 | Gris #8A9198 |
| Error | — | — | #ba1a1a; destructivo #DC2626 | Rojo no es de marca |

#### 12.4.1 Paleta oficial — DECIDIDA (D-04, 4-nov-2026)

**Esta paleta reemplaza todos los colores de la tabla anterior.** Solo se usan estos 6 colores; ningún otro tono arbitrario, ni siquiera tintes de Tailwind como `slate-*` o `emerald-*`.

| Rol | Variable CSS (`packages/ui`, `@theme` de Tailwind v4) | HEX | RGB | CMYK |
|---|---|---|---|---|
| Verde primario | `--color-tb-verde` | #88BD4C | 136, 189, 76 | 28, 0, 60, 26 |
| Azul secundario | `--color-tb-azul` | #2491CC | 36, 145, 204 | 82, 29, 0, 20 |
| Amarillo de acento | `--color-tb-amarillo` | #F3CB35 | 243, 203, 53 | 0, 16, 78, 5 |
| Gris neutro | `--color-tb-gris` | #888D91 | 136, 141, 145 | 6, 3, 0, 43 |
| Blanco | `--color-tb-blanco` | #FFFFFF | 255, 255, 255 | 0, 0, 0, 0 |
| Negro | `--color-tb-negro` | #000000 | 0, 0, 0 | 0, 0, 0, 100 |

**Excepción única (D-04b, 4-nov-2026):** un rojo **solo para errores, estados críticos y acciones destructivas**: `--color-tb-error` #C62828 (RGB 198, 40, 40). Contraste sobre blanco 5,6:1, así que sirve también como texto. Nunca se usa para decoración, gráficos ni marca. Va siempre acompañado de icono y texto (por ejemplo "Rechazada").

**Tipografía (D-04c, 4-nov-2026):** **Poppins** en toda la interfaz (licencia OFL, servida localmente con `@fontsource/poppins`), **solo los pesos 400, 500 y 600** en woff2 con subset latino (ajustado en §19.1), y `font-variant-numeric: tabular-nums` en montos y tablas. Se descartan Plus Jakarta Sans, Inter y Arial Rounded.

**Implementación (etapa 1):**
- Se declaran como variables en `@theme` y se **desactiva la paleta por defecto de Tailwind** (`--color-*: initial`), para que no se pueda usar otro color.
- Un lint o prueba en la CI rechaza cualquier HEX o clase de color fuera de estos 6 más el rojo de error.
- Los dashboards, la Zona 4 y los gráficos de Stitch se adaptan a esta paleta.

**Reglas de contraste (WCAG 2.2 AA sobre blanco, calculadas):**

| Color sobre blanco | Contraste | Uso permitido |
|---|---|---|
| Negro | 21:1 | Todo el texto |
| Azul #2491CC | 3,5:1 | Texto ≥ 18,66 px en negrilla o ≥ 24 px, iconos, bordes y enlaces subrayados |
| Gris #888D91 | 3,4:1 | Bordes, separadores, iconos y texto grande; **no** texto secundario pequeño |
| Verde #88BD4C | 2,2:1 | Fondos y rellenos con texto **negro** encima (9,4:1); nunca como texto |
| Amarillo #F3CB35 | 1,6:1 | Fondos y acentos con texto negro encima; nunca como texto (MARCA §5) |

- **Botón primario:** fondo verde y texto negro.
- **Botón secundario:** borde azul y texto negro o azul grande.
- **Texto blanco:** solo sobre azul, en tamaño grande y en negrilla (3,5:1).
- **Nota sobre el logo:** el manual pinta el logo con los colores de muestra (#008AC7, #20AE67, #F3D02A). La interfaz usa los códigos escritos y el archivo del logo no se modifica, así que hay una diferencia leve y aceptada.

#### 12.4.2 Referencia histórica (ya no aplica)

- **Tipografía:**
  - LIB/GUIA: Plus Jakarta Sans 400–700.
  - DESIGN.md: Plus Jakarta Sans en títulos (xl 32/40 700, lg 24/32 600, md 20/28 600, sm 16/24 600) e **Inter** en cuerpo y datos (16/24, 14/20, 12/16; label-sm 11 px 600 en mayúsculas). Números con `tabular-nums`.
  - MARCA: Arial Rounded MT Bold + Poppins.
  - [CONFLICTO H-15, D-04]
- **Radios, elevación y espaciado (DESIGN.md):**
  - Radio base 4 px (inputs y botones); tarjetas 8 px; `full` solo para badges y avatares.
  - Elevación: nivel 1 con borde de 1 px; nivel 2 con sombra `0 4px 12px rgba(11,37,69,.06)`; modales con scrim #0B2545 al 45 %.
  - Grid de 12/8/4 columnas, gutter 16/12 px, margen 24/16 px, máximo 1920 px.
  - Breakpoints: 1280 y 768 px.
- **Componentes (DESIGN.md):**
  - **Botones:** 32 o 38 px de alto.
  - **Inputs:** 34 px de alto, foco #0A66C2 con glow al 15 %.
  - **Checkbox:** 16 px.
  - **Badges:**
    - OK: #ECFDF5 / #A7F3D0 / #065F46, punto #10B981.
    - Alerta: #FFFBEB / #FDE68A / #92400E.
    - Crítico: #FEF2F2 / #FECACA / #991B1B.
    - Info: #EFF6FF / #BFDBFE / #1E40AF.
  - **Tablas:** encabezado #F8FAFC 11 px en mayúsculas; hover #F1F5F9; fila seleccionada #EFF6FF con borde izquierdo de 2 px.
  - **Navegación:** tabs subrayados de 2 px; breadcrumbs separados por "/"; tenant switcher con etiqueta de ambiente.
- **Gráficos:**
  - Curva: AreaChart monotone #0A66C2 con degradado.
  - **Donut** [CONFLICTO]:
    - LIB: #0A66C2/#00C29F/#FFBB28/#8884d8, radios 60/85.
    - GUIA: #0A66C2/#10B981/#F59E0B/#8884d8, radios 60/80.
    - CAPT: Telecomunicaciones 42 %, Banca & Fintech 24 %, Retail & Logística 20 %, Salud 14 % [EJEMPLO].
  - Sparklines en la Zona 4.
- **Store** (GUIA/LIB): `activeCategory`, `activeSubmodule`, `setActiveSubmodule`. LIB agrega `accordionMode` y `activeTenant`. [REC] El tenant activo lo decide el servidor, no el cliente.
- **Formato colombiano:** COP ($845.2M COP o $84,500,000), NIT, CUFE, FE-10928, zona America/Bogota. El idioma de la UI es español; las pantallas de Stitch mezclan inglés (D-24).
- **Marca:**
  - El logo `image.png` de Stitch trae el eslogan en portugués ("Uma nova forma…"); el oficial es **"Una nueva forma de entender las redes"**.
  - Sede real: Cali. El prototipo dice "Bogotá" [EJEMPLO].

### 12.5 Flujos de acceso y onboarding (Stitch)

- **Registro y acceso empresarial:** "Activar nueva suscripción" o "Iniciar sesión corporativa"; credenciales del administrador; SSO con Azure AD/Entra, Okta SAML o Google Workspace.
- **Registro simple:** Google o código de confirmación → "Crear cuenta y configurar empresa".
- **Inicio de sesión recurrente:** Google Workspace, SSO, contraseña y "Magic Code". El texto dice "Plataforma Unificada de Conectividad & Tráfico SD-WAN", lo que no corresponde a este producto.
- **Onboarding completo:**
  - Validación de identidad corporativa (RUES/DIAN).
  - Módulos habilitados.
  - Conector express con Odoo.
  - Administrador raíz y co-administrador.
  - "Arquitectura de aislamiento".
  - Test de conectividad.
- **Onboarding simplificado:** "Personaliza tu espacio de trabajo", con el tamaño de la empresa (1–10 … 200+) y "Completar más tarde".
- **[DECIDIDO D-09]** Un solo flujo: Google o correo + passkey, con TOTP. Se retiran de los diseños la contraseña, el "Magic Code" y el código por correo. SAML/Okta queda para después.

### 12.6 Responsive y accesibilidad

**Accesibilidad:** el objetivo es WCAG 2.2 AA (contraste ya resuelto en §12.4.1). **Responsive:** sigue sin definir y queda **diferido**; mientras tanto, la suite se optimiza para escritorio de ≥ 1280 px, y las pruebas en móvil de §19 miden rendimiento, no el layout. Falta definir verificar el contraste (el amarillo y el verde de marca no sirven para texto pequeño), la navegación por teclado entre zonas, `prefers-reduced-motion` y el comportamiento en tablet y móvil (H-24).

---

## 13. Auditoría: hallazgos

Severidad: C = crítica, A = alta, M = media. Los hallazgos con fuente AUD están sin verificación cruzada.

| ID | Sev. | Hallazgo | Fuentes | Recomendación / decisión |
|---|---|---|---|---|
| H-01 | A | El usuario pide "desde cero" y el PDF dice "no partimos de cero" | PDF §2, §29.1 | Repositorio nuevo; activos integrados tras inspección (PLAN §0.2) |
| H-02 | A | Framework: React+Vite+Bootstrap (PDF) vs Next 14 "obligatorio" (GUIA) | PDF §17.1; GUIA §1; LIB | D-02 |
| H-03 | A | Microservicios + gRPC (BP) vs "no microservicios sin justificación" (PDF) | BP Capa 3; PDF §26, §29.6 | D-06 |
| H-04 | C | "OpenAI Assistants SDK" (BP): API retirada el 26-ago-2026; el PDF acordó el Agents SDK | BP; PDF §27; AUD | Corregir el BP |
| H-05 | C | n8n como motor productivo y diseñador para clientes (BP, GUIA, Stitch) vs solo validación (PDF); licencia SUL | BP; PDF §27; AUD | D-17 |
| H-06 | A | Agentes en la fase 3 (BP) vs última etapa (PDF) | BP §7; PDF §27 | Manda el PDF |
| H-07 | A | Roles, pipeline y estados fijos (BP) vs configurables (PDF); tres listas de roles distintas | BP §4, Capa 2; PDF §4.4, §5.4 | §7.4 |
| H-08 | A | Tres modelos de autenticación; OTP por correo no conforme con NIST | BP §6; PDF §4.3; Stitch; AUD | D-09 |
| H-09 | A | SLA 99,98 %, RPO < 1 min y geo-balanceo no son alcanzables con Compose en un solo host | BP §6; PDF §24 | D-13 |
| H-10 | C | MinIO Community archivado (25-abr-2026) | BP Capa 4; AUD | D-11 |
| H-11 | C | Odoo 16 sin soporte; XML-RPC deprecado; Odoo 19+ trae RADIAN nativo, lo que puede duplicar funciones | BP; AUD | D-16 |
| H-12 | C | El flujo RADIAN del BP mezcla roles (el 034 lo registra el emisor) y omite 031 y 033; Stitch llama al 034 "rechazo" | BP §5; AUD | §4.4; D-15 |
| H-13 | C | Para registrar eventos por terceros hace falta PT, mandato o software habilitado; Stitch muestra un "PT #0049-2023" sin respaldo | AUD; Stitch | D-14 |
| H-14 | A | next 14.2.5 tiene CVE-2025-29927 (bypass de middleware); todas las versiones de LIB están desactualizadas | LIB §9; AUD | §6.1 |
| H-15 | A | La UI (#0A66C2, Plus Jakarta/Inter) no sigue la marca (#008AC7 + verde + amarillo, Arial Rounded/Poppins); el logo trae el eslogan en portugués | LIB; DESIGN.md; MARCA | D-04 |
| H-16 | M | Stitch muestra afirmaciones sin respaldo: ISO 27001, SOX, FIPS, SLA 99,99 %, K8s, Celery/RabbitMQ, multi-schema, "LLM en red privada", XAdES-BES | Stitch; AUD | No son especificación; retirarlas del diseño final |
| H-17 | A | El scraping del RUES no tiene base legal clara; los datos de personas caen bajo la Ley 1581 | BP; AUD | D-21 |
| H-18 | M | Notificaciones sin diseño de UI | PDF §13 | Etapa 2 |
| H-19 | M | Analítica ambigua: ¿del tenant o del negocio SaaS (MRR/CAC)? | BP; PDF §14 | D-20 |
| H-20 | M | "NOC 24/7" y SLA en Ayuda sin un responsable real | BP; Stitch | D-13 |
| H-21 | M | Iconos: lucide (GUIA) vs Material Symbols (Stitch) | GUIA §6; Stitch | D-05 |
| H-22 | A | El SQL del BP no sirve para RLS: tenant nulo, UNIQUE globales, sin políticas | BP §4; AUD | §7.4 |
| H-23 | A | Transferencia internacional de datos (OpenAI, Meta, Make, nube) no tratada; el tracing del Agents SDK sale hacia OpenAI | AUD | D-13, D-18 |
| H-24 | M | Sin responsive ni objetivo de accesibilidad | LIB/GUIA | §12.6 |
| H-25 | M | Zona 4: barra de 48 px (BP) vs franja de tarjetas de conectores (Stitch/CAPT) | BP §3; CAPT | D-05 |
| H-26 | M | El patrón de la GUIA (módulo solo en zustand) rompe los deep links | GUIA §4; AUD | La URL es la fuente de verdad |
| H-27 | M | Make no aparece en BP, LIB, GUIA ni Stitch, aunque es temporal y está [ACORDADO] | PDF §27 | Incluirlo en la Runtime Layer |
| H-28 | M | `navigation_flow/code.html` duplica el login; no hay flujo de navegación real | Stitch | Pedirlo de nuevo o borrarlo |

**Vacíos de especificación (resumen):**
- ORM y migraciones.
- Data fetching, router y formularios en el frontend.
- Bus de eventos: sobre, outbox, DLQ.
- Proveedor de objetos y retención legal de XML y PDF.
- Backups y PITR.
- Pooling de conexiones.
- Tiempo real: protocolo y autorización por organización.
- Versionado de API y errores.
- Observabilidad.
- CI/CD.
- MFA, SSO por organización y suplantación.
- Llaves (KEK/DEK).
- Hosting y región.
- Búsqueda (Ctrl+K, deduplicación).
- Calendario de días hábiles.
- Certificados digitales por organización.
- Facturación de la propia suite.
- Modelo multi-tenant de WhatsApp.
- Consentimiento y supresión unificados.
- Catálogo de herramientas de agentes y evaluación antes de publicar.
- i18n.
- Gestor de paquetes y estructura del monorepo.

**Datos de ejemplo que NO son requisitos:**
- "TELCOBRAS DEMO S.A.S.", NIT 900.000.000-0, Carlos Mendoza.
- $845.2M, $482.5M, 1.428, 3.892, 14.210, 24/30, 82 %, 99,2 %, 18 ms, 12 s, 32 msg/min.
- "Q3-2024", "Sede Principal Bogotá".
- Odoo v16/v17, Graph v18, Shopify 2024-04.

---

## 14. Registro de decisiones (base de los ADR)

| ID | Decisión | Opciones | Decisión o recomendación | Decide | Estado |
|---|---|---|---|---|---|
| D-01 | Jerarquía de fuentes | §0.2 | **DECIDIDO (4-nov-2026): caso por caso.** No hay fuente que mande por defecto; cada conflicto se resuelve en su propia decisión D-xx | Arquitecto | ✅ Cerrada |
| D-02 | Framework frontend | React+Vite SPA · Next 16 | **DECIDIDO (4-nov-2026): SPA React + Vite + TypeScript.** Se descarta Next.js | Arquitecto | ✅ Cerrada |
| D-03 | Estilos y componentes | Tailwind v4 + shadcn/Radix · Bootstrap | **DECIDIDO (4-nov-2026): Tailwind v4 + shadcn/ui con Radix fijado explícitamente.** Se descarta Bootstrap | Arquitecto | ✅ Cerrada |
| D-04 | Identidad visual de la UI | Paleta de marca · derivada de la marca · paleta actual #0A66C2 | **DECIDIDO (4-nov-2026): paleta oficial ESTRICTA, solo 6 colores** (ver §12.4.1). Verde primario #88BD4C, azul secundario #2491CC, amarillo de acento #F3CB35, gris #888D91, blanco y negro. Prohibidos otros tonos. Se descarta #0A66C2. **D-04b:** única excepción, rojo #C62828 solo para errores. **D-04c:** Poppins en toda la UI | Arquitecto | ✅ Cerrada |
| D-05 | Iconos y Zona 4 | lucide · Material Symbols; barra de 48 px · franja de tarjetas | **DECIDIDO (4-nov-2026): solo lucide-react** (strokeWidth 1.75 o 2; los logos de terceros con SVG oficiales). **Zona 4 = barra fija de 48 px** con indicadores; al hacer clic se despliega el detalle por conector (tarjetas del prototipo) | Arquitecto | ✅ Cerrada |
| D-06 | Estilo arquitectónico | Monolito modular · microservicios | **DECIDIDO (4-nov-2026): monolito modular NestJS** con un módulo por dominio y fronteras estrictas. LeadGen y RADIAN (Python) quedan como servicios aparte, detrás de contratos. REST + OpenAPI; sin gRPC ni Kubernetes | Arquitecto | ✅ Cerrada |
| D-07 | ORM y migraciones | Drizzle · Prisma · Kysely · TypeORM | Se decide con la prueba de concepto de RLS (PLAN §0.3) | Arquitecto | Etapa 0 |
| D-08 | Multi-tenancy | RLS en esquema compartido · esquema por tenant | **DECIDIDO (4-nov-2026): tablas compartidas + RLS.** `organization_id NOT NULL` en todo, membresías usuario–organización, reglas de §7.4. Se descarta el esquema por tenant | Arquitecto | ✅ Cerrada |
| D-09 | Identidad | Better Auth · Keycloak · gestionado (Auth0/Clerk/WorkOS); modelo de sesión; MFA; un solo flujo de registro | **DECIDIDO (4-nov-2026): Better Auth embebido en NestJS.** Acceso **sin contraseña**: Google Workspace (OIDC) o correo + **passkey**, con 2FA por **TOTP** (app). SSO corporativo (Okta/Entra) se agrega después por organización. Sesión en cookie httpOnly; límites de intentos por cuenta; suplantación del superadmin auditada. Se descartan el OTP por correo como factor y la contraseña | Arquitecto | ✅ Cerrada |
| D-10 | Cola y eventos | BullMQ + Valkey + outbox · pg-boss · RabbitMQ | **DECIDIDO (4-nov-2026): BullMQ + Valkey (instancia única) + outbox en PostgreSQL** y consumidores idempotentes. Se descartan Redis Cluster, RabbitMQ y Celery | Arquitecto | ✅ Cerrada |
| D-11 | Almacenamiento de objetos | S3/R2 gestionado · SeaweedFS | **DECIDIDO (4-nov-2026): S3 gestionado** (R2, S3 o equivalente) a través de la API S3, con versionado. En local se emula con un contenedor S3-compatible. Se descarta MinIO. Proveedor exacto, junto con D-13 | Arquitecto | ✅ Cerrada |
| D-12 | Secretos | Vault · OpenBao · KMS + cifrado envolvente | **DECIDIDO (4-nov-2026): cifrado envolvente en la app** (AES-256-GCM en PostgreSQL) con la llave maestra fuera de la base de datos (variable protegida del servidor al inicio; OpenBao o KMS después). Se descarta Vault por ahora | Arquitecto | ✅ Cerrada |
| D-13 | Hosting, región y SLO | Nube · VPS · servidor propio | **DECIDIDO (4-nov-2026): VPS / servidor alquilado con Docker Compose.** Meta del piloto: **99,5 % de disponibilidad** con respaldos verificados (PITR) y restauración probada. Se descarta el 99,98 % del BP para el piloto. **Sigue abierto:** proveedor y región (si es fuera de Colombia, hay que documentar la transferencia internacional según la Ley 1581) | Gerencia + arquitecto | ✅ Cerrada (proveedor pendiente) |
| D-14 | Figura ante la DIAN | PT tercero vía API · mandato (043) · habilitar a Telcobras como PT · solo descarga | **PENDIENTE (4-nov-2026): el arquitecto averigua cómo funciona hoy la herramienta RADIAN** y lo consulta con contabilidad/legal. Bloquea la etapa 4, no las etapas 0–3 | Gerencia + legal/contable | Antes de la etapa 4 |
| D-15 | Alcance RADIAN | Solo recepción (030–033) · emisor (034) · título valor (035–051) | **DECIDIDO (4-nov-2026): primera versión solo de recepción.** Facturas de proveedores: descargar, validar, eventos 030/031/032/033, aprobación humana y borrador en Odoo. El emisor (034) y el título valor (035–051) quedan fuera | Arquitecto + contable | ✅ Cerrada |
| D-16 | Odoo | Versión, edición, API JSON-2, ¿usar RADIAN nativo de Odoo? | **DECIDIDO (4-nov-2026): Telcobras usa Odoo 19 o 20.** El conector usa la **API JSON-2 con API key** (sin XML-RPC). **Abierto para la etapa 0:** confirmar la versión exacta, la edición y el hosting, y comparar el RADIAN nativo de Odoo con el módulo de la suite para no duplicar funciones | Arquitecto | ✅ Cerrada (inventario pendiente) |
| D-17 | n8n y módulo 06 | Diseñador n8n (Enterprise) · catálogo gobernado | **DECIDIDO (4-nov-2026): el módulo 06 es un catálogo de procesos gobernados por Telcobras** (activar, ver historial, "Solicitar flujo personalizado"). Los clientes no diseñan flujos. n8n queda solo como laboratorio interno de Telcobras. Se retiran de los diseños "Diseñar flujo en n8n" y "+ Nuevo flujo n8n" | Arquitecto | ✅ Cerrada |
| D-18 | Agentes: lenguaje y datos | Agents SDK en Python o TS; tracing; ZDR | Etapa 6 | Arquitecto | Diferida |
| D-19 | WhatsApp multi-tenant | WABA por organización · número compartido | Etapa 3+ | Arquitecto | Diferida |
| D-20 | Analítica | Del tenant · del negocio SaaS · ambas, separadas | **DECIDIDO (4-nov-2026): separadas.** Cada organización ve solo su analítica (comercial, documental, automatización, IA). MRR, CAC, LTV, NDR y "Junta Directiva" van solo en el Panel Global de Telcobras | Arquitecto | ✅ Cerrada |
| D-21 | Fuentes de LeadGen | Scraping actual · datos abiertos · proveedores | **DECIDIDO (4-nov-2026): primero se revisa LeadGen.** En la etapa 0 se inventarían las fuentes que usa hoy y se validan con legal antes de integrarlo (etapa 3). Mientras tanto no se agrega scraping nuevo | Arquitecto + legal | ✅ Cerrada (validación legal pendiente) |
| D-22 | Idioma del código y del esquema | Inglés · español | **DECIDIDO (4-nov-2026): código, tablas y APIs en inglés; UI en español** con textos externalizados | Arquitecto | ✅ Cerrada |
| D-23 | Repositorio y herramientas | Monorepo (pnpm workspaces) · varios repos; versión de Node | **DECIDIDO (4-nov-2026): monorepo pnpm en este repositorio** (apps/web, apps/api, packages/ui, packages/contracts); Node LTS | Arquitecto | ✅ Cerrada |
| D-24 | Idioma de la UI e i18n | Solo español · i18n desde el inicio | **DECIDIDO (4-nov-2026): solo español de Colombia, con textos externalizados** para poder traducir después | Arquitecto | ✅ Cerrada |

| D-25 | Modelo comercial (PDF §26) | Planes, límites y consumo por organización | La arquitectura lo soporta desde el núcleo (módulos habilitados, límites, medición); los valores comerciales los define Gerencia | Gerencia | Diferida (etapa 5) |

Pendientes del PDF §26 y dónde quedaron:
- Microservicios: D-06.
- Almacenamiento: D-11.
- Autenticación: D-09.
- Cola: D-10.
- Modelo comercial: D-25.
- Tecnología de analítica: D-20, con la herramienta concreta a definir en la etapa 5.

---

## 15. Ruta de abordaje [APROBADA PARA INICIAR, 4-nov-2026]

Sin fechas, porque el PDF §29.2 prohíbe inventar cronogramas. Los agentes van al final (PDF §27). El detalle de la primera etapa está en `docs/PLAN_IMPLEMENTACION_INICIAL.md`.

| Etapa | Objetivo | Entregables | Sale cuando |
|---|---|---|---|
| 0 Decisiones y descubrimiento | Cerrar lo que bloquea | Este documento aprobado; ADR-001 a ADR-011; prueba de RLS (D-07); inventario de LeadGen, RADIAN, Make y Odoo | ADR escritos, ORM elegido e inventario escrito |
| 1 Fundaciones | Esqueleto seguro y multiempresa | Monorepo, Compose, CI; núcleo (organizaciones, usuarios, membresías, auth, RBAC configurable, auditoría, RLS); shell de 5 zonas con design system y datos simulados | Pruebas de aislamiento en verde; navegación por los 10 módulos |
| 2 CRM, documentos y notificaciones | Primer valor comercial | CRM completo (§4.2), Document Management, notificaciones internas | Flujo lead → oportunidad → actividad funcionando |
| 3 Integration Hub, Odoo y LeadGen | Conectar activos | Registry, Credential Manager, logs; conector Odoo; LeadGen integrado por contrato | Prospectos de LeadGen llegan al CRM |
| 4 RADIAN y puente Make | Documentos fiscales | RADIAN integrado (estados + eventos), aprobación humana → borrador en Odoo; adaptador Make | Factura recibida → aprobada → registrada en Odoo |
| 5 Analítica, planes y piloto | Operar con clientes | Analítica, suscripciones y consumo, Panel Global, endurecimiento, pentest, piloto | Piloto en producción con SLO acordados |
| 6 Agentes propios (final) | Capacidad de IA propia | Agent Management, Runtime Layer, agentes con Agents SDK en Docker | Primer agente en producción |

**Diferencias con el BP (4 fases en 12 semanas):**
- El BP da la fase 1 por "completada en canvas", pero el código no existe.
- El BP pone n8n y los agentes en la fase 3; el PDF los pone al final.
- El BP deja la seguridad para la fase 4; esta ruta prueba el aislamiento desde la etapa 1.

---

## 16. Estructura documental (PDF §29.4)

```
docs/
  DOCUMENTO_MADRE_SUITE_TELCOBRAS.md   ← este documento
  PLAN_IMPLEMENTACION_INICIAL.md
  architecture/  overview · system-context · module-map · data-flow   (se crea al avanzar)
  decisions/     ADR-001 fuentes · 002 estilo · 003 frontend · 004 tenancy · 005 ORM (tras la prueba) · 006 identidad · 007 marca · 008 convenciones · 009 datos e infraestructura · 010 hosting · 011 alcance funcional   ← creado
  modules/       core · crm · leadgen · radian · integration-hub · agent-management
  api/ · database/ · security/ · deployment/
  Arquitectura/  (fuentes originales, solo lectura)
```

---

## 17. Glosario

| Término | Significado |
|---|---|
| ADR | Registro de decisión de arquitectura |
| BOLA/IDOR | Acceso a objetos de otro usuario u organización cambiando un id |
| CUFE / CUDE | Código único de la factura o del evento electrónico (SHA-384) |
| DIAN / RADIAN | Autoridad tributaria / su registro de facturas como título valor |
| KEK/DEK | Llave que cifra llaves / llave que cifra datos |
| MRR, CAC, LTV, NDR | Ingreso recurrente mensual, costo de adquisición, valor de vida, retención neta |
| NIT | Número de identificación tributaria |
| OIDC / SSO / OTP / JWT | Login federado / inicio único / código de un solo uso / token firmado |
| Organización (tenant) | Empresa cliente de la suite. "Empresa" se reserva para los registros del CRM |
| Outbox | Tabla donde se guarda el evento en la misma transacción para publicarlo después |
| PT | Proveedor tecnológico habilitado por la DIAN |
| RLS | Seguridad por filas de PostgreSQL |
| RPO / RTO / SLO | Pérdida máxima de datos / tiempo de recuperación / objetivo de servicio |
| RUES | Registro Único Empresarial y Social |
| UBL 2.1 / XAdES-EPES | Formato XML de la factura / firma digital exigida |

---

## 18. Anexos

**A. Inventario de piezas de Stitch** (23 únicas; las que tienen ficha detallada están en el scratchpad de la auditoría):

| Carpeta | Módulo |
|---|---|
| layout_maestro_de_5_zonas_0_4 · 5_zonas_interactivas_con_zona_2_optimizada · 5_zonas_reactivas_totales_1/2 · explorador_interactivo_del_menu | Shell y navegación (variantes) |
| dashboard_general_1/2 | 01 Inicio |
| dashboard_ejecutivo_y_analitica_transversal | 08 Analítica |
| crm_pipeline_kanban | 02 Comercial |
| leadgen_inteligencia_comercial | 03 Intel. Comercial |
| radian_facturas_dian_y_aprobaciones · centro_documental | 04 Documentos |
| hub_de_integraciones | 05 Integraciones |
| flujos_de_proceso_y_automatizacion | 06 Automatización |
| agent_management_runtime_layer | 07 IA |
| roles_y_permisos · configuracion_inicial (onboarding) · configuracion_simplificada | 09 Administración |
| panel_administrativo_global (super admin) | Panel Global |
| centro_de_ayuda | 10 Ayuda |
| registro_y_acceso · registro_simple_google_codigo · inicio_de_sesion_recurrente | Acceso |
| navigation_flow | **Duplicado** del inicio de sesión (H-28) |
| telco_enterprise_core/DESIGN.md | Design system |
| a_clean_professional_…_flow_diagram · image.png · 2 capturas | Diagrama de flujo, logo, prototipo anotado |

**B. Referencias oficiales (PDF §30):**
- OpenAI Agents SDK (general, Python, modelos y proveedores, tracing).
- Condiciones de licencia de n8n.
- RLS de PostgreSQL.
- Docker Compose y su uso en producción.
- OWASP API Security Top 10.
- SIC y Ley 1581 de 2012.

**C. Fuentes:** `docs/Arquitectura/` (sin modificar).

---

## 19. Requisitos de rendimiento, escalabilidad y calidad (agregados el 4-nov-2026)

Cada requisito pedido por el arquitecto se revisó contra la arquitectura decidida (§14):
- **Viable:** se adopta tal cual.
- **Ajustado:** se adopta con una alternativa más eficiente.
- **Descartado:** choca con una decisión cerrada; se documenta la alternativa.

La columna "Etapa" usa la ruta de §15. Todos estos requisitos son **estándares obligatorios** desde la etapa en que aparecen: no son tareas que se hacen una sola vez.

### 19.1 Fase 1 — Frontend crítico (desde la etapa 1)

| Requisito | Veredicto | Cómo se cumple en esta arquitectura | Etapa |
|---|---|---|---|
| Pantallas esqueleto | Viable | Componente `Skeleton` del design system, con la forma de cada vista; se muestra mientras carga la petición | 1 |
| Actualizaciones optimistas | Viable | **TanStack Query** (cierra el vacío de "data fetching" de §6.1): `onMutate` actualiza la caché y `onError` revierte. Uso típico: mover tarjetas en el Kanban, aprobar facturas, interruptores de conectores | 1–2 |
| Evitar renderizados innecesarios | Ajustado | **React Compiler** (memoización automática) en lugar de `memo/useMemo` a mano; Zustand con selectores; el estado del servidor vive en TanStack Query, no en Zustand | 1 |
| Virtualizar listas largas | Viable | `@tanstack/react-virtual` en tablas, logs y feeds de más de ~100 filas. Siempre va **junto con** la paginación del servidor, nunca en su lugar | 2 |
| Fuentes locales con pesos limitados | Ajustado | Poppins (D-04c) servida localmente con `@fontsource`, en **woff2, subset latino y solo 3 pesos: 400, 500 y 600** (reemplaza los 4 pesos de D-04c). `font-display: swap` y precarga del peso 400 | 1 |
| Imágenes WEBP/AVIF | Viable, alcance pequeño | La suite casi no tiene imágenes: el logo y los iconos van en **SVG**. AVIF con respaldo WEBP solo para avatares e imágenes de marketing. Los documentos de los usuarios (PDF/XML) no se convierten | 1 |
| Lazy loading de imágenes | Viable | `loading="lazy"` y `decoding="async"` en toda imagen fuera de la primera pantalla; el logo de la Zona 0 va sin lazy | 1 |
| Code splitting por página | Viable | Una ruta, un chunk: rutas perezosas del router y `React.lazy`. Cada módulo de la Zona 1 se descarga solo al entrar. Recharts y el visor XML/PDF se cargan solo en las vistas que los usan | 1 |
| Scripts de terceros diferidos | Viable | Política: ningún script de terceros en el arranque; se cargan con `async`/`defer` o después de la interacción. La CSP lista los orígenes permitidos | 1 |
| Eliminar dependencias sin uso | Viable | `knip` en la CI falla con dependencias, exports o archivos sin uso | 1 |
| SSR / SSG | **Descartado** | Contradice D-02 (SPA React + Vite): toda la suite está detrás del login y no necesita SEO. El shell es estático, va en la CDN y la primera carga se cubre con code splitting y skeletons. Si algún día hay páginas públicas de marketing, se prerenderizan en un sitio aparte | — |

### 19.2 Fase 2 — Red, APIs, backend y base de datos (desde la etapa 1)

| Requisito | Veredicto | Cómo se cumple | Etapa |
|---|---|---|---|
| Evitar llamadas duplicadas | Viable | TanStack Query deduplica las peticiones en vuelo y cachea con `staleTime` por recurso. En el backend, las mutaciones aceptan una `Idempotency-Key` (§5.3) | 1 |
| Debounce en búsquedas | Viable | 300 ms en Ctrl+K y en autocompletados; las peticiones viejas se cancelan con `AbortController` | 1 |
| Paginar todos los resultados | Ajustado | **Paginación por cursor (keyset)** en lugar de `OFFSET`, porque es estable y rápida en tablas grandes. Ningún endpoint de lista responde sin límite; el máximo por página es 100 | 1 |
| Timeouts estrictos en APIs externas | Viable | Todo cliente del Integration Hub usa `AbortSignal.timeout`: 10 s por defecto y 30 s como máximo para la DIAN. Los reintentos con backoff exponencial los hace la cola (D-10), nunca la petición del usuario. Un circuit breaker por conector alimenta el estado de la Zona 4 | 3 |
| Paralelizar peticiones independientes | Viable | Frontend: consultas paralelas en TanStack Query. Backend: `Promise.all` para llamadas independientes. Dashboards: un endpoint agregado por vista para evitar cascadas de peticiones | 1 |
| Streaming de respuestas de IA | Viable | Token a token con **SSE**, sobre el streaming del OpenAI Agents SDK. Aplica cuando lleguen los agentes | 6 |
| Compresión Brotli/Gzip | Ajustado | En el **proxy inverso y la CDN** (Caddy `encode zstd br gzip` + Cloudflare), no en Node. Los assets se precomprimen en el build | 1 |
| Tareas pesadas a colas | Viable, ya decidido | BullMQ + Valkey + outbox (D-10): investigaciones de LeadGen, documentos, sincronización con Odoo, reportes y campañas. La petición web responde de inmediato con un id de trabajo; el avance llega por tiempo real | 2 |
| Caché de datos frecuentes | Ajustado | En **Valkey** (D-10), no en un Redis aparte. Las llaves llevan `organization_id`, así que nunca se mezclan organizaciones; TTL corto y se invalidan por evento. Candidatos: permisos de la sesión, catálogos, KPIs de dashboard | 2 |
| Resolver consultas N+1 | Viable | El ORM (D-07) debe resolver relaciones con joins o cargas por lote; en las pruebas, un contador de queries por endpoint falla si pasa el umbral | 1 |
| Índices para consultas frecuentes | Viable | Índices compuestos que **empiezan por `organization_id`** (por RLS), más los de cursor (`organization_id, created_at, id`). Se revisan con `pg_stat_statements` | 1 |
| Seleccionar solo las columnas necesarias | Viable | Prohibido `SELECT *` en el código; cada endpoint proyecta las columnas que devuelve su contrato OpenAPI | 1 |
| Pool de conexiones | Ajustado | Pool del driver de Node en la etapa 1; **PgBouncer en modo transacción** cuando haya más de una instancia de la API. Es compatible con RLS porque el tenant se fija con `set_config(..., true)` por transacción (§7.4) | 1 / 5 |

### 19.3 Fase 3 — Infraestructura, monitoreo y pruebas (desde la etapa 1; HA en la etapa 5)

| Requisito | Veredicto | Cómo se cumple | Etapa |
|---|---|---|---|
| CDN y caché del navegador | Viable | Cloudflare delante del VPS. Assets con hash en el nombre: `Cache-Control: public, max-age=31536000, immutable`; `index.html`: `no-cache`. Las respuestas de la API no se cachean en la CDN | 1 |
| Servidores cerca de la BD | Viable | La API, los workers, PostgreSQL y Valkey en el **mismo VPS o en la misma red privada y región**. El S3 gestionado (D-11) y el proveedor del VPS (D-13) se eligen en la misma región | 1 |
| Balanceo de carga entre instancias | Ajustado | Choca con D-13 (un VPS, 99,5 %). Se cumple por diseño: **API sin estado** (sesión en la BD/Valkey, archivos en S3, tiempo real con adaptador de Valkey). Así Caddy puede balancear varias réplicas en el mismo host, y luego entre VPS, sin cambiar código. El balanceo entre servidores se activa cuando la carga o el SLA lo pidan | 5 |
| Rastrear peticiones lentas con OpenTelemetry | Viable | SDK de OpenTelemetry en NestJS y en los workers (HTTP, PostgreSQL, Valkey, BullMQ), con `organization_id` y `correlation_id` en cada span. Alerta cuando el p95 de un endpoint supera su presupuesto | 1 |
| Medir la velocidad real de los usuarios | Viable | RUM con la librería `web-vitals` (LCP, INP, CLS) enviada al backend de OpenTelemetry. Se mide el percentil 75 por ruta en producción | 5 (en staging desde la 1) |
| Pruebas de rendimiento en móviles y redes lentas | Viable | **Obligatorias en la CI**: Lighthouse CI en emulación móvil con red Slow 4G y CPU 4×; Playwright con throttling para los flujos críticos. El build falla si se rompe el presupuesto | 1 |

### 19.4 Presupuestos de rendimiento (punto de partida [REC], ajustables)

| Métrica | Presupuesto |
|---|---|
| JS inicial (shell + ruta de entrada), comprimido | ≤ 200 KB |
| LCP en móvil con Slow 4G (Lighthouse) | ≤ 2,5 s |
| INP (p75 en producción) | ≤ 200 ms |
| CLS | ≤ 0,1 |
| API de lectura, p95 en el servidor | ≤ 300 ms |
| Fuentes totales | 3 archivos woff2, ≤ 120 KB |

Nota: la meta de "< 20 ms de latencia en UI" del BP §1 se reemplaza por estos presupuestos, que son medibles.
