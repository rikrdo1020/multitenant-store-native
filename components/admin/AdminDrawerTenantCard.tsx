import { View } from 'react-native';
import { Store } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import type { AdminDrawerViewModel } from '@/hooks/use-admin-drawer-content';

interface AdminDrawerTenantCardProps {
  drawer: AdminDrawerViewModel;
}

export function AdminDrawerTenantCard({ drawer }: AdminDrawerTenantCardProps) {
  return (
    <View className="mx-3 mt-3 gap-3 rounded-lg bg-muted px-3 py-3">
      <View className="flex-row items-center gap-2">
        <Store size={16} className="text-muted-foreground" />
        <Text variant="small" className="font-medium text-foreground">
          {drawer.tenant?.name ?? 'Sin tienda'}
        </Text>
      </View>
      {drawer.tenant?.slug && (
        <Text variant="xs" className="ml-6 text-muted-foreground">
          {drawer.tenant.slug}
        </Text>
      )}
    </View>
  );
}
