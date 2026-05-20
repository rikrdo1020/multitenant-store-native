import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { memberService } from '@/services/members';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { TeamRole } from '@/types';

const membersQueryKey = (slug?: string) => ['members', slug];
const memberInvitationsQueryKey = (slug?: string) => ['members', slug, 'invitations'];

function invalidateMemberQueries(slug?: string) {
  queryClient.invalidateQueries({ queryKey: membersQueryKey(slug) });
  queryClient.invalidateQueries({ queryKey: memberInvitationsQueryKey(slug) });
}

export function useMembers(tenantSlugOverride?: string, enabled = true) {
  const { tenant } = useTenantStore();
  const slug = tenantSlugOverride ?? tenant?.slug;

  return useQuery({
    queryKey: membersQueryKey(slug),
    queryFn: () => memberService.getMembers(slug!),
    enabled: !!slug && enabled,
    staleTime: 30_000,
  });
}

export function useMemberInvitations(tenantSlugOverride?: string, enabled = true) {
  const { tenant } = useTenantStore();
  const slug = tenantSlugOverride ?? tenant?.slug;

  return useQuery({
    queryKey: memberInvitationsQueryKey(slug),
    queryFn: () => memberService.getPendingInvitations(slug!),
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
      invalidateMemberQueries(slug);
    },
  });
}

export function useUpdateMemberRole(tenantSlugOverride?: string) {
  const { tenant } = useTenantStore();
  const slug = tenantSlugOverride ?? tenant?.slug;

  return useMutation({
    mutationFn: (payload: { memberId: string; role: TeamRole }) =>
      memberService.updateMemberRole(slug!, payload.memberId, payload.role),
    onSuccess: () => {
      invalidateMemberQueries(slug);
    },
  });
}

export function useRemoveMember(tenantSlugOverride?: string) {
  const { tenant } = useTenantStore();
  const slug = tenantSlugOverride ?? tenant?.slug;

  return useMutation({
    mutationFn: (memberId: string) => memberService.removeMember(slug!, memberId),
    onSuccess: () => {
      invalidateMemberQueries(slug);
    },
  });
}
