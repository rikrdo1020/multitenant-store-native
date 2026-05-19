import { describe, expect, it, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { OrderListItem } from './OrderListItem';
import type { Order } from '@/types';

const order: Order = {
  documentId: 'ord_001',
  orderId: 'ORD-0001',
  orderStatus: 'pending',
  items: [{ productId: 'p1', name: 'Producto A', quantity: 1, unitPrice: 20 }],
  customerData: { name: 'Juan Perez', email: 'juan@test.com', phone: '6000-0000' },
  paymentMethod: 'cash',
  total: 20,
  createdAt: '2026-05-18T10:00:00.000Z',
};

describe('OrderListItem', () => {
  it('SHOULD render order id, customer name and status', () => {
    render(<OrderListItem order={order} onPress={jest.fn()} />);

    expect(screen.getByText('#ORD-0001')).toBeTruthy();
    expect(screen.getByText('Juan Perez')).toBeTruthy();
    expect(screen.getByText('Pendiente')).toBeTruthy();
  });

  it('SHOULD call onPress with order when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(<OrderListItem order={order} onPress={onPress} />);

    fireEvent.press(getByTestId('order-list-item'));
    expect(onPress).toHaveBeenCalledWith(order);
  });

  it('SHOULD render payment method label', () => {
    render(<OrderListItem order={order} onPress={jest.fn()} />);
    expect(screen.getByText('Efectivo')).toBeTruthy();
  });

  it('GIVEN yappy payment SHOULD render Yappy label', () => {
    const yappyOrder = { ...order, paymentMethod: 'yappy' };
    render(<OrderListItem order={yappyOrder} onPress={jest.fn()} />);
    expect(screen.getByText('Yappy')).toBeTruthy();
  });
});
