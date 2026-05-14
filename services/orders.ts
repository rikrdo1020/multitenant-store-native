import api from './api';
import type { Order, ApiResponse, CreateOrderPayload } from '@/types';

interface CreateOrderResponse {
  order: Order;
  clientSecret?: string;
}

export const orderService = {
  createOrder: async (data: CreateOrderPayload): Promise<CreateOrderResponse> => {
    const response = await api.post<ApiResponse<CreateOrderResponse>>('/orders', data);
    return response.data.data;
  },

  getOrder: async (orderId: string): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return response.data.data;
  },
};
