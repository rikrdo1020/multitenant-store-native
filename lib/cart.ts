import type { CartItem, Product } from '@/types';
import { generateItemKey } from './utils';

export function createCartItem(
  product: Product,
  selectedOptions?: Record<string, string>,
): CartItem {
  return {
    documentId: product.documentId,
    name: product.name,
    price: product.discountPrice ?? product.price,
    quantity: 1,
    selectedOptions,
    image: product.images[0],
    stock: getEffectiveStock(product),
    availableStock: product.availableStock,
    stockStatus: product.stockStatus,
    type: product.type,
  };
}

export function upsertCartItem(
  items: CartItem[],
  product: Product,
  selectedOptions?: Record<string, string>,
): CartItem[] {
  const effectiveStock = getEffectiveStock(product);
  if (effectiveStock <= 0) return items;

  const key = generateItemKey(product.documentId, selectedOptions);
  const existingIndex = items.findIndex(
    (item) => generateItemKey(item.documentId, item.selectedOptions) === key,
  );

  if (existingIndex === -1) {
    return [...items, createCartItem(product, selectedOptions)];
  }

  return items.map((item, index) =>
    index === existingIndex
      ? { ...item, quantity: Math.min(item.quantity + 1, effectiveStock) }
      : item,
  );
}

export function removeCartItem(
  items: CartItem[],
  documentId: string,
  selectedOptions?: Record<string, string>,
): CartItem[] {
  const key = generateItemKey(documentId, selectedOptions);
  return items.filter((item) => generateItemKey(item.documentId, item.selectedOptions) !== key);
}

export function updateCartItemQuantity(
  items: CartItem[],
  documentId: string,
  quantity: number,
  selectedOptions?: Record<string, string>,
): CartItem[] {
  if (quantity <= 0) {
    return removeCartItem(items, documentId, selectedOptions);
  }

  const key = generateItemKey(documentId, selectedOptions);
  return items.map((item) =>
    generateItemKey(item.documentId, item.selectedOptions) === key
      ? { ...item, quantity: Math.min(quantity, item.stock) }
      : item,
  );
}

function getEffectiveStock(product: Product): number {
  return product.availableStock ?? product.stock;
}
