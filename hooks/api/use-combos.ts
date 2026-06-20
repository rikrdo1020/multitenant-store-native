import { useQuery } from '@tanstack/react-query';
import { comboService } from '@/services/combos';
import { useTenantStore } from '@/stores/use-tenant-store';

export const combosQueryKey = (tenantSlug?: string) => ['combos', tenantSlug];

export function useCombos(tenantSlugOverride?: string, enabled = true) {
  const { tenant } = useTenantStore();
  const tenantSlug = tenantSlugOverride ?? tenant?.slug;

  return useQuery({
    queryKey: combosQueryKey(tenantSlug),
    queryFn: () => comboService.getCombos(tenantSlug!),
    enabled: !!tenantSlug && enabled,
    staleTime: 5 * 60_000,
  });
}
