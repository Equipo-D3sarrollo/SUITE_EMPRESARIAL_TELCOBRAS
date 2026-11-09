import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PageBackground, ROTATION_MS } from '../src/components/page-background';

describe('PageBackground', () => {
  it('cambia el fondo manualmente y rota después de 30 segundos', () => {
    vi.useFakeTimers();
    render(<PageBackground />);

    const background = screen.getByTestId('page-background');
    expect(background).toBeInTheDocument();
    const canvas = background.querySelector('canvas');
    expect(canvas).toHaveAttribute('aria-hidden', 'true');
    expect(canvas).toHaveStyle({ pointerEvents: 'none' });

    const button = screen.getByRole('button', { name: 'Cambiar fondo interactivo' });
    fireEvent.click(button);
    expect(canvas).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(ROTATION_MS));
    expect(canvas).toBeInTheDocument();
    vi.useRealTimers();
  });
});
