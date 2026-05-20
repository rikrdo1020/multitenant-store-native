import { View } from 'react-native';
import { AuthFooterLink } from '@/components/auth/AuthFooterLink';
import { AuthHero } from '@/components/auth/AuthHero';
import { AuthPanelHeader } from '@/components/auth/AuthPanelHeader';
import { AuthScreenFrame } from '@/components/auth/AuthScreenFrame';
import { RegisterFields } from '@/components/auth/RegisterFields';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useRegisterScreen } from '@/hooks/use-register-screen';

export function RegisterScreen() {
  const register = useRegisterScreen();

  return (
    <AuthScreenFrame maxWidth={440}>
      <AuthPanelHeader stepLabel="02 - Registro" onBack={register.goBack} />
      <AuthHero title={'Crear\ncuenta.'} subtitle="Completa tus datos para empezar" />

      <View className="gap-6 px-6 pb-4">
        <RegisterFields register={register} />

        {register.errors.root ? (
          <View className="border-l-2 border-destructive py-1 pl-4">
            <Text className="text-sm text-destructive">{register.errors.root.message}</Text>
          </View>
        ) : null}

        <Button
          size="lg"
          loading={register.loading}
          onPress={register.submit}
          className="rounded-sm"
          accessibilityLabel="Crear cuenta"
        >
          Crear cuenta
        </Button>

        <Text className="pb-2 text-[11px] leading-5 tracking-wide text-muted-foreground">
          Al registrarte aceptas los Terminos de Uso y la Politica de Privacidad.
        </Text>
      </View>

      <AuthFooterLink
        prompt="Ya tienes cuenta?"
        actionLabel="Ingresa"
        accessibilityLabel="Ir al inicio de sesion"
        onPress={register.goToLogin}
      />
    </AuthScreenFrame>
  );
}
