# Portafolio de fondos interactivos (Interactive Backgrounds)

> Documento de conocimiento para Claude / Copilot dentro de VS Code.
> Contiene TODO lo necesario para replicar cualquiera de los 13 efectos en cualquier proyecto:
> qué es cada uno, cómo se comporta, sus parámetros exactos, el algoritmo, el rendimiento y cómo integrarlo.

---

## 0. Instrucciones para Claude (léelo primero)

Cuando el usuario pida un "fondo interactivo", "efecto de puntos/malla/partículas que sigue el mouse" o nombre cualquiera de los efectos de este portafolio:

1. **No reescribas el efecto desde cero.** El código de referencia ya existe en `src/components/InteractiveBackground/` (`engine.js`, `effects.js`, `InteractiveBackground.jsx`). Reutilízalo.
2. Si la carpeta no existe en el proyecto, cópiala tal cual (no requiere dependencias) y adapta solo la integración (sección 4 y 5).
3. Para ajustar el look usa las **props** (`variant`, `density`, `intensity`, `radius`, `autoplay`, `color`, `hue`) antes de tocar el algoritmo. Las constantes internas de cada efecto están en la sección 6.
4. Para un efecto nuevo, sigue el contrato de la sección 7 (se agrega una entrada en `effects.js`; no se toca el motor).
5. **Restricciones del proyecto del usuario (UARP-AI):** React 18 + Vite 7, Mantine 8 (también MUI 7, Bootstrap 5, Recharts, ECharts). **No usar Tailwind.** No migrar ni romper nada existente; solo agregar el componente y montarlo. Mantener compatibles los tests (Vitest + Testing Library, entorno jsdom).
6. Verifica siempre: `npm run build`, `npm run test` y revisión visual en modo claro y oscuro.
7. Si el proyecto usa TypeScript: renombra a `.ts/.tsx`, tipa `A` (ver sección 7) o deja los `.js` con `allowJs`.

---

## 1. Vista rápida de los 13 efectos

| # | `variant` | Nombre | Familia | Estela | Costo CPU | Ideal para |
|---|-----------|--------|---------|--------|-----------|------------|
| 1 | `grid` | Dot grid | Malla de puntos | No | Bajo | Dashboard, hero |
| 2 | `constellation` | Constellation | Red de partículas | No | Medio | Landing, login |
| 3 | `flow` | Flow field | Partículas con estela | Sí | Medio | Login, portada |
| 4 | `ripple` | Ripples | Malla de puntos + ondas | No | Medio | Hero, portafolio |
| 5 | `aurora` | Aurora / mesh gradient | Degradado animado | No | Bajo | Login, secciones suaves |
| 6 | `flicker` | Flickering grid | Cuadrícula parpadeante | No | Medio | Dashboard técnico |
| 7 | `magnet` | Magnetic field | Líneas orientadas | No | Medio | Dashboard, hero |
| 8 | `star` | Starfield 3D | 3D / parallax | No | Medio | Login, portada |
| 9 | `mesh` | Elastic mesh | Malla de líneas | No | Medio | Hero, secciones |
| 10 | `hex` | Hex glow | Panal con estela | No | Medio | Dashboard industrial |
| 11 | `terrain` | Wireframe terrain | 3D wireframe | No | Medio-alto | Login, portada |
| 12 | `orbit` | Orbit swarm | Partículas con estela | Sí | Medio | Hero, login |
| 13 | `spot` | Spotlight grid | Plano técnico | No | Bajo | Dashboard, admin |

**Recomendación para paneles de administración (usuarios, roles, permisos, auditoría):** `spot`, `hex`, `flicker`, `grid` o `magnet`, con `intensity` entre 0.3 y 0.6 y `autoplay={false}`. Los efectos con mucho movimiento (`flow`, `aurora`, `star`, `terrain`, `orbit`) cansan en sesiones largas: úsalos en login/bienvenida.

---

## 2. Cómo se llama este efecto (términos de búsqueda)

- **Interactive dot grid / dot matrix background** → malla de puntos que reacciona al cursor.
- **Particle network / constellation effect** → partículas unidas por líneas (particles.js, tsParticles).
- **Flow field / Perlin noise particles**, **Magnetic field / iron filings**, **Flickering grid**, **Pulsar grid**, **Vortex**, **Elastic spiderweb / organic mesh**, **Starfield / warp**, **Synthwave wireframe terrain**, **Aurora / mesh gradient background**.
- Sitios para inspirarse: shadcn.io/background, 21st.dev, Framer Marketplace, CodePen (buscar "canvas background mouse interaction").
- Librerías alternativas (solo si el motor propio no alcanza): **tsParticles** (`npm i @tsparticles/react @tsparticles/slim`), **three.js / @react-three/fiber** (3D real), **p5.js**, **OGL** (shaders ligeros). Canvas 2D nativo es suficiente para los 13 efectos de este portafolio.

---

## 3. Arquitectura del kit

```
src/components/InteractiveBackground/
├── effects.js                  # Registro de efectos (13). Cada uno: { label, trail?, init(A), draw(A,t) }
├── engine.js                   # Motor sin dependencias: canvas, DPR, resize, puntero, rAF, pausa, reduced-motion
├── InteractiveBackground.jsx   # Wrapper de React (useRef + useEffect)
├── index.js                    # Exports
└── InteractiveBackground.test.jsx   # Smoke tests (Vitest + jsdom)
docs/
├── EFFECTS_PORTFOLIO.md        # Este documento
└── demos/                      # HTML originales de referencia (se abren en el navegador)
```

Flujo: `InteractiveBackground` crea el motor con `createEngine(canvas, opts)`. El motor mide el canvas con `ResizeObserver`, llama `effect.init(A)` y luego `effect.draw(A, t)` en cada frame de `requestAnimationFrame`. Los efectos sin `trail` se limpian cada frame; los que tienen `trail: true` llaman `A.fade(alpha)`.

### 3.1 Props y opciones

| Prop | Defecto | Rango útil | Qué hace |
|------|---------|-----------|----------|
| `variant` | `'grid'` | ver tabla 1 | Efecto a mostrar |
| `density` | `1` | 0.5 – 2 | Escala espaciado y cantidad de partículas (más = más denso y más costoso) |
| `intensity` | `1` | 0.2 – 1.5 | Escala la opacidad de todo lo que se dibuja |
| `radius` | `1` | 0.5 – 2 | Multiplica el radio de influencia del puntero |
| `autoplay` | `true` | bool | Sin puntero real, un puntero virtual recorre la pantalla (útil en móvil) |
| `interactive` | `true` | bool | `false` ignora mouse/dedo |
| `color` | `null` | CSS color | Si es null: `--ib-color` → `--mantine-primary-color-filled` → `#4f5ef0` |
| `hue` | `215` | 0 – 360 | Tono base, solo `aurora` |
| `fixed` | `false` | bool | `position: fixed` (toda la ventana) en lugar de `absolute` (el contenedor) |
| `className`, `style` | — | — | Se aplican al `<canvas>` |

### 3.2 API que reciben los efectos (`A`)

| Miembro | Descripción |
|---------|-------------|
| `A.ctx`, `A.W`, `A.H` | Contexto 2D y tamaño en px CSS (el motor ya aplica `devicePixelRatio`, máx. 2) |
| `A.s` | Estado propio del efecto; se reinicia en cada `init` |
| `A.c.dot` | Color principal (se relee cada ~30 frames para seguir el tema claro/oscuro) |
| `A.o` | Opciones vivas |
| `A.pointer(t)` | `{x, y, active}`: real, virtual (autoplay) o `{-9999,-9999,false}` |
| `A.clicks` | Clics recientes `{x, y, t}` (los usa `ripple`) |
| `A.fade(a)` | Desvanece con `destination-out` (estelas sin tapar el fondo de la página) |
| `A.sp(px)` | Espaciado ÷ `density` (mínimo 8) |
| `A.n(count)` | Cantidad × `density` (mínimo 8) |
| `A.al(alpha)` | Alpha × `intensity`, limitado a 0..1 |
| `A.r(px)` | Radio × `radius` |

---

## 4. Instalación en un proyecto React + Vite

1. Copia la carpeta `src/components/InteractiveBackground/` al proyecto (por ejemplo, junto al módulo del dashboard).
2. No hay que instalar paquetes. Requisitos: React 18 (hooks), navegador moderno (canvas 2D, ResizeObserver, IntersectionObserver).
3. Copia `docs/EFFECTS_PORTFOLIO.md` al repo y referencia el archivo en `CLAUDE.md` y `.github/copilot-instructions.md` (hay snippets listos en `CLAUDE.snippet.md` y `copilot-instructions.snippet.md`).
4. Importa y monta (sección 5). Corre `npm run build` y `npm run test`.

Fuera de React: `import { createEngine } from './engine.js'` y pasa cualquier `<canvas>`; llama `engine.destroy()` al desmontar.

---

## 5. Integración (con Mantine, sin Tailwind)

### 5.1 Fondo dentro del módulo Dashboard

```jsx
import { Box } from '@mantine/core';
import InteractiveBackground from '../../components/InteractiveBackground';

export default function DashboardPage() {
  return (
    <Box pos="relative" mih="100vh" style={{ overflow: 'hidden' }}>
      <InteractiveBackground variant="spot" intensity={0.5} autoplay={false} />
      <Box pos="relative" style={{ zIndex: 1 }}>
        {/* contenido existente del dashboard, sin cambios */}
      </Box>
    </Box>
  );
}
```

### 5.2 Fondo a pantalla completa (login / bienvenida)

```jsx
<InteractiveBackground fixed variant="constellation" density={1} />
```

### 5.3 Selector de variante (para probar rápido)

```jsx
import { useState } from 'react';
import { SegmentedControl } from '@mantine/core';
import InteractiveBackground, { variants } from '../../components/InteractiveBackground';

const [variant, setVariant] = useState('grid');
<SegmentedControl value={variant} onChange={setVariant} data={variants} />
<InteractiveBackground variant={variant} />
```

### 5.4 Color y tema

- Por defecto el color sale de `--mantine-primary-color-filled`, así que sigue el color primario y el modo claro/oscuro de Mantine sin código extra.
- Forzar un color: `<InteractiveBackground color="#14b8a6" />` o definir `--ib-color` en CSS del contenedor.
- Si las tarjetas pierden legibilidad: bajar `intensity` (0.3–0.5) o dar a las tarjetas un fondo semitransparente (`backgroundColor: 'var(--mantine-color-body)'` con opacidad) sin rediseñar nada.

### 5.5 Reglas de capas

- El contenedor del canvas debe tener `position: relative` (o usar `fixed`).
- El canvas lleva `pointer-events: none` y `z-index: 0`: nunca bloquea clics. El contenido va encima con `position: relative; z-index: 1`.
- Los eventos de puntero se escuchan en `window`, así que funcionan aunque haya contenido encima.

---

## 6. Fichas detalladas por efecto

> Todas las cifras son las constantes reales de `effects.js`. "Escala con" indica qué props las modifican.

### 6.1 `grid` — Dot grid (malla de puntos)
- **Qué se ve:** cuadrícula regular de puntos pequeños. Cerca del cursor, los puntos se apartan, crecen y se iluminan; al alejarse vuelven suavemente a su sitio.
- **Interacción:** repulsión radial con retorno elástico.
- **Constantes:** espaciado 30 px · radio de influencia 140 px · desplazamiento máx. 38 px (`k × 38`, con `k = 1 − d/R`) · suavizado (lerp) 0.15 · radio del punto `1.4 + k × 2.6` · alpha `0.25 + k × 0.75`.
- **Algoritmo:** por punto, calcular vector al puntero; si `d < R`, objetivo = posición original + dirección normalizada × desplazamiento; mover la posición actual hacia el objetivo (lerp); dibujar círculo con tamaño y alpha según `k`.
- **Escala con:** `density` (espaciado), `radius`, `intensity`.
- **Rendimiento:** ~1.000–2.500 puntos; muy ligero.
- **Usar en:** dashboard (con `intensity` ≈ 0.4), hero. **Evitar:** nada especial.

### 6.2 `constellation` — Red de partículas
- **Qué se ve:** puntos que flotan y se unen con líneas finas cuando están cerca; las líneas se desvanecen con la distancia.
- **Interacción:** el cursor repele partículas cercanas y se conecta con líneas a las que están dentro de su radio.
- **Constantes:** cantidad `min(160, área/14000 × density)` · velocidad ±0.3 px/frame · rebote en bordes · distancia de enlace 130 px (alpha `(1−d/L) × 0.6`) · repulsión 110 px (1.6 px/frame) · enlaces al cursor 170 px (alpha `× 0.8`) · radio del punto 2.
- **Algoritmo:** mover y rebotar; empujar si está cerca del puntero; dibujar puntos; doble bucle O(n²) para enlaces (limitado por el tope de 160); enlazar con el puntero.
- **Escala con:** `density` (cantidad), `radius`, `intensity`.
- **Rendimiento:** O(n²) con n ≤ 160 ≈ 12.800 comprobaciones/frame; ok. Si se sube `density` mucho, usar un spatial hash.
- **Usar en:** login, landing. **Evitar:** pantallas con tablas muy densas (ruido visual).

### 6.3 `flow` — Flow field (campo de flujo) · estela
- **Qué se ve:** cientos de partículas fluyen siguiendo un campo ondulante y dejan estelas que se desvanecen.
- **Interacción:** cerca del cursor las partículas giran en remolino alrededor de él.
- **Constantes:** cantidad `min(1200, área/2200 × density)` · velocidad 1.5 px/frame · ángulo `sin(x·0.004 + t·0.0003) · cos(y·0.004 − t·0.00025) · 2π` · radio del remolino 220 px (mezcla del ángulo con `atan2 + 1.57`) · fade `0.08` · alpha 0.8 · reaparición aleatoria 0.2 % por frame.
- **Algoritmo:** `A.fade(0.08)`; por partícula calcular ángulo del campo, mezclar con el remolino si está cerca del puntero, avanzar, dibujar segmento (anterior → nuevo) en un único `beginPath`/`stroke`; reaparecer al salir de pantalla.
- **Escala con:** `density`, `radius`, `intensity`.
- **Rendimiento:** un solo `stroke` por frame; bueno hasta ~1.200 partículas.
- **Nota:** al usar `destination-out` puede quedar un residuo muy tenue de estela (alpha ≤ ~3 %); es normal.
- **Usar en:** login/bienvenida. **Evitar:** dashboards de trabajo largos.

### 6.4 `ripple` — Ripples (ondas)
- **Qué se ve:** malla de puntos que pulsa en ondas concéntricas alrededor del cursor; cada clic lanza un anillo expansivo.
- **Interacción:** puntero (onda continua) + clic/tap (anillo).
- **Constantes:** espaciado 24 px · punto base 1.2 px / alpha 0.22 · onda `sin(d·0.05 − t·0.006) · exp(−d/220)` (longitud ≈ 125 px) · amplitud +3 px de tamaño / +0.7 de alpha · anillo de clic: velocidad 0.35 px/ms, ancho `exp(−|d−r|/30)`, duración 1800 ms, amplitud +4 px / +0.8.
- **Algoritmo:** por punto sumar la contribución de la onda del puntero y de cada clic activo; dibujar círculo; eliminar clics vencidos.
- **Escala con:** `density`, `radius` (decaimiento de la onda), `intensity`.
- **Rendimiento:** ~3.000–5.000 arcos/frame; medio. Subir el espaciado en pantallas grandes si baja el FPS.
- **Nota:** los clics se registran en cualquier parte de la ventana (si el puntero está sobre el canvas).
- **Usar en:** hero, portafolio.

### 6.5 `aurora` — Aurora / mesh gradient
- **Qué se ve:** manchas de luz de colores que flotan lentamente, mezclándose como una aurora; una de ellas sigue al cursor.
- **Interacción:** una mancha persigue al puntero con suavizado.
- **Constantes:** 5 manchas · radio `35 % × max(W,H)` · alpha 0.38 · tono base 215 + 32 × i (`hue` configurable) · saturación 90 % / luminosidad 60 % · movimiento `x = W·(0.5 + 0.38·sin(t·0.0003·(i+1) + 2i))`, `y = H·(0.5 + 0.35·cos(t·0.00025·(i+2) + i))` · seguimiento lerp 0.05.
- **Algoritmo:** 5 `createRadialGradient` con `hsla` que decae a transparente; un `fillRect` por mancha.
- **Rendimiento:** muy bajo (5 gradientes).
- **Usar en:** login, secciones suaves. Es el único que no usa `color` (usa `hue`).

### 6.6 `flicker` — Flickering grid
- **Qué se ve:** cuadrícula de pequeños cuadrados que titilan al azar, estilo matrix; el cursor funciona como foco de luz.
- **Constantes:** espaciado 16 px · cuadrado 8 px · alpha base `0.1 + 0.08·sin(t·0.001·f + fase)` con `f ∈ [0.5, 2.5]` · foco 170 px (suma `(1−d/170) × 0.85`).
- **Algoritmo:** cada celda guarda fase y frecuencia aleatorias; alpha = base + brillo por cercanía; `fillRect`.
- **Escala con:** `density`, `radius`, `intensity`.
- **Rendimiento:** ~2.000–4.000 rectángulos; medio-bajo.
- **Usar en:** dashboard técnico/industrial.

### 6.7 `magnet` — Magnetic field (limaduras de hierro)
- **Qué se ve:** muchas rayitas orientadas hacia el cursor como limaduras alrededor de un imán; las cercanas se alargan y se iluminan.
- **Constantes:** espaciado 26 px · largo `10 + k × 9` px con `k = 1 − d/320` · alpha `0.2 + k × 0.7` · grosor 1.6 · extremos redondeados.
- **Algoritmo:** ángulo = `atan2` hacia el puntero; segmento centrado en la celda; sin puntero (y `autoplay` false) apunta al centro.
- **Escala con:** `density`, `radius`, `intensity`.
- **Rendimiento:** ~1.500–3.000 trazos individuales; medio.
- **Usar en:** dashboard, hero.

### 6.8 `star` — Starfield 3D
- **Qué se ve:** viaje por un campo de estrellas con estelas; el cursor desplaza la cámara con parallax (las cercanas se mueven más).
- **Constantes:** estrellas `min(700, área/1800 × density)` · profundidad z de 20 a 1200 · velocidad 5 por frame · largo de estela 14 de z · distancia focal 300 · parallax ×1.4 · suavizado 0.06 · grosor `max(0.6, (1 − z/1200) × 2.6)` · alpha `1.1 − z/1200`.
- **Algoritmo:** proyección `x' = W/2 + (x − ox) × 300/z`; dibujar de `z+14` a `z`; al pasar la cámara (z < 20) reaparece al fondo.
- **Rendimiento:** un `stroke` por estrella; medio.
- **Usar en:** login/bienvenida.

### 6.9 `mesh` — Elastic mesh (malla elástica)
- **Qué se ve:** red de líneas que se estira y se dobla como una tela cuando el cursor la empuja.
- **Constantes:** espaciado 36 px · radio 190 px · fuerza `(1 − d/R)² × 70` · suavizado 0.18 · alpha de línea 0.4.
- **Algoritmo:** nodos con posición original y actual; desplazar por repulsión cuadrática; dibujar segmentos horizontales y verticales en un solo `stroke`.
- **Escala con:** `density`, `radius`, `intensity`.
- **Rendimiento:** ~1.500 nodos, un `stroke`; ligero.
- **Usar en:** hero, secciones.

### 6.10 `hex` — Hex glow (panal)
- **Qué se ve:** panal de hexágonos; los que toca el cursor se iluminan y se apagan despacio, dejando una estela.
- **Constantes:** radio de celda 24 px (horizontal `1.5·r`, vertical `√3·r`, columnas impares desplazadas `h/2`; hexágono de lado `r − 2`, vértice a 0°) · activación a `1.6·r` del puntero · decaimiento `v × 0.96` por frame · alpha `0.12 + v × 0.7` · relleno `v × 0.3`.
- **Algoritmo:** cada celda tiene `v ∈ [0,1]`; si el puntero está cerca `v = 1`; siempre `v *= 0.96`; trazar 6 vértices.
- **Escala con:** `density` (tamaño de celda), `radius` (zona de activación), `intensity`.
- **Rendimiento:** ~600–1.200 hexágonos; medio.
- **Usar en:** dashboard industrial (muy recomendado).

### 6.11 `terrain` — Wireframe terrain (synthwave)
- **Qué se ve:** terreno de alambre en perspectiva con olas; el cursor levanta una colina.
- **Constantes:** 36 columnas × 26 filas · separación 64 · z inicial 180 · distancia focal 480 · altura de cámara 230 · horizonte en `H × 0.42` · altura `sin(i·0.45 + t·0.0014)·cos(j·0.4 − t·0.001)·38 + sin(j·0.25 + t·0.0007)·22` · colina `120 × exp(−r²/7)` (escala con `radius`) · alpha por fila `1 − j/rows × 0.9` (mín. 0.08).
- **Algoritmo:** generar la rejilla 3D, proyectar a 2D, dibujar filas y columnas; el cursor se mapea a (columna, fila).
- **Rendimiento:** ~1.900 segmentos/frame con trazos separados; medio-alto en móviles lentos.
- **Usar en:** login/portada. Deja el cielo (mitad superior) vacío: ideal para título encima.

### 6.12 `orbit` — Orbit swarm (enjambre) · estela
- **Qué se ve:** cientos de partículas giran alrededor del cursor con inercia y dejan estelas luminosas.
- **Constantes:** cantidad `min(480, área/2500 × density)` · radio orbital 30–180 px × `radius` con pulsación ±25 % (`sin(t·0.002 + 3·ángulo)`) · velocidad angular 0.008–0.028 rad/frame (signo aleatorio) · inercia 0.03–0.12 · elipse con relación 0.6 · fade 0.14 · punto 1.6 px · alpha 0.9.
- **Algoritmo:** `A.fade(0.14)`; cada partícula persigue su punto objetivo en una elipse alrededor del puntero.
- **Rendimiento:** un arco por partícula; medio.
- **Usar en:** hero, login.

### 6.13 `spot` — Spotlight grid (plano técnico)
- **Qué se ve:** cuadrícula tenue tipo plano; alrededor del cursor las líneas se revelan en tres anillos de luz y aparecen cruces (+) en las intersecciones.
- **Constantes:** espaciado 40 px · alpha base 0.1 · tres recortes circulares (radios 240 / 170 / 100 px, alphas 0.12 / 0.14 / 0.18, acumulativos) · cruces dentro de 130 px con brazo de 4 px y alpha 0.9.
- **Algoritmo:** dibujar la rejilla completa tenue; con `ctx.clip()` en cada círculo, volver a dibujarla; marcar intersecciones cercanas.
- **Escala con:** `density`, `radius`, `intensity`.
- **Particularidad:** sin puntero activo (`autoplay={false}` y sin mouse) solo se ve la rejilla tenue: perfecto para dashboards sobrios.
- **Rendimiento:** muy ligero. **El más recomendado para administración.**

---

## 7. Cómo crear un efecto nuevo

Agrega una entrada en `effects.js`; no hay que tocar el motor ni el componente.

```js
miEfecto: {
  label: 'Mi efecto',
  trail: false,                 // true si usa estelas (entonces llama A.fade(a) en draw)
  init(A) {
    // Prepara el estado. Usa A.sp / A.n para respetar density.
    A.s.items = Array.from({ length: A.n(100) }, () => ({ x: Math.random() * A.W, y: Math.random() * A.H }));
  },
  draw(A, t) {
    const { ctx } = A, p = A.pointer(t);          // puntero real/virtual
    ctx.fillStyle = A.c.dot;
    for (const it of A.s.items) {
      const d = Math.hypot(it.x - p.x, it.y - p.y);
      ctx.globalAlpha = A.al(d < A.r(150) ? 1 : 0.3); // respeta intensity y radius
      ctx.beginPath(); ctx.arc(it.x, it.y, 2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  },
},
```

Tipos (si el proyecto usa TypeScript):

```ts
export interface EffectAPI {
  ctx: CanvasRenderingContext2D; W: number; H: number; s: Record<string, any>;
  c: { dot: string }; o: { density: number; intensity: number; radius: number; autoplay: boolean; hue: number };
  clicks: { x: number; y: number; t: number }[];
  pointer(t: number): { x: number; y: number; active: boolean };
  fade(a: number): void; sp(px: number): number; n(c: number): number; al(a: number): number; r(px: number): number;
}
export interface Effect { label: string; trail?: boolean; init(A: EffectAPI): void; draw(A: EffectAPI, t: number): void }
```

Reglas para efectos nuevos: sin asignaciones grandes por frame; un solo `beginPath`/`stroke` cuando sea posible; limitar conteos; restaurar `globalAlpha = 1` al final; no leer el DOM en `draw`.

---

## 8. Rendimiento, accesibilidad y pruebas

- **FPS bajos:** bajar `density` a 0.6–0.8; `intensity` no afecta el costo. Los más pesados: `terrain`, `ripple`, `constellation` con `density` > 1.5.
- **DPR:** limitado a 2 por el motor.
- **Pausa automática:** cuando la pestaña no está visible (`visibilitychange`) y cuando el canvas sale de pantalla (`IntersectionObserver`).
- **`prefers-reduced-motion`:** el motor dibuja un único cuadro estático (las variantes con estela se "pre-calientan" 120 frames) y detiene la animación.
- **Accesibilidad:** `aria-hidden="true"`, no recibe foco ni clics.
- **Tests (jsdom):** `canvas.getContext('2d')` no existe en jsdom; `createEngine` devuelve `null` y el componente no falla. Ver `InteractiveBackground.test.jsx`.
- **Memoria:** `destroy()` quita todos los listeners y observers; React lo llama en el cleanup (también en StrictMode).

### Problemas frecuentes

| Síntoma | Causa | Solución |
|---------|-------|----------|
| No se ve nada | El contenedor no tiene alto o no es `position: relative` | Dar `mih`/`h` al contenedor o usar `fixed` |
| El contenido no recibe clics | Capas mal ordenadas | Contenido con `position: relative; z-index: 1`; canvas ya lleva `pointer-events: none` |
| Se ve borroso | DPR no aplicado | Usar el motor tal cual (ya lo aplica) |
| Color no sigue el tema | Se pasó `color` fijo | Quitar `color` para usar `--mantine-primary-color-filled` |
| Estela deja un tono tenue | Redondeo de `destination-out` | Normal; subir el fade a 0.12–0.16 |
| Lento en móvil | Demasiada densidad | `density={0.6}` o cambiar a `grid` / `spot` |
| Falla un test | jsdom sin canvas | Mantener el chequeo `getContext` nulo (ya incluido) |

---

## 9. Checklist de replicación (para Claude)

1. ¿Existe `src/components/InteractiveBackground/`? Si no, copiarla.
2. Elegir `variant` según la sección 1 (admin → `spot`/`hex`/`flicker`; login → `constellation`/`flow`/`star`/`terrain`/`aurora`).
3. Montar con contenedor `position: relative` y contenido en `z-index: 1`.
4. Ajustar `intensity` (0.3–0.6 en dashboards), `density` y `autoplay`.
5. Verificar claro/oscuro, móvil y `prefers-reduced-motion`.
6. Ejecutar `npm run build` y `npm run test`.
7. Resumir al usuario los archivos creados/modificados.

---

## 10. Prompt maestro (pegar en Copilot / Claude Code)

```
Lee docs/EFFECTS_PORTFOLIO.md. Implementa el fondo interactivo "<variant>" en <módulo/ruta>
reutilizando src/components/InteractiveBackground (cópialo si no existe, sin dependencias nuevas).
Usa Mantine y el color primario del tema (claro/oscuro), NO uses Tailwind, no cambies lógica,
rutas ni permisos existentes, mantén los tests pasando y ajusta intensity/density para que el
contenido siga legible. Al terminar, lista los archivos tocados y confirma build y tests.
```

---

## 11. Demos de referencia

Archivos HTML autónomos en `docs/demos/` (ábrelos con doble clic o Live Server):

| Archivo | Efectos |
|---------|---------|
| `fondo-interactivo.html` | Dot grid, Constellation |
| `fondos-avanzados.html` | Flow field, Ripples, Aurora, Flickering grid, Magnetic field |
| `fondos-avanzados-2.html` | Starfield 3D, Elastic mesh, Hex glow, Wireframe terrain, Orbit swarm, Spotlight grid |

Los HTML contienen la versión "monolítica" de cada efecto (mismo algoritmo y constantes); el kit en `src/` es la versión modular, parametrizable y lista para producción.
