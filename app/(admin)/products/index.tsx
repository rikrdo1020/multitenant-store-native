import { View } from 'react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Text } from '@/components/ui/Text';

export default function AdminProductsScreen() {
  return (
    <ScreenWrapper>
      <View className="p-4">
        <Text variant="h1">Productos</Text>
        <Text variant="body">Gestiona tu catálogo</Text>
      </View>
    </ScreenWrapper>
  );
}
