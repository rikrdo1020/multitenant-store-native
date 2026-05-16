import { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  TextInput,
  View,
  type TextStyle,
} from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { AuthScreenFrame } from '@/components/auth/AuthScreenFrame';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import {
  inviteRegistrationSchema,
  type InviteRegistrationFormData,
} from '@/lib/validators';
import {
  getAuthErrorMessage,
  registerInvite,
  verifyInvite,
} from '@/services/auth';
import type { InviteVerification } from '@/types';

type ScreenState = 'form' | 'success';

const webTextInputFocusStyle =
  Platform.OS === 'web'
    ? ({ outlineStyle: 'none' } as unknown as TextStyle)
    : undefined;

interface InviteRegistrationScreenProps {
  token: string;
}

export function InviteRegistrationScreen({ token }: InviteRegistrationScreenProps) {
  const router = useRouter();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [screenState, setScreenState] = useState<ScreenState>('form');

  const inviteQuery = useQuery({
    queryKey: ['invite-verification', token],
    queryFn: () => verifyInvite(token),
    enabled: !!token,
    retry: false,
  });

  const registerMutation = useMutation({
    mutationFn: registerInvite,
    onSuccess: () => setScreenState('success'),
  });

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<InviteRegistrationFormData>({
    resolver: zodResolver(inviteRegistrationSchema),
  });

  const inputBorderClass = (field: string, hasError: boolean) => {
    if (hasError) return 'border-destructive';
    if (focusedField === field) return 'border-foreground';
    return 'border-border';
  };

  const onSubmit = async (data: InviteRegistrationFormData) => {
    if (!token) {
      setError('root', { message: 'El enlace no incluye un token valido.' });
      return;
    }

    try {
      clearErrors('root');
      await registerMutation.mutateAsync({
        token,
        name: data.name,
        password: data.password,
      });
    } catch (error) {
      setError('root', {
        message: getAuthErrorMessage(
          error,
          'No pudimos aceptar la invitacion. Intenta de nuevo.',
        ),
      });
    }
  };

  const acceptExistingUserInvite = async () => {
    if (!token) return;

    try {
      clearErrors('root');
      await registerMutation.mutateAsync({ token });
    } catch (error) {
      setError('root', {
        message: getAuthErrorMessage(
          error,
          'No pudimos aceptar la invitacion. Intenta de nuevo.',
        ),
      });
    }
  };

  if (!token) {
    return <InviteStateScreen kind="invalid" onLogin={() => router.replace('/(auth)/login')} />;
  }

  if (inviteQuery.isLoading) {
    return (
      <AuthScreenFrame scroll={false} maxWidth={480}>
        <View className="flex-1 items-center justify-center gap-4 px-6">
          <ActivityIndicator size="large" />
          <Text className="text-sm text-muted-foreground">
            Verificando invitacion...
          </Text>
        </View>
      </AuthScreenFrame>
    );
  }

  if (inviteQuery.error || !inviteQuery.data) {
    return (
      <InviteStateScreen
        kind="invalid"
        message={getAuthErrorMessage(
          inviteQuery.error,
          'La invitacion no es valida o expiro.',
        )}
        onLogin={() => router.replace('/(auth)/login')}
      />
    );
  }

  if (screenState === 'success') {
    return (
      <InviteStateScreen
        kind="success"
        invite={inviteQuery.data}
        onLogin={() => router.replace('/(auth)/login')}
      />
    );
  }

  const invite = inviteQuery.data;
  const isExistingUser = invite.isExistingUser;

  return (
    <AuthScreenFrame maxWidth={480}>
      <View className="flex-row items-center justify-between px-6 pt-8">
        <Pressable
          onPress={() => router.replace('/(auth)/login')}
          hitSlop={{ top: 10, bottom: 10, left: 0, right: 20 }}
          className="flex-row items-center gap-2"
          accessibilityRole="button"
          accessibilityLabel="Volver al inicio de sesion"
        >
          <View className="h-[1.5px] w-4 bg-foreground" />
          <Text className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground">
            Volver
          </Text>
        </Pressable>
        <Text className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Invitacion
        </Text>
      </View>

      <View className="px-6 pb-6 pt-8">
        <Text className="text-[44px] font-bold leading-[1] text-foreground">
          {'Unete a\nla tienda.'}
        </Text>
        <View className="mt-5 flex-row items-center gap-3">
          <View className="h-[1.5px] w-6 bg-foreground" />
          <Text className="flex-1 text-sm leading-5 text-muted-foreground">
            Acepta la invitacion para trabajar en {invite.tenant.name}.
          </Text>
        </View>
      </View>

      <View className="mx-6 mb-6 gap-2 rounded-lg border border-border bg-muted/30 p-4">
        <Text className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Detalle de acceso
        </Text>
        <Text className="text-base font-semibold text-foreground">
          {invite.email}
        </Text>
        <View className="flex-row flex-wrap gap-2">
          <Pill label={invite.tenant.name} />
          <Pill label={roleLabel(invite.role)} />
        </View>
      </View>

      <View className="flex-1 gap-6 px-6 pb-8">
        {isExistingUser ? (
          <View className="gap-5">
            <Text className="text-sm leading-6 text-muted-foreground">
              Esta invitacion corresponde a una cuenta existente. Al aceptarla,
              podras iniciar sesion con tu contrasena actual y entrar a la tienda.
            </Text>
            {errors.root && <RootError message={errors.root.message} />}
            <Button
              size="lg"
              loading={registerMutation.isPending}
              onPress={acceptExistingUserInvite}
              className="rounded-sm"
              accessibilityLabel="Aceptar invitacion"
            >
              Aceptar invitacion
            </Button>
          </View>
        ) : (
          <>
            <View className="gap-2">
              <Text className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Nombre completo
              </Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className={`border-b-[1.5px] pb-2.5 ${inputBorderClass('name', !!errors.name)}`}>
                    <TextInput
                      className="bg-transparent py-0 text-[15px] text-foreground outline-none"
                      style={webTextInputFocusStyle}
                      placeholder="Tu nombre"
                      placeholderTextColor="#b0b0b0"
                      autoCapitalize="words"
                      value={value}
                      onChangeText={onChange}
                      onBlur={() => {
                        onBlur();
                        setFocusedField(null);
                      }}
                      onFocus={() => setFocusedField('name')}
                      accessibilityLabel="Nombre completo"
                    />
                  </View>
                )}
              />
              {errors.name && <FieldError message={errors.name.message} />}
            </View>

            <PasswordField
              label="Contrasena"
              valueName="password"
              control={control}
              error={errors.password?.message}
              focusedField={focusedField}
              setFocusedField={setFocusedField}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              inputBorderClass={inputBorderClass}
            />

            <PasswordField
              label="Confirmar contrasena"
              valueName="confirmPassword"
              control={control}
              error={errors.confirmPassword?.message}
              focusedField={focusedField}
              setFocusedField={setFocusedField}
              showPassword={showConfirmPassword}
              setShowPassword={setShowConfirmPassword}
              inputBorderClass={inputBorderClass}
            />

            {errors.root && <RootError message={errors.root.message} />}

            <Button
              size="lg"
              loading={registerMutation.isPending}
              onPress={handleSubmit(onSubmit)}
              className="rounded-sm"
              accessibilityLabel="Crear cuenta y aceptar invitacion"
            >
              Crear cuenta
            </Button>
          </>
        )}
      </View>
    </AuthScreenFrame>
  );
}

function InviteStateScreen({
  kind,
  invite,
  message,
  onLogin,
}: {
  kind: 'invalid' | 'success';
  invite?: InviteVerification;
  message?: string;
  onLogin: () => void;
}) {
  const isSuccess = kind === 'success';

  return (
    <AuthScreenFrame scroll={false} maxWidth={480}>
      <View className="px-6 pt-8">
        <Pressable
          onPress={onLogin}
          hitSlop={{ top: 10, bottom: 10, left: 0, right: 20 }}
          className="flex-row items-center gap-2 self-start"
          accessibilityRole="button"
          accessibilityLabel="Ir al inicio de sesion"
        >
          <View className="h-[1.5px] w-4 bg-foreground" />
          <Text className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground">
            Ingresar
          </Text>
        </Pressable>
      </View>

      <View className="flex-1 justify-end px-6 pb-16">
        <Text className="text-[84px] font-bold leading-none text-secondary-foreground/20">
          {isSuccess ? 'OK' : '404'}
        </Text>
        <View className="mt-6 gap-4">
          <Text className="text-[40px] font-bold leading-[1.05] text-foreground">
            {isSuccess ? 'Invitacion\naceptada.' : 'Enlace\ninvalido.'}
          </Text>
          <View className="mt-2 flex-row items-start gap-3">
            <View className="mt-3 h-[1.5px] w-6 bg-foreground" />
            <Text className="flex-1 text-sm leading-6 text-muted-foreground">
              {isSuccess
                ? `Ya puedes iniciar sesion para trabajar en ${invite?.tenant.name ?? 'la tienda'}.`
                : message ?? 'Solicita una nueva invitacion al administrador de la tienda.'}
            </Text>
          </View>
          <View className="pt-6">
            <Button
              size="lg"
              onPress={onLogin}
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

function PasswordField({
  label,
  valueName,
  control,
  error,
  setFocusedField,
  showPassword,
  setShowPassword,
  inputBorderClass,
}: {
  label: string;
  valueName: 'password' | 'confirmPassword';
  control: ReturnType<typeof useForm<InviteRegistrationFormData>>['control'];
  error?: string;
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean | ((previous: boolean) => boolean)) => void;
  inputBorderClass: (field: string, hasError: boolean) => string;
}) {
  return (
    <View className="gap-2">
      <Text className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </Text>
      <Controller
        control={control}
        name={valueName}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className={`flex-row items-center border-b-[1.5px] pb-2.5 ${inputBorderClass(valueName, !!error)}`}>
            <TextInput
              className="flex-1 bg-transparent py-0 text-[15px] text-foreground outline-none"
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
              onFocus={() => setFocusedField(valueName)}
              accessibilityLabel={label}
            />
            <Pressable
              onPress={() => setShowPassword((previous) => !previous)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? `Ocultar ${label}` : `Mostrar ${label}`}
            >
              <Text className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground">
                {showPassword ? 'OCULTAR' : 'MOSTRAR'}
              </Text>
            </Pressable>
          </View>
        )}
      />
      {error && <FieldError message={error} />}
    </View>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <Text className="text-[11px] tracking-wide text-destructive">{message}</Text>;
}

function RootError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <View className="border-l-2 border-destructive py-1 pl-4">
      <Text className="text-sm text-destructive">{message}</Text>
    </View>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <View className="rounded-full border border-border bg-background px-3 py-1">
      <Text className="text-xs font-medium text-foreground">{label}</Text>
    </View>
  );
}

function roleLabel(role: string) {
  if (role === 'admin') return 'Administrador';
  return 'Manager';
}
