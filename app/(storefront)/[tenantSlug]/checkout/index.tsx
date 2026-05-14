import { View } from 'react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Text } from '@/components/ui/Text';

export default function CheckoutShippingScreen() {
  return (
    <ScreenWrapper>
      <View className="p-4">
        <Text variant="h1">Datos de envío</Text>
        <Text variant="body">Completa tus datos</Text>
      </View>
    </ScreenWrapper>
  );
}
