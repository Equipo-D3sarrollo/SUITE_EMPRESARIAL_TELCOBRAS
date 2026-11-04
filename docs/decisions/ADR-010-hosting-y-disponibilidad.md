# ADR-010: VPS con Docker Compose y meta de 99,5 %

- **Estado:** Aceptado
- **Fecha:** 4 de noviembre de 2026
- **Decide:** arquitecto del producto
- **Decisiones:** D-13 (documento madre §14)

## Contexto
El blueprint promete 99,98 %, RPO < 1 min y geo-balanceo, que no es alcanzable con Compose en un solo host.

## Decisión
VPS alquilado con Docker Compose, Caddy como proxy y Cloudflare como CDN/WAF. Meta del piloto: 99,5 % de disponibilidad, respaldos con PITR y restauración probada. La API no guarda estado en el servidor, para poder balancear después.

## Consecuencias
Abierto (diferido): proveedor y región. Si quedan fuera de Colombia, hay que documentar la transferencia internacional de datos (Ley 1581).
