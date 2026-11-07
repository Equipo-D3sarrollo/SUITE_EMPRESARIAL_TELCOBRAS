import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import InteractiveBackground, { variants } from './index.js';

// jsdom no implementa canvas: el motor devuelve null y el componente no debe fallar.
describe('InteractiveBackground', () => {
  it('renderiza un canvas decorativo sin romper en jsdom', () => {
    const { container } = render(<InteractiveBackground variant="spot" />);
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
    expect(canvas.getAttribute('aria-hidden')).toBe('true');
  });

  it('expone las 13 variantes', () => {
    expect(variants).toHaveLength(13);
  });
});
