import { Pressable, View } from 'react-native';
import { AuthControlledTextField } from '@/components/auth/AuthControlledTextField';
import { AuthPasswordToggle } from '@/components/auth/AuthPasswordToggle';
import { Text } from '@/components/ui/Text';
import type { useLoginScreen } from '@/hooks/use-login-screen';

type LoginViewModel = ReturnType<typeof useLoginScreen>;

export function LoginFields({ login }: { login: LoginViewModel }) {
  return (
    <>
      <AuthControlledTextField
        control={login.control}
        name="email"
        label="Correo electronico"
        placeholder="tu@correo.com"
        error={login.errors.email?.message}
        focused={login.focusedField === 'email'}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        onFocus={() => login.setFocusedField('email')}
        onBlur={() => login.setFocusedField(null)}
      />
      <AuthControlledTextField
        control={login.control}
        name="password"
        label="Contrasena"
        placeholder="********"
        error={login.errors.password?.message}
        focused={login.focusedField === 'password'}
        secureTextEntry={!login.showPassword}
        autoCapitalize="none"
        autoCorrect={false}
        rightElement={<AuthPasswordToggle isVisible={login.showPassword} onPress={() => login.setShowPassword((previous) => !previous)} />}
        onFocus={() => login.setFocusedField('password')}
        onBlur={() => login.setFocusedField(null)}
      />
      <View className="-mt-2 flex-row justify-end">
        <Pressable onPress={login.goToForgotPassword} accessibilityRole="button">
          <Text className="text-[11px] tracking-wide text-muted-foreground underline">
            Olvide mi contrasena
          </Text>
        </Pressable>
      </View>
    </>
  );
}
