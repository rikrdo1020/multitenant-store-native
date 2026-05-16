import api from './api';
import type { Tag, ApiResponse } from '@/types';

export const tagService = {
  getTags: async (tenantSlug: string): Promise<Tag[]> => {
    const response = await api.get<ApiResponse<Tag[]>>('/tags', {
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },
};
