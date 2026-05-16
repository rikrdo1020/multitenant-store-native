import { describe, expect, it } from '@jest/globals';
import {
  buildCreateOrderPayload,
  formatSelectedOptions,
  PENDING_PAYMENT_METHOD,
} from './order';
import type { CartItem, ShippingMethod } from '@/types';

const cartItems: CartItem[] = [
  {
    documentId: 'prod_001',
    name: 'Camisa',
    price: 25,
    quantity: 2,
    image: 'https://example.com/camisa.jpg',
    stock: 5,
    selectedOptions: {
      Talla: 'M',
      Color: 'Negro',
    },
  },
];

const shippingMethod: ShippingMethod = {
  documentId: 'ship_001',
  name: 'Delivery',
  type: 'delivery_zone',
  basePrice: 3,
  logistics: [
    {
      documentId: 'loc_001',
      key: 'panama-city',
      label: 'Panama City',
      extraPrice: 2,
    },
  ],
};

describe('order helpers', () => {
  it('GIVEN cart items with selected options WHEN building order payload SHOULD preserve variant selections', () => {
    const payload = buildCreateOrderPayload({
      items: cartItems,
      customerData: {
        name: 'Ana Perez',
        email: 'ana@example.com',
        phone: '6000-0000',
      },
      shippingAddress: {
        address: 'Calle 1',
        city: 'Panama',
      },
      shippingMethod,
      selectedLocationId: 'loc_001',
    });

    expect(payload.items[0]).toMatchObject({
      productId: 'prod_001',
      name: 'Camisa',
      quantity: 2,
      unitPrice: 25,
      imageUrl: 'https://example.com/camisa.jpg',
      selectedOptions: {
        Talla: 'M',
        Color: 'Negro',
      },
    });
  });

  it('GIVEN selected shipping method and location WHEN building order payload SHOULD include shipping contract fields', () => {
    const payload = buildCreateOrderPayload({
      items: cartItems,
      customerData: {
        name: 'Ana Perez',
        email: 'ana@example.com',
        phone: '6000-0000',
      },
      shippingAddress: {
        address: 'Calle 1',
        city: 'Panama',
        reference: 'Casa azul',
      },
      shippingMethod,
      selectedLocationId: 'loc_001',
    });

    expect(payload).toMatchObject({
      shippingMethodId: 'ship_001',
      shippingLocationId: 'loc_001',
      shippingCost: 5,
      paymentMethod: PENDING_PAYMENT_METHOD,
    });
    expect(payload.shippingData).toMatchObject({
      address: {
        address: 'Calle 1',
        city: 'Panama',
        reference: 'Casa azul',
      },
      method: {
        documentId: 'ship_001',
        name: 'Delivery',
        type: 'delivery_zone',
      },
      location: {
        documentId: 'loc_001',
        key: 'panama-city',
        label: 'Panama City',
      },
    });
  });

  it('GIVEN selected options WHEN formatting for display SHOULD return a compact readable string', () => {
    expect(formatSelectedOptions({ Talla: 'M', Color: 'Negro' })).toBe(
      'Talla: M / Color: Negro',
    );
  });
});
