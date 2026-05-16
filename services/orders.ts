import api from './api';
import type { Order, ApiResponse, CreateOrderPayload } from '@/types';

export const orderService = {
  createOrder: async (tenantSlug: string, data: CreateOrderPayload): Promise<Order> => {
    const response = await api.post<ApiResponse<Order>>('/orders', data, {
      headers: { 'x-tenant-id': tenantSlug },
    });

    return response.data.data;
  },

  getOrder: async (tenantSlug: string, orderId: string): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(`/orders/track/${orderId}`, {
      headers: { 'x-tenant-id': tenantSlug },
    });

    return response.data.data;
  },
};
