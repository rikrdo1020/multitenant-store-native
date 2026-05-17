import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { memberService } from '@/services/members';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { TeamRole } from '@/types';

export function useMembers(tenantSlugOverride?: string, enabled = true) {
  const { tenant } = useTenantStore();
  const slug = tenantSlugOverride ?? tenant?.slug;

  return useQuery({
    queryKey: ['members', slug],
    queryFn: () => memberService.getMembers(slug!),
    enabled: !!slug && enabled,
    staleTime: 30_000,
  });
}

export function useInviteMember(tenantSlugOverride?: string) {
  const { tenant } = useTenantStore();
  const slug = tenantSlugOverride ?? tenant?.slug;

  return useMutation({
    mutationFn: (payload: { email: string; role: TeamRole }) =>
      memberService.inviteMember(slug!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', slug] });
    },
  });
}
