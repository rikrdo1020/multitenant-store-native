import { View } from 'react-native';
import { Mail } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { getMemberDisplayName } from '@/lib/member-helpers';
import type { TenantMember } from '@/types';

interface MemberIdentityProps {
  member: TenantMember;
}

export function MemberIdentity({ member }: MemberIdentityProps) {
  const displayName = getMemberDisplayName(member);

  return (
    <View className="min-w-0 flex-1 flex-row items-center gap-3">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-muted">
        <Text className="font-bold text-foreground">
          {displayName.slice(0, 1).toUpperCase()}
        </Text>
      </View>
      <View className="min-w-0 flex-1">
        <Text className="font-semibold text-foreground" numberOfLines={1}>
          {displayName}
        </Text>
        <View className="mt-1 flex-row items-center gap-1">
          <Mail size={13} className="text-muted-foreground" />
          <Text variant="small" numberOfLines={1}>
            {member.user.email}
          </Text>
        </View>
      </View>
    </View>
  );
}
