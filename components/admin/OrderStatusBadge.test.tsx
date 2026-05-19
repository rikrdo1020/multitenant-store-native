import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { OrderStatusBadge } from './OrderStatusBadge';
import type { OrderStatus } from '@/types';

const cases: { status: OrderStatus; label: string }[] = [
  { status: 'pending',   label: 'Pendiente' },
  { status: 'paid',      label: 'Pagado' },
  { status: 'cancelled', label: 'Cancelado' },
  { status: 'failed',    label: 'Fallido' },
  { status: 'rejected',  label: 'Rechazado' },
  { status: 'expired',   label: 'Expirado' },
];

describe('OrderStatusBadge', () => {
  it.each(cases)('GIVEN status $status SHOULD render label $label', ({ status, label }) => {
    render(<OrderStatusBadge status={status} />);
    expect(screen.getByText(label)).toBeTruthy();
  });
});
