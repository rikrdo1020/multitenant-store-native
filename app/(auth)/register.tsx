import { useState } from "react";
import {
  Platform,
  Pressable,
  TextInput,
  View,
  type TextStyle,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { AuthScreenFrame } from "@/components/auth/AuthScreenFrame";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { registerSchema, type RegisterFormData } from "@/lib/validators";
import { register } from "@/services/auth";

const webTextInputFocusStyle =
  Platform.OS === "web"
    ? ({ outlineStyle: "none" } as unknown as TextStyle)
    : undefined;

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
      router.replace("/");
    } catch {
      setError("root", {
        message: "No fue posible crear la cuenta. Intenta de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputBorderClass = (field: string, hasError: boolean) => {
    if (hasError) return "border-destructive";
    if (focusedField === field) return "border-foreground";
    return "border-border";
  };

  return (
    <AuthScreenFrame maxWidth={440}>
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
          02 - Registro
        </Text>
      </View>

      <View className="px-6 pt-8 pb-7">
        <Text className="text-[48px] font-bold leading-[1] text-foreground">
          {"Crear\ncuenta."}
        </Text>
        <View className="flex-row items-center gap-3 mt-4">
          <View className="w-6 h-[1.5px] bg-foreground" />
          <Text className="text-sm text-muted-foreground">
            Completa tus datos para empezar
          </Text>
        </View>
      </View>

      <View className="px-6 gap-6 pb-4">
        <View className="gap-2">
          <Text className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
            Nombre completo
          </Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <View
                className={`border-b-[1.5px] pb-2.5 ${inputBorderClass("name", !!errors.name)}`}
              >
                <TextInput
                  className="text-[15px] text-foreground py-0 bg-transparent outline-none"
                  style={webTextInputFocusStyle}
                  placeholder="Juan Garcia"
                  placeholderTextColor="#b0b0b0"
                  autoCapitalize="words"
                  value={value}
                  onChangeText={onChange}
                  onBlur={() => {
                    onBlur();
                    setFocusedField(null);
                  }}
                  onFocus={() => setFocusedField("name")}
                  accessibilityLabel="Nombre completo"
                />
              </View>
            )}
          />
          {errors.name && (
            <Text className="text-[11px] text-destructive tracking-wide">
              {errors.name.message}
            </Text>
          )}
        </View>

        <View className="gap-2">
          <Text className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
            Correo electronico
          </Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View
                className={`border-b-[1.5px] pb-2.5 ${inputBorderClass("email", !!errors.email)}`}
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
                  onFocus={() => setFocusedField("email")}
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

        <View className="gap-2">
          <Text className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
            Telefono
          </Text>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <View
                className={`border-b-[1.5px] pb-2.5 ${inputBorderClass("phone", !!errors.phone)}`}
              >
                <TextInput
                  className="text-[15px] text-foreground py-0 bg-transparent outline-none"
                  style={webTextInputFocusStyle}
                  placeholder="+507 6000-0000"
                  placeholderTextColor="#b0b0b0"
                  keyboardType="phone-pad"
                  value={value}
                  onChangeText={onChange}
                  onBlur={() => {
                    onBlur();
                    setFocusedField(null);
                  }}
                  onFocus={() => setFocusedField("phone")}
                  accessibilityLabel="Telefono"
                />
              </View>
            )}
          />
          {errors.phone && (
            <Text className="text-[11px] text-destructive tracking-wide">
              {errors.phone.message}
            </Text>
          )}
        </View>

        <View className="gap-2">
          <Text className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
            Contrasena
          </Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View
                className={`border-b-[1.5px] pb-2.5 flex-row items-center ${inputBorderClass("password", !!errors.password)}`}
              >
                <TextInput
                  className="flex-1 text-[15px] text-foreground py-0 bg-transparent outline-none"
                  style={webTextInputFocusStyle}
                  placeholder="Minimo 6 caracteres"
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
                  onFocus={() => setFocusedField("password")}
                  accessibilityLabel="Contrasena"
                />
                <Pressable
                  onPress={() => setShowPassword((previous) => !previous)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword ? "Ocultar contrasena" : "Mostrar contrasena"
                  }
                >
                  <Text className="text-[10px] tracking-[0.15em] text-muted-foreground font-medium">
                    {showPassword ? "OCULTAR" : "MOSTRAR"}
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

        {errors.root && (
          <View className="border-l-2 border-destructive pl-4 py-1">
            <Text className="text-sm text-destructive">
              {errors.root.message}
            </Text>
          </View>
        )}

        <View className="pt-1 pb-2">
          <Button
            size="lg"
            loading={loading}
            onPress={handleSubmit(onSubmit)}
            className="rounded-sm"
            accessibilityLabel="Crear cuenta"
          >
            Crear cuenta
          </Button>
        </View>

        <Text className="text-[11px] text-muted-foreground leading-5 tracking-wide pb-2">
          Al registrarte aceptas los Terminos de Uso y la Politica de
          Privacidad.
        </Text>
      </View>

      <View className="px-6 py-8 flex-row items-center gap-4">
        <View className="h-px flex-1 bg-border" />
        <Pressable
          onPress={() => router.push("/(auth)/login")}
          accessibilityRole="button"
          accessibilityLabel="Ir al inicio de sesion"
        >
          <Text className="text-[13px] text-muted-foreground">
            Ya tienes cuenta?{" "}
            <Text className="text-[13px] font-semibold text-foreground">
              Ingresa
            </Text>
          </Text>
        </Pressable>
      </View>
    </AuthScreenFrame>
  );
}
