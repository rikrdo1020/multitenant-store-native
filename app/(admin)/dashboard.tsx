import { View } from 'react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Text } from '@/components/ui/Text';

export default function DashboardScreen() {
  return (
    <ScreenWrapper>
      <View className="p-4 gap-4">
        <Text variant="h1">Dashboard</Text>
        <Text variant="body">Resumen de tu tienda</Text>

        {/* TODO: Stats cards, recent orders, low stock alerts */}
      </View>
    </ScreenWrapper>
  );
}
