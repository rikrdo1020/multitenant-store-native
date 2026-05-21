import { View } from 'react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { Button } from '@/components/ui/Button';
import { StorefrontScreenHeader } from '@/components/storefront/StorefrontScreenHeader';
import { Text } from '@/components/ui/Text';
import { useStoreHomeScreen } from '@/hooks/use-store-home-screen';

interface StoreHomeScreenContentProps {
  tenantSlug?: string;
}

export function StoreHomeScreenContent({ tenantSlug }: StoreHomeScreenContentProps) {
  const store = useStoreHomeScreen(tenantSlug);

  if (store.isLoading) return <LoadingScreen />;

  return (
    <ScreenWrapper>
      <StorefrontScreenHeader
        title={store.tenant?.name || 'Tienda'}
        subtitle="Vista publica de la tienda"
        onBack={store.canOpenAdminPanel ? store.goToAdminPanel : undefined}
        backAccessibilityLabel="Volver al panel de tienda"
      />
      <View className="gap-4 p-4">
        <Text variant="body">Bienvenido a nuestro catalogo</Text>
        <Button size="lg" onPress={store.goToProducts}>
          Ver productos
        </Button>
      </View>
    </ScreenWrapper>
  );
}
