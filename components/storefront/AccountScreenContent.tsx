import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LogIn, LogOut, Package, UserRound } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { logout } from '@/services/auth';
import { useAuthStore } from '@/stores/use-auth-store';

interface AccountScreenContentProps {
  tenantSlug?: string;
}

export function AccountScreenContent({ tenantSlug }: AccountScreenContentProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const goToOrders = () => {
    if (!tenantSlug) return;
    router.push(`/(storefront)/${tenantSlug}/orders` as never);
  };

  const goToLogin = () => {
    const returnTo = tenantSlug ? `/(storefront)/${tenantSlug}/account` : '/';
    router.push(`/(auth)/login?returnTo=${encodeURIComponent(returnTo)}` as never);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View className="mx-auto w-full max-w-5xl gap-5">
          <View className="gap-1">
            <Text variant="h1">Mi cuenta</Text>
            <Text variant="small">Consulta tus pedidos y la informacion asociada a tu compra.</Text>
          </View>

          {!isAuthenticated ? (
            <View className="gap-4 rounded-lg border border-border bg-card p-5">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-muted">
                <LogIn size={22} color="#171717" />
              </View>
              <View className="gap-1">
                <Text variant="h3">Inicia sesion para ver tus pedidos</Text>
                <Text variant="small">
                  Usaremos tu correo para mostrar las ordenes asociadas a esta tienda.
                </Text>
              </View>
              <Button onPress={goToLogin}>Iniciar sesion</Button>
            </View>
          ) : (
            <>
              <View className="gap-3 rounded-lg border border-border bg-card p-5">
                <View className="flex-row items-center gap-3">
                  <View className="h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <UserRound size={22} color="#171717" />
                  </View>
                  <View className="min-w-0 flex-1">
                    <Text className="font-semibold">{user?.name ?? 'Cliente'}</Text>
                    <Text variant="small">{user?.email}</Text>
                  </View>
                </View>
              </View>

              <Pressable
                onPress={goToOrders}
                className="rounded-lg border border-border bg-card p-5 active:bg-muted"
              >
                <View className="flex-row items-center gap-3">
                  <View className="h-11 w-11 items-center justify-center rounded-full bg-muted">
                    <Package size={20} color="#171717" />
                  </View>
                  <View className="min-w-0 flex-1">
                    <Text className="font-semibold">Mis pedidos</Text>
                    <Text variant="small">Revisa el estado y detalle de tus ordenes.</Text>
                  </View>
                </View>
              </Pressable>

              <Button variant="outline" onPress={handleLogout}>
                <View className="flex-row items-center gap-2">
                  <LogOut size={16} color="#171717" />
                  <Text className="font-semibold">Cerrar sesion</Text>
                </View>
              </Button>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
