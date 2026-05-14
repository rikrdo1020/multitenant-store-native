import api from './api';
import type { Product, ProductFilters, ApiResponse, PaginationMeta } from '@/types';

export const productService = {
  getProducts: async (tenantSlug: string, filters: ProductFilters): Promise<{ data: Product[]; meta: PaginationMeta }> => {
    const response = await api.get<ApiResponse<Product[]>>('/products', {
      params: { ...filters, tenant: tenantSlug },
      headers: { 'x-tenant-id': tenantSlug },
    });
    return { data: response.data.data, meta: response.data.meta! };
  },

  getProduct: async (tenantSlug: string, slug: string): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/products/${slug}`, {
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },
};
