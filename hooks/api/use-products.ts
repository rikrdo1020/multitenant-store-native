import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/products';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { ProductFilters } from '@/types';

export function useProducts(filters: ProductFilters = {}) {
  const { tenant } = useTenantStore();

  return useQuery({
    queryKey: ['products', tenant?.slug, filters],
    queryFn: () => productService.getProducts(tenant!.slug, filters),
    enabled: !!tenant,
    staleTime: 60_000,
  });
}
