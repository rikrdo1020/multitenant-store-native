import { describe, expect, it } from '@jest/globals';
import type { Product } from '@/types';
import { upsertCartItem } from './cart';
import { generateItemKey } from './utils';

const product: Product = {
  documentId: 'prod_001',
  name: 'Camisa',
  slug: 'camisa',
  price: 20,
  discountPrice: 15,
  stock: 2,
  images: ['https://example.com/camisa.jpg'],
};

describe('cart helpers', () => {
  it('GIVEN selected options in different key order WHEN generating keys SHOULD return the same item key', () => {
    const firstKey = generateItemKey('prod_001', { Talla: 'M', Color: 'Negro' });
    const secondKey = generateItemKey('prod_001', { Color: 'Negro', Talla: 'M' });

    expect(firstKey).toBe(secondKey);
  });

  it('GIVEN a product with selected options WHEN adding it twice SHOULD increment the existing item', () => {
    const firstItems = upsertCartItem([], product, { Talla: 'M', Color: 'Negro' });
    const secondItems = upsertCartItem(firstItems, product, { Color: 'Negro', Talla: 'M' });

    expect(secondItems).toHaveLength(1);
    expect(secondItems[0]).toMatchObject({
      documentId: 'prod_001',
      price: 15,
      quantity: 2,
      selectedOptions: { Talla: 'M', Color: 'Negro' },
    });
  });

  it('GIVEN a product stock limit WHEN adding beyond stock SHOULD cap the quantity', () => {
    const firstItems = upsertCartItem([], product);
    const secondItems = upsertCartItem(firstItems, product);
    const thirdItems = upsertCartItem(secondItems, product);

    expect(thirdItems[0].quantity).toBe(2);
  });

  it('GIVEN an out of stock product WHEN adding to cart SHOULD leave cart unchanged', () => {
    const items = upsertCartItem([], { ...product, stock: 0 });

    expect(items).toEqual([]);
  });

  it('GIVEN different selected options WHEN adding to cart SHOULD create separate cart items', () => {
    const firstItems = upsertCartItem([], product, { Talla: 'M' });
    const secondItems = upsertCartItem(firstItems, product, { Talla: 'L' });

    expect(secondItems).toHaveLength(2);
  });
});
