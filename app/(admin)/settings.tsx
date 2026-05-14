import { View } from 'react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Text } from '@/components/ui/Text';

export default function SettingsScreen() {
  return (
    <ScreenWrapper>
      <View className="p-4">
        <Text variant="h1">Configuración</Text>
      </View>
    </ScreenWrapper>
  );
}
