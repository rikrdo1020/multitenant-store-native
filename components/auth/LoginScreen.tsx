import { View } from 'react-native';
import { AuthFooterLink } from '@/components/auth/AuthFooterLink';
import { AuthHero } from '@/components/auth/AuthHero';
import { LoginFields } from '@/components/auth/LoginFields';
import { AuthPanelHeader } from '@/components/auth/AuthPanelHeader';
import { AuthScreenFrame } from '@/components/auth/AuthScreenFrame';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useLoginScreen } from '@/hooks/use-login-screen';

export function LoginScreen() {
  const login = useLoginScreen();

  return (
    <AuthScreenFrame>
      <AuthPanelHeader stepLabel="01 - Acceso" />
      <AuthHero title={'Hola,\nbienvenido.'} subtitle="Ingresa tus datos para continuar" />

      <View className="flex-1 gap-6 px-6">
        <LoginFields login={login} />
        {login.errors.root ? (
          <View className="border-l-2 border-destructive py-1 pl-4">
            <Text className="text-sm text-destructive">{login.errors.root.message}</Text>
          </View>
        ) : null}

        <Button
          size="lg"
          loading={login.loading}
          onPress={login.submit}
          className="rounded-sm"
          accessibilityLabel="Ingresar"
        >
          Ingresar
        </Button>
      </View>

      <AuthFooterLink
        prompt="Sin cuenta?"
        actionLabel="Registrate"
        accessibilityLabel="Registrarse"
        onPress={login.goToRegister}
      />
    </AuthScreenFrame>
  );
}
