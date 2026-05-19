import { Pressable, View } from 'react-native';
import { Pencil, UserRound } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import type { CustomerProfile } from '@/types';

interface AccountProfilePanelProps {
  profile?: CustomerProfile;
  fallbackUserName: string;
  fallbackEmail?: string;
  onEdit: () => void;
}

export function AccountProfilePanel({
  profile,
  fallbackUserName,
  fallbackEmail,
  onEdit,
}: AccountProfilePanelProps) {
  const displayName = profile?.name?.trim() || fallbackUserName;
  const displayEmail = profile?.email || fallbackEmail;
  const displayPhone = profile?.phone?.trim() || 'Completa tu telefono';

  return (
    <View className="gap-4 rounded-lg border border-border bg-card p-5">
      <View className="flex-row items-start justify-between gap-4">
        <View className="min-w-0 flex-1 flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-muted">
            <UserRound size={22} color="#171717" />
          </View>
          <View className="min-w-0 flex-1">
            <Text className="font-semibold" numberOfLines={1}>
              {displayName}
            </Text>
            <Text variant="small" numberOfLines={1}>
              {displayEmail}
            </Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Editar perfil"
          hitSlop={10}
          onPress={onEdit}
        >
          <Pencil size={18} color="#171717" />
        </Pressable>
      </View>

      <View className="gap-2 rounded-md bg-muted p-3">
        <Text variant="xs" className="font-semibold uppercase">
          Telefono
        </Text>
        <Text className="font-medium">{displayPhone}</Text>
      </View>
    </View>
  );
}
