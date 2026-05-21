import { View } from 'react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { AdminSettingsLogoutButton } from '@/components/admin/settings/AdminSettingsLogoutButton';
import { AdminSettingsProfileCard } from '@/components/admin/settings/AdminSettingsProfileCard';
import { AdminSettingsStoreCard } from '@/components/admin/settings/AdminSettingsStoreCard';
import { AdminSettingsStoreSelector } from '@/components/admin/settings/AdminSettingsStoreSelector';
import { Text } from '@/components/ui/Text';
import { useAdminSettingsScreen } from '@/hooks/use-admin-settings-screen';

export function AdminSettingsScreen() {
  const settings = useAdminSettingsScreen();

  return (
    <ScreenWrapper scroll>
      <View className="flex-1 gap-5 p-4">
        <Text variant="h1">Configuracion</Text>
        <AdminSettingsProfileCard user={settings.user} />
        <AdminSettingsStoreCard settings={settings} />
        {settings.stores.length > 1 && <AdminSettingsStoreSelector settings={settings} />}
        <AdminSettingsLogoutButton onLogout={settings.handleLogout} />
      </View>
    </ScreenWrapper>
  );
}
