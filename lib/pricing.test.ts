import { describe, expect, it } from '@jest/globals';
import type { CartItem, ComboDefinition } from '@/types';
import { calculateCartPricing } from './pricing';

const baseItem: CartItem = {
  documentId: 'prod_1',
  name: 'Audifonos',
  price: 10,
  quantity: 1,
  stock: 20,
  type: 'audio',
};

describe('calculateCartPricing', () => {
  it('GIVEN no combos WHEN calculating pricing SHOULD return regular subtotal', () => {
    const result = calculateCartPricing([
      { ...baseItem, quantity: 2 },
      { ...baseItem, documentId: 'prod_2', name: 'Cable', price: 5, type: 'accessory' },
    ]);

    expect(result).toMatchObject({
      originalTotal: 25,
      total: 25,
      savings: 0,
    });
  });

  it('GIVEN an active combo WHEN it lowers total SHOULD apply combo savings', () => {
    const result = calculateCartPricing(
      [{ ...baseItem, price: 99.99, quantity: 2 }],
      [combo('combo_1', 150, [{ productType: 'audio', quantity: 2 }])],
    );

    expect(result).toMatchObject({
      originalTotal: 199.98,
      total: 150,
      savings: 49.98,
    });
  });

  it('GIVEN a non-saving combo WHEN calculating pricing SHOULD ignore it', () => {
    const result = calculateCartPricing(
      [{ ...baseItem, quantity: 2 }],
      [combo('combo_1', 25, [{ productType: 'audio', quantity: 2 }])],
    );

    expect(result).toMatchObject({
      originalTotal: 20,
      total: 20,
      savings: 0,
    });
  });

  it('GIVEN multiple eligible combos WHEN calculating pricing SHOULD choose best savings', () => {
    const result = calculateCartPricing(
      [
        { ...baseItem, price: 40, quantity: 2 },
        { ...baseItem, documentId: 'prod_2', name: 'Case', price: 20, type: 'accessory' },
      ],
      [
        combo('combo_audio', 70, [{ productType: 'audio', quantity: 2 }]),
        combo('combo_bundle', 80, [
          { productType: 'audio', quantity: 2 },
          { productType: 'accessory', quantity: 1 },
        ]),
      ],
    );

    expect(result).toMatchObject({
      originalTotal: 100,
      total: 80,
      savings: 20,
    });
  });

  it('GIVEN many eligible items WHEN applying one combo SHOULD cap applications at five', () => {
    const result = calculateCartPricing(
      [{ ...baseItem, quantity: 12 }],
      [combo('combo_1', 15, [{ productType: 'audio', quantity: 2 }])],
    );

    expect(result).toMatchObject({
      originalTotal: 120,
      total: 95,
      savings: 25,
    });
  });

  it('GIVEN variant options WHEN building lines SHOULD use stable sorted item keys', () => {
    const result = calculateCartPricing([
      {
        ...baseItem,
        selectedOptions: { Talla: 'M', Color: 'Negro' },
      },
    ]);

    expect(result.lines[0].itemKey).toBe('prod_1:{"Color":"Negro","Talla":"M"}');
  });
});

function combo(
  documentId: string,
  price: number,
  rules: ComboDefinition['rules'],
): ComboDefinition {
  return {
    documentId,
    name: documentId,
    price,
    isActive: true,
    rules,
  };
}
