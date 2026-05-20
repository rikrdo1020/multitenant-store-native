import { describe, expect, it } from '@jest/globals';
import { getDefaultCustomerAddress, mapSavedAddressToCheckoutValues } from './customer-address';
import type { CustomerAddress, CustomerProfile } from '@/types';

const address: CustomerAddress = {
  documentId: 'addr_1',
  name: 'Ana Buyer',
  address: 'Street 1',
  city: 'Panama',
  department: 'Panama',
  phone: '6000-0000',
  isDefault: true,
};

const profile: CustomerProfile = {
  documentId: 'cus_1',
  name: 'Buyer',
  email: 'buyer@example.com',
  phone: '6111-1111',
};

describe('customer address helpers', () => {
  it('GIVEN saved address WHEN mapping to checkout SHOULD preserve delivery fields and profile email', () => {
    expect(mapSavedAddressToCheckoutValues(address, profile)).toEqual({
      name: 'Ana Buyer',
      email: 'buyer@example.com',
      phone: '6000-0000',
      address: 'Street 1',
      city: 'Panama',
      department: 'Panama',
    });
  });

  it('GIVEN profile is unavailable WHEN mapping to checkout SHOULD not clear existing checkout email', () => {
    expect(mapSavedAddressToCheckoutValues(address)).toEqual({
      name: 'Ana Buyer',
      phone: '6000-0000',
      address: 'Street 1',
      city: 'Panama',
      department: 'Panama',
    });
  });

  it('GIVEN addresses WHEN reading default SHOULD prefer isDefault then first item', () => {
    const fallback = { ...address, documentId: 'addr_2', isDefault: false };

    expect(getDefaultCustomerAddress([fallback, address])).toBe(address);
    expect(getDefaultCustomerAddress([fallback])).toBe(fallback);
    expect(getDefaultCustomerAddress([])).toBeNull();
  });
});
