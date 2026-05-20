import { View } from 'react-native';
import { Pencil, Trash2 } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import type { TenantMember } from '@/types';

interface MemberActionsProps {
  member: TenantMember;
  currentUserId?: string;
  disabled: boolean;
  onEditRole: (member: TenantMember) => void;
  onRemove: (member: TenantMember) => void;
}

export function MemberActions({
  member,
  currentUserId,
  disabled,
  onEditRole,
  onRemove,
}: MemberActionsProps) {
  const isSelf = currentUserId === member.user.documentId;
  const protectedMember = member.role === 'superadmin' || isSelf;

  return (
    <View className="flex-row flex-wrap gap-2">
      <Button
        size="sm"
        variant="outline"
        disabled={disabled || protectedMember}
        onPress={() => onEditRole(member)}
      >
        <View className="flex-row items-center gap-1">
          <Pencil size={14} className="text-foreground" />
          <Text className="text-sm font-semibold text-foreground">Rol</Text>
        </View>
      </Button>
      <Button
        size="sm"
        variant="destructive"
        disabled={disabled || protectedMember}
        onPress={() => onRemove(member)}
      >
        <View className="flex-row items-center gap-1">
          <Trash2 size={14} color="#ffffff" />
          <Text className="text-sm font-semibold text-destructive-foreground">
            Eliminar
          </Text>
        </View>
      </Button>
    </View>
  );
}
