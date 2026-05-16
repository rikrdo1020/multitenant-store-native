import { create } from 'zustand';
import type { CustomerFormData, ReceiverFormData, ShippingAddressData } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { getItem, removeItem, setItem } from '@/lib/storage';
import { useTenantStore } from './use-tenant-store';

interface CheckoutState {
  customerData: CustomerFormData | null;
  receiverData: ReceiverFormData | null;
  shippingAddress: ShippingAddressData | null;
  selectedMethodId: string | null;
  selectedLocationId: string | null;
}

interface CheckoutStore extends CheckoutState {
  tenantKey: string | null;
  setTenantScope: (tenantKey: string | null) => Promise<void>;
  setCustomerData: (data: CustomerFormData) => void;
  setReceiverData: (data: ReceiverFormData | null) => void;
  setShippingAddress: (data: ShippingAddressData) => void;
  setSelectedMethod: (methodId: string | null) => void;
  setSelectedLocation: (locationId: string | null) => void;
  clearCheckout: () => void;
}

const emptyCheckoutState: CheckoutState = {
  customerData: null,
  receiverData: null,
  shippingAddress: null,
  selectedMethodId: null,
  selectedLocationId: null,
};

export const useCheckoutStore = create<CheckoutStore>()((set, get) => ({
  tenantKey: null,
  ...emptyCheckoutState,
  setTenantScope: async (tenantKey) => {
    if (!tenantKey) {
      set({ tenantKey: null, ...emptyCheckoutState });
      return;
    }

    if (get().tenantKey === tenantKey) return;

    const checkout = await readTenantCheckout(tenantKey);
    set({ tenantKey, ...checkout });
  },
  setCustomerData: (customerData) => {
    set({ customerData });
    persistCurrentCheckout(get());
  },
  setReceiverData: (receiverData) => {
    set({ receiverData });
    persistCurrentCheckout(get());
  },
  setShippingAddress: (shippingAddress) => {
    set({ shippingAddress });
    persistCurrentCheckout(get());
  },
  setSelectedMethod: (selectedMethodId) => {
    set({ selectedMethodId, selectedLocationId: null });
    persistCurrentCheckout(get());
  },
  setSelectedLocation: (selectedLocationId) => {
    set({ selectedLocationId });
    persistCurrentCheckout(get());
  },
  clearCheckout: () => {
    const tenantKey = get().tenantKey ?? resolveTenantKey();
    set({ ...emptyCheckoutState });

    if (tenantKey) {
      void removeItem(STORAGE_KEYS.CHECKOUT(tenantKey));
    }
  },
}));

function resolveTenantKey(): string | null {
  return useTenantStore.getState().tenant?.slug ?? null;
}

async function readTenantCheckout(tenantKey: string): Promise<CheckoutState> {
  const rawCheckout = await getItem(STORAGE_KEYS.CHECKOUT(tenantKey));
  if (!rawCheckout) return emptyCheckoutState;

  try {
    const parsed = JSON.parse(rawCheckout) as Partial<CheckoutState>;
    return {
      customerData: parsed.customerData ?? null,
      receiverData: parsed.receiverData ?? null,
      shippingAddress: parsed.shippingAddress ?? null,
      selectedMethodId: parsed.selectedMethodId ?? null,
      selectedLocationId: parsed.selectedLocationId ?? null,
    };
  } catch {
    return emptyCheckoutState;
  }
}

function persistCurrentCheckout(state: CheckoutStore): void {
  if (!state.tenantKey) return;

  const snapshot: CheckoutState = {
    customerData: state.customerData,
    receiverData: state.receiverData,
    shippingAddress: state.shippingAddress,
    selectedMethodId: state.selectedMethodId,
    selectedLocationId: state.selectedLocationId,
  };

  void setItem(STORAGE_KEYS.CHECKOUT(state.tenantKey), JSON.stringify(snapshot));
}
