import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';
import { getItem, setItem, removeItem } from '@/lib/storage';
import { generateItemKey } from '@/lib/utils';
import { calculateCartPricing } from '@/lib/pricing';
import { useTenantStore } from './use-tenant-store';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, options?: Record<string, string>) => void;
  removeItem: (documentId: string, options?: Record<string, string>) => void;
  updateQuantity: (documentId: string, quantity: number, options?: Record<string, string>) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, options) => {
        const items = [...get().items];
        const key = generateItemKey(product.documentId, options);
        const existingIndex = items.findIndex(
          (i) => generateItemKey(i.documentId, i.selectedOptions) === key
        );

        if (existingIndex >= 0) {
          const newQty = Math.min(items[existingIndex].quantity + 1, product.stock);
          items[existingIndex] = { ...items[existingIndex], quantity: newQty };
        } else {
          items.push({
            documentId: product.documentId,
            name: product.name,
            price: product.discountPrice ?? product.price,
            quantity: 1,
            selectedOptions: options,
            image: product.images[0],
            stock: product.stock,
          });
        }
        set({ items });
      },
      removeItem: (documentId, options) => {
        const key = generateItemKey(documentId, options);
        set((state) => ({
          items: state.items.filter(
            (i) => generateItemKey(i.documentId, i.selectedOptions) !== key
          ),
        }));
      },
      updateQuantity: (documentId, quantity, options) => {
        if (quantity <= 0) {
          get().removeItem(documentId, options);
          return;
        }
        const key = generateItemKey(documentId, options);
        set((state) => ({
          items: state.items.map((i) =>
            generateItemKey(i.documentId, i.selectedOptions) === key
              ? { ...i, quantity: Math.min(quantity, i.stock) }
              : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
      getTotalPrice: () => {
        const result = calculateCartPricing(get().items);
        return result.total;
      },
    }),
    {
      name: 'mt:cart:temp',
      storage: createJSONStorage(() => ({
        getItem: async (name: string) => getItem(name),
        setItem: async (name: string, value: string) => setItem(name, value),
        removeItem: async (name: string) => removeItem(name),
      })),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
