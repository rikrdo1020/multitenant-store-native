import { useState } from 'react';
import { View, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { registerSchema, type RegisterFormData } from '@/lib/validators';
import { register } from '@/services/auth';

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      await register(data);
      router.replace('/');
    } catch (error) {
      setError('root', { message: 'No fue posible crear la cuenta. Intentá de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const inputBorderClass = (field: string, hasError: boolean) => {
    if (hasError) return 'border-destructive';
    if (focusedField === field) return 'border-foreground';
    return 'border-border';
  };

  return (
    <ScreenWrapper scroll safeArea>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Back nav + index label */}
        <View className="flex-row items-center justify-between px-6 pt-8">
          <Pressable
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 0, right: 20 }}
            className="flex-row items-center gap-2"
          >
            <View className="w-4 h-[1.5px] bg-foreground" />
            <Text className="text-[11px] tracking-[0.18em] uppercase text-foreground font-medium">
              Volver
            </Text>
          </Pressable>
          <Text className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
            02 — Registro
          </Text>
        </View>

        {/* Header — stacked typographic block */}
        <View className="px-6 pt-8 pb-7">
          <Text
            className="text-[48px] font-bold leading-[1] tracking-[-0.03em] text-foreground"
          >
            {'Crear\ncuenta.'}
          </Text>
          <View className="flex-row items-center gap-3 mt-4">
            <View className="w-6 h-[1.5px] bg-foreground" />
            <Text className="text-sm text-muted-foreground">
              Completá tus datos para empezar
            </Text>
          </View>
        </View>

        {/* Fields */}
        <View className="px-6 gap-6 pb-4">

          {/* Name */}
          <View className="gap-2">
            <Text className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
              Nombre completo
            </Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className={`border-b-[1.5px] pb-2.5 ${inputBorderClass('name', !!errors.name)}`}>
                  <TextInput
                    className="text-[15px] text-foreground py-0 bg-transparent"
                    placeholder="Juan García"
                    placeholderTextColor="#b0b0b0"
                    autoCapitalize="words"
                    value={value}
                    onChangeText={onChange}
                    onBlur={() => { onBlur(); setFocusedField(null); }}
                    onFocus={() => setFocusedField('name')}
                  />
                </View>
              )}
            />
            {errors.name && (
              <Text className="text-[11px] text-destructive tracking-wide">{errors.name.message}</Text>
            )}
          </View>

          {/* Email */}
          <View className="gap-2">
            <Text className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
              Correo electrónico
            </Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className={`border-b-[1.5px] pb-2.5 ${inputBorderClass('email', !!errors.email)}`}>
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
              <Text className="text-[11px] text-destructive tracking-wide">{errors.email.message}</Text>
            )}
          </View>

          {/* Phone */}
          <View className="gap-2">
            <Text className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
              Teléfono
            </Text>
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className={`border-b-[1.5px] pb-2.5 ${inputBorderClass('phone', !!errors.phone)}`}>
                  <TextInput
                    className="text-[15px] text-foreground py-0 bg-transparent"
                    placeholder="+54 11 0000 0000"
                    placeholderTextColor="#b0b0b0"
                    keyboardType="phone-pad"
                    value={value}
                    onChangeText={onChange}
                    onBlur={() => { onBlur(); setFocusedField(null); }}
                    onFocus={() => setFocusedField('phone')}
                  />
                </View>
              )}
            />
            {errors.phone && (
              <Text className="text-[11px] text-destructive tracking-wide">{errors.phone.message}</Text>
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
                <View className={`border-b-[1.5px] pb-2.5 flex-row items-center ${inputBorderClass('password', !!errors.password)}`}>
                  <TextInput
                    className="flex-1 text-[15px] text-foreground py-0 bg-transparent"
                    placeholder="Mínimo 6 caracteres"
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
              <Text className="text-[11px] text-destructive tracking-wide">{errors.password.message}</Text>
            )}
          </View>

          {/* Root error */}
          {errors.root && (
            <View className="border-l-2 border-destructive pl-4 py-1">
              <Text className="text-sm text-destructive">{errors.root.message}</Text>
            </View>
          )}

          {/* CTA */}
          <View className="pt-1 pb-2">
            <Button
              size="lg"
              loading={loading}
              onPress={handleSubmit(onSubmit)}
              className="rounded-sm"
            >
              Crear cuenta
            </Button>
          </View>

          {/* Terms footnote — small, left-aligned */}
          <Text className="text-[11px] text-muted-foreground leading-5 tracking-wide pb-2">
            Al registrarte aceptás los Términos de Uso y la Política de Privacidad.
          </Text>
        </View>

        {/* Footer login link */}
        <View className="px-6 py-8 flex-row items-center gap-4">
          <View className="h-px flex-1 bg-border" />
          <Pressable onPress={() => router.push('/(auth)/login')}>
            <Text className="text-[13px] text-muted-foreground">
              ¿Ya tenés cuenta?{' '}
              <Text className="text-[13px] font-semibold text-foreground">
                Ingresá
              </Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
