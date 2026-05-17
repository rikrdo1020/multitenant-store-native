import api from './api';
import type { ApiResponse, PaginationMeta } from '@/types';

export interface MarketplaceFeaturedProduct {
  documentId: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
}

export interface MarketplaceStore {
  documentId: string;
  slug: string;
  name: string;
  description?: string;
  logo?: string;
  primaryColor?: string;
  products: MarketplaceFeaturedProduct[];
}

interface MarketplaceStoresApiResponse extends ApiResponse<MarketplaceStore[]> {
  meta: PaginationMeta;
}

export interface MarketplaceStoresResult {
  stores: MarketplaceStore[];
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
