# ADR-002: Monolito modular NestJS

- **Estado:** Aceptado
- **Fecha:** 4 de noviembre de 2026
- **Decide:** arquitecto del producto
- **Decisiones:** D-06 (documento madre §14)

> **Nota (10 de noviembre de 2026):** [ADR-013](ADR-013-datadian-y-nueva-ruta.md) cambia el caso de RADIAN: la funcionalidad se construye dentro del monolito como el módulo DataDian (`documents`), no como un servicio Python aparte. LeadGen sigue como servicio aparte.
>
> **Nota (12 de noviembre de 2026):** [ADR-014](ADR-014-arquitectura-datadian-telco.md) propone, pendiente de confirmar, extraer el motor Telco de DataDian como una aplicación TypeScript aparte (`apps/telco`), con la justificación que pide la sección Consecuencias. La interfaz y la API de DataDian siguen en el monolito.

## Contexto
El blueprint propone microservicios con gRPC; el PDF prohíbe microservicios, Kubernetes y una BD por módulo sin justificación (§26, §29.6).

## Decisión
Monolito modular en NestJS, con un módulo por dominio y fronteras estrictas: ningún módulo toca las tablas de otro. LeadGen y RADIAN (Python, existentes) quedan como servicios aparte, detrás de contratos HTTP o eventos. Comunicación REST + OpenAPI; tiempo real con SSE o WebSocket. Sin gRPC ni Kubernetes.

## Consecuencias
Un solo despliegue de la API. Un módulo se puede extraer como servicio solo con justificación y un ADR nuevo.
