import api from './api';
import type { ApiResponse, StoreBanner, StoreBannerPayload } from '@/types';

export const bannerService = {
  getBanners: async (tenantSlug: string): Promise<StoreBanner[]> => {
    const response = await api.get<ApiResponse<StoreBanner[]>>('/banners', {
      headers: { 'x-tenant-id': tenantSlug },
    });

    return response.data.data;
  },

  createBanner: async (
    tenantSlug: string,
    payload: StoreBannerPayload,
  ): Promise<StoreBanner> => {
    const response = await api.post<ApiResponse<StoreBanner>>('/banners', payload, {
      headers: { 'x-tenant-id': tenantSlug },
    });

    return response.data.data;
  },

  updateBanner: async (
    tenantSlug: string,
    id: string,
    payload: Partial<StoreBannerPayload>,
  ): Promise<StoreBanner> => {
    const response = await api.put<ApiResponse<StoreBanner>>(
      `/banners/${id}`,
      payload,
      { headers: { 'x-tenant-id': tenantSlug } },
    );

    return response.data.data;
  },

  deleteBanner: async (tenantSlug: string, id: string): Promise<void> => {
    await api.delete(`/banners/${id}`, {
      headers: { 'x-tenant-id': tenantSlug },
    });
  },
};
