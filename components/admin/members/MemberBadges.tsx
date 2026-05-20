import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { roleLabel } from '@/lib/member-helpers';
import { cn } from '@/lib/utils';
import type { TenantMember } from '@/types';

export function RoleBadge({ role }: { role: TenantMember['role'] }) {
  return (
    <View className="rounded-full border border-border bg-background px-3 py-1">
      <Text className="text-xs font-semibold text-foreground">
        {roleLabel(role)}
      </Text>
    </View>
  );
}

export function MemberStatusBadge({ active }: { active: boolean }) {
  return (
    <View className={cn('rounded-full px-3 py-1', active ? 'bg-primary/10' : 'bg-muted')}>
      <Text className={cn('text-xs font-semibold', active ? 'text-primary' : 'text-muted-foreground')}>
        {active ? 'Activo' : 'Inactivo'}
      </Text>
    </View>
  );
}

export function PendingBadge() {
  return (
    <View className="rounded-full bg-secondary px-3 py-1">
      <Text className="text-xs font-semibold text-secondary-foreground">
        Pendiente
      </Text>
    </View>
  );
}
