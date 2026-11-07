<!-- Pega este bloque en .github/copilot-instructions.md -->
## Fondos interactivos (canvas)

Cuando se pida un fondo animado/interactivo (puntos, malla, partículas, estrellas, terreno, etc.):
1. Lee `docs/EFFECTS_PORTFOLIO.md`.
2. Reutiliza `src/components/InteractiveBackground/` (motor sin dependencias). No reescribas los efectos.
3. Variantes disponibles: grid, constellation, flow, ripple, aurora, flicker, magnet, star, mesh, hex, terrain, orbit, spot.
4. Monta el componente dentro de un contenedor `position: relative` con el contenido encima (`z-index: 1`).
5. Usa Mantine y el color primario del tema. No uses Tailwind. No agregues dependencias ni cambies lógica existente.
6. Verifica `npm run build` y `npm run test`.
