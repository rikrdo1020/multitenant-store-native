import { View } from 'react-native';
import { Store } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { adminColors, adminIconSizes } from '@/lib/admin-theme';
import type { AdminDrawerViewModel } from '@/hooks/use-admin-drawer-content';

interface AdminDrawerTenantCardProps {
  drawer: AdminDrawerViewModel;
}

export function AdminDrawerTenantCard({ drawer }: AdminDrawerTenantCardProps) {
  const name = drawer.tenant?.name ?? 'Sin tienda';
  const initial = name.charAt(0).toUpperCase();

  return (
    <View className="mx-3 mt-3 rounded-xl border border-border bg-card px-3 py-3">
      <View className="flex-row items-center gap-3">
        {/* Store avatar with initial */}
        <View className="h-9 w-9 items-center justify-center rounded-lg bg-foreground">
          <Text variant="small" className="font-bold text-background">
            {initial}
          </Text>
        </View>

        <View className="flex-1">
          <Text variant="small" className="font-semibold text-foreground leading-tight">
            {name}
          </Text>
          {drawer.tenant?.slug ? (
            <Text variant="xs" className="text-muted-foreground">
              {drawer.tenant.slug}
            </Text>
          ) : (
            <Text variant="xs" className="text-muted-foreground">
              Sin tienda activa
            </Text>
          )}
        </View>

        <Store size={adminIconSizes.sm} color={adminColors.mutedForeground} />
      </View>
    </View>
  );
}
