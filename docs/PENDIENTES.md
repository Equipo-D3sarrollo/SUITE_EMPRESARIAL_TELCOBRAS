# Pendientes — Suite Empresarial Telcobras

| Campo | Valor |
|---|---|
| Fecha de corte | 5 de noviembre de 2026 |
| Base | `docs/DOCUMENTO_MADRE_SUITE_TELCOBRAS.md` v1.1 |
| Uso | Lista única de lo que **no** está definido o hecho al iniciar la construcción. Cuando un punto se resuelve, se marca aquí y se actualiza el documento madre o el ADR correspondiente |

**Especificación de la etapa 2:** [`docs/etapas/ETAPA_2_ESPECIFICACION.md`](etapas/ETAPA_2_ESPECIFICACION.md) (decisiones E2-1 a E2-13).

**Lo que sí está definido** (no se repite aquí): visión, 12 módulos, decisiones D-01–D-06, D-08–D-13, D-15–D-17 y D-20–D-24 (ADR-001 a ADR-011), paleta y tipografía, layout de 5 zonas, modelo de datos conceptual, reglas de seguridad, requisitos de rendimiento (§19) y ruta por etapas (§15).

## 1. Decisiones diferidas

| ID | Qué falta decidir | Quién | Bloquea |
|---|---|---|---|
| D-13 | Proveedor y región del VPS y del S3; transferencia internacional (Ley 1581) si quedan fuera de Colombia | Gerencia + arquitecto | Producción (etapa 5) |
| D-14 | Figura ante la DIAN: PT tercero, mandato (evento 043), habilitación propia o solo descarga | Arquitecto + contabilidad/legal | Etapa 4 (RADIAN) |
| D-16 | Versión exacta, edición y hosting de Odoo; si su RADIAN nativo duplica el módulo | Arquitecto | Etapa 3 (conector Odoo) |
| D-18 | Lenguaje de los agentes (Python o TS), tracing propio, ZDR y retención con OpenAI | Arquitecto | Etapa 6 |
| D-19 | WhatsApp multi-tenant (WABA por organización o número compartido) | Arquitecto | Etapa 3+ |
| D-21 | Validación legal de las fuentes de LeadGen (RUES, datos de personas) | Arquitecto + legal | Etapa 3 (LeadGen) |
| D-25 | Modelo comercial: planes, límites y precios | Gerencia | Etapa 5 |

## 2. Información por conseguir (etapa 0)

| Qué | Para qué |
|---|---|
| Acceso al repositorio de LeadGen (+ Harvey) | Inventario de stack, API, fuentes y datos (D-21) |
| Acceso a la herramienta RADIAN | Cómo obtiene documentos de la DIAN (D-14) |
| Acceso de lectura a Make | Inventario de escenarios y credenciales; plan de salida |
| Datos de la instancia de Odoo | D-16 y diseño del conector |

## 3. Temas que el documento madre no define todavía

| Tema | Estado | Cuándo |
|---|---|---|
| Diseño responsive (tablet y móvil) | Diferido; solo escritorio ≥ 1280 px | Antes del piloto |
| Sidebar colapsable a 64 px | Mejora posterior; 256 px fijo | Posterior |
| Router, formularios y cliente API del frontend | Sin elegir | Al montar la etapa 1 |
| Lint y formato (ESLint/Prettier o Biome) | Sin elegir | Etapa 1 |
| Tiempo real: SSE o WebSocket, autenticación, reconexión | ✅ Resuelto: SSE (E2-4, `docs/etapas/ETAPA_2_ESPECIFICACION.md`) | Etapa 2 |
| Bus de eventos: sobre, DLQ, retención | ✅ Resuelto: E2-13 (outbox + BullMQ + mensajes fallidos) | Etapa 2 |
| Búsqueda (Ctrl+K global, deduplicación de leads) | ✅ Resuelto: E2-6 y E2-3 | Etapa 2 |
| UI de notificaciones (más allá de la campana) | ✅ Resuelto: E2-5 (campana, bandeja, correo, preferencias) | Etapa 2 |
| Consentimiento y lista de supresión unificada (correo y WhatsApp, Ley 2300) | Sin definir | Etapa 3 |
| Dominios de envío por organización (SPF, DKIM, DMARC) y proveedor de correo | Sin definir | Etapa 3 |
| Retención legal de XML/PDF de facturas y de la auditoría | Sin definir | Antes de la etapa 4 |
| Certificados digitales por organización (custodia, vencimientos, XAdES-EPES) | Depende de D-14 | Etapa 4 |
| Calendario de días hábiles y festivos de Colombia | Sin definir | Etapa 4 |
| SSO corporativo (Okta/Entra) por organización | Diferido por D-09 | Posterior |
| Suplantación del superadmin: duración, aviso, quién autoriza | Solo el principio (auditada) | Etapa 5 |
| Facturación electrónica de la propia suite | Sin definir | Etapa 5 |
| Herramienta de analítica (réplica, vistas, almacén) | Sin definir (D-20 cubre el alcance) | Etapa 5 |
| Responsable del "NOC 24/7" y SLA de soporte | Sin definir | Etapa 5 |
| Respuesta a incidentes y notificación de brechas a la SIC | Sin definir | Etapa 5 |
| Agentes: herramientas, evaluación, memoria/RAG, costos por organización | Solo conceptual | Etapa 6 |
| Presupuestos de rendimiento (§19.4) y timeouts | Punto de partida sin datos reales | Ajustar en etapa 1 |

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
| `CLAUDE.md` de graphify | Sin commit: menciona un grafo que aún no existe |
| Grafo de graphify | Se genera cuando haya código |
