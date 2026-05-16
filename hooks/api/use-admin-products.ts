import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { productService } from '@/services/products';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { ProductFilters } from '@/types';

export function useAdminProducts(filters?: ProductFilters, tenantSlugOverride?: string) {
  const { tenant } = useTenantStore();
  const slug = tenantSlugOverride ?? tenant?.slug;

  return useQuery({
    queryKey: ['admin-products', slug, filters],
    queryFn: () => productService.getAdminProducts(slug!, filters),
    enabled: !!slug,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}
