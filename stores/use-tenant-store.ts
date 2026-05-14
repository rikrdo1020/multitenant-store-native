import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Tenant } from '@/types';
import { getItem, setItem, removeItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';

interface TenantStore {
  tenant: Tenant | null;
  setTenant: (tenant: Tenant | null) => void;
}

const asyncStorage = {
  getItem: async (name: string): Promise<string | null> => getItem(name),
  setItem: async (name: string, value: string): Promise<void> => setItem(name, value),
  removeItem: async (name: string): Promise<void> => removeItem(name),
};

export const useTenantStore = create<TenantStore>()(
  persist(
    (set) => ({
      tenant: null,
      setTenant: (tenant) => set({ tenant }),
    }),
    {
      name: STORAGE_KEYS.TENANT,
      storage: createJSONStorage(() => asyncStorage),
    }
  )
);
