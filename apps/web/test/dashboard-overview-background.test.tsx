import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  DashboardOverviewBackground,
  ROTATION_MS,
} from '@/features/dashboard/dashboard-overview-background';

describe('DashboardOverviewBackground', () => {
  it('cambia el fondo manualmente y rota después de 30 segundos', () => {
    vi.useFakeTimers();
    render(<DashboardOverviewBackground />);

    const background = screen.getByTestId('dashboard-overview-background');
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
