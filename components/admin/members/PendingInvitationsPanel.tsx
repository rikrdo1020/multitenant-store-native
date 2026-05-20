import { Clock } from 'lucide-react-native';
import { InvitationRow } from '@/components/admin/members/InvitationRow';
import { MembersSection } from '@/components/admin/members/MembersSection';
import type { MemberInvitation } from '@/types';

interface PendingInvitationsPanelProps {
  invitations: MemberInvitation[];
  isWide: boolean;
  isLoading: boolean;
  isError: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export function PendingInvitationsPanel(props: PendingInvitationsPanelProps) {
  return (
    <MembersSection
      title="Invitaciones pendientes"
      icon={<Clock size={18} className="text-muted-foreground" />}
      isLoading={props.isLoading}
      isError={props.isError}
      isEmpty={props.invitations.length === 0}
      isRefreshing={props.isRefreshing}
      emptyTitle="No hay invitaciones pendientes"
      emptyDescription="Las nuevas invitaciones apareceran aqui hasta que sean aceptadas."
      onRefresh={props.onRefresh}
    >
      {props.invitations.map((invitation, index) => (
        <InvitationRow
          key={invitation.documentId}
          invitation={invitation}
          isLast={index === props.invitations.length - 1}
          isWide={props.isWide}
        />
      ))}
    </MembersSection>
  );
}
