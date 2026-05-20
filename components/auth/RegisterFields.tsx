import { AuthControlledTextField } from '@/components/auth/AuthControlledTextField';
import { AuthPasswordToggle } from '@/components/auth/AuthPasswordToggle';
import type { useRegisterScreen } from '@/hooks/use-register-screen';

type RegisterViewModel = ReturnType<typeof useRegisterScreen>;

export function RegisterFields({ register }: { register: RegisterViewModel }) {
  const fieldProps = (field: string) => ({
    focused: register.focusedField === field,
    onBlur: () => register.setFocusedField(null),
    onFocus: () => register.setFocusedField(field),
  });

  return (
    <>
      <AuthControlledTextField control={register.control} name="name" label="Nombre completo" placeholder="Juan Garcia" error={register.errors.name?.message} autoCapitalize="words" {...fieldProps('name')} />
      <AuthControlledTextField control={register.control} name="email" label="Correo electronico" placeholder="tu@correo.com" error={register.errors.email?.message} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} {...fieldProps('email')} />
      <AuthControlledTextField control={register.control} name="phone" label="Telefono" placeholder="+507 6000-0000" error={register.errors.phone?.message} keyboardType="phone-pad" {...fieldProps('phone')} />
      <AuthControlledTextField
        control={register.control}
        name="password"
        label="Contrasena"
        placeholder="Minimo 6 caracteres"
        error={register.errors.password?.message}
        secureTextEntry={!register.showPassword}
        autoCapitalize="none"
        autoCorrect={false}
        rightElement={<AuthPasswordToggle isVisible={register.showPassword} onPress={() => register.setShowPassword((previous) => !previous)} />}
        {...fieldProps('password')}
      />
    </>
  );
}
