# ADR-007: Paleta oficial, Poppins, lucide y Zona 4

- **Estado:** Aceptado
- **Fecha:** 4 de noviembre de 2026
- **Decide:** arquitecto del producto
- **Decisiones:** D-04, D-04b, D-04c, D-05 (documento madre §14)

## Contexto
Los diseños usan #0A66C2, Plus Jakarta Sans/Inter y Material Symbols, y no siguen la marca Telcobras.

## Decisión
Solo 6 colores: verde primario #88BD4C, azul secundario #2491CC, amarillo de acento #F3CB35, gris #888D91, blanco #FFFFFF y negro #000000. Única excepción: el rojo #C62828, solo para errores, siempre con icono y texto. La paleta por defecto de Tailwind queda desactivada y la CI rechaza otros colores. Todo texto pequeño va en negro (reglas de contraste en el documento madre §12.4.1). Poppins local con 3 pesos (400, 500, 600). Iconos solo de lucide-react. Zona 4 como barra de 48 px que se expande con el detalle por conector.

## Consecuencias
Los diseños de Stitch se adaptan a esta paleta; no se copian sus colores.
