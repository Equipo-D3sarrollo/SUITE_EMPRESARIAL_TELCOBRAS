import assert from 'node:assert/strict';
import { test } from 'node:test';
import { initialScripts } from './check-bundle-size.mjs';

test('toma los scripts del index.html y sus modulepreload, sin repetir', () => {
  const html = `
    <script type="module" crossorigin src="/assets/index-a1.js"></script>
    <link rel="modulepreload" crossorigin href="/assets/react-b2.js">
    <link crossorigin href="/assets/router-c3.js" rel="modulepreload">
    <link rel="modulepreload" href="/assets/react-b2.js">
    <link rel="stylesheet" crossorigin href="/assets/index-d4.css">
    <link rel="preload" as="font" href="/assets/poppins-latin-400.woff2">`;
  assert.deepEqual(initialScripts(html), [
    '/assets/index-a1.js',
    '/assets/react-b2.js',
    '/assets/router-c3.js',
  ]);
});
