import api from './api';
import type { ProductType, ApiResponse } from '@/types';

export const productTypeService = {
  getProductTypes: async (tenantSlug: string): Promise<ProductType[]> => {
    const response = await api.get<ApiResponse<ProductType[]>>('/product-types', {
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },
};
