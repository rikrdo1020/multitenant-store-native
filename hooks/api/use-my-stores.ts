import { useQuery } from '@tanstack/react-query';
import { tenantService } from '@/services/tenant';

export function useMyStores() {
  return useQuery({
    queryKey: ['my-stores'],
    queryFn: () => tenantService.getMyStores(),
    staleTime: 2 * 60_000,
  });
}
