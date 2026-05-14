import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CustomerFormData, ReceiverFormData, ShippingAddressData } from '@/types';
import { getItem, setItem, removeItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';

interface CheckoutStore {
  customerData: CustomerFormData | null;
  receiverData: ReceiverFormData | null;
  shippingAddress: ShippingAddressData | null;
  selectedMethodId: string | null;
  selectedLocationId: string | null;
  setCustomerData: (data: CustomerFormData) => void;
  setReceiverData: (data: ReceiverFormData) => void;
  setShippingAddress: (data: ShippingAddressData) => void;
  setSelectedMethod: (methodId: string | null) => void;
  setSelectedLocation: (locationId: string | null) => void;
  clearCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      customerData: null,
      receiverData: null,
      shippingAddress: null,
      selectedMethodId: null,
      selectedLocationId: null,
      setCustomerData: (data) => set({ customerData: data }),
      setReceiverData: (data) => set({ receiverData: data }),
      setShippingAddress: (data) => set({ shippingAddress: data }),
      setSelectedMethod: (methodId) =>
        set({ selectedMethodId: methodId, selectedLocationId: null, shippingAddress: null }),
      setSelectedLocation: (locationId) => set({ selectedLocationId: locationId }),
      clearCheckout: () =>
        set({
          customerData: null,
          receiverData: null,
          shippingAddress: null,
          selectedMethodId: null,
          selectedLocationId: null,
        }),
    }),
    {
      name: 'mt:checkout:temp',
      storage: createJSONStorage(() => ({
        getItem: async (name: string) => getItem(name),
        setItem: async (name: string, value: string) => setItem(name, value),
        removeItem: async (name: string) => removeItem(name),
      })),
      partialize: (state) => ({
        customerData: state.customerData,
        receiverData: state.receiverData,
        shippingAddress: state.shippingAddress,
        selectedMethodId: state.selectedMethodId,
        selectedLocationId: state.selectedLocationId,
      }),
    }
  )
);
