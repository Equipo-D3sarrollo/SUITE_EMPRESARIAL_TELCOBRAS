/**
 * engine.js — Motor de canvas SIN dependencias y SIN React.
 * Funciona en cualquier framework (React, Vue, Svelte) o en HTML plano.
 *
 *   const engine = createEngine(canvasEl, { variant: 'spot', intensity: 0.6 });
 *   engine.setOptions({ variant: 'hex' });   // cambiar en caliente
 *   engine.destroy();                        // limpiar listeners y animación
 *
 * Devuelve null si el navegador/entorno no tiene contexto 2D (p. ej. jsdom en tests).
 */
import { effects } from './effects.js';

export const DEFAULTS = {
  variant: 'grid',     // ver effects.js → grid | constellation | flow | ripple | aurora | flicker | magnet | star | mesh | hex | terrain | orbit | spot
  density: 1,          // 0.5 (más ligero) … 2 (más denso). Escala espaciado y cantidad de partículas
  intensity: 1,        // 0.2 (sutil) … 1.5 (fuerte). Escala la opacidad
  radius: 1,           // multiplicador del radio de interacción con el puntero
  autoplay: true,      // true: sin puntero, un puntero virtual recorre la pantalla
  interactive: true,   // false: ignora el mouse/dedo
  color: null,         // color CSS; si es null se toma de la variable CSS --ib-color o del color primario de Mantine
  hue: 215,            // tono base (0-360) solo para "aurora"
};

export function createEngine(canvas, userOptions = {}) {
  const ctx = canvas && canvas.getContext && canvas.getContext('2d');
  if (!ctx) return null;

  const o = { ...DEFAULTS, ...userOptions };
  const mouse = { x: -9999, y: -9999, in: false };
  const mq = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  let reduced = !!(mq && mq.matches);
  let raf = 0, running = false, visible = true, frameNo = 0, dpr = 1;

  const A = {
    ctx, W: 0, H: 0, s: {}, o, mouse, clicks: [], c: { dot: '#4f5ef0' },
    sp: (px) => Math.max(8, px / o.density),
    n: (c) => Math.max(8, Math.round(c * o.density)),
    al: (a) => Math.min(1, Math.max(0, a * o.intensity)),
    r: (px) => px * o.radius,
    pointer(t) {
      if (mouse.in) return { x: mouse.x, y: mouse.y, active: true };
      if (o.autoplay) return { x: A.W / 2 + Math.cos(t * 0.0006) * A.W * 0.3, y: A.H / 2 + Math.sin(t * 0.0008) * A.H * 0.25, active: true };
      return { x: -9999, y: -9999, active: false };
    },
    fade(a) {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(0,0,0,' + a + ')';
      ctx.fillRect(0, 0, A.W, A.H);
      ctx.restore();
    },
  };

  function readColors() {
    const cs = getComputedStyle(canvas);
    const get = (n) => cs.getPropertyValue(n).trim();
    A.c.dot = o.color || get('--ib-color') || get('--mantine-primary-color-filled') || get('--mantine-color-blue-filled') || '#4f5ef0';
  }

  function drawFrame(t) {
    const e = effects[o.variant];
    if (!e) return;
    if (!e.trail) ctx.clearRect(0, 0, A.W, A.H);
    e.draw(A, t);
  }

  function rebuild() {
    A.s = {}; A.clicks.length = 0;
    ctx.clearRect(0, 0, A.W, A.H);
    readColors();
    const e = effects[o.variant];
    if (!e || !A.W || !A.H) return;
    e.init(A);
    if (reduced) { for (let i = 0, n = e.trail ? 120 : 1; i < n; i++) drawFrame(i * 16); } // imagen estática
  }

  function frame(t) {
    raf = 0;
    if (!running) return;
    if (frameNo++ % 30 === 0) readColors(); // detecta cambios de tema claro/oscuro
    drawFrame(t);
    raf = requestAnimationFrame(frame);
  }
  const start = () => { if (running || reduced || !visible || document.hidden) return; running = true; raf = requestAnimationFrame(frame); };
  const stop = () => { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; };

  function resize() {
    const r = canvas.getBoundingClientRect();
    A.W = Math.max(1, Math.floor(r.width)); A.H = Math.max(1, Math.floor(r.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = A.W * dpr; canvas.height = A.H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rebuild();
  }

  const onMove = (e) => {
    if (!o.interactive) return;
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    mouse.in = mouse.x >= 0 && mouse.y >= 0 && mouse.x <= r.width && mouse.y <= r.height;
  };
  const onLeave = () => { mouse.in = false; };
  const onDown = (e) => { if (o.interactive && mouse.in) A.clicks.push({ x: e.clientX - canvas.getBoundingClientRect().left, y: e.clientY - canvas.getBoundingClientRect().top, t: performance.now() }); };
  const onVis = () => (document.hidden ? stop() : start());
  const onMq = (e) => { reduced = e.matches; reduced ? (stop(), rebuild()) : (rebuild(), start()); };

  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onDown, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
  window.addEventListener('blur', onLeave);
  document.addEventListener('visibilitychange', onVis);
  if (mq && mq.addEventListener) mq.addEventListener('change', onMq);

  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
  if (ro) ro.observe(canvas); else { window.addEventListener('resize', resize); resize(); }
  const io = typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible ? start() : stop(); })
    : null;
  if (io) io.observe(canvas);
  start();

  return {
    setOptions(next = {}) { Object.assign(o, next); rebuild(); start(); },
    resize,
    destroy() {
      stop();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      document.removeEventListener('visibilitychange', onVis);
      if (mq && mq.removeEventListener) mq.removeEventListener('change', onMq);
      if (ro) ro.disconnect(); else window.removeEventListener('resize', resize);
      if (io) io.disconnect();
    },
  };
}
