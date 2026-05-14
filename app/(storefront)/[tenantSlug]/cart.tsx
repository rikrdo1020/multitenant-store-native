import { View } from 'react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Text } from '@/components/ui/Text';

export default function CartScreen() {
  return (
    <ScreenWrapper>
      <View className="p-4">
        <Text variant="h1">Carrito</Text>
        <Text variant="body">Tus productos seleccionados</Text>
      </View>
    </ScreenWrapper>
  );
}
