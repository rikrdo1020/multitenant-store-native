import { useQuery } from '@tanstack/react-query';
import { storeHomeService } from '@/services/store-home';

export function useStoreHome(tenantSlug?: string) {
  return useQuery({
    queryKey: ['store-home', tenantSlug],
    queryFn: () => storeHomeService.getHome(tenantSlug!),
    enabled: !!tenantSlug,
    staleTime: 60_000,
  });
}
