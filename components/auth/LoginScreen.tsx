import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  View,
  type TextStyle,
  type ViewStyle,
  useWindowDimensions,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenWrapper } from "@/components/shared/ScreenWrapper";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { loginSchema, type LoginFormData } from "@/lib/validators";
import { cn } from "@/lib/utils";
import { login } from "@/services/auth";

const webTextInputFocusStyle =
  Platform.OS === "web"
    ? ({ outlineStyle: "none" } as unknown as TextStyle)
    : undefined;

export function LoginScreen() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { height, width } = useWindowDimensions();
  const isWideLayout = width >= 768;
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const authPanelStyle = useMemo(() => {
    if (!isWideLayout) return undefined;

    const base = {
      maxWidth: 420,
      minHeight: Math.min(Math.max(height - 48, 560), 668),
      width: "100%" as const,
    };

    if (Platform.OS === "web") {
      return {
        ...base,
        boxShadow: "0 24px 64px rgba(17, 17, 17, 0.08)",
      } as unknown as ViewStyle;
    }

    return {
      ...base,
      shadowColor: "#111111",
      shadowOffset: { width: 0, height: 18 },
      shadowOpacity: 0.08,
      shadowRadius: 28,
    };
  }, [height, isWideLayout]);

  const safeReturnPath = useMemo(() => getSafeReturnPath(returnTo), [returnTo]);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const inputBorderClass = (field: string, hasError: boolean) => {
    if (hasError) return "border-destructive";
    if (focusedField === field) return "border-foreground";
    return "border-border";
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const user = await login(data.email, data.password);
      if (returnTo) {
        router.replace(safeReturnPath as never);
      } else if (user.role === "customer") {
        router.replace("/marketplace");
      } else {
        router.replace("/(admin)/dashboard");
      }
    } catch {
      setError("root", {
        message: "Credenciales incorrectas. Intenta de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper scroll safeArea className={cn(isWideLayout && "bg-muted")}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View
          className={cn(
            "flex-1 w-full",
            isWideLayout && "items-center justify-center px-5 py-6",
          )}
        >
          <View
            className={cn(
              "w-full flex-1 bg-background",
              isWideLayout && "flex-none border border-border",
            )}
            style={authPanelStyle}
          >
            <View className="flex-row items-center px-6 pt-8 gap-3">
              <View className="h-px flex-1 bg-border" />
              <Text className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">
                01 - Acceso
              </Text>
            </View>

            <View className="px-6 pt-10 pb-8">
              <Text className="text-[52px] font-bold leading-[1] text-foreground">
                {"Hola,\nbienvenido."}
              </Text>
              <View className="flex-row items-center gap-3 mt-5">
                <View className="w-6 h-[1.5px] bg-foreground" />
                <Text className="text-sm text-muted-foreground tracking-wide">
                  Ingresa tus datos para continuar
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
                      className={cn(
                        "border-b-[1.5px] pb-2.5",
                        inputBorderClass("email", !!errors.email),
                      )}
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
                  Contrasena
                </Text>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View
                      className={cn(
                        "border-b-[1.5px] pb-2.5 flex-row items-center",
                        inputBorderClass("password", !!errors.password),
                      )}
                    >
                      <TextInput
                        className="flex-1 text-[15px] text-foreground py-0 bg-transparent outline-none"
                        style={webTextInputFocusStyle}
                        placeholder="********"
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
                          showPassword
                            ? "Ocultar contrasena"
                            : "Mostrar contrasena"
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

              <View className="flex-row justify-end -mt-2">
                <Pressable
                  onPress={() => router.push("/(auth)/forgot-password")}
                  hitSlop={{ top: 8, bottom: 8, left: 12, right: 0 }}
                  accessibilityRole="button"
                  accessibilityLabel="Olvide mi contrasena"
                >
                  <Text className="text-[11px] text-muted-foreground underline tracking-wide">
                    Olvide mi contrasena
                  </Text>
                </Pressable>
              </View>

              {errors.root && (
                <View className="border-l-2 border-destructive pl-4 py-1">
                  <Text className="text-sm text-destructive">
                    {errors.root.message}
                  </Text>
                </View>
              )}

              <View className="gap-3 pt-1">
                <Button
                  size="lg"
                  loading={loading}
                  onPress={handleSubmit(onSubmit)}
                  className="rounded-sm"
                  accessibilityLabel="Ingresar"
                >
                  Ingresar
                </Button>
              </View>
            </View>

            <View className="px-6 py-10 flex-row items-center gap-4">
              <View className="h-px flex-1 bg-border" />
              <Pressable
                onPress={() => router.push("/(auth)/register")}
                accessibilityRole="button"
                accessibilityLabel="Registrarse"
              >
                <Text className="text-[13px] text-muted-foreground">
                  Sin cuenta?{" "}
                  <Text className="text-[13px] font-semibold text-foreground">
                    Registrate
                  </Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

function getSafeReturnPath(returnTo?: string): string {
  if (!returnTo) return "/";

  try {
    const decoded = decodeURIComponent(returnTo);
    if (!decoded.startsWith("/") || decoded.startsWith("//") || decoded.includes("://")) {
      return "/";
    }

    return decoded;
  } catch {
    return "/";
  }
}
