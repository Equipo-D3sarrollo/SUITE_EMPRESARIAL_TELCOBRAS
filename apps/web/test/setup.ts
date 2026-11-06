import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Sin `globals` de Vitest, Testing Library no limpia el DOM sola entre pruebas.
afterEach(cleanup);

// jsdom no implementa scrollIntoView; cmdk lo llama al mover la selección.
Element.prototype.scrollIntoView ??= () => {};

globalThis.ResizeObserver ??= class {
  constructor(private readonly callback: ResizeObserverCallback) {}

  observe(target: Element): void {
    this.callback(
      [
        {
          target,
          contentRect: target.getBoundingClientRect(),
          borderBoxSize: [],
          contentBoxSize: [],
          devicePixelContentBoxSize: [],
        },
      ],
      this,
    );
  }

  unobserve(): void {}

  disconnect(): void {}
};
