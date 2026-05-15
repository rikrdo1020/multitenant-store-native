import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services/categories';
import { useTenantStore } from '@/stores/use-tenant-store';

export function useCategories(tenantSlugOverride?: string) {
  const { tenant } = useTenantStore();
  const slug = tenantSlugOverride ?? tenant?.slug;

  return useQuery({
    queryKey: ['categories', slug],
    queryFn: () => categoryService.getCategories(slug!),
    enabled: !!slug,
    staleTime: 5 * 60_000,
  });
}
