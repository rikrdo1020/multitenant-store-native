import api from './api';
import type { Category, ApiResponse, CreateCategoryPayload, UpdateCategoryPayload } from '@/types';

export const categoryService = {
  getCategories: async (tenantSlug: string): Promise<Category[]> => {
    const response = await api.get<ApiResponse<Category[]>>('/categories', {
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },

  createCategory: async (tenantSlug: string, payload: CreateCategoryPayload): Promise<Category> => {
    const response = await api.post<ApiResponse<Category>>('/categories', payload, {
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },

  updateCategory: async (tenantSlug: string, id: string, payload: UpdateCategoryPayload): Promise<Category> => {
    const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, payload, {
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },

  deleteCategory: async (tenantSlug: string, id: string): Promise<void> => {
    await api.delete(`/categories/${id}`, {
      headers: { 'x-tenant-id': tenantSlug },
    });
  },
};
