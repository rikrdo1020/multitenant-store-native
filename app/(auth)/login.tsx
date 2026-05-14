import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { loginSchema, type LoginFormData } from '@/lib/validators';
import { login } from '@/services/auth';

export default function LoginScreen() {
  const router = useRouter();
  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      router.replace('/');
    } catch (error) {
      // Error handled by API interceptor
    }
  };

  return (
    <ScreenWrapper>
      <View className="flex-1 justify-center px-6 gap-6">
        <View className="gap-2">
          <Text variant="h1">Iniciar sesión</Text>
          <Text variant="small">Ingresa tus credenciales para continuar</Text>
        </View>

        {/* TODO: Add FormField components for email/password */}
        <Button onPress={handleSubmit(onSubmit)}>Ingresar</Button>

        <Button variant="ghost" onPress={() => router.push('/(auth)/register')}>
          <Text>¿No tienes cuenta? Regístrate</Text>
        </Button>
      </View>
    </ScreenWrapper>
  );
}
