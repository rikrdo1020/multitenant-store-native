import api from './api';
import type { Tenant, ApiResponse, UpdateTenantPayload } from '@/types';

export const tenantService = {
  getProfile: async (slug: string): Promise<Tenant> => {
    const response = await api.get<ApiResponse<Tenant>>(`/store/profile`, {
      headers: { 'x-tenant-id': slug },
    });
    return response.data.data;
  },

  checkSlug: async (slug: string, excludeDocumentId?: string): Promise<{ available: boolean }> => {
    const params = new URLSearchParams({ slug });
    if (excludeDocumentId) params.set('excludeId', excludeDocumentId);
    const response = await api.get<ApiResponse<{ available: boolean }>>(`/store/check-slug?${params}`);
    return response.data.data;
  },

  getMyStores: async (): Promise<Tenant[]> => {
    const response = await api.get<ApiResponse<Tenant[]>>('/store/my-stores');
    return response.data.data;
  },

  createStore: async (data: { name: string; slug: string; description?: string }): Promise<Tenant> => {
    const response = await api.post<ApiResponse<Tenant>>('/store', data);
    return response.data.data;
  },

  updateStore: async (documentId: string, data: UpdateTenantPayload): Promise<Tenant> => {
    const response = await api.put<ApiResponse<Tenant>>(`/store/profile/${documentId}`, data);
    return response.data.data;
  },
};
