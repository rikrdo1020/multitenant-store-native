import { View } from 'react-native';
import { ActiveMembersPanel } from '@/components/admin/members/ActiveMembersPanel';
import { MembersHeader } from '@/components/admin/members/MembersHeader';
import { PendingInvitationsPanel } from '@/components/admin/members/PendingInvitationsPanel';
import type { useMembersScreen } from '@/hooks/use-members-screen';

interface MembersDashboardProps {
  screen: ReturnType<typeof useMembersScreen>;
  isWide: boolean;
}

export function MembersDashboard({ screen, isWide }: MembersDashboardProps) {
  const isMutating = screen.isUpdatingRole || screen.isRemovingMember;

  return (
    <View className="gap-6">
      <MembersHeader
        tenantName={screen.tenant!.name}
        isWide={isWide}
        onInvite={screen.openInvite}
      />
      <ActiveMembersPanel
        members={screen.members}
        currentUserId={screen.user?.documentId}
        isWide={isWide}
        isLoading={screen.membersLoading}
        isError={screen.membersError}
        isRefreshing={screen.membersRefreshing}
        isMutating={isMutating}
        onRefresh={screen.refreshMembers}
        onInvite={screen.openInvite}
        onEditRole={screen.openRoleEditor}
        onRemove={screen.openRemoveDialog}
      />
      <PendingInvitationsPanel
        invitations={screen.invitations}
        isWide={isWide}
        isLoading={screen.invitationsLoading}
        isError={screen.invitationsError}
        isRefreshing={screen.invitationsRefreshing}
        onRefresh={screen.refreshInvitations}
      />
    </View>
  );
}
