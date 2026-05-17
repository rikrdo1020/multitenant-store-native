import api from './api';
import type { ProductType, ApiResponse, CreateProductTypePayload, UpdateProductTypePayload } from '@/types';

export const productTypeService = {
  getProductTypes: async (tenantSlug: string): Promise<ProductType[]> => {
    const response = await api.get<ApiResponse<ProductType[]>>('/product-types', {
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },

  createProductType: async (tenantSlug: string, payload: CreateProductTypePayload): Promise<ProductType> => {
    const response = await api.post<ApiResponse<ProductType>>('/product-types', payload, {
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },

  updateProductType: async (tenantSlug: string, id: string, payload: UpdateProductTypePayload): Promise<ProductType> => {
    const response = await api.put<ApiResponse<ProductType>>(`/product-types/${id}`, payload, {
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },

  deleteProductType: async (tenantSlug: string, id: string): Promise<void> => {
    await api.delete(`/product-types/${id}`, {
      headers: { 'x-tenant-id': tenantSlug },
    });
  },
};
