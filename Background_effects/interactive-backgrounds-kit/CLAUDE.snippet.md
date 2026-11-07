<!-- Pega este bloque en CLAUDE.md (raíz del repo) -->
## Fondos interactivos (canvas)

- Catálogo completo de efectos y guía de implementación: `docs/EFFECTS_PORTFOLIO.md` (léelo antes de crear o modificar fondos animados).
- Código reutilizable: `src/components/InteractiveBackground/` (`engine.js`, `effects.js`, `InteractiveBackground.jsx`). Reutilízalo; no reescribas efectos desde cero.
- Variantes: grid, constellation, flow, ripple, aurora, flicker, magnet, star, mesh, hex, terrain, orbit, spot.
- Para dashboards/administración usa `spot`, `hex`, `flicker`, `grid` o `magnet` con `intensity` 0.3–0.6 y `autoplay={false}`.
- Reglas del proyecto: React 18 + Vite 7 + Mantine 8; NO Tailwind; sin dependencias nuevas; no romper lógica existente; tests con Vitest + jsdom deben seguir pasando.
