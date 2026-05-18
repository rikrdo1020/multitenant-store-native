import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTenant } from '@/hooks/api/use-tenant';

export default function StoreHomeScreen() {
  const { tenantSlug } = useLocalSearchParams<{ tenantSlug: string }>();
  const router = useRouter();
  const { data: tenant, isLoading } = useTenant(tenantSlug);

  if (isLoading) return <LoadingScreen />;

  return (
    <ScreenWrapper>
      <View className="p-4 gap-4">
        <Text variant="h1">{tenant?.name || 'Tienda'}</Text>
        <Text variant="body">Bienvenido a nuestro catálogo</Text>

        <Button
          size="lg"
          onPress={() => router.push(`/(storefront)/${tenantSlug}/products` as never)}
        >
          Ver productos
        </Button>
      </View>
    </ScreenWrapper>
  );
}
