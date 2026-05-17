import { useQuery } from '@tanstack/react-query';
import { marketplaceService } from '@/services/marketplace';

export function useMarketplaceStores() {
  return useQuery({
    queryKey: ['marketplace', 'stores'],
    queryFn: () => marketplaceService.getStores(),
    staleTime: 2 * 60_000,
  });
}
