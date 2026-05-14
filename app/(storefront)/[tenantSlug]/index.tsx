import { View, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { Text } from '@/components/ui/Text';
import { useTenant } from '@/hooks/api/use-tenant';

export default function StoreHomeScreen() {
  const { tenantSlug } = useLocalSearchParams<{ tenantSlug: string }>();
  const { data: tenant, isLoading } = useTenant(tenantSlug);

  if (isLoading) return <LoadingScreen />;

  return (
    <ScreenWrapper>
      <View className="p-4 gap-4">
        <Text variant="h1">{tenant?.name || 'Tienda'}</Text>
        <Text variant="body">Bienvenido a nuestro catálogo</Text>

        {/* TODO: Featured products, categories grid */}
      </View>
    </ScreenWrapper>
  );
}
