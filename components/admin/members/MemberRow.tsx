import { View } from 'react-native';
import { MemberActions } from '@/components/admin/members/MemberActions';
import { MemberIdentity } from '@/components/admin/members/MemberIdentity';
import { MemberStatusBadge, RoleBadge } from '@/components/admin/members/MemberBadges';
import { cn } from '@/lib/utils';
import type { TenantMember } from '@/types';

interface MemberRowProps {
  member: TenantMember;
  isLast: boolean;
  isWide: boolean;
  currentUserId?: string;
  disabled: boolean;
  onEditRole: (member: TenantMember) => void;
  onRemove: (member: TenantMember) => void;
}

export function MemberRow({
  member,
  isLast,
  isWide,
  currentUserId,
  disabled,
  onEditRole,
  onRemove,
}: MemberRowProps) {
  const isActive = member.user.isActive ?? true;

  return (
    <View
      className={cn(
        'gap-3 px-4 py-4',
        !isLast && 'border-b border-border',
        isWide && 'flex-row items-center justify-between',
      )}
    >
      <MemberIdentity member={member} />
      <View className="gap-3 md:flex-row md:items-center">
        <View className="flex-row flex-wrap gap-2">
          <RoleBadge role={member.role} />
          <MemberStatusBadge active={isActive} />
        </View>
        <MemberActions
          member={member}
          currentUserId={currentUserId}
          disabled={disabled}
          onEditRole={onEditRole}
          onRemove={onRemove}
        />
      </View>
    </View>
  );
}
