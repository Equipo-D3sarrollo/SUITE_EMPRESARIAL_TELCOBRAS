/**
 * effects.js — Registro de los 13 efectos de fondo interactivo.
 *
 * Contrato de cada efecto:
 *   {
 *     label: string,          // nombre legible
 *     trail?: boolean,        // true => el motor NO limpia el canvas; el efecto llama A.fade(alpha)
 *     init(A): void,          // se llama al montar, al cambiar de tamaño u opciones; guarda estado en A.s
 *     draw(A, t): void,       // se llama en cada frame (t = ms de requestAnimationFrame)
 *   }
 *
 * `A` (API que entrega el motor):
 *   A.ctx, A.W, A.H         contexto 2D y tamaño CSS del canvas (el motor ya aplica devicePixelRatio)
 *   A.s                     objeto de estado propio del efecto (se resetea en cada init)
 *   A.c.dot                 color principal (CSS válido para canvas)
 *   A.o                     opciones vivas (density, intensity, radius, autoplay, hue, ...)
 *   A.pointer(t)            => { x, y, active } puntero real, virtual (autoplay) o fuera de pantalla
 *   A.clicks                array de { x, y, t } con los clics recientes
 *   A.fade(a)               desvanece lo dibujado (para estelas) sin tapar el fondo de la página
 *   A.sp(px)                espaciado escalado por density  (más density => más denso)
 *   A.n(count)              cantidad escalada por density
 *   A.al(alpha)             alpha escalado por intensity y limitado a 0..1
 *   A.r(px)                 radio de interacción escalado por radius
 */

const TAU = Math.PI * 2;
const rnd = (a = 1, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));

export const effects = {
  /* 1 ─ Dot grid ─────────────────────────────────────────────────────────── */
  grid: {
    label: 'Dot grid (malla de puntos)',
    init(A) {
      const s = A.sp(30), d = [];
      for (let x = s / 2; x < A.W; x += s) for (let y = s / 2; y < A.H; y += s) d.push({ ox: x, oy: y, x, y });
      A.s.d = d;
    },
    draw(A, t) {
      const { ctx } = A, p = A.pointer(t), R = A.r(140);
      ctx.fillStyle = A.c.dot;
      for (const d of A.s.d) {
        const dx = d.ox - p.x, dy = d.oy - p.y, dist = Math.hypot(dx, dy);
        let tx = d.ox, ty = d.oy, k = 0;
        if (dist < R) { k = 1 - dist / R; const f = k * 38; tx += (dx / (dist || 1)) * f; ty += (dy / (dist || 1)) * f; }
        d.x += (tx - d.x) * 0.15; d.y += (ty - d.y) * 0.15;
        ctx.globalAlpha = A.al(0.25 + k * 0.75);
        ctx.beginPath(); ctx.arc(d.x, d.y, 1.4 + k * 2.6, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
    },
  },

  /* 2 ─ Constellation ────────────────────────────────────────────────────── */
  constellation: {
    label: 'Constellation (red de partículas)',
    init(A) {
      const n = Math.min(160, A.n((A.W * A.H) / 14000));
      A.s.p = Array.from({ length: n }, () => ({ x: rnd(A.W), y: rnd(A.H), vx: rnd(-0.3, 0.3), vy: rnd(-0.3, 0.3) }));
    },
    draw(A, t) {
      const { ctx, W, H } = A, P = A.s.p, m = A.pointer(t), L = A.r(130), push = A.r(110), link = A.r(170);
      ctx.fillStyle = A.c.dot; ctx.strokeStyle = A.c.dot; ctx.lineWidth = 1;
      for (const q of P) {
        q.x += q.vx; q.y += q.vy;
        if (q.x < 0 || q.x > W) q.vx *= -1;
        if (q.y < 0 || q.y > H) q.vy *= -1;
        const dx = q.x - m.x, dy = q.y - m.y, d = Math.hypot(dx, dy);
        if (d < push) { q.x += (dx / (d || 1)) * 1.6; q.y += (dy / (d || 1)) * 1.6; }
        ctx.globalAlpha = A.al(0.9);
        ctx.beginPath(); ctx.arc(q.x, q.y, 2, 0, TAU); ctx.fill();
      }
      for (let i = 0; i < P.length; i++) {
        const a = P[i];
        for (let j = i + 1; j < P.length; j++) {
          const b = P[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < L) { ctx.globalAlpha = A.al((1 - d / L) * 0.6); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        const dm = Math.hypot(a.x - m.x, a.y - m.y);
        if (m.active && dm < link) { ctx.globalAlpha = A.al((1 - dm / link) * 0.8); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(m.x, m.y); ctx.stroke(); }
      }
      ctx.globalAlpha = 1;
    },
  },

  /* 3 ─ Flow field ───────────────────────────────────────────────────────── */
  flow: {
    label: 'Flow field (campo de flujo)',
    trail: true,
    init(A) {
      const n = Math.min(1200, A.n((A.W * A.H) / 2200));
      A.s.p = Array.from({ length: n }, () => { const x = rnd(A.W), y = rnd(A.H); return { x, y, px: x, py: y }; });
    },
    draw(A, t) {
      const { ctx, W, H } = A, m = A.pointer(t), R = A.r(220);
      A.fade(0.08);
      ctx.globalAlpha = A.al(0.8); ctx.strokeStyle = A.c.dot; ctx.lineWidth = 1; ctx.beginPath();
      for (const p of A.s.p) {
        p.px = p.x; p.py = p.y;
        let a = Math.sin(p.x * 0.004 + t * 0.0003) * Math.cos(p.y * 0.004 - t * 0.00025) * TAU;
        const dx = p.x - m.x, dy = p.y - m.y, d = Math.hypot(dx, dy);
        if (d < R) { const k = 1 - d / R; a = a * (1 - k) + (Math.atan2(dy, dx) + 1.57) * k; }
        p.x += Math.cos(a) * 1.5; p.y += Math.sin(a) * 1.5;
        if (p.x < 0 || p.x > W || p.y < 0 || p.y > H || Math.random() < 0.002) { p.x = rnd(W); p.y = rnd(H); p.px = p.x; p.py = p.y; }
        ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y);
      }
      ctx.stroke(); ctx.globalAlpha = 1;
    },
  },

  /* 4 ─ Ripples ──────────────────────────────────────────────────────────── */
  ripple: {
    label: 'Ripples (ondas)',
    init() {},
    draw(A, t) {
      const { ctx, W, H } = A, g = A.sp(24), p = A.pointer(t), cl = A.clicks;
      while (cl.length && t - cl[0].t > 1800) cl.shift();
      ctx.fillStyle = A.c.dot;
      for (let x = g / 2; x < W; x += g) for (let y = g / 2; y < H; y += g) {
        let s = 1.2, a = 0.22;
        if (p.active) {
          const d = Math.hypot(x - p.x, y - p.y), w = Math.max(0, Math.sin(d * 0.05 - t * 0.006)) * Math.exp(-d / A.r(220));
          s += w * 3; a += w * 0.7;
        }
        for (const k of cl) {
          const d = Math.hypot(x - k.x, y - k.y), r = (t - k.t) * 0.35;
          const e = Math.exp(-Math.abs(d - r) / 30) * Math.max(0, 1 - (t - k.t) / 1800);
          s += e * 4; a += e * 0.8;
        }
        ctx.globalAlpha = A.al(a);
        ctx.beginPath(); ctx.arc(x, y, s, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
    },
  },

  /* 5 ─ Aurora / mesh gradient ───────────────────────────────────────────── */
  aurora: {
    label: 'Aurora (mesh gradient)',
    init(A) { A.s.mx = A.W / 2; A.s.my = A.H / 2; },
    draw(A, t) {
      const { ctx, W, H } = A, p = A.pointer(t), r = A.r(Math.max(W, H) * 0.35);
      A.s.mx += ((p.active ? p.x : W / 2) - A.s.mx) * 0.05;
      A.s.my += ((p.active ? p.y : H / 2) - A.s.my) * 0.05;
      for (let i = 0; i < 5; i++) {
        const x = i === 0 ? A.s.mx : W * (0.5 + 0.38 * Math.sin(t * 0.0003 * (i + 1) + i * 2));
        const y = i === 0 ? A.s.my : H * (0.5 + 0.35 * Math.cos(t * 0.00025 * (i + 2) + i));
        const hue = (A.o.hue + i * 32) % 360;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `hsla(${hue},90%,60%,${A.al(0.38)})`);
        g.addColorStop(1, `hsla(${hue},90%,60%,0)`);
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      }
    },
  },

  /* 6 ─ Flickering grid ──────────────────────────────────────────────────── */
  flicker: {
    label: 'Flickering grid (cuadrícula parpadeante)',
    init(A) {
      const s = A.sp(16), c = [];
      for (let x = s / 2; x < A.W; x += s) for (let y = s / 2; y < A.H; y += s) c.push({ x, y, p: rnd(TAU), f: rnd(0.5, 2.5) });
      A.s.c = c;
    },
    draw(A, t) {
      const { ctx } = A, m = A.pointer(t), R = A.r(170);
      ctx.fillStyle = A.c.dot;
      for (const k of A.s.c) {
        let a = 0.1 + 0.08 * Math.sin(t * 0.001 * k.f + k.p);
        const d = Math.hypot(k.x - m.x, k.y - m.y);
        if (d < R) a += (1 - d / R) * 0.85;
        ctx.globalAlpha = A.al(a); ctx.fillRect(k.x - 4, k.y - 4, 8, 8);
      }
      ctx.globalAlpha = 1;
    },
  },

  /* 7 ─ Magnetic field ───────────────────────────────────────────────────── */
  magnet: {
    label: 'Magnetic field (limaduras de hierro)',
    init() {},
    draw(A, t) {
      const { ctx, W, H } = A, g = A.sp(26), p0 = A.pointer(t), m = p0.active ? p0 : { x: W / 2, y: H / 2 }, R = A.r(320);
      ctx.strokeStyle = A.c.dot; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
      for (let x = g / 2; x < W; x += g) for (let y = g / 2; y < H; y += g) {
        const dx = m.x - x, dy = m.y - y, d = Math.hypot(dx, dy), a = Math.atan2(dy, dx);
        const k = Math.max(0, 1 - d / R), L = (10 + k * 9) / 2, ca = Math.cos(a) * L, sa = Math.sin(a) * L;
        ctx.globalAlpha = A.al(0.2 + k * 0.7);
        ctx.beginPath(); ctx.moveTo(x - ca, y - sa); ctx.lineTo(x + ca, y + sa); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    },
  },

  /* 8 ─ Starfield 3D ─────────────────────────────────────────────────────── */
  star: {
    label: 'Starfield 3D (campo de estrellas)',
    init(A) {
      const spawn = () => ({ x: rnd(-1, 1) * A.W * 1.2, y: rnd(-1, 1) * A.H * 1.2, z: rnd(20, 1200) });
      A.s.spawn = spawn;
      A.s.s = Array.from({ length: Math.min(700, A.n((A.W * A.H) / 1800)) }, spawn);
      A.s.ox = 0; A.s.oy = 0;
    },
    draw(A, t) {
      const { ctx, W, H } = A, m = A.pointer(t);
      A.s.ox += ((m.active ? (m.x - W / 2) * 1.4 : 0) - A.s.ox) * 0.06;
      A.s.oy += ((m.active ? (m.y - H / 2) * 1.4 : 0) - A.s.oy) * 0.06;
      ctx.strokeStyle = A.c.dot; ctx.lineCap = 'round';
      for (const s of A.s.s) {
        const z0 = s.z + 14; s.z -= 5;
        if (s.z < 20) Object.assign(s, A.s.spawn(), { z: 1200 });
        const k1 = 300 / s.z, k0 = 300 / z0;
        ctx.globalAlpha = A.al(Math.min(1, 1.1 - s.z / 1200));
        ctx.lineWidth = Math.max(0.6, (1 - s.z / 1200) * 2.6);
        ctx.beginPath();
        ctx.moveTo(W / 2 + (s.x - A.s.ox) * k0, H / 2 + (s.y - A.s.oy) * k0);
        ctx.lineTo(W / 2 + (s.x - A.s.ox) * k1, H / 2 + (s.y - A.s.oy) * k1);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    },
  },

  /* 9 ─ Elastic mesh ─────────────────────────────────────────────────────── */
  mesh: {
    label: 'Elastic mesh (malla elástica)',
    init(A) {
      const g = A.sp(36); A.s.cols = Math.ceil(A.W / g) + 1; A.s.rows = Math.ceil(A.H / g) + 1; A.s.n = [];
      for (let j = 0; j < A.s.rows; j++) for (let i = 0; i < A.s.cols; i++) A.s.n.push({ ox: i * g, oy: j * g, x: i * g, y: j * g });
    },
    draw(A, t) {
      const { ctx } = A, m = A.pointer(t), R = A.r(190), { cols, rows, n } = A.s;
      for (const q of n) {
        const dx = q.ox - m.x, dy = q.oy - m.y, d = Math.hypot(dx, dy);
        let tx = q.ox, ty = q.oy;
        if (d < R) { const f = Math.pow(1 - d / R, 2) * 70; tx += (dx / (d || 1)) * f; ty += (dy / (d || 1)) * f; }
        q.x += (tx - q.x) * 0.18; q.y += (ty - q.y) * 0.18;
      }
      ctx.strokeStyle = A.c.dot; ctx.globalAlpha = A.al(0.4); ctx.lineWidth = 1; ctx.beginPath();
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const a = n[j * cols + i];
        if (i < cols - 1) { const b = n[j * cols + i + 1]; ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); }
        if (j < rows - 1) { const b = n[(j + 1) * cols + i]; ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); }
      }
      ctx.stroke(); ctx.globalAlpha = 1;
    },
  },

  /* 10 ─ Hex glow ────────────────────────────────────────────────────────── */
  hex: {
    label: 'Hex glow (panal hexagonal)',
    init(A) {
      const r = A.sp(24), w = r * 1.5, h = r * Math.sqrt(3);
      A.s.r = r; A.s.c = [];
      for (let i = 0, x = 0; x < A.W + r; i++, x += w) for (let y = (i % 2) * (h / 2); y < A.H + r; y += h) A.s.c.push({ x, y, v: 0 });
    },
    draw(A, t) {
      const { ctx } = A, m = A.pointer(t), r = A.s.r - 2, lit = A.s.r * 1.6 * A.o.radius;
      ctx.strokeStyle = A.c.dot; ctx.fillStyle = A.c.dot; ctx.lineWidth = 1;
      for (const k of A.s.c) {
        if (Math.hypot(k.x - m.x, k.y - m.y) < lit) k.v = 1;
        k.v *= 0.96;
        ctx.beginPath();
        for (let a = 0; a < 6; a++) { const px = k.x + r * Math.cos(a * 1.0472), py = k.y + r * Math.sin(a * 1.0472); a ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
        ctx.closePath();
        ctx.globalAlpha = A.al(0.12 + k.v * 0.7); ctx.stroke();
        if (k.v > 0.02) { ctx.globalAlpha = A.al(k.v * 0.3); ctx.fill(); }
      }
      ctx.globalAlpha = 1;
    },
  },

  /* 11 ─ Wireframe terrain ───────────────────────────────────────────────── */
  terrain: {
    label: 'Wireframe terrain (terreno 3D synthwave)',
    init() {},
    draw(A, t) {
      const { ctx, W, H } = A, cols = 36, rows = 26, sp = 64, p0 = A.pointer(t), m = p0.active ? p0 : { x: W / 2, y: H / 2 };
      const mi = (m.x / W) * cols, mj = (1 - m.y / H) * rows, bump = 120 * A.o.radius, P = [];
      for (let j = 0; j <= rows; j++) {
        const row = [];
        for (let i = 0; i <= cols; i++) {
          const x = (i - cols / 2) * sp, z = 180 + j * sp;
          let y = Math.sin(i * 0.45 + t * 0.0014) * Math.cos(j * 0.4 - t * 0.001) * 38 + Math.sin(j * 0.25 + t * 0.0007) * 22;
          y += bump * Math.exp(-((i - mi) * (i - mi) + (j - mj) * (j - mj)) / 7);
          const k = 480 / z; row.push([W / 2 + x * k, H * 0.42 + (230 - y) * k]);
        }
        P.push(row);
      }
      ctx.strokeStyle = A.c.dot; ctx.lineWidth = 1.2;
      for (let j = 0; j <= rows; j++) {
        ctx.globalAlpha = A.al(Math.max(0.08, 1 - (j / rows) * 0.9));
        ctx.beginPath(); P[j].forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke();
        if (j < rows) { ctx.beginPath(); for (let i = 0; i <= cols; i++) { ctx.moveTo(P[j][i][0], P[j][i][1]); ctx.lineTo(P[j + 1][i][0], P[j + 1][i][1]); } ctx.stroke(); }
      }
      ctx.globalAlpha = 1;
    },
  },

  /* 12 ─ Orbit swarm ─────────────────────────────────────────────────────── */
  orbit: {
    label: 'Orbit swarm (enjambre orbital)',
    trail: true,
    init(A) {
      A.s.p = Array.from({ length: Math.min(480, A.n((A.W * A.H) / 2500)) }, () => ({
        x: A.W / 2, y: A.H / 2, a: rnd(TAU), r: rnd(30, 180), s: rnd(0.008, 0.028) * (Math.random() < 0.5 ? -1 : 1), k: rnd(0.03, 0.12),
      }));
    },
    draw(A, t) {
      const { ctx } = A, m0 = A.pointer(t), m = m0.active ? m0 : { x: A.W / 2, y: A.H / 2 }, R = A.o.radius;
      A.fade(0.14);
      ctx.globalAlpha = A.al(0.9); ctx.fillStyle = A.c.dot;
      for (const p of A.s.p) {
        p.a += p.s;
        const rr = p.r * R * (1 + 0.25 * Math.sin(t * 0.002 + p.a * 3));
        const tx = m.x + Math.cos(p.a) * rr, ty = m.y + Math.sin(p.a) * rr * 0.6;
        p.x += (tx - p.x) * p.k; p.y += (ty - p.y) * p.k;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
    },
  },

  /* 13 ─ Spotlight grid ──────────────────────────────────────────────────── */
  spot: {
    label: 'Spotlight grid (plano técnico)',
    init() {},
    draw(A, t) {
      const { ctx, W, H } = A, m = A.pointer(t), g = A.sp(40);
      ctx.strokeStyle = A.c.dot; ctx.lineWidth = 1;
      const grid = (a) => {
        ctx.globalAlpha = A.al(a); ctx.beginPath();
        for (let x = 0; x <= W; x += g) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
        for (let y = 0; y <= H; y += g) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
        ctx.stroke();
      };
      grid(0.1);
      if (m.active) {
        for (const [r, a] of [[240, 0.12], [170, 0.14], [100, 0.18]]) {
          ctx.save(); ctx.beginPath(); ctx.arc(m.x, m.y, A.r(r), 0, TAU); ctx.clip(); grid(a); ctx.restore();
        }
        const cr = A.r(130);
        ctx.globalAlpha = A.al(0.9); ctx.beginPath();
        for (let x = Math.floor((m.x - cr) / g) * g; x < m.x + cr; x += g) for (let y = Math.floor((m.y - cr) / g) * g; y < m.y + cr; y += g) {
          if (Math.hypot(x - m.x, y - m.y) < cr) { ctx.moveTo(x - 4, y); ctx.lineTo(x + 4, y); ctx.moveTo(x, y - 4); ctx.lineTo(x, y + 4); }
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    },
  },
};

export const variants = Object.keys(effects);
