import api from './api';
import type { Brand, ApiResponse } from '@/types';

export const brandService = {
  getBrands: async (tenantSlug: string): Promise<Brand[]> => {
    const response = await api.get<ApiResponse<Brand[]>>('/brands', {
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },
};
