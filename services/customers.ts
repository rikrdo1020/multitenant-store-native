import api from './api';
import type {
  AdminCustomerFilters,
  ApiResponse,
  Customer,
  CustomerAddress,
  CustomerAddressPayload,
  CustomerDetail,
  CustomerProfile,
  PaginationMeta,
  UpdateCustomerPayload,
  UpdateCustomerProfilePayload,
} from '@/types';

export interface CustomerListResult {
  data: Customer[];
  meta: PaginationMeta;
}

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

  getCustomers: async (
    tenantSlug: string,
    filters?: AdminCustomerFilters,
  ): Promise<CustomerListResult> => {
    const response = await api.get<ApiResponse<Customer[]>>('/customers', {
      params: filters,
      headers: { 'x-tenant-id': tenantSlug },
    });
    return { data: response.data.data, meta: response.data.meta! };
  },

  getCustomer: async (tenantSlug: string, id: string): Promise<CustomerDetail> => {
    const response = await api.get<ApiResponse<CustomerDetail>>(`/customers/${id}`, {
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },

  updateCustomer: async (
    tenantSlug: string,
    id: string,
    payload: UpdateCustomerPayload,
  ): Promise<Customer> => {
    const response = await api.put<ApiResponse<Customer>>(`/customers/${id}`, payload, {
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },

  deleteCustomer: async (tenantSlug: string, id: string): Promise<void> => {
    await api.delete(`/customers/${id}`, {
      headers: { 'x-tenant-id': tenantSlug },
    });
  },
};
