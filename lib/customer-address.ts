import type { CustomerAddress, CustomerProfile } from '@/types';
import type { CheckoutFormData } from './validators';

export function mapSavedAddressToCheckoutValues(
  address: CustomerAddress,
  profile?: CustomerProfile | null,
): Partial<CheckoutFormData> {
  return {
    name: address.name,
    ...(profile?.email ? { email: profile.email } : {}),
    phone: address.phone,
    address: address.address,
    city: address.city,
    department: address.department,
  };
}

export function getDefaultCustomerAddress(addresses: CustomerAddress[]): CustomerAddress | null {
  return addresses.find((address) => address.isDefault) ?? addresses[0] ?? null;
}
