import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/orders';

export function useOrders(tenantSlug?: string) {
  return useQuery({
    queryKey: ['orders', tenantSlug, 'account'],
    queryFn: () => orderService.getOrders(tenantSlug!, { page: 1, pageSize: 50 }),
    enabled: !!tenantSlug,
    staleTime: 60_000,
  });
}

export function useOrder(tenantSlug?: string, orderId?: string) {
  return useQuery({
    queryKey: ['orders', tenantSlug, orderId],
    queryFn: () => orderService.getOrderById(tenantSlug!, orderId!),
    enabled: !!tenantSlug && !!orderId,
    staleTime: 60_000,
  });
}
