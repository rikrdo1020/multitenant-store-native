import { useQuery } from '@tanstack/react-query';
import { tagService } from '@/services/tags';
import { useTenantStore } from '@/stores/use-tenant-store';

export function useTags(tenantSlugOverride?: string) {
  const { tenant } = useTenantStore();
  const slug = tenantSlugOverride ?? tenant?.slug;

  return useQuery({
    queryKey: ['tags', slug],
    queryFn: () => tagService.getTags(slug!),
    enabled: !!slug,
    staleTime: 5 * 60_000,
  });
}
