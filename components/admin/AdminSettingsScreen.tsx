import { View } from 'react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { AdminSettingsAccountCard } from '@/components/admin/settings/AdminSettingsAccountCard';
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
      {/* Hero profile section — full bleed, no card */}
      <AdminSettingsProfileCard user={settings.user} />

      <View className="flex-1 gap-6 px-4 pt-6 pb-8">
        {/* Account section */}
        {settings.canOpenStorefront && (
          <View className="gap-1.5">
            <Text variant="xs" className="px-1 font-semibold uppercase tracking-widest text-muted-foreground">
              Cuenta
            </Text>
            <AdminSettingsAccountCard onPress={settings.goToAccount} />
          </View>
        )}

        {/* Store section */}
        <View className="gap-1.5">
          <Text variant="xs" className="px-1 font-semibold uppercase tracking-widest text-muted-foreground">
            Tienda
          </Text>
          <AdminSettingsStoreCard settings={settings} />
          {settings.stores.length > 1 && <AdminSettingsStoreSelector settings={settings} />}
        </View>

        {/* Logout — separated, at bottom */}
        <AdminSettingsLogoutButton onLogout={settings.handleLogout} />
      </View>
    </ScreenWrapper>
  );
}
