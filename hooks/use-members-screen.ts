import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  useInviteMember,
  useMemberInvitations,
  useMembers,
  useRemoveMember,
  useUpdateMemberRole,
} from '@/hooks/api/use-members';
import { showToast } from '@/lib/toast';
import type { InviteMemberFormData } from '@/lib/validators';
import { getMemberErrorMessage } from '@/services/members';
import { useAuthStore } from '@/stores/use-auth-store';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { TeamRole, TenantMember } from '@/types';

type FormResult = Promise<string | null>;

export function useMembersScreen() {
  const router = useRouter();
  const tenant = useTenantStore((state) => state.tenant);
  const user = useAuthStore((state) => state.user);
  const [inviteVisible, setInviteVisible] = useState(false);
  const [memberForRole, setMemberForRole] = useState<TenantMember | null>(null);
  const [memberForRemoval, setMemberForRemoval] = useState<TenantMember | null>(null);
  const isSuperadmin = user?.role === 'superadmin';
  const canManageMembers = user?.role === 'admin' || isSuperadmin;

  const membersQuery = useMembers(undefined, canManageMembers);
  const invitationsQuery = useMemberInvitations(undefined, canManageMembers);
  const inviteMember = useInviteMember();
  const updateMemberRole = useUpdateMemberRole();
  const removeMember = useRemoveMember();

  const refreshMembers = () => {
    void membersQuery.refetch();
  };

  const refreshInvitations = () => {
    void invitationsQuery.refetch();
  };

  const submitInvite = async (data: InviteMemberFormData): FormResult => {
    try {
      await inviteMember.mutateAsync({
        email: data.email.trim().toLowerCase(),
        role: data.role,
      });
      showToast('Invitacion enviada', 'success', data.email.trim().toLowerCase());
      setInviteVisible(false);
      return null;
    } catch (error) {
      return getMemberErrorMessage(error, 'No pudimos enviar la invitacion. Intenta de nuevo.');
    }
  };

  const submitRole = async (role: TeamRole): FormResult => {
    if (!memberForRole) return 'Selecciona un miembro para actualizar.';

    try {
      await updateMemberRole.mutateAsync({ memberId: memberForRole.documentId, role });
      showToast('Rol actualizado', 'success', memberForRole.user.email);
      setMemberForRole(null);
      return null;
    } catch (error) {
      return getMemberErrorMessage(error, 'No pudimos actualizar el rol. Intenta de nuevo.');
    }
  };

  const confirmRemove = async () => {
    if (!memberForRemoval) return;

    try {
      await removeMember.mutateAsync(memberForRemoval.documentId);
      showToast('Miembro eliminado', 'success', memberForRemoval.user.email);
      setMemberForRemoval(null);
    } catch (error) {
      showToast(
        'No pudimos eliminar el miembro',
        'destructive',
        getMemberErrorMessage(error, 'Intenta de nuevo.'),
      );
    }
  };

  return {
    tenant,
    user,
    isSuperadmin,
    canManageMembers,
    members: membersQuery.data ?? [],
    invitations: invitationsQuery.data ?? [],
    membersLoading: membersQuery.isLoading,
    membersError: Boolean(membersQuery.error),
    membersRefreshing: membersQuery.isFetching,
    invitationsLoading: invitationsQuery.isLoading,
    invitationsError: Boolean(invitationsQuery.error),
    invitationsRefreshing: invitationsQuery.isFetching,
    inviteVisible,
    memberForRole,
    memberForRemoval,
    isInviting: inviteMember.isPending,
    isUpdatingRole: updateMemberRole.isPending,
    isRemovingMember: removeMember.isPending,
    goToMissingTenantAction: () => {
      if (isSuperadmin) {
        router.push('/(superadmin)/tenants');
        return;
      }

      router.push('/(owner)/create-store');
    },
    refreshMembers,
    refreshInvitations,
    openInvite: () => setInviteVisible(true),
    closeInvite: () => setInviteVisible(false),
    openRoleEditor: setMemberForRole,
    closeRoleEditor: () => setMemberForRole(null),
    openRemoveDialog: setMemberForRemoval,
    closeRemoveDialog: () => setMemberForRemoval(null),
    submitInvite,
    submitRole,
    confirmRemove,
  };
}
