# Pendientes — OrveX.IA

| Campo | Valor |
|---|---|
| Fecha de corte | 5 de noviembre de 2026 |
| Base | `docs/DOCUMENTO_MADRE_SUITE_TELCOBRAS.md` v1.1 |
| Uso | Lista única de lo que **no** está definido o hecho al iniciar la construcción. Cuando un punto se resuelve, se marca aquí y se actualiza el documento madre o el ADR correspondiente |

**Ruta actualizada el 10-nov-2026 por [ADR-013](decisions/ADR-013-datadian-y-nueva-ruta.md):** etapa 1 cerrada, etapa 2 = DataDian, etapa 3 = CRM y notificaciones, y el resto se corre un número.

**Especificaciones:** etapa 2 en [`docs/etapas/ETAPA_2_DATADIAN.md`](etapas/ETAPA_2_DATADIAN.md) (decisiones DD-1 a DD-7, diseño pendiente); etapa 3 en [`docs/etapas/ETAPA_3_ESPECIFICACION.md`](etapas/ETAPA_3_ESPECIFICACION.md) (decisiones E2-1 a E2-13).

**Lo que sí está definido** (no se repite aquí): visión, 12 módulos, decisiones D-01–D-06, D-08–D-13, D-15–D-17 y D-20–D-24 (ADR-001 a ADR-013), paleta y tipografía, layout de 5 zonas, modelo de datos conceptual, reglas de seguridad, requisitos de rendimiento (§19) y ruta por etapas (§15).

## 1. Decisiones diferidas

| ID | Qué falta decidir | Quién | Bloquea |
|---|---|---|---|
| D-13 | Proveedor y región del VPS y del S3; transferencia internacional (Ley 1581) si quedan fuera de Colombia | Gerencia + arquitecto | Producción (etapa 6) |
| D-14 | Figura ante la DIAN: PT tercero, mandato (evento 043), habilitación propia o solo descarga | Arquitecto + contabilidad/legal | Etapa 2, solo la fase C de DataDian (envío de eventos). El flujo de listado, descarga, aprobación y Odoo no depende de ella |
| D-16 | Versión exacta, edición y hosting de Odoo; si su RADIAN nativo duplica el módulo | Arquitecto | Etapa 2 (borrador en Odoo de DataDian) |
| D-18 | Lenguaje de los agentes (Python o TS), tracing propio, ZDR y retención con OpenAI | Arquitecto | Etapa 7 |
| D-19 | WhatsApp multi-tenant (WABA por organización o número compartido) | Arquitecto | Etapa 4+ |
| D-21 | Validación legal de las fuentes de LeadGen (RUES, datos de personas) | Arquitecto + legal | Etapa 4 (LeadGen) |
| D-25 | Modelo comercial: planes, límites y precios | Gerencia | Etapa 6 |

## 2. Información por conseguir (etapa 0)

| Qué | Para qué |
|---|---|
| Acceso al repositorio de LeadGen (+ Harvey) | Inventario de stack, API, fuentes y datos (D-21) |
| Acceso a la herramienta RADIAN | Cómo obtiene documentos de la DIAN (D-14) |
| Acceso de lectura a Make | Inventario de escenarios y credenciales; plan de salida |
| Datos de la instancia de Odoo 19 Online y el detalle de la petición HTTP del **escenario de Make.com** que hoy le envía los PDF y los datos (URL, modelo, campos, credencial). El acceso ya está confirmado; la suite replica esa lógica | D-16 y diseño del conector |
| Certificado digital `.p12` de Telcobras y su contraseña. **Pendiente por decisión del usuario (11-nov-2026)** | XML por CUFE por el web service de la DIAN y eventos RADIAN (DataDian, fases B y C). No bloquea la fase A |
| El archivo Excel real del listado (ya hay captura con los 18 campos) y un PDF real protegido con el NIT. **Pendientes por decisión del usuario (11-nov-2026)** | Fijar las columnas del importador y probar la apertura del PDF (DataDian, fase 0) |

## 3. Temas que el documento madre no define todavía

| Tema | Estado | Cuándo |
|---|---|---|
| Diseño responsive (tablet y móvil) | Diferido; solo escritorio ≥ 1280 px | Antes del piloto |
| Sidebar colapsable a 64 px | Mejora posterior; 256 px fijo | Posterior |
| Router, formularios y cliente API del frontend | Sin elegir | Al montar la etapa 1 |
| Lint y formato (ESLint/Prettier o Biome) | Sin elegir | Etapa 1 |
| Tiempo real: SSE o WebSocket, autenticación, reconexión | ✅ Resuelto: SSE (E2-4, `docs/etapas/ETAPA_3_ESPECIFICACION.md`) | Etapa 3 |
| Bus de eventos: sobre, DLQ, retención | ✅ Resuelto: E2-13 (outbox + BullMQ + mensajes fallidos) | Etapa 2 o 3, la que lo necesite primero |
| Búsqueda (Ctrl+K global, deduplicación de leads) | ✅ Resuelto: E2-6 y E2-3 | Etapa 3 |
| UI de notificaciones (más allá de la campana) | ✅ Resuelto: E2-5 (campana, bandeja, correo, preferencias) | Etapa 3 |
| Consentimiento y lista de supresión unificada (correo y WhatsApp, Ley 2300) | Sin definir | Etapa 4 |
| Dominios de envío por organización (SPF, DKIM, DMARC) y proveedor de correo | Sin definir | Etapa 4 |
| Retención legal de XML/PDF de facturas y de la auditoría | Sin definir | Etapa 2 (antes de permitir borrado definitivo en DataDian) |
| Certificados digitales por organización (custodia, vencimientos, XAdES-EPES) | La custodia y los vencimientos no dependen de D-14; la firma de eventos sí | Etapa 2 |
| Calendario de días hábiles y festivos de Colombia | Sin definir | Etapa 2 |
| SSO corporativo (Okta/Entra) por organización | Diferido por D-09 | Posterior |
| TOTP obligatorio para administradores de organización y superadministradores | Sin implementar; hoy es opcional para todos (ADR-012) | Antes del piloto |
| Exigir TOTP también al entrar con Google: hoy quien tiene TOTP activo entra con Google sin el segundo factor, porque el hook de Better Auth solo cubre el código por correo y el callback de OAuth es una navegación (hay que redirigir a `/iniciar-sesion?paso=totp`) | Sin implementar; decidir si se corrige o si se acepta porque Google Workspace aplica su propia verificación (ADR-012) | Antes de habilitar Google en producción |
| Límite de envíos de códigos de acceso por cuenta y por hora; confirmar el límite por IP de Better Auth en producción (hoy 3 por minuto, solo activo en producción) | Sin definir (ADR-012) | Antes del piloto |
| Duración de la sesión (hoy 7 días por defecto de Better Auth) y una más corta para administradores | Sin definir (ADR-012) | Antes del piloto |
| Restablecimiento del TOTP por un administrador cuando la persona perdió la app y los códigos de respaldo | Sin definir (ADR-012) | Antes del piloto |
| Logo gráfico de OrveX.IA y eslogan propio: hoy el logotipo es solo texto animado (`apps/web/src/shell/zone0-topbar/logo.tsx`) y conserva el eslogan de Telcobras «Una nueva forma de entender las redes» | Pendiente del diseño de marca | Antes del piloto |
| NIT repetido al crear una organización: la base no lo impide (`organizations.nit` sin restricción única) y el formulario muestra un error genérico si la API rechaza la creación | Sin decidir si el NIT debe ser único y qué mensaje mostrar | Antes del piloto |
| Acceso a «Registrar otra organización» también desde el selector de organizaciones (hoy solo está en el menú de usuario) | Mejora opcional | Posterior |
| Suplantación del superadmin: duración, aviso, quién autoriza | Solo el principio (auditada) | Etapa 6 |
| Facturación electrónica de la propia suite | Sin definir | Etapa 6 |
| Herramienta de analítica (réplica, vistas, almacén) | Sin definir (D-20 cubre el alcance) | Etapa 6 |
| Responsable del "NOC 24/7" y SLA de soporte | Sin definir | Etapa 6 |
| Respuesta a incidentes y notificación de brechas a la SIC | Sin definir | Etapa 6 |
| Agentes: herramientas, evaluación, memoria/RAG, costos por organización | Solo conceptual | Etapa 7 |
| Presupuestos de rendimiento (§19.4) y timeouts | Punto de partida sin datos reales | Ajustar en etapa 2 |
| Administración de miembros y roles en la interfaz (invitar con un rol limitado desde la web) | Criterio de salida de la etapa 1 no verificado; la API de invitaciones ya existe (ADR-013) | Antes del piloto |
| E2E autenticado (registro → login → cambiar de organización → menú según el rol) | Criterio de salida de la etapa 1 no verificado (ADR-013) | Antes del piloto |
| Lighthouse móvil con Slow 4G y presupuestos de §19.4 en la CI | Criterio de salida de la etapa 1 no verificado (ADR-013) | Antes del piloto |
| Etapas que muestran las vistas de reserva (`apps/web/src/features/module-placeholder/stages.ts`) y textos del menú «Documentos» y «Centro Documental» | Siguen con la ruta vieja; se cambian junto con el menú de DataDian (ADR-013) | Etapa 2, al aplicar el menú |

## 4. Verificaciones pendientes

| Qué | Por qué |
|---|---|
| Versiones, fechas y normas de la auditoría web (Node 26, NestJS 12, retiro de MinIO, Assistants API, Res. DIAN 000227/2025, Odoo 20, licencia n8n) | Sin verificación cruzada: confirmar en la fuente oficial al usarlas |
| React Compiler estable y compatible | Requisito de §19.1 sin confirmar |
| Licencia de n8n para el uso interno | Confirmar por escrito con n8n |

## 5. Pantallas de Stitch

La carpeta se eliminó el 4-nov-2026. Solo 6 pantallas tuvieron ficha detallada (layouts y dashboard); las otras 17 quedaron con inventario de títulos, columnas y botones (documento madre §4, §12, §18-A). El detalle visual fino de esas pantallas se diseña de nuevo al construir cada módulo, con la paleta oficial.

## 6. Entorno y repositorio

| Qué | Estado |
|---|---|
| Docker Desktop (WSL2) | ✅ Instalado (Docker 29.9.2, Compose v5.6.1) |
| pnpm | ✅ Instalado (12.16.1) |
| `CLAUDE.md` de graphify | Sin commit (archivo de instrucciones del proyecto) |
| Grafo de graphify | ✅ Generado en `graphify-out/` tras iniciar la implementación |
