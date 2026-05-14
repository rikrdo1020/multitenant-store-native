import { View } from 'react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Text } from '@/components/ui/Text';

export default function CustomersScreen() {
  return (
    <ScreenWrapper>
      <View className="p-4">
        <Text variant="h1">Clientes</Text>
      </View>
    </ScreenWrapper>
  );
}
