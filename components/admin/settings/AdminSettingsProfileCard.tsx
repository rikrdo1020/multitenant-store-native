import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import type { User as UserModel } from '@/types';

interface AdminSettingsProfileCardProps {
  user: UserModel | null;
}

export function AdminSettingsProfileCard({ user }: AdminSettingsProfileCardProps) {
  const name = user?.name ?? 'Usuario';
  const initial = name.charAt(0).toUpperCase();
  const role = user?.role ?? null;

  return (
    <View className="bg-foreground px-5 pt-8 pb-7">
      {/* Large avatar */}
      <View className="h-16 w-16 items-center justify-center rounded-2xl bg-background mb-4">
        <Text variant="h2" className="font-bold text-foreground">
          {initial}
        </Text>
      </View>

      <Text variant="h2" className="font-bold text-background leading-tight">
        {name}
      </Text>

      {user?.email ? (
        <Text variant="small" className="mt-0.5 text-muted-foreground">
          {user.email}
        </Text>
      ) : null}

      {role ? (
        <View className="mt-3 self-start rounded-md border border-border/20 bg-background/10 px-2.5 py-1">
          <Text variant="xs" className="font-semibold uppercase tracking-wider text-background/70">
            {role}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
