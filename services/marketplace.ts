import api from './api';
import type { ApiResponse, MarketplaceStore, MarketplaceStoresResult, PaginationMeta } from '@/types';

interface MarketplaceStoresApiResponse extends ApiResponse<MarketplaceStore[]> {
  meta: PaginationMeta;
}

export const marketplaceService = {
  getStores: async (page = 1, pageSize = 20): Promise<MarketplaceStoresResult> => {
    const response = await api.get<MarketplaceStoresApiResponse>('/marketplace/stores', {
      params: { page, pageSize },
    });
    return {
      stores: response.data.data,
      meta: response.data.meta!,
    };
  },
};
