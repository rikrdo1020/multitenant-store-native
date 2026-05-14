import { useState } from 'react';
import { View, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { z } from 'zod';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

type ScreenState = 'idle' | 'sent';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [screenState, setScreenState] = useState<ScreenState>('idle');

  const {
    control,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (_data: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      // TODO: call forgot-password API endpoint
      // await requestPasswordReset(data.email);
      await new Promise((r) => setTimeout(r, 800)); // placeholder delay
      setScreenState('sent');
    } catch (error) {
      setError('root', { message: 'No pudimos procesar la solicitud. Intentá de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  /* ── Confirmation state ────────────────────────────────── */
  if (screenState === 'sent') {
    return (
      <ScreenWrapper safeArea>
        {/* Back nav */}
        <View className="px-6 pt-8">
          <Pressable
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 0, right: 20 }}
            className="flex-row items-center gap-2 self-start"
          >
            <View className="w-4 h-[1.5px] bg-foreground" />
            <Text className="text-[11px] tracking-[0.18em] uppercase text-foreground font-medium">
              Volver
            </Text>
          </Pressable>
        </View>

        <View className="flex-1 justify-end px-6 pb-16">
          {/* Large status indicator — number-style */}
          <Text className="text-[100px] font-bold leading-none tracking-[-0.05em] text-secondary-foreground/20 select-none">
            ✓
          </Text>

          <View className="mt-6 gap-4">
            <Text className="text-[40px] font-bold leading-[1.05] tracking-[-0.03em] text-foreground">
              {'Revisá\ntu correo.'}
            </Text>

            <View className="flex-row items-start gap-3 mt-2">
              <View className="w-6 h-[1.5px] bg-foreground mt-3" />
              <Text className="text-sm text-muted-foreground flex-1 leading-6">
                Si <Text className="text-sm font-semibold text-foreground">{getValues('email')}</Text> está registrado, vas a recibir las instrucciones para restablecer tu contraseña.
              </Text>
            </View>

            <View className="pt-6">
              <Button
                variant="outline"
                size="lg"
                onPress={() => router.push('/(auth)/login')}
                className="rounded-sm"
              >
                Volver al inicio
              </Button>
            </View>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  /* ── Default form state ────────────────────────────────── */
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
            03 — Recuperar
          </Text>
        </View>

        {/* Header */}
        <View className="px-6 pt-8 pb-8">
          <Text className="text-[48px] font-bold leading-[1] tracking-[-0.03em] text-foreground">
            {'Recuperar\ncontraseña.'}
          </Text>
          <View className="flex-row items-center gap-3 mt-5">
            <View className="w-6 h-[1.5px] bg-foreground" />
            <Text className="text-sm text-muted-foreground flex-1 leading-5">
              Te enviamos un enlace para que puedas crear una nueva
            </Text>
          </View>
        </View>

        {/* Form */}
        <View className="px-6 gap-6 flex-1">

          {/* Email field */}
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

          {/* Root error */}
          {errors.root && (
            <View className="border-l-2 border-destructive pl-4 py-1">
              <Text className="text-sm text-destructive">{errors.root.message}</Text>
            </View>
          )}

          {/* CTA */}
          <View className="pt-1">
            <Button
              size="lg"
              loading={loading}
              onPress={handleSubmit(onSubmit)}
              className="rounded-sm"
            >
              Enviar instrucciones
            </Button>
          </View>

          {/* Footnote */}
          <Text className="text-[11px] text-muted-foreground leading-5 tracking-wide">
            Revisá también la carpeta de spam si no recibís el correo en unos minutos.
          </Text>
        </View>

        {/* Footer spacer */}
        <View className="px-6 py-10 flex-row items-center gap-4">
          <View className="h-px flex-1 bg-border" />
          <Pressable onPress={() => router.push('/(auth)/login')}>
            <Text className="text-[13px] text-muted-foreground">
              Recordé mi contraseña.{' '}
              <Text className="text-[13px] font-semibold text-foreground">
                Ingresar
              </Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
