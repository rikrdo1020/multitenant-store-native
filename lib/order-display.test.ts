import { describe, expect, it } from '@jest/globals';
import {
  formatOrderOptions,
  getEffectiveOrderStatus,
  getOrderItemCount,
  getOrderShippingAddress,
  getOrderShippingLocationName,
  getOrderShippingMethodName,
  getOrderTimeline,
  getOrderTotals,
} from './order-display';
import type { Order } from '@/types';

const baseOrder: Order = {
  documentId: 'order-1',
  orderId: 'ORD-1',
  orderStatus: 'pending',
  items: [
    { productId: 'prod-1', name: 'Shirt', quantity: 2, unitPrice: 10 },
    { productId: 'prod-2', name: 'Cap', quantity: 1, unitPrice: 5 },
  ],
  customerData: { name: 'Buyer', email: 'buyer@example.com', phone: '+50760000000' },
  shippingData: {
    address: { address: 'Street 1', city: 'Panama', reference: 'Floor 2' },
    method: { documentId: 'ship-1', name: 'Delivery', type: 'delivery_zone' },
    location: { documentId: 'loc-1', key: 'panama-city', label: 'Panama City' },
  },
  shippingCost: 3,
  paymentMethod: 'pending',
  total: 28,
  createdAt: '2026-05-16T20:00:00.000Z',
};

describe('order display helpers', () => {
  it('GIVEN order items WHEN counting SHOULD return total quantity', () => {
    expect(getOrderItemCount(baseOrder)).toBe(3);
  });

  it('GIVEN selected options WHEN formatting SHOULD show a readable variant summary', () => {
    expect(formatOrderOptions({ selectedOptions: { Talla: 'M', Color: 'Negro' } })).toBe(
      'Talla: M / Color: Negro',
    );
  });

  it('GIVEN order totals WHEN calculating SHOULD infer discount from subtotal and shipping', () => {
    expect(getOrderTotals({ ...baseOrder, total: 20 })).toEqual({
      subtotal: 25,
      shippingCost: 3,
      discount: 8,
      total: 20,
    });
  });

  it('GIVEN shipping snapshot WHEN reading delivery data SHOULD return method location and address', () => {
    expect(getOrderShippingMethodName(baseOrder)).toBe('Delivery');
    expect(getOrderShippingLocationName(baseOrder)).toBe('Panama City');
    expect(getOrderShippingAddress(baseOrder)).toEqual(['Street 1', 'Panama', 'Floor 2']);
  });

  it('GIVEN terminal status WHEN building timeline SHOULD mark the terminal state as blocked', () => {
    expect(getOrderTimeline('failed')).toEqual([
      { key: 'pending', label: 'Orden recibida', state: 'done' },
      { key: 'failed', label: 'Fallida', state: 'blocked' },
    ]);
  });

  it('GIVEN dispatched flag WHEN reading effective status SHOULD show dispatched unless terminal', () => {
    expect(getEffectiveOrderStatus({ orderStatus: 'paid', dispatched: true })).toBe('dispatched');
    expect(getEffectiveOrderStatus({ orderStatus: 'cancelled', dispatched: true })).toBe('cancelled');
  });
});
