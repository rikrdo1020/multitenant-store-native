import api from './api';
import type { ApiResponse, StoreHomeData } from '@/types';

export const storeHomeService = {
  getHome: async (tenantSlug: string): Promise<StoreHomeData> => {
    const response = await api.get<ApiResponse<StoreHomeData>>('/store/home', {
      headers: { 'x-tenant-id': tenantSlug },
    });

    return response.data.data;
  },
};
