import { View } from 'react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Text } from '@/components/ui/Text';

export default function PaymentScreen() {
  return (
    <ScreenWrapper>
      <View className="p-4">
        <Text variant="h1">Pago</Text>
        <Text variant="body">Selecciona tu método de pago</Text>
      </View>
    </ScreenWrapper>
  );
}
