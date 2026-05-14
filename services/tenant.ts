import api from './api';
import type { Tenant, ApiResponse } from '@/types';

export const tenantService = {
  getProfile: async (slug: string): Promise<Tenant> => {
    const response = await api.get<ApiResponse<Tenant>>(`/store/profile`, {
      headers: { 'x-tenant-id': slug },
    });
    return response.data.data;
  },

  createStore: async (data: { name: string; slug: string; description?: string }): Promise<Tenant> => {
    const response = await api.post<ApiResponse<Tenant>>('/tenants', data);
    return response.data.data;
  },

  updateStore: async (documentId: string, data: Partial<Tenant>): Promise<Tenant> => {
    const response = await api.put<ApiResponse<Tenant>>(`/tenants/${documentId}`, data);
    return response.data.data;
  },
};
