import { TouchableOpacity } from 'react-native';
import { LogOut } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';

interface AdminSettingsLogoutButtonProps {
  onLogout: () => void;
}

export function AdminSettingsLogoutButton({ onLogout }: AdminSettingsLogoutButtonProps) {
  return (
    <TouchableOpacity
      onPress={onLogout}
      className="flex-row items-center justify-center gap-2 rounded-xl border border-destructive bg-destructive/5 p-4"
    >
      <LogOut size={20} className="text-destructive" />
      <Text variant="body" className="font-semibold text-destructive">
        Cerrar sesion
      </Text>
    </TouchableOpacity>
  );
}
