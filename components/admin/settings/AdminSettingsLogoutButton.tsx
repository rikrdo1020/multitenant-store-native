import { TouchableOpacity, View } from 'react-native';
import { LogOut } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { adminColors } from '@/lib/admin-theme';

interface AdminSettingsLogoutButtonProps {
  onLogout: () => void;
}

export function AdminSettingsLogoutButton({ onLogout }: AdminSettingsLogoutButtonProps) {
  return (
    <TouchableOpacity
      onPress={onLogout}
      activeOpacity={0.7}
      className="flex-row items-center gap-3 rounded-xl px-4 py-3"
    >
      <View className="h-8 w-8 items-center justify-center rounded-lg bg-destructive/8">
        <LogOut size={16} color={adminColors.destructive} />
      </View>
      <Text variant="small" className="font-medium text-destructive">
        Cerrar sesion
      </Text>
    </TouchableOpacity>
  );
}
