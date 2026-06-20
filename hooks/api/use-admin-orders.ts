import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { orderService } from '@/services/orders';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { AdminOrderFilters } from '@/types';

export function useAdminOrders(filters?: AdminOrderFilters) {
  const { tenant } = useTenantStore();

  return useQuery({
    queryKey: ['admin-orders', tenant?.slug, filters],
    queryFn: () => orderService.getAdminOrders(tenant!.slug, filters),
    enabled: !!tenant?.slug,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useRecentOrders(limit = 8) {
  const { tenant } = useTenantStore();

  return useQuery({
    queryKey: ['admin-orders', 'recent', tenant?.slug, limit],
    queryFn: () => orderService.getRecentOrders(tenant!.slug, limit),
    enabled: !!tenant?.slug,
    staleTime: 60_000,
  });
}
