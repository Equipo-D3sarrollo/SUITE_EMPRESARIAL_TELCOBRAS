# ADR-001: Resolución de conflictos entre fuentes

- **Estado:** Aceptado
- **Fecha:** 4 de noviembre de 2026
- **Decide:** arquitecto del producto
- **Decisiones:** D-01 (documento madre §14)

## Contexto
Las fuentes (PDF, blueprint, guías frontend, Stitch, manual de marca) se contradicen en framework, backend, agentes, n8n, roles, autenticación e infraestructura.

## Decisión
No hay una fuente que mande por defecto. Cada conflicto se resuelve en su propia decisión (D-xx) del documento madre §14. El arquitecto del producto decide; Claude Code recomienda y espera aprobación (PDF §29).

## Consecuencias
Cada conflicto nuevo genera una D-xx y, si afecta a la arquitectura, un ADR.
