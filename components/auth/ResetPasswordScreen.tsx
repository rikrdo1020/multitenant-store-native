import { useState } from 'react';
import { View, TextInput, Pressable, Platform, type TextStyle } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { AuthScreenFrame } from '@/components/auth/AuthScreenFrame';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validators';
import { getAuthErrorMessage, resetPassword } from '@/services/auth';

type ScreenState = 'form' | 'success';

const webTextInputFocusStyle = Platform.OS === 'web'
  ? ({ outlineStyle: 'none' } as unknown as TextStyle)
  : undefined;

interface ResetPasswordScreenProps {
  token: string;
}

export function ResetPasswordScreen({ token }: ResetPasswordScreenProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [screenState, setScreenState] = useState<ScreenState>('form');

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const inputBorderClass = (field: string, hasError: boolean) => {
    if (hasError) return 'border-destructive';
    if (focusedField === field) return 'border-foreground';
    return 'border-border';
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError('root', { message: 'El enlace no incluye un token valido.' });
      return;
    }

    try {
      setLoading(true);
      clearErrors('root');
      await resetPassword(token, data.password);
      setScreenState('success');
    } catch (error) {
      setError('root', {
        message: getAuthErrorMessage(error, 'No pudimos actualizar la contrasena. Intenta de nuevo.'),
      });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthScreenFrame scroll={false}>
        <View className="px-6 pt-8">
          <Pressable
            onPress={() => router.push('/(auth)/forgot-password')}
            hitSlop={{ top: 10, bottom: 10, left: 0, right: 20 }}
            className="flex-row items-center gap-2 self-start"
            accessibilityRole="button"
            accessibilityLabel="Solicitar nuevo enlace"
          >
            <View className="w-4 h-[1.5px] bg-foreground" />
            <Text className="text-[11px] tracking-[0.18em] uppercase text-foreground font-medium">
              Nuevo enlace
            </Text>
          </Pressable>
        </View>

        <View className="flex-1 justify-end px-6 pb-16">
          <Text className="text-[96px] font-bold leading-none text-secondary-foreground/20 select-none">
            404
          </Text>
          <View className="mt-6 gap-4">
            <Text className="text-[40px] font-bold leading-[1.05] text-foreground">
              {'Enlace\ninvalido.'}
            </Text>
            <View className="flex-row items-start gap-3 mt-2">
              <View className="w-6 h-[1.5px] bg-foreground mt-3" />
              <Text className="text-sm text-muted-foreground flex-1 leading-6">
                Abre el enlace completo que recibiste por correo o solicita uno nuevo.
              </Text>
            </View>
            <View className="pt-6">
              <Button
                variant="outline"
                size="lg"
                onPress={() => router.push('/(auth)/forgot-password')}
                className="rounded-sm"
                accessibilityLabel="Solicitar nuevo enlace"
              >
                Solicitar nuevo enlace
              </Button>
            </View>
          </View>
        </View>
      </AuthScreenFrame>
    );
  }

  if (screenState === 'success') {
    return (
      <AuthScreenFrame scroll={false}>
        <View className="px-6 pt-8">
          <Pressable
            onPress={() => router.replace('/(auth)/login')}
            hitSlop={{ top: 10, bottom: 10, left: 0, right: 20 }}
            className="flex-row items-center gap-2 self-start"
            accessibilityRole="button"
            accessibilityLabel="Volver al inicio de sesion"
          >
            <View className="w-4 h-[1.5px] bg-foreground" />
            <Text className="text-[11px] tracking-[0.18em] uppercase text-foreground font-medium">
              Ingresar
            </Text>
          </Pressable>
        </View>

        <View className="flex-1 justify-end px-6 pb-16">
          <Text className="text-[96px] font-bold leading-none text-secondary-foreground/20 select-none">
            OK
          </Text>
          <View className="mt-6 gap-4">
            <Text className="text-[40px] font-bold leading-[1.05] text-foreground">
              {'Contrasena\nactualizada.'}
            </Text>
            <View className="flex-row items-start gap-3 mt-2">
              <View className="w-6 h-[1.5px] bg-foreground mt-3" />
              <Text className="text-sm text-muted-foreground flex-1 leading-6">
                Ya puedes iniciar sesion con tu nueva contrasena.
              </Text>
            </View>
            <View className="pt-6">
              <Button
                size="lg"
                onPress={() => router.replace('/(auth)/login')}
                className="rounded-sm"
                accessibilityLabel="Ir al inicio de sesion"
              >
                Ir al inicio
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
          onPress={() => router.push('/(auth)/login')}
          hitSlop={{ top: 10, bottom: 10, left: 0, right: 20 }}
          className="flex-row items-center gap-2"
          accessibilityRole="button"
          accessibilityLabel="Volver al inicio de sesion"
        >
          <View className="w-4 h-[1.5px] bg-foreground" />
          <Text className="text-[11px] tracking-[0.18em] uppercase text-foreground font-medium">
            Volver
          </Text>
        </Pressable>
        <Text className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
          04 - Reset
        </Text>
      </View>

      <View className="px-6 pt-8 pb-8">
        <Text className="text-[48px] font-bold leading-[1] text-foreground">
          {'Nueva\ncontrasena.'}
        </Text>
        <View className="flex-row items-center gap-3 mt-5">
          <View className="w-6 h-[1.5px] bg-foreground" />
          <Text className="text-sm text-muted-foreground flex-1 leading-5">
            Crea una contrasena segura para volver a entrar.
          </Text>
        </View>
      </View>

      <View className="px-6 gap-6 flex-1">
        <View className="gap-2">
          <Text className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
            Nueva contrasena
          </Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className={`border-b-[1.5px] pb-2.5 flex-row items-center ${inputBorderClass('password', !!errors.password)}`}>
                <TextInput
                  className="flex-1 text-[15px] text-foreground py-0 bg-transparent outline-none"
                  style={webTextInputFocusStyle}
                  placeholder="Minimo 8 caracteres"
                  placeholderTextColor="#b0b0b0"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={value}
                  onChangeText={onChange}
                  onBlur={() => {
                    onBlur();
                    setFocusedField(null);
                  }}
                  onFocus={() => setFocusedField('password')}
                  accessibilityLabel="Nueva contrasena"
                />
                <Pressable
                  onPress={() => setShowPassword((previous) => !previous)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Ocultar nueva contrasena' : 'Mostrar nueva contrasena'}
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

        <View className="gap-2">
          <Text className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
            Confirmar contrasena
          </Text>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className={`border-b-[1.5px] pb-2.5 flex-row items-center ${inputBorderClass('confirmPassword', !!errors.confirmPassword)}`}>
                <TextInput
                  className="flex-1 text-[15px] text-foreground py-0 bg-transparent outline-none"
                  style={webTextInputFocusStyle}
                  placeholder="Repite la contrasena"
                  placeholderTextColor="#b0b0b0"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={value}
                  onChangeText={onChange}
                  onBlur={() => {
                    onBlur();
                    setFocusedField(null);
                  }}
                  onFocus={() => setFocusedField('confirmPassword')}
                  accessibilityLabel="Confirmar contrasena"
                />
                <Pressable
                  onPress={() => setShowConfirmPassword((previous) => !previous)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessibilityRole="button"
                  accessibilityLabel={showConfirmPassword ? 'Ocultar confirmacion' : 'Mostrar confirmacion'}
                >
                  <Text className="text-[10px] tracking-[0.15em] text-muted-foreground font-medium">
                    {showConfirmPassword ? 'OCULTAR' : 'MOSTRAR'}
                  </Text>
                </Pressable>
              </View>
            )}
          />
          {errors.confirmPassword && (
            <Text className="text-[11px] text-destructive tracking-wide">{errors.confirmPassword.message}</Text>
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
            accessibilityLabel="Actualizar contrasena"
          >
            Actualizar contrasena
          </Button>
        </View>

        <Text className="text-[11px] text-muted-foreground leading-5 tracking-wide">
          Por seguridad, cerraremos las sesiones activas de esta cuenta.
        </Text>
      </View>
    </AuthScreenFrame>
  );
}
