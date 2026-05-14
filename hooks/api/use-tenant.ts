import { useQuery } from '@tanstack/react-query';
import { tenantService } from '@/services/tenant';

export function useTenant(slug: string) {
  return useQuery({
    queryKey: ['tenant', slug],
    queryFn: () => tenantService.getProfile(slug),
    enabled: !!slug,
    staleTime: 5 * 60_000,
  });
}
