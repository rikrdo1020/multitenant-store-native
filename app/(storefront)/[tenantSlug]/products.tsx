import { View } from 'react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Text } from '@/components/ui/Text';

export default function ProductsScreen() {
  return (
    <ScreenWrapper>
      <View className="p-4">
        <Text variant="h1">Catálogo</Text>
        <Text variant="body">Lista de productos</Text>
      </View>
    </ScreenWrapper>
  );
}
