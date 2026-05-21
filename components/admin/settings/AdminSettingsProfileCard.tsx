import { View } from 'react-native';
import { User } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import type { User as UserModel } from '@/types';

interface AdminSettingsProfileCardProps {
  user: UserModel | null;
}

export function AdminSettingsProfileCard({ user }: AdminSettingsProfileCardProps) {
  return (
    <View className="rounded-xl border border-border bg-card p-4">
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <User size={24} className="text-primary" />
        </View>
        <View className="flex-1">
          <Text variant="body" className="font-semibold text-foreground">
            {user?.name ?? 'Usuario'}
          </Text>
          <Text variant="small" className="text-muted-foreground">
            {user?.email ?? ''}
          </Text>
        </View>
      </View>
      <Text variant="xs" className="mt-2 text-muted-foreground">
        Rol: {user?.role ?? 'N/A'}
      </Text>
    </View>
  );
}
