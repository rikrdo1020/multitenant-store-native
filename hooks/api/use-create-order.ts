import { useMutation } from '@tanstack/react-query';
import { orderService } from '@/services/orders';
import type { CreateOrderPayload } from '@/types';

export function useCreateOrder(tenantSlug?: string) {
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => {
      if (!tenantSlug) {
        throw new Error('Tenant slug is required to create an order.');
      }

      return orderService.createOrder(tenantSlug, payload);
    },
  });
}
