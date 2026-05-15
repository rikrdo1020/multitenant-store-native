import { useQuery } from '@tanstack/react-query';
import { brandService } from '@/services/brands';
import { useTenantStore } from '@/stores/use-tenant-store';

export function useBrands(tenantSlugOverride?: string) {
  const { tenant } = useTenantStore();
  const slug = tenantSlugOverride ?? tenant?.slug;

  return useQuery({
    queryKey: ['brands', slug],
    queryFn: () => brandService.getBrands(slug!),
    enabled: !!slug,
    staleTime: 5 * 60_000,
  });
}
