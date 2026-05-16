import api from './api';
import type { ApiResponse, ShippingMethod } from '@/types';

export const shippingService = {
  getShippingMethods: async (tenantSlug: string): Promise<ShippingMethod[]> => {
    const response = await api.get<ApiResponse<ShippingMethod[]>>('/shipping', {
      headers: { 'x-tenant-id': tenantSlug },
    });

    return response.data.data;
  },
};
