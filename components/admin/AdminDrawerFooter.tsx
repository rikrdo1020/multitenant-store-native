import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import type { AdminDrawerViewModel } from '@/hooks/use-admin-drawer-content';

interface AdminDrawerFooterProps {
  drawer: AdminDrawerViewModel;
}

export function AdminDrawerFooter({ drawer }: AdminDrawerFooterProps) {
  const name = drawer.user?.name ?? 'Usuario';
  const initial = name.charAt(0).toUpperCase();

  return (
    <View className="border-t border-border px-4 py-3">
      <View className="flex-row items-center gap-3">
        {/* Avatar initial */}
        <View className="h-8 w-8 items-center justify-center rounded-full bg-muted border border-border">
          <Text variant="xs" className="font-semibold text-foreground">
            {initial}
          </Text>
        </View>

        <View className="flex-1">
          <Text variant="small" className="font-medium text-foreground leading-tight">
            {name}
          </Text>
          {drawer.user?.email ? (
            <Text variant="xs" className="text-muted-foreground">
              {drawer.user.email}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}
