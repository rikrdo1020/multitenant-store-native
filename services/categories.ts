import api from './api';
import type { Category, ApiResponse } from '@/types';

export const categoryService = {
  getCategories: async (tenantSlug: string): Promise<Category[]> => {
    const response = await api.get<ApiResponse<Category[]>>('/categories', {
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },
};
