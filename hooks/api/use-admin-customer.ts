import { useQuery } from '@tanstack/react-query';
import { customerService } from '@/services/customers';
import { useTenantStore } from '@/stores/use-tenant-store';

export function useAdminCustomer(id: string) {
  const { tenant } = useTenantStore();

  return useQuery({
    queryKey: ['admin-customers', tenant?.slug, id],
    queryFn: () => customerService.getCustomer(tenant!.slug, id),
    enabled: !!tenant?.slug && !!id,
    staleTime: 30_000,
  });
}
