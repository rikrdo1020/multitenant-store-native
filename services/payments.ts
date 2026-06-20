import api from './api';
import type { ApiResponse, CreatePaymentResult } from '@/types';

interface CreatePaymentPayload {
  orderId: string;
  viewToken: string;
  amount: number;
  aliasYappy?: string;
}

export const paymentService = {
  createYappyPayment: async (tenantSlug: string, payload: CreatePaymentPayload): Promise<CreatePaymentResult> => {
    const response = await api.post<ApiResponse<CreatePaymentResult>>('/payments/yappy/create', payload, {
      headers: { 'x-tenant-id': tenantSlug },
    });

    return response.data.data;
  },
};
