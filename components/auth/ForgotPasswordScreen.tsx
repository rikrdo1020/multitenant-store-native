import { useState } from 'react';
import { View, TextInput, Pressable, Platform, type TextStyle } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { AuthScreenFrame } from '@/components/auth/AuthScreenFrame';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validators';
import { getAuthErrorMessage, requestPasswordReset } from '@/services/auth';

type ScreenState = 'idle' | 'sent';

const webTextInputFocusStyle = Platform.OS === 'web'
  ? ({ outlineStyle: 'none' } as unknown as TextStyle)
  : undefined;

export function ForgotPasswordScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [screenState, setScreenState] = useState<ScreenState>('idle');
  const [sentEmail, setSentEmail] = useState('');

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      clearErrors('root');
      await requestPasswordReset(data.email);
      setSentEmail(data.email);
      setScreenState('sent');
    } catch (error) {
      setError('root', {
        message: getAuthErrorMessage(error, 'No pudimos procesar la solicitud. Intenta de nuevo.'),
      });
    } finally {
      setLoading(false);
    }
  };

  if (screenState === 'sent') {
    return (
      <AuthScreenFrame scroll={false}>
        <View className="px-6 pt-8">
          <Pressable
            onPress={() => router.push('/(auth)/login')}
            hitSlop={{ top: 10, bottom: 10, left: 0, right: 20 }}
            className="flex-row items-center gap-2 self-start"
            accessibilityRole="button"
            accessibilityLabel="Volver al inicio de sesion"
          >
            <View className="w-4 h-[1.5px] bg-foreground" />
            <Text className="text-[11px] tracking-[0.18em] uppercase text-foreground font-medium">
              Volver
            </Text>
          </Pressable>
        </View>

        <View className="flex-1 justify-end px-6 pb-16">
          <Text className="text-[96px] font-bold leading-none text-secondary-foreground/20 select-none">
            OK
          </Text>

          <View className="mt-6 gap-4">
            <Text className="text-[40px] font-bold leading-[1.05] text-foreground">
              {'Revisa\ntu correo.'}
            </Text>

            <View className="flex-row items-start gap-3 mt-2">
              <View className="w-6 h-[1.5px] bg-foreground mt-3" />
              <Text className="text-sm text-muted-foreground flex-1 leading-6">
                Enviamos las instrucciones a{' '}
                <Text className="text-sm font-semibold text-foreground">{sentEmail}</Text>.
              </Text>
            </View>

            <View className="pt-6">
              <Button
                variant="outline"
                size="lg"
                onPress={() => router.push('/(auth)/login')}
                className="rounded-sm"
                accessibilityLabel="Volver al inicio de sesion"
              >
                Volver al inicio
              </Button>
            </View>
          </View>
        </View>
      </AuthScreenFrame>
    );
  }

  return (
    <AuthScreenFrame>
      <View className="flex-row items-center justify-between px-6 pt-8">
        <Pressable
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 0, right: 20 }}
          className="flex-row items-center gap-2"
          accessibilityRole="button"
          accessibilityLabel="Volver"
        >
          <View className="w-4 h-[1.5px] bg-foreground" />
          <Text className="text-[11px] tracking-[0.18em] uppercase text-foreground font-medium">
            Volver
          </Text>
        </Pressable>
        <Text className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
          03 - Recuperar
        </Text>
      </View>

      <View className="px-6 pt-8 pb-8">
        <Text className="text-[48px] font-bold leading-[1] text-foreground">
          {'Recuperar\ncontrasena.'}
        </Text>
        <View className="flex-row items-center gap-3 mt-5">
          <View className="w-6 h-[1.5px] bg-foreground" />
          <Text className="text-sm text-muted-foreground flex-1 leading-5">
            Te enviamos un enlace para crear una nueva contrasena.
          </Text>
        </View>
      </View>

      <View className="px-6 gap-6 flex-1">
        <View className="gap-2">
          <Text className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
            Correo electronico
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
                  className="text-[15px] text-foreground py-0 bg-transparent outline-none"
                  style={webTextInputFocusStyle}
                  placeholder="tu@correo.com"
                  placeholderTextColor="#b0b0b0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={value}
                  onChangeText={onChange}
                  onBlur={() => {
                    onBlur();
                    setFocusedField(null);
                  }}
                  onFocus={() => setFocusedField('email')}
                  accessibilityLabel="Correo electronico"
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

        {errors.root && (
          <View className="border-l-2 border-destructive pl-4 py-1">
            <Text className="text-sm text-destructive">{errors.root.message}</Text>
          </View>
        )}

        <View className="pt-1">
          <Button
            size="lg"
            loading={loading}
            onPress={handleSubmit(onSubmit)}
            className="rounded-sm"
            accessibilityLabel="Enviar instrucciones de recuperacion"
          >
            Enviar instrucciones
          </Button>
        </View>

        <Text className="text-[11px] text-muted-foreground leading-5 tracking-wide">
          Revisa tambien la carpeta de spam si no recibes el correo en unos minutos.
        </Text>
      </View>

      <View className="px-6 py-10 flex-row items-center gap-4">
        <View className="h-px flex-1 bg-border" />
        <Pressable
          onPress={() => router.push('/(auth)/login')}
          accessibilityRole="button"
          accessibilityLabel="Recorde mi contrasena"
        >
          <Text className="text-[13px] text-muted-foreground">
            Recorde mi contrasena.{' '}
            <Text className="text-[13px] font-semibold text-foreground">
              Ingresar
            </Text>
          </Text>
        </Pressable>
      </View>
    </AuthScreenFrame>
  );
}
