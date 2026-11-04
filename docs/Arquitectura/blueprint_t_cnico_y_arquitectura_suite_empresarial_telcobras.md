# BLUEPRINT MAESTRO DE INGENIERÍA Y ARQUITECTURA: SUITE EMPRESARIAL TELCOBRAS
**Versión de Especificación: 4.8.2-Enterprise-Release**  
**Organización: Telcobras S.A.S. | Cloud Enterprise Systems**  
*Documento Rector de Arquitectura de Software, Modelo de Datos, Topología de Red y Roadmap Técnico*

---

## 1. RESUMEN ARQUITECTÓNICO & PRINCIPIOS DE DISEÑO

El **Blueprint de la Suite Empresarial Telcobras** define la arquitectura end-to-end para una solución SaaS multi-tenant diseñada para operar con latencia mínima (< 20 ms en UI), procesamiento tributario asíncrono y desacoplamiento estricto por capas.

### Principios Rectores:
1. **Reactividad de 5 Zonas (0 a 4)**: Cero recargas de página completas (`SPA/SSR híbrido`). Transición instantánea del Workspace (Zona 2), Panel Contextual (Zona 3) y Telemetría (Zona 4) al conmutar submenús en el Sidebar (Zona 1).
2. **Aislamiento Multi-Tenant Estricto**: Particionamiento lógico y aislamiento por NIT (`tenant_id`) con criptografía en reposo (AES-256) para todos los artefactos XML UBL 2.1 y contratos comerciales.
3. **Resiliencia & Tolerancia a Fallos**: Colas asíncronas con reintentos exponenciales para WebServices gubernamentales (DIAN SOAP) y ERPs heredados (Odoo XML-RPC).
4. **Gobierno Corporativo y Auditoría**: Trazabilidad inmutable de accesos por IP, roles RBAC y registros de telemetría en tiempo real.

---

## 2. TOPOLOGÍA DE INFRAESTRUCTURA & DIAGRAMA DE CAPAS C4

```
+---------------------------------------------------------------------------------------------------+
| CAPA 1: CLIENTE & PRESENTACIÓN (REACTIVO 5 ZONAS)                                                |
| Next.js 14+ (App Router) / Tailwind CSS / Radix UI / Zustand / Recharts / Plus Jakarta Sans       |
|  - Zona 0: Topbar Global (Multi-Tenant Selector, Buscador CMD-K, User Popover)                    |
|  - Zona 1: Sidebar Acordeón (10 Módulos Corporativos)                                             |
|  - Zona 2: Workspace Operativo Principal (~72% viewport width)                                    |
|  - Zona 3: Contextual KPI & Insights Panel (~28% viewport width)                                 |
|  - Zona 4: Telemetry & Connectivity Status Bar (Latencia, Webhooks, Salud de APIs)                |
+--------------------------------------------------+------------------------------------------------+
                                                   | HTTPS / WSS / gRPC-Web
                                                   v
+---------------------------------------------------------------------------------------------------+
| CAPA 2: API GATEWAY & SEGURIDAD PERIMETRAL                                                        |
| NGINX / Cloudflare Enterprise (TLS 1.3, Rate Limiting, WAF, Enrutador Multi-Tenant)               |
|  - Autenticación: Google Workspace SSO / OAuth 2.0 / Códigos OTP Temporales (Sin Contraseña)      |
|  - Token Broker: JWT (JSON Web Tokens con firma asimétrica RS256, rotación a 15 min)             |
|  - RBAC Middleware: Validación de Claims (Roles: Super-Admin, Director Ops, DIAN Auditor, NOC)   |
+--------------------------------------------------+------------------------------------------------+
                                                   | HTTP REST / Internal gRPC
                                                   v
+---------------------------------------------------------------------------------------------------+
| CAPA 3: SERVICIOS DE APLICACIÓN Y ORQUESTACIÓN (BACKEND MICROSERVICES)                           |
| Node.js (NestJS / Fastify) & Python (FastAPI para IA/Crawlers)                                    |
|                                                                                                   |
|  [Core CRM Engine]       [RADIAN / DIAN Engine]     [LeadGen Algorítmico]    [Integration Hub]    |
|   • Etapas Kanban         • Validador UBL 2.1        • Web Scraping & RUES    • Conector Odoo ERP |
|   • Probabilidad COP      • Eventos 030, 032, 034    • Scoring IA (OpenAI)    • WhatsApp Cloud API|
|                                                                                                   |
|  [Workflow Engine]       [AI Agent Sandboxes]       [Analytics / BI]         [NOC & Telemetría]   |
|   • n8n Core Engine       • Docker Containers        • Agregaciones MRR/CAC   • Heartbeat Pingers  |
|   • Colas BullMQ/Redis    • OpenAI Assistants SDK    • Motor de Exportación   • Monitor de Latencia|
+--------------------------------------------------+------------------------------------------------+
                                                   |
                                                   v
+---------------------------------------------------------------------------------------------------+
| CAPA 4: ALMACENAMIENTO, COLAS Y EVENT BROKER                                                      |
|  • Base de Datos Relacional: PostgreSQL 16 con Row-Level Security (RLS por `empresa_id / NIT`)    |
|  • Caché & Telemetría Rápida: Redis Cluster (Sesiones activas, ratelimit, colas BullMQ)           |
|  • Repositorio de Documentos: MinIO / AWS S3 (Facturas XML, Representaciones Gráficas PDF)        |
+---------------------------------------------------------------------------------------------------+
```

---

## 3. ARQUITECTURA DETALLADA DEL FRONTEND: MATRIZ DE LAS 5 ZONAS

### Esquema de Distribución del Viewport
```
 0px +---------------------------------------------------------------------------------------------+
     | [ZONA 0]: Barra Superior Global (Height: 56px | Fixed Shrink: 0)                            |
56px +-------------------+-------------------------------------------------------------------------+
     | [ZONA 1]: Sidebar | [ZONA 2]: Workspace Principal       | [ZONA 3]: Panel Contextual        |
     | Acordeón          | (~72% del espacio de trabajo)       | (~28% del espacio de trabajo)     |
     | (Width: 256px     | Scroll Vertical Independiente       | Scroll Vertical Independiente     |
     |  Overflow-Y)      | Vistas ricas: Kanban, Tablas, etc.  | Donut Charts, Rankings, Feeds     |
H-48 +-------------------+-------------------------------------+-----------------------------------+
     | [ZONA 4]: Barra de Telemetría Inferior (Height: 48px | Latencia 18ms | Conectores Activos)  |
     +---------------------------------------------------------------------------------------------+
```

### Tabla de Estados y Sincronización entre Módulos

| Módulo Activo (Zona 1) | Vista Montada en Zona [2] (~72%) | Widgets Montados en Zona [3] (~28%) | Telemetría Activa en Zona [4] |
| :--- | :--- | :--- | :--- |
| **01. Inicio** | Dashboard general, 4 KPIs macro ($845.2M COP), curva SVG de captación, tabla facturas recientes. | Gráfico Donut de industrias (Telecom 42%, Fintech 24%, etc.), feed de actividad en tiempo real. | Latencia media (18ms), estado DIAN (100%), sync Odoo (12s). |
| **02. Comercial** | Tablero Kanban reactivo (Calificación, Propuesta, Negociación, Cierre) con drag & drop. | Progreso de cuota comercial del mes (82%), Top Ejecutivos de cuenta y ratio de conversión. | Conexiones WebSocket activas, eventos de pipeline en vivo. |
| **03. Intel. Comercial** | Motor LeadGen, tabla de prospectos enriquecidos con score IA (98%, 94%), empuje a CRM. | Filtros sectoriales rápidos, conteo diario de prospectos rastreados (1,428), métrica de afinidad. | Estado del Crawler de bases de datos empresariales, pool activo. |
| **04. Documentos** | Consola RADIAN con eventos UBL 2.1 (030, 032, 034), visor XML, estados de validación. | Tasa de aprobación fiscal (99.2%), semáforo de facturas pendientes de aceptación, alertas. | Certificado digital vigente, ping SOAP DIAN (12ms). |
| **05. Integraciones** | Matriz de conectores con toggles en tiempo real (Odoo ERP v16.0, WhatsApp Cloud, DIAN). | Quota mensual de consumo de APIs, logs de peticiones HTTP entrantes/salientes. | Estado de sincronización XML-RPC Odoo, tasa WhatsApp (32 msg/m). |
| **06. Automatización** | Diseñador y monitor de workflows n8n, tabla de ejecuciones recientes (14,210 sin fallos). | Estadísticas de triggers ejecutados, tiempo medio de ejecución por flujo, tasa de éxito (100%). | Monitor de colas BullMQ, workers de procesamiento en segundo plano. |
| **07. Intel. Artificial** | Consola de ejecución de agentes Docker (*LeadScout*, *RADIAN Auditor*, *CRM Sync*), logs. | Monitoreo de memoria por contenedor, consumo acumulado de tokens de OpenAI en el ciclo. | Agentes activos (3/4 workers), sandbox isolation status: Seguro. |
| **08. Analítica** | Gráficos ejecutivos de MRR ($482.5M COP), CAC, LTV, filtros por sede y botones de exportación. | Resumen consolidado para Junta Directiva, indicadores de retención neta (NDR). | Caché analítico actualizado, tiempo de renderizado de reportes. |
| **09. Administración** | Matriz de control RBAC, gestión de usuarios, auditoría de inicios de sesión por IP. | Utilización de licencias adquiridas (24 de 30 asientos ocupados), políticas de seguridad. | Módulo de autenticación SSO activo, sesiones concurrentes. |
| **10. Ayuda** | Base de conocimientos técnica, explorador interactivo de endpoints de API, contacto NOC. | Enlace directo a ticket prioritario NOC 24/7, SLA garantizado de red (99.98%). | Estado de salud global de microservicios de Telcobras. |

---

## 4. MODELO DE DATOS PRINCIPAL (ENTITY RELATIONSHIP SCHEMA)

```sql
-- 1. Tenants (Empresas Clientes)
CREATE TABLE empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nit VARCHAR(20) NOT NULL UNIQUE,
    razon_social VARCHAR(255) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    plan_suscripcion VARCHAR(50) DEFAULT 'ENTERPRISE',
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Usuarios y Autenticación RBAC
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    rol VARCHAR(50) CHECK (rol IN ('SUPER_ADMIN', 'DIRECTOR_OPS', 'COMERCIAL', 'FINANZAS', 'NOC_SOPORTE')),
    ultimo_acceso TIMESTAMP WITH TIME ZONE,
    ip_origen VARCHAR(45)
);

-- 3. Pipeline Comercial (CRM Kanban)
CREATE TABLE oportunidades_comerciales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES empresas(id),
    cliente_nombre VARCHAR(255) NOT NULL,
    valor_estimado_cop NUMERIC(15, 2) NOT NULL,
    etapa VARCHAR(50) CHECK (etapa IN ('CALIFICACION', 'PROPUESTA', 'NEGOCIACION', 'CIERRE_GANADO', 'PERDIDO')),
    probabilidad_porcentaje INT CHECK (probabilidad_porcentaje BETWEEN 0 AND 100),
    ejecutivo_id UUID REFERENCES usuarios(id),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Documentos RADIAN / Facturación Electrónica DIAN
CREATE TABLE facturas_radian (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES empresas(id),
    cufe VARCHAR(100) NOT NULL UNIQUE,
    prefijo_folio VARCHAR(50) NOT NULL,
    emisor_razon_social VARCHAR(255) NOT NULL,
    emisor_nit VARCHAR(20) NOT NULL,
    total_cop NUMERIC(15, 2) NOT NULL,
    estado_dian VARCHAR(50) CHECK (estado_dian IN ('RECIBIDA', 'ACUSE_030', 'RECIBO_032', 'ACEPTADA_034', 'RECHAZADA')),
    sincronizado_odoo BOOLEAN DEFAULT FALSE,
    odoo_invoice_id VARCHAR(50),
    fecha_emision TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 5. Conectores e Integraciones
CREATE TABLE integraciones_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES empresas(id),
    tipo_conector VARCHAR(50) CHECK (tipo_conector IN ('DIAN_SOAP', 'ODOO_XMLRPC', 'WHATSAPP_CLOUD', 'OPENAI_SDK')),
    activo BOOLEAN DEFAULT TRUE,
    ultima_sincronizacion TIMESTAMP WITH TIME ZONE,
    estado_latencia_ms INT DEFAULT 0
);
```

---

## 5. FLUJO DE INTEGRACIÓN DE DATOS & EVENTOS EN TIEMPO REAL

```
[Cliente o Proveedor]
         |
         | Emite Factura Electrónica XML (UBL 2.1)
         v
[Webhook Ingesta / API DIAN SOAP]
         |
         +---> 1. Validador de Esquema y Firma Digital XAdES
         |
         +---> 2. Generación Eventos RADIAN (Acuse 030 -> Bien 032 -> Tácita 034)
         |
         +---> 3. Sincronización asíncrona hacia Odoo ERP v16.0 (XML-RPC)
         |
         +---> 4. Emisión de Evento WebSocket a la Suite Telcobras
                         |
                         +---> Zona [2]: Se añade la fila a la tabla con badge 'Sincronizado'
                         +---> Zona [3]: Actualiza el Donut y el Feed de Actividad en vivo
                         +---> Zona [4]: Incrementa el contador de transacciones en la telemetría
```

---

## 6. SEGURIDAD, AUTENTICACIÓN Y POLÍTICAS DE CUMPLIMIENTO

1. **Flujo de Acceso Zero-Friction**:
   * Autenticación corporativa vía Google Workspace SSO (OAuth 2.0).
   * Alternativa Passwordless: Código temporal OTP de 6 dígitos con expiración a los 5 minutos y límite de 3 intentos fallidos por IP.
2. **Encriptación**:
   * En tránsito: Protocolo forzado TLS 1.3 con suite de cifrado HSTS activa.
   * En reposo: Encriptación AES-256 para almacenamiento de credenciales de API (API Keys de OpenAI, tokens de WhatsApp y secretos XML-RPC de Odoo en HashiCorp Vault / KMS).
3. **Cumplimiento Tributario Colombiano**:
   * Implementación de la **Resolución 000085 de 2022 de la DIAN** para el registro de facturas electrónicas de venta como título valor negociable en el sistema RADIAN.
4. **Respaldo y Disponibilidad (SLA)**:
   * Target de disponibilidad de infraestructura: **99.98% de Uptime**.
   * Replicación de bases de datos PostgreSQL con punto de recuperación objetivo (RPO) < 1 minuto y tiempo de recuperación (RTO) < 15 minutos.

---

## 7. ROADMAP TÉCNICO DE IMPLEMENTACIÓN (FASES 1 A 4)

```
+----------------------------------------------------------------------------------------------------+
| FASE 1: FRONTEND REACTIVO & SISTEMA BASE (Semanas 1 - 3) [COMPLETADA EN CANVAS]                   |
| • Ensamblaje del Layout Maestro de 5 Zonas (0 a 4) en Next.js 14 + Tailwind CSS.                   |
| • Store global Zustand con reactividad sincronizada para los 10 módulos del Sidebar.               |
| • Sistema de diseño oficial Telcobras (#0A66C2, Plus Jakarta Sans, componentes Radix).             |
+----------------------------------------------------------------------------------------------------+
                                                 |
                                                 v
+----------------------------------------------------------------------------------------------------+
| FASE 2: CONECTIVIDAD & INTEGRACIONES CRÍTICAS (Semanas 4 - 6)                                      |
| • Implementación de cliente SOAP XML para ambiente de pruebas/habilitación DIAN.                  |
| • Conector XML-RPC bidireccional con Odoo ERP v16.0 para conciliación de terceros y facturas.     |
| • Gateway de autenticación SSO y envío de OTP corporativo.                                         |
+----------------------------------------------------------------------------------------------------+
                                                 |
                                                 v
+----------------------------------------------------------------------------------------------------+
| FASE 3: AUTOMATIZACIÓN & AGENTES COGNITIVOS (Semanas 7 - 9)                                        |
| • Despliegue de instancias n8n Core orquestadas mediante Docker.                                   |
| • Configuración de Sandboxes aislados para agentes OpenAI (LeadScout, Auditor RADIAN, CRM Sync).   |
| • Tableros de Telemetría activa en Zona 4 conectores de WhatsApp Cloud API.                       |
+----------------------------------------------------------------------------------------------------+
                                                 |
                                                 v
+----------------------------------------------------------------------------------------------------+
| FASE 4: AUDITORÍA DE SEGURIDAD & SALIDA A PRODUCCIÓN (Semanas 10 - 12)                             |
| • Pruebas de penetración (Pen-Testing) y auditoría de aislamiento multi-tenant por NIT.           |
| • Piloto con 5 cuentas corporativas de alta facturación de Telcobras.                             |
| • Despliegue en producción con monitoreo NOC 24/7 y balanceo de carga geo-distribuido.             |
+----------------------------------------------------------------------------------------------------+
```

---
*Blueprint oficial para la Dirección de Tecnología (CTO) y Gerencia General de Telcobras S.A.S.*
