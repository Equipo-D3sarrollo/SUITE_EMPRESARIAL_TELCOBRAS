# Etapa 3 — CRM y notificaciones

> **Renumerada el 10-nov-2026 ([ADR-013](../decisions/ADR-013-datadian-y-nueva-ruta.md)).** Antes era la etapa 2. La etapa 2 es ahora DataDian (`ETAPA_2_DATADIAN.md`). Cambios en esta especificación: el **Centro Documental se elimina** (DataDian ocupa su lugar en el menú) y la gestión documental queda como **servicio interno de archivos** que el CRM usa para sus adjuntos. Los identificadores E2-1 a E2-13 se conservan para no romper referencias. Si DataDian necesita antes alguna pieza compartida (archivos de E2-7 u outbox de E2-13), se construye en la etapa 2 y aquí se reutiliza.

| Campo | Valor |
|---|---|
| Estado | Especificación aprobada por decisiones del 6-nov-2026; se construye cuando la etapa 2 (DataDian) cumpla su criterio de salida |
| Base | Documento madre §4.2, §4.7, §4.8, §5.3, §7.4, §12, §15, §19; `PENDIENTES.md`; ADR-002 a ADR-011 y ADR-005 |
| Diseño de referencia | Stitch `crm_pipeline_kanban` (copia fuera del repo; `centro_documental` quedó descartada por ADR-013), adaptados a la paleta oficial (§12.4.1), Poppins y lucide |
| Criterio de salida (plan §15) | Flujo **lead → oportunidad → actividad** funcionando de punta a punta, con adjuntos y notificaciones |

## 1. Decisiones de la etapa (identificadores E2 conservados)

| ID | Decisión |
|---|---|
| E2-1 | **Leads y oportunidades separados, con conversión.** Los leads tienen lista propia con estados Nuevo, Contactado, Calificado y Descartado. Al calificar uno se convierte en empresa + contacto + oportunidad. Los leads masivos de LeadGen no llenan el Kanban |
| E2-2 | **Etapas por defecto del Kanban = las 8 del PDF §5.4:** Nuevo lead → Contactado → Calificado → Reunión → Propuesta → Negociación → Ganado / Perdido. Son configurables por organización (renombrar, reordenar, agregar, desactivar); Ganado y Perdido son cierres obligatorios. Un lead convertido entra en **Calificado** por defecto (se puede elegir otra etapa); una oportunidad creada a mano puede empezar en cualquiera |
| E2-3 | **Duplicados: reglas + revisión humana.** Duplicado seguro (mismo NIT, correo normalizado o dominio web dentro de la organización): se bloquea y se ofrece abrir el existente. Duplicado probable (nombre parecido, `pg_trgm` + `unaccent`): aviso y el usuario decide. La fusión es manual y queda auditada |
| E2-4 | **Tiempo real con SSE.** `GET /api/v1/events/stream`, autenticado con la cookie de sesión. Envía solo eventos de la organización activa y del usuario, distribuidos con Valkey pub/sub (canal por organización) para funcionar con varias instancias. Reconexión con `Last-Event-ID`. Las acciones siguen por REST |
| E2-5 | **Notificaciones internas + correo.** Campana en la Zona 0 con contador, bandeja y "marcar como leído", por SSE. Correo para lo importante: oportunidad asignada, actividad vencida o por vencer, mención. Preferencias por usuario y por tipo. WhatsApp queda para la etapa 4 |
| E2-6 | **Búsqueda global en PostgreSQL.** `tsvector` en español + `unaccent` + `pg_trgm` sobre empresas, contactos, leads, oportunidades y documentos, dentro de `withTenant`. `GET /api/v1/search?q=` con debounce de 300 ms. Sin motor externo |
| E2-7 | **Archivos: máximo 25 MB, tipos cerrados, antivirus.** PDF, XML, DOCX, XLSX, PNG, JPG y ZIP; el tipo se valida por el contenido real. Subida directa a S3 con URL prefirmada. El archivo queda "en verificación" hasta que **ClamAV** lo escanea. SHA-256 y versiones. Descarga con URL prefirmada de corta duración |
| E2-8 | **Alcance de los permisos: "propios" o "todos".** Por ejemplo `crm.opportunity:read:own` frente a `crm.opportunity:read:all`. "Propios" = el usuario es el responsable (`owner_user_id`). Comercial = propios; Gerente y Administrador de empresa = todos. Se aplica en el backend (filtro + verificación por objeto); RLS sigue aislando por organización. Equipos y territorios, después |
| E2-9 | **Importar y exportar.** Empresas, contactos y leads desde CSV/XLSX: mapeo de columnas, vista previa con errores y duplicados, confirmación. Corre en segundo plano (BullMQ), con progreso por SSE, y queda auditado. Exportar listas filtradas a Excel y PDF respetando el alcance |
| E2-10 | **Papelera con restauración.** Borrado lógico (`deleted_at`, `deleted_by`) restaurable. El borrado definitivo requiere permiso de administrador y queda auditado. Los documentos fiscales no se borran definitivamente mientras corra su plazo legal (pendiente) |
| E2-11 | **Multimoneda desde la etapa 3: COP y USD.** Cada monto guarda importe, moneda, importe convertido a COP, tasa usada y fecha de la tasa. Los totales del pipeline se muestran en COP. Tasa: **TRM oficial diaria** (Superintendencia Financiera, publicada en datos.gov.co; confirmar el dataset y su API al implementar), descargada por un trabajo diario y guardada en `exchange_rates`. Si falta la TRM del día se usa la última disponible y se indica su fecha |
| E2-12 | **Actividades sin sincronizar calendarios en la etapa 3.** Viven en la suite, con recordatorios por la campana y el correo. Google Calendar / Outlook llegan con el Integration Hub (etapa 4) |
| E2-13 [REC] | **Eventos internos.** Sobre: `{ id (uuid v7), type, version, organizationId, actorUserId, occurredAt, correlationId, data }`. Se escriben en la tabla `outbox_events` en la misma transacción del cambio. Un despachador los publica en BullMQ (`FOR UPDATE SKIP LOCKED`). Los consumidores son idempotentes, con la tabla `processed_events` por id. Hasta 5 reintentos con backoff exponencial; después pasan a la cola de mensajes fallidos y a la tabla `failed_events` para revisarlos |

## 2. Alcance

**Entra:** CRM completo según PDF §5:
- empresas, contactos y leads, con conversión;
- oportunidades con Kanban;
- actividades;
- historial de interacción;
- reportes comerciales básicos en la Zona 3.

También entran:
- adjuntos del CRM sobre el servicio interno de archivos (PDF §12, sin Centro Documental; ADR-013);
- notificaciones internas y correo (PDF §13);
- búsqueda global Ctrl+K;
- tiempo real por SSE;
- eventos internos con outbox;
- importación y exportación;
- multimoneda.

**No entra:**
- LeadGen y su envío de prospectos al CRM (etapa 4);
- RADIAN, extracción de facturas y vínculo con Odoo/DIAN (etapa 2, DataDian);
- WhatsApp y calendarios (etapa 4);
- equipos y territorios;
- analítica transversal y MRR (etapa 6).

Los botones de Stitch que dependen de esas etapas ("Sincronizar RADIAN/DIAN", "Vincular con Odoo/DIAN", "Re-indexar OCR") **no se muestran** hasta su etapa.

## 3. Modelo de datos

Reglas de §7.4 en todas las tablas:
- `organization_id NOT NULL`, con RLS forzado;
- índices que empiezan por `organization_id` y de cursor;
- borrado lógico (E2-10) en las entidades de negocio;
- auditoría de cada mutación;
- nombres en inglés (ADR-008).

| Tabla | Campos principales (PDF §5, §12, §22 y Stitch) |
|---|---|
| `companies` | name, legal_name, nit (UNIQUE parcial por organización), sector, size, address, city, website + `website_domain` normalizado (UNIQUE parcial), commercial_status, tier, owner_user_id, tags, notes, search_vector, deleted_at |
| `contacts` | first_name, last_name, email + `email_normalized` (UNIQUE parcial), phone, job_title, company_id, origin, status, tags, notes, owner_user_id, consent_basis (Ley 1581), search_vector, deleted_at |
| `leads` | company_name, nit, website, contact_name, email, phone, industry, origin (leadgen, web_form, import, campaign, integration, manual), status (new, contacted, qualified, discarded), discard_reason, score, priority, owner_user_id, converted_at, converted_company_id/contact_id/opportunity_id, search_vector, deleted_at |
| `pipeline_stages` | name, position, default_probability, is_closed_won, is_closed_lost, is_active (8 semilla, E2-2) |
| `opportunities` | title, company_id, contact_id, stage_id, owner_user_id, service_description, amount, currency, amount_cop, fx_rate, fx_date, probability, priority, expected_close_date, origin, lost_reason, closed_at, search_vector, deleted_at |
| `activities` | type (call, email, meeting, follow_up, task, note, commitment), subject, description, due_at, completed_at, owner_user_id, related_type + related_id (company, contact, lead, opportunity), reminder_at, deleted_at |
| `stage_history` | opportunity_id, from_stage_id, to_stage_id, changed_by, changed_at (para tiempo de cierre y conversión) |
| `duplicate_merges` | entity_type, kept_id, merged_id, merged_by, merged_at, snapshot jsonb |
| `documents` | title, category (factura, contrato, propuesta, certificado, administrativo, otro), status (uploading, scanning, available, infected, rejected), current_version_id, owner_user_id, origin (upload, import, integration), search_vector, deleted_at, retention_until |
| `document_versions` | document_id, version, storage_key, size_bytes, mime_type (detectado), sha256, scan_status, scanned_at, uploaded_by, uploaded_at |
| `document_links` | document_id, entity_type, entity_id (empresa, contacto, oportunidad, lead) |
| `document_metadata` | document_id, key, value (metadatos libres y de clasificación) |
| `notifications` | user_id, type, title, body, entity_type, entity_id, read_at, created_at |
| `notification_preferences` | user_id, type, email_enabled |
| `imports` | entity_type, file_document_id, column_mapping jsonb, status, total, created, updated, skipped, errors jsonb, created_by |
| `exchange_rates` | rate_date, from_currency, to_currency, rate, source (global, sin RLS, solo lectura para app_user) |
| `outbox_events`, `processed_events`, `failed_events` | E2-13 |

## 4. Permisos nuevos (catálogo de `@telcobras/contracts`, E2-8)

- **CRM:**
  - `crm.company`, `crm.contact`, `crm.lead`, `crm.opportunity` y `crm.activity`, cada uno con `:read`, `:create`, `:update` y `:delete`, todos con alcance `own` o `all`.
  - `crm.lead:convert`, `crm.record:merge`, `crm.pipeline:configure`, `crm.import:run`, `crm.export:run`.
- **Documentos:** `documents.file:read|upload|update|delete` (con `own` o `all`), `documents.file:purge` (borrado definitivo).
- **Notificaciones:** propias de cada usuario; no requieren permiso.
- **Asignación a roles semilla:**
  - Comercial: CRM con alcance `own`.
  - Gerente y Administrador de empresa: `all`.
  - Administrativo y Contador: documentos `all` y CRM solo lectura.
  - Operador: `own`.
  - Usuario básico: lectura `own`.

## 5. API (REST /api/v1, OpenAPI, paginación por cursor, problem+json, Idempotency-Key)

| Recurso | Endpoints |
|---|---|
| Empresas, contactos, leads, oportunidades, actividades | CRUD con filtros (responsable, etapa, sector, origen, período de cierre, estado), `POST …/restore`, `DELETE …?purge=true` (con permiso) |
| Leads | `POST /leads/{id}/convert` (crea empresa + contacto + oportunidad en una transacción, con verificación de duplicados), `POST /leads/{id}/discard` |
| Duplicados | `GET /duplicates/check` (antes de crear), `POST /duplicates/merge` |
| Pipeline | `GET/PUT /pipeline/stages`, `PATCH /opportunities/{id}/stage` (mover en el Kanban; registra `stage_history`) |
| Historial | `GET /{entity}/{id}/timeline` (actividades + cambios de etapa + documentos + auditoría) |
| Documentos | `POST /documents/uploads` (URL prefirmada), `POST /documents/{id}/versions`, `GET /documents/{id}/download` (URL prefirmada, solo si `available`), vínculos y metadatos |
| Importar / exportar | `POST /imports` (archivo + entidad), `POST /imports/{id}/preview`, `POST /imports/{id}/confirm`, `GET /exports/{entity}?format=xlsx\|pdf` |
| Búsqueda | `GET /search?q=` |
| Notificaciones | `GET /notifications`, `POST /notifications/{id}/read`, `POST /notifications/read-all`, `GET/PUT /me/notification-preferences` |
| Tiempo real | `GET /events/stream` (SSE) |
| Monedas | `GET /exchange-rates/latest?from=USD&to=COP` |

## 6. Eventos de negocio (PDF §9.4 + esta etapa)

`company.created`, `contact.created`, `lead.created`, `lead.qualified`, `lead.converted`, `lead.discarded`, `opportunity.created`, `opportunity.stage_changed`, `opportunity.won`, `opportunity.lost`, `opportunity.assigned`, `activity.created`, `activity.due_soon`, `activity.overdue`, `document.uploaded`, `document.scanned`, `document.infected`, `import.completed`, `record.merged`.

Las notificaciones (E2-5), el tiempo real (E2-4) y el historial se alimentan de estos eventos.

## 7. Interfaz (Zona 1 → Zonas 2, 3 y 4)

| Submódulo | Zona 2 | Zona 3 | Zona 4 |
|---|---|---|---|
| **Pipeline Kanban** (Stitch) | KPIs: pipeline total activo, cuentas calificadas, tasa de cierre ponderada, ganado del mes. Filtros: responsable, período de cierre, sector, origen. Columnas por etapa con conteo y total estimado en COP. Tarjetas con origen, prioridad, empresa, servicio, monto (con moneda), barra de probabilidad, responsable y próxima fecha. Arrastrar y soltar con @dnd-kit y actualización optimista (§19.1). "Nueva oportunidad", "Exportar" | Próximos compromisos (actividades del usuario: vencidas, hoy, mañana), conversión por etapa | Eventos del pipeline en vivo (SSE) |
| **CRM Empresas** | Tabla virtualizada: Razón social y NIT, Sector, Servicio principal, Responsable, Monto estimado, Acción "Ficha 360°" | Empresas por sector, últimas actualizadas | — |
| **Ficha 360°** (empresa, contacto, lead, oportunidad) | Datos, contactos, oportunidades, documentos vinculados e historial (timeline) | Próximas actividades del registro | — |
| **Contactos** | Tabla con empresa, cargo, correo, teléfono, origen, estado y etiquetas | — | — |
| **Leads** | Tabla con estado, origen, score, prioridad y responsable. Acciones: calificar, descartar, convertir (asistente con verificación de duplicados), importar | Leads por origen y estado | — |
| **Oportunidades** | Vista de tabla del pipeline | — | — |
| **Actividades** | Lista y agenda (día/semana) con filtros; completar en línea | Vencidas y por vencer | — |
| **Adjuntos** (pestaña de la Ficha 360°; ya no hay Centro Documental, ADR-013) | Buzón de carga (arrastrar y soltar, tipos y 25 MB visibles). Tabla: documento, categoría, fecha, estado. Búsqueda | Inspector: metadatos, SHA-256, versiones, vínculos, historial de auditoría, descargar, enviar a papelera | Estado del escaneo antivirus |
| **Zona 0** | Campana con contador y bandeja; Ctrl+K con resultados reales de la búsqueda global | | |

Datos colombianos: NIT con dígito de verificación, montos en COP o USD con `Intl` (es-CO), zona horaria America/Bogota. Todo con la paleta oficial y estados con icono + texto.

## 8. Requisitos de §19 que aplican

- Kanban y matriz con actualizaciones optimistas.
- Tablas virtualizadas.
- Paginación por cursor.
- Debounce en la búsqueda.
- Importaciones, escaneos y correos en la cola.
- Caché de KPIs en Valkey por organización.
- Índices de cursor y GIN para `search_vector`.
- Prohibido `SELECT *`.
- Timeouts en llamadas a S3, ClamAV y SMTP.
- Pruebas de rendimiento en móvil en la CI.

## 9. Infraestructura nueva

- **ClamAV** (`clamav/clamav`) en Compose y en producción. Un worker transmite el objeto de S3 a `clamd` (INSTREAM) y actualiza el estado.
- **Workers BullMQ** en el mismo monorepo: proceso aparte de la API, misma imagen y otro comando. Se encargan de:
  - el despachador de outbox;
  - los escaneos;
  - las importaciones y exportaciones;
  - los correos;
  - los recordatorios (`activity.due_soon` y `activity.overdue`);
  - la TRM diaria.
- **Extensiones de PostgreSQL:** `pg_trgm` y `unaccent`.

## 10. Pruebas obligatorias

- **Aislamiento:**
  - las pruebas RLS de la etapa 1 extendidas a todas las tablas nuevas;
  - alcance `own` frente a `all`: un comercial no ve ni modifica oportunidades ajenas aunque adivine el id.
- **Conversión de lead:** transaccional (si falla una parte no se crea nada), con duplicados.
- **Kanban:** mover una tarjeta registra el historial; el rollback optimista funciona ante un error.
- **Documentos:** se rechaza un tipo falso por extensión; un archivo con la firma de prueba EICAR queda `infected` y no se puede descargar; las versiones conservan su hash.
- **Eventos:**
  - un evento duplicado no se procesa dos veces;
  - después de 5 fallos pasa a mensajes fallidos;
  - SSE solo entrega eventos de la organización activa.
- **Importación:** vista previa con errores y duplicados; la confirmación es idempotente.
- **Multimoneda:** conversión con la TRM y uso de la última tasa disponible.
- **E2E del criterio de salida:** crear lead → calificar → convertir → mover la oportunidad en el Kanban → crear actividad → recibir notificación (campana y correo en Mailpit) → adjuntar documento → encontrarlo con Ctrl+K.

## 11. Depende de las etapas 1 y 2

`withTenant`, roles y permisos con guard, auditoría, sesión con organización activa, shell de 5 zonas, design system (KpiCard, DataTable, EmptyState, Skeleton, StatusBadge), cliente OpenAPI, Valkey, S3 local, Mailpit y la CI. De la etapa 2 (DataDian) reutiliza lo que ya exista del servicio interno de archivos y del outbox.

## 12. Pendientes que siguen abiertos para esta etapa

| Tema | Nota |
|---|---|
| Plazo legal de conservación de documentos fiscales | Necesario para E2-10 (no borrar definitivamente); confirmar con contabilidad |
| Dataset y API exactos de la TRM | Confirmar en datos.gov.co al implementar E2-11 |
| Textos de los correos de notificación | Redactarlos con el tono de marca (MARCA §3) |
