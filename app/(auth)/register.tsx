import { View } from 'react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Text } from '@/components/ui/Text';

export default function RegisterScreen() {
  return (
    <ScreenWrapper>
      <View className="flex-1 items-center justify-center px-6">
        <Text variant="h1">Crear cuenta</Text>
        <Text variant="body">Registro de nuevo usuario</Text>
      </View>
    </ScreenWrapper>
  );
}
