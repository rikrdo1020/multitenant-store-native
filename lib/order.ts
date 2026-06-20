import { getSelectedShippingLocation, getShippingCost } from './shipping';
import type {
  CartItem,
  CreateOrderPayload,
  CustomerFormData,
  PaymentProviderType,
  ShippingAddressData,
  ShippingMethod,
} from '@/types';

export const PENDING_PAYMENT_METHOD = 'pending';

interface BuildCreateOrderPayloadParams {
  items: CartItem[];
  customerData: CustomerFormData;
  shippingAddress: ShippingAddressData;
  shippingMethod: ShippingMethod;
  selectedLocationId?: string | null;
  paymentMethod?: PaymentProviderType | 'pending';
}

export function buildCreateOrderPayload({
  items,
  customerData,
  shippingAddress,
  shippingMethod,
  selectedLocationId,
  paymentMethod = PENDING_PAYMENT_METHOD,
}: BuildCreateOrderPayloadParams): CreateOrderPayload {
  const selectedLocation = getSelectedShippingLocation(shippingMethod, selectedLocationId);

  return {
    items: items.map((item) => ({
      productId: item.documentId,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      ...(item.image ? { imageUrl: item.image } : {}),
      ...(item.selectedOptions ? { selectedOptions: item.selectedOptions } : {}),
    })),
    customerData: cleanCustomerData(customerData),
    shippingData: {
      address: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        ...(shippingAddress.department ? { department: shippingAddress.department } : {}),
        ...(shippingAddress.reference ? { reference: shippingAddress.reference } : {}),
      },
      method: {
        documentId: shippingMethod.documentId,
        name: shippingMethod.name,
        type: shippingMethod.type,
      },
      ...(selectedLocation
        ? {
            location: {
              documentId: selectedLocation.documentId,
              key: selectedLocation.key,
              label: selectedLocation.label,
            },
          }
        : {}),
    },
    shippingMethodId: shippingMethod.documentId,
    ...(selectedLocation ? { shippingLocationId: selectedLocation.documentId } : {}),
    shippingCost: getShippingCost(shippingMethod, selectedLocation?.documentId),
    paymentMethod,
  };
}

export function formatSelectedOptions(selectedOptions?: Record<string, string>): string {
  if (!selectedOptions || Object.keys(selectedOptions).length === 0) return '';

  return Object.entries(selectedOptions)
    .map(([name, value]) => `${name}: ${value}`)
    .join(' / ');
}

export function getCartStockIssue(items: CartItem[]): string | null {
  const unavailableItem = items.find(
    (item) => item.stockStatus === 'out_of_stock' || item.stock <= 0,
  );
  if (unavailableItem) {
    return `${unavailableItem.name} ya no tiene stock disponible.`;
  }

  const overLimitItem = items.find((item) => item.quantity > item.stock);
  if (overLimitItem) {
    return `${overLimitItem.name} solo tiene ${overLimitItem.stock} disponible${overLimitItem.stock === 1 ? '' : 's'}.`;
  }

  return null;
}

function cleanCustomerData(customerData: CustomerFormData): CustomerFormData {
  return {
    name: customerData.name,
    email: customerData.email,
    phone: customerData.phone,
    ...(customerData.notes ? { notes: customerData.notes } : {}),
  };
}
