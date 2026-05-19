import api from './api';
import type {
  ApiResponse,
  CustomerAddress,
  CustomerAddressPayload,
  CustomerProfile,
  UpdateCustomerProfilePayload,
} from '@/types';

function tenantHeaders(tenantSlug: string) {
  return { headers: { 'x-tenant-id': tenantSlug } };
}

export const customerService = {
  getMe: async (tenantSlug: string): Promise<CustomerProfile> => {
    const response = await api.get<ApiResponse<CustomerProfile>>('/customers/me', tenantHeaders(tenantSlug));
    return response.data.data;
  },

  updateMe: async (
    tenantSlug: string,
    payload: UpdateCustomerProfilePayload,
  ): Promise<CustomerProfile> => {
    const response = await api.put<ApiResponse<CustomerProfile>>(
      '/customers/me',
      payload,
      tenantHeaders(tenantSlug),
    );
    return response.data.data;
  },

  getAddresses: async (tenantSlug: string): Promise<CustomerAddress[]> => {
    const response = await api.get<ApiResponse<CustomerAddress[]>>(
      '/customers/me/addresses',
      tenantHeaders(tenantSlug),
    );
    return response.data.data;
  },

  createAddress: async (
    tenantSlug: string,
    payload: CustomerAddressPayload,
  ): Promise<CustomerAddress> => {
    const response = await api.post<ApiResponse<CustomerAddress>>(
      '/customers/me/addresses',
      payload,
      tenantHeaders(tenantSlug),
    );
    return response.data.data;
  },

  updateAddress: async (
    tenantSlug: string,
    addressId: string,
    payload: Partial<CustomerAddressPayload>,
  ): Promise<CustomerAddress> => {
    const response = await api.put<ApiResponse<CustomerAddress>>(
      `/customers/me/addresses/${addressId}`,
      payload,
      tenantHeaders(tenantSlug),
    );
    return response.data.data;
  },

  deleteAddress: async (tenantSlug: string, addressId: string): Promise<void> => {
    await api.delete(`/customers/me/addresses/${addressId}`, tenantHeaders(tenantSlug));
  },
};
