import api from './api';
import type { Tag, ApiResponse, CreateTagPayload, UpdateTagPayload } from '@/types';

export const tagService = {
  getTags: async (tenantSlug: string): Promise<Tag[]> => {
    const response = await api.get<ApiResponse<Tag[]>>('/tags', {
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },

  createTag: async (tenantSlug: string, payload: CreateTagPayload): Promise<Tag> => {
    const response = await api.post<ApiResponse<Tag>>('/tags', payload, {
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },

  updateTag: async (tenantSlug: string, id: string, payload: UpdateTagPayload): Promise<Tag> => {
    const response = await api.put<ApiResponse<Tag>>(`/tags/${id}`, payload, {
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },

  deleteTag: async (tenantSlug: string, id: string): Promise<void> => {
    await api.delete(`/tags/${id}`, {
      headers: { 'x-tenant-id': tenantSlug },
    });
  },
};
