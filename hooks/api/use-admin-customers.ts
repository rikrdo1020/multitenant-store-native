import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { customerService } from '@/services/customers';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { AdminCustomerFilters } from '@/types';

export function useAdminCustomers(filters?: AdminCustomerFilters) {
  const { tenant } = useTenantStore();

  return useQuery({
    queryKey: ['admin-customers', tenant?.slug, filters],
    queryFn: () => customerService.getCustomers(tenant!.slug, filters),
    enabled: !!tenant?.slug,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}
