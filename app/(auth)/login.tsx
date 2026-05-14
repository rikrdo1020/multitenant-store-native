import { useState } from 'react';
import { View, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { loginSchema, type LoginFormData } from '@/lib/validators';
import { login } from '@/services/auth';

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      await login(data.email, data.password);
      router.replace('/');
    } catch (error) {
      setError('root', { message: 'Credenciales incorrectas. Intentá de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper scroll safeArea>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Index label strip — top edge */}
        <View className="flex-row items-center px-6 pt-8 gap-3">
          <View className="h-px flex-1 bg-border" />
          <Text className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">
            01 — Acceso
          </Text>
        </View>

        {/* Large typographic header — left-anchored, deliberately heavy */}
        <View className="px-6 pt-10 pb-8">
          <Text
            className="text-[52px] font-bold leading-[1] tracking-[-0.03em] text-foreground"
          >
            {'Hola,\nbienvenido.'}
          </Text>
          <View className="flex-row items-center gap-3 mt-5">
            <View className="w-6 h-[1.5px] bg-foreground" />
            <Text className="text-sm text-muted-foreground tracking-wide">
              Ingresá tus datos para continuar
            </Text>
          </View>
        </View>

        {/* Form block */}
        <View className="px-6 gap-6 flex-1">

          {/* Email */}
          <View className="gap-2">
            <Text className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
              Correo electrónico
            </Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  className={`border-b-[1.5px] pb-2.5 ${
                    errors.email
                      ? 'border-destructive'
                      : focusedField === 'email'
                      ? 'border-foreground'
                      : 'border-border'
                  }`}
                >
                  <TextInput
                    className="text-[15px] text-foreground py-0 bg-transparent"
                    placeholder="tu@correo.com"
                    placeholderTextColor="#b0b0b0"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onChangeText={onChange}
                    onBlur={() => { onBlur(); setFocusedField(null); }}
                    onFocus={() => setFocusedField('email')}
                  />
                </View>
              )}
            />
            {errors.email && (
              <Text className="text-[11px] text-destructive tracking-wide">
                {errors.email.message}
              </Text>
            )}
          </View>

          {/* Password */}
          <View className="gap-2">
            <Text className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
              Contraseña
            </Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  className={`border-b-[1.5px] pb-2.5 flex-row items-center ${
                    errors.password
                      ? 'border-destructive'
                      : focusedField === 'password'
                      ? 'border-foreground'
                      : 'border-border'
                  }`}
                >
                  <TextInput
                    className="flex-1 text-[15px] text-foreground py-0 bg-transparent"
                    placeholder="••••••••"
                    placeholderTextColor="#b0b0b0"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onChangeText={onChange}
                    onBlur={() => { onBlur(); setFocusedField(null); }}
                    onFocus={() => setFocusedField('password')}
                  />
                  <Pressable
                    onPress={() => setShowPassword((p) => !p)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text className="text-[10px] tracking-[0.15em] text-muted-foreground font-medium">
                      {showPassword ? 'OCULTAR' : 'MOSTRAR'}
                    </Text>
                  </Pressable>
                </View>
              )}
            />
            {errors.password && (
              <Text className="text-[11px] text-destructive tracking-wide">
                {errors.password.message}
              </Text>
            )}
          </View>

          {/* Forgot password — right-flush */}
          <View className="flex-row justify-end -mt-2">
            <Pressable
              onPress={() => router.push('/(auth)/forgot-password')}
              hitSlop={{ top: 8, bottom: 8, left: 12, right: 0 }}
            >
              <Text className="text-[11px] text-muted-foreground underline tracking-wide">
                Olvidé mi contraseña
              </Text>
            </Pressable>
          </View>

          {/* Root error banner */}
          {errors.root && (
            <View className="border-l-2 border-destructive pl-4 py-1">
              <Text className="text-sm text-destructive">{errors.root.message}</Text>
            </View>
          )}

          {/* CTA */}
          <View className="gap-3 pt-1">
            <Button
              size="lg"
              loading={loading}
              onPress={handleSubmit(onSubmit)}
              className="rounded-sm"
            >
              Ingresar
            </Button>
          </View>
        </View>

        {/* Footer register link — bottom anchor, non-centered */}
        <View className="px-6 py-10 flex-row items-center gap-4">
          <View className="h-px flex-1 bg-border" />
          <Pressable onPress={() => router.push('/(auth)/register')}>
            <Text className="text-[13px] text-muted-foreground">
              ¿Sin cuenta?{' '}
              <Text className="text-[13px] font-semibold text-foreground">
                Registrate
              </Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
