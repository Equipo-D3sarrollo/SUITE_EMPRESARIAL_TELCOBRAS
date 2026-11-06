import { render, screen, within } from '@testing-library/react';
import { Users } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { KpiCard } from '../src';

describe('KpiCard', () => {
  it('es un grupo con el título como nombre y muestra valor, variación y pie', () => {
    render(
      <KpiCard
        title="Leads registrados"
        value="1.428"
        icon={Users}
        delta={{ value: '+18,4 %', trend: 'up', label: 'vs. mes anterior' }}
        footer={
          <>
            <span>Origen LeadGen</span>
            <span>68 %</span>
          </>
        }
      />,
    );

    const card = screen.getByRole('group', { name: 'Leads registrados' });
    const value = within(card).getByText('1.428');
    expect(value).toHaveClass('tabular-nums');
    expect(within(card).getByText('+18,4 %')).toBeInTheDocument();
    expect(within(card).getByText('vs. mes anterior')).toBeInTheDocument();
    expect(within(card).getByText('68 %')).toBeInTheDocument();
    for (const icon of card.querySelectorAll('svg')) {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    }
  });

  it('funciona sin icono, variación ni pie', () => {
    render(<KpiCard title="Integraciones" value="8 / 8" />);

    const card = screen.getByRole('group', { name: 'Integraciones' });
    expect(within(card).getByText('8 / 8')).toBeInTheDocument();
    expect(card.querySelector('svg')).toBeNull();
  });
});
