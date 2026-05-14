import { View } from 'react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Text } from '@/components/ui/Text';

export default function AdminOrdersScreen() {
  return (
    <ScreenWrapper>
      <View className="p-4">
        <Text variant="h1">Pedidos</Text>
        <Text variant="body">Gestiona los pedidos de tu tienda</Text>
      </View>
    </ScreenWrapper>
  );
}
