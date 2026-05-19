import api from './api';
import type {
  ApiResponse,
  AdminCustomerFilters,
  Customer,
  CustomerDetail,
  PaginationMeta,
  UpdateCustomerPayload,
} from '@/types';

export interface CustomerListResult {
  data: Customer[];
  meta: PaginationMeta;
}

export const customerService = {
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
