import { create } from 'zustand';
import type { CartItem, Product } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { getItem, removeItem, setItem } from '@/lib/storage';
import { calculateCartPricing } from '@/lib/pricing';
import {
  removeCartItem,
  updateCartItemQuantity,
  upsertCartItem,
} from '@/lib/cart';
import { useTenantStore } from './use-tenant-store';

interface CartStore {
  tenantKey: string | null;
  items: CartItem[];
  setTenantScope: (tenantKey: string | null) => Promise<void>;
  addItem: (product: Product, options?: Record<string, string>, tenantKey?: string) => void;
  removeItem: (documentId: string, options?: Record<string, string>) => void;
  updateQuantity: (documentId: string, quantity: number, options?: Record<string, string>) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()((set, get) => ({
  tenantKey: null,
  items: [],
  setTenantScope: async (tenantKey) => {
    if (!tenantKey) {
      set({ tenantKey: null, items: [] });
      return;
    }

    if (get().tenantKey === tenantKey) return;

    const items = await readTenantCart(tenantKey);
    set({ tenantKey, items });
  },
  addItem: (product, options, tenantKeyOverride) => {
    const tenantKey = resolveTenantKey(tenantKeyOverride, get().tenantKey);
    const currentItems = getScopedItems(get(), tenantKey);
    const items = upsertCartItem(currentItems, product, options);

    set({ tenantKey, items });
    persistTenantCart(tenantKey, items);
  },
  removeItem: (documentId, options) => {
    const { tenantKey, items } = get();
    if (!tenantKey) return;

    const nextItems = removeCartItem(items, documentId, options);
    set({ items: nextItems });
    persistTenantCart(tenantKey, nextItems);
  },
  updateQuantity: (documentId, quantity, options) => {
    const { tenantKey, items } = get();
    if (!tenantKey) return;

    const nextItems = updateCartItemQuantity(items, documentId, quantity, options);
    set({ items: nextItems });
    persistTenantCart(tenantKey, nextItems);
  },
  clearCart: () => {
    const { tenantKey } = get();
    set({ items: [] });
    if (tenantKey) {
      void removeItem(STORAGE_KEYS.CART(tenantKey));
    }
  },
  getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
  getTotalPrice: () => calculateCartPricing(get().items).total,
}));

function resolveTenantKey(tenantKeyOverride?: string, currentTenantKey?: string | null): string {
  const activeTenant = useTenantStore.getState().tenant;
  const tenantKey = tenantKeyOverride ?? currentTenantKey ?? activeTenant?.slug;

  if (!tenantKey) {
    throw new Error('Cart tenant scope is required before adding items.');
  }

  return tenantKey;
}

function getScopedItems(state: CartStore, tenantKey: string): CartItem[] {
  return state.tenantKey === tenantKey ? state.items : [];
}

async function readTenantCart(tenantKey: string): Promise<CartItem[]> {
  const rawCart = await getItem(STORAGE_KEYS.CART(tenantKey));
  if (!rawCart) return [];

  try {
    const parsed = JSON.parse(rawCart);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistTenantCart(tenantKey: string, items: CartItem[]): void {
  void setItem(STORAGE_KEYS.CART(tenantKey), JSON.stringify(items));
}
