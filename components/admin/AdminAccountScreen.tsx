import { View } from 'react-native';
import { AdminAccountHeader } from '@/components/admin/AdminAccountHeader';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { AccountScreenContent } from '@/components/storefront/AccountScreenContent';
import { Text } from '@/components/ui/Text';
import { useAdminAccountScreen } from '@/hooks/use-admin-account-screen';

export function AdminAccountScreen() {
  const { tenantSlug } = useAdminAccountScreen();

  if (!tenantSlug) {
    return (
      <ScreenWrapper safeArea={false}>
        <View className="flex-1 justify-center gap-2 p-4">
          <Text variant="h2">Selecciona una tienda</Text>
          <Text variant="body" className="text-muted-foreground">
            Necesitas una tienda activa para revisar la cuenta asociada.
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <AccountScreenContent
      tenantSlug={tenantSlug}
      contentHeader={<AdminAccountHeader />}
      safeArea={false}
      showHeader={false}
    />
  );
}
