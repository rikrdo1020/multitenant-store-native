import { Users } from 'lucide-react-native';
import { MemberRow } from '@/components/admin/members/MemberRow';
import { MembersSection } from '@/components/admin/members/MembersSection';
import type { TenantMember } from '@/types';

interface ActiveMembersPanelProps {
  members: TenantMember[];
  currentUserId?: string;
  isWide: boolean;
  isLoading: boolean;
  isError: boolean;
  isRefreshing: boolean;
  isMutating: boolean;
  onRefresh: () => void;
  onInvite: () => void;
  onEditRole: (member: TenantMember) => void;
  onRemove: (member: TenantMember) => void;
}

export function ActiveMembersPanel(props: ActiveMembersPanelProps) {
  return (
    <MembersSection
      title="Equipo activo"
      icon={<Users size={18} className="text-muted-foreground" />}
      isLoading={props.isLoading}
      isError={props.isError}
      isEmpty={props.members.length === 0}
      isRefreshing={props.isRefreshing}
      emptyTitle="Aun no hay miembros"
      emptyDescription="Invita a la primera persona que ayudara con la tienda."
      emptyActionLabel="Invitar miembro"
      onEmptyAction={props.onInvite}
      onRefresh={props.onRefresh}
    >
      {props.members.map((member, index) => (
        <MemberRow
          key={member.documentId}
          member={member}
          currentUserId={props.currentUserId}
          isLast={index === props.members.length - 1}
          isWide={props.isWide}
          disabled={props.isMutating}
          onEditRole={props.onEditRole}
          onRemove={props.onRemove}
        />
      ))}
    </MembersSection>
  );
}
