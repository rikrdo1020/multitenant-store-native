import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/products';
import { useTenantStore } from '@/stores/use-tenant-store';

export function useProduct(tenantSlug?: string, slug?: string) {
  const { tenant } = useTenantStore();
  const resolvedTenantSlug = tenantSlug ?? tenant?.slug;

  return useQuery({
    queryKey: ['product', resolvedTenantSlug, slug],
    queryFn: () => productService.getProduct(resolvedTenantSlug!, slug!),
    enabled: !!resolvedTenantSlug && !!slug,
    staleTime: 60_000,
  });
}
