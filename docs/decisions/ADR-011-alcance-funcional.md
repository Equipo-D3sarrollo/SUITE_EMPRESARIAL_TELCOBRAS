# ADR-011: RADIAN, Odoo, automatización, analítica y LeadGen

- **Estado:** Aceptado
- **Fecha:** 4 de noviembre de 2026
- **Decide:** arquitecto del producto
- **Decisiones:** D-15, D-16, D-17, D-20, D-21 (documento madre §14)

## Contexto
El blueprint asume Odoo 16 con XML-RPC, n8n para clientes y analítica mezclada; el flujo RADIAN mezcla roles.

## Decisión
RADIAN v1 solo de recepción: facturas de proveedores, eventos 030/031/032/033, aprobación humana y borrador en Odoo. Odoo 19/20 con la API JSON-2 y API key, sin XML-RPC. Módulo 06 = catálogo de procesos gobernados por Telcobras, y n8n solo como laboratorio interno. Analítica separada: la de cada organización por un lado y MRR/CAC/LTV solo en el Panel Global. LeadGen: primero se inventarían sus fuentes y se validan con legal; no se agrega scraping nuevo.

## Consecuencias
Abierto (diferido): la figura ante la DIAN (D-14) bloquea la etapa 4; hay que confirmar la versión exacta de Odoo y si su RADIAN nativo duplica funciones.
