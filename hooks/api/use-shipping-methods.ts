import { useQuery } from '@tanstack/react-query';
import { shippingService } from '@/services/shipping';
import { useTenantStore } from '@/stores/use-tenant-store';

export function useShippingMethods(tenantSlugOverride?: string) {
  const { tenant } = useTenantStore();
  const tenantSlug = tenantSlugOverride ?? tenant?.slug;

  return useQuery({
    queryKey: ['shipping-methods', tenantSlug],
    queryFn: () => shippingService.getShippingMethods(tenantSlug!),
    enabled: !!tenantSlug,
    staleTime: 5 * 60_000,
  });
}
