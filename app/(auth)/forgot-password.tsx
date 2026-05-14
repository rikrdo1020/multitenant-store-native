import { View } from 'react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Text } from '@/components/ui/Text';

export default function ForgotPasswordScreen() {
  return (
    <ScreenWrapper>
      <View className="flex-1 items-center justify-center px-6">
        <Text variant="h1">Recuperar contraseña</Text>
        <Text variant="body">Ingresa tu email para recibir instrucciones</Text>
      </View>
    </ScreenWrapper>
  );
}
