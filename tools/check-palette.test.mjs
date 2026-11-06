import assert from 'node:assert/strict';
import { test } from 'node:test';
import { findViolations } from './check-palette.mjs';

const messages = (text) => findViolations(text).map((v) => v.message);

test('acepta las variables, clases y valores de la paleta oficial', () => {
  const ok = `
    @theme { --color-*: initial; --color-tb-verde: #88BD4C; --color-tb-azul: #2491cc; }
    .card { box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08); border-color: var(--color-tb-gris); }
    .x { color: #FFF; background: #000000; outline-color: #C62828; fill: transparent; stroke: currentColor; }
    <div className="bg-tb-verde text-tb-negro hover:bg-tb-azul/10 border-tb-gris" />
    <Area stroke="var(--color-tb-azul)" fill="none" />
    <a href="#contenido">Saltar al contenido</a>
    const t = 'texto tan rápido como el rojo'; rgb(255 255 255 / 50%); #2491CC80;
  `;
  assert.deepEqual(findViolations(ok), []);
});

test('rechaza HEX fuera de la paleta con línea y columna', () => {
  const [v] = findViolations('a {}\n  .b { color: #0A66C2; }');
  assert.equal(v.line, 2);
  assert.equal(v.column, 15);
  assert.match(v.message, /#0A66C2/);
  assert.equal(messages('fill="#abc"').length, 1);
  assert.equal(messages("const c = '#88BD4D'").length, 1);
});

test('rechaza rgb() con otro tono y las demás funciones de color', () => {
  assert.equal(messages('color: rgb(10, 102, 194)').length, 1);
  assert.equal(messages('color: rgba(0,0,0)').length, 0);
  assert.equal(messages('color: hsl(210 40% 50%)').length, 1);
  assert.equal(messages('color: oklch(0.6 0.1 250)').length, 1);
  assert.equal(messages('color: color(display-p3 0 0.5 1)').length, 1);
  assert.equal(messages('d3.rgb(x); chalk.color(y); $.hsl(z)').length, 0);
});

test('rechaza clases de la paleta por defecto de Tailwind', () => {
  const found = messages(
    '<p className="text-slate-900 md:bg-emerald-500 border-x-red-600 from-blue-50/40 bg-white" />',
  );
  assert.equal(found.length, 5);
  assert.match(found[0], /text-slate-900/);
  assert.equal(messages('var(--color-gray-200)').length, 1);
  assert.equal(messages('<p className="bg-tb-blanco text-tb-negro" />').length, 0);
});

test('rechaza colores con nombre en propiedades de color', () => {
  assert.equal(messages('.a { border: 1px solid red; }').length, 1);
  assert.equal(messages('<path fill="orange" />').length, 1);
  assert.equal(messages("{ stroke: 'gray' }").length, 1);
  assert.equal(messages('{ "theme_color": "navy" }').length, 1);
  assert.equal(messages("{ color: 'white', background: 'black' }").length, 0);
  assert.equal(messages('{ fill: palette.gray, stroke: tokens.red }').length, 0);
});
