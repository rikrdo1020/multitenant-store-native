import api from './api';
import type { Brand, ApiResponse, CreateBrandPayload, UpdateBrandPayload } from '@/types';

export const brandService = {
  getBrands: async (tenantSlug: string): Promise<Brand[]> => {
    const response = await api.get<ApiResponse<Brand[]>>('/brands', {
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },

  createBrand: async (tenantSlug: string, payload: CreateBrandPayload): Promise<Brand> => {
    const response = await api.post<ApiResponse<Brand>>('/brands', payload, {
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },

  updateBrand: async (tenantSlug: string, id: string, payload: UpdateBrandPayload): Promise<Brand> => {
    const response = await api.put<ApiResponse<Brand>>(`/brands/${id}`, payload, {
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },

  deleteBrand: async (tenantSlug: string, id: string): Promise<void> => {
    await api.delete(`/brands/${id}`, {
      headers: { 'x-tenant-id': tenantSlug },
    });
  },
};
