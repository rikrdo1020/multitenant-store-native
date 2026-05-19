import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/orders';
import { useTenantStore } from '@/stores/use-tenant-store';

export function useAdminOrder(orderId: string) {
  const { tenant } = useTenantStore();

  return useQuery({
    queryKey: ['admin-orders', tenant?.slug, orderId],
    queryFn: () => orderService.getAdminOrder(tenant!.slug, orderId),
    enabled: !!tenant?.slug && !!orderId,
    staleTime: 30_000,
  });
}
