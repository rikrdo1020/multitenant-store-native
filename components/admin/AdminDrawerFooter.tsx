import { TouchableOpacity, View } from 'react-native';
import { LogOut } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import type { AdminDrawerViewModel } from '@/hooks/use-admin-drawer-content';

interface AdminDrawerFooterProps {
  drawer: AdminDrawerViewModel;
}

export function AdminDrawerFooter({ drawer }: AdminDrawerFooterProps) {
  return (
    <View className="border-t border-border px-4 py-3">
      <Text variant="small" className="mb-2 text-muted-foreground">
        {drawer.user?.name ?? 'Usuario'}
      </Text>
      <TouchableOpacity
        onPress={drawer.handleLogout}
        className="flex-row items-center gap-2 rounded-md bg-destructive/5 px-3 py-2"
      >
        <LogOut size={18} className="text-destructive" />
        <Text variant="body" className="font-medium text-destructive">
          Cerrar sesion
        </Text>
      </TouchableOpacity>
    </View>
  );
}
