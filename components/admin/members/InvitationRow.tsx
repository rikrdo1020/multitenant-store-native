import { View } from 'react-native';
import { Mail } from 'lucide-react-native';
import { PendingBadge, RoleBadge } from '@/components/admin/members/MemberBadges';
import { Text } from '@/components/ui/Text';
import { invitationExpiryLabel } from '@/lib/member-helpers';
import { cn } from '@/lib/utils';
import type { MemberInvitation } from '@/types';

interface InvitationRowProps {
  invitation: MemberInvitation;
  isLast: boolean;
  isWide: boolean;
}

export function InvitationRow({ invitation, isLast, isWide }: InvitationRowProps) {
  return (
    <View
      className={cn(
        'gap-3 px-4 py-4',
        !isLast && 'border-b border-border',
        isWide && 'flex-row items-center justify-between',
      )}
    >
      <View className="min-w-0 flex-1">
        <View className="flex-row items-center gap-2">
          <Mail size={14} className="text-muted-foreground" />
          <Text className="font-semibold text-foreground" numberOfLines={1}>
            {invitation.email}
          </Text>
        </View>
        <Text variant="small" className="mt-1">
          {invitationExpiryLabel(invitation)}
        </Text>
      </View>
      <View className="flex-row flex-wrap gap-2">
        <RoleBadge role={invitation.role} />
        <PendingBadge />
      </View>
    </View>
  );
}
