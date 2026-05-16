import { useQuery } from '@tanstack/react-query';
import { productTypeService } from '@/services/product-types';
import { useTenantStore } from '@/stores/use-tenant-store';

export function useProductTypes(tenantSlugOverride?: string) {
  const { tenant } = useTenantStore();
  const slug = tenantSlugOverride ?? tenant?.slug;

  return useQuery({
    queryKey: ['product-types', slug],
    queryFn: () => productTypeService.getProductTypes(slug!),
    enabled: !!slug,
    staleTime: 5 * 60_000,
  });
}
