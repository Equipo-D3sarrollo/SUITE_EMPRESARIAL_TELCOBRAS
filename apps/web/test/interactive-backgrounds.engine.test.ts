import { afterEach, describe, expect, it, vi } from 'vitest';
import { createEngine } from '../src/components/interactive-backgrounds/engine.js';
import { effects, variants } from '../src/components/interactive-backgrounds/effects.js';

const context = () => ({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  setTransform: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  arc: vi.fn(),
  closePath: vi.fn(),
  createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
  lineCap: 'butt',
  globalAlpha: 1,
  globalCompositeOperation: 'source-over',
});

function canvas() {
  const ctx = context();
  const element = document.createElement('canvas');
  vi.spyOn(element, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    width: 800,
    height: 500,
    top: 0,
    right: 800,
    bottom: 500,
    left: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
  return { ctx, element };
}

afterEach(() => vi.restoreAllMocks());

describe('interactive background effects', () => {
  it.each(variants)('initializes and draws %s', (variant) => {
    const { element, ctx } = canvas();
    const engine = createEngine(element, {
      variant,
      density: 0.75,
      intensity: 1,
      autoplay: false,
      interactive: false,
      color: '#a0d8f5',
    });

    expect(engine).not.toBeNull();
    vi.useFakeTimers();
    vi.runAllTimers();
    expect(ctx.setTransform).toHaveBeenCalled();
    expect(effects[variant]).toBeDefined();
    engine?.destroy();
    vi.useRealTimers();
  });

  it('ignores an unknown variant without throwing', () => {
    const { element } = canvas();
    const engine = createEngine(element, { variant: 'missing' });
    expect(() => engine?.resize()).not.toThrow();
    engine?.destroy();
  });
});
