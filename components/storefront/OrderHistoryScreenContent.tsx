import { ActivityIndicator, RefreshControl, ScrollView, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, PackageSearch } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { OrderCard } from '@/components/storefront/OrderCard';
import { useTenant } from '@/hooks/api/use-tenant';
import { useOrders } from '@/hooks/api/use-orders';
import { useAuthStore } from '@/stores/use-auth-store';
import type { Order } from '@/types';

interface OrderHistoryScreenContentProps {
  tenantSlug?: string;
}

export function OrderHistoryScreenContent({ tenantSlug }: OrderHistoryScreenContentProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 900;
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const tenantQuery = useTenant(tenantSlug ?? '');
  const tenant = tenantQuery.data;
  const ordersQuery = useOrders(isAuthenticated ? tenantSlug : undefined);
  const orders = ordersQuery.data?.data ?? [];

  const goBack = () => router.back();
  const goToProducts = () => router.push(`/(storefront)/${tenantSlug}/products` as never);
  const goToLogin = () => {
    const returnTo = tenantSlug ? `/(storefront)/${tenantSlug}/orders` : '/';
    router.push(`/(auth)/login?returnTo=${encodeURIComponent(returnTo)}` as never);
  };
  const goToOrder = (order: Order) => {
    router.push(`/(storefront)/${tenantSlug}/orders/${order.documentId}` as never);
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <ScreenHeader title="Mis pedidos" subtitle="Historial de compras" onBack={goBack} />
        <View className="flex-1 items-center justify-center gap-4 px-6">
          <PackageSearch size={34} color="#737373" />
          <View className="gap-1">
            <Text variant="h3" className="text-center">Inicia sesion para ver tus pedidos</Text>
            <Text variant="small" className="text-center">
              El historial se carga usando el correo de tu cuenta.
            </Text>
          </View>
          <Button onPress={goToLogin}>Iniciar sesion</Button>
        </View>
      </SafeAreaView>
    );
  }

  if (ordersQuery.isLoading) {
    return <LoadingScreen message="Cargando pedidos..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScreenHeader
        title="Mis pedidos"
        subtitle={tenant?.name ? `Compras en ${tenant.name}` : 'Historial de compras'}
        onBack={goBack}
      />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={ordersQuery.isFetching && !ordersQuery.isLoading}
            onRefresh={() => {
              void ordersQuery.refetch();
            }}
          />
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        <View className="mx-auto w-full max-w-5xl gap-4">
          {ordersQuery.isError ? (
            <View className="items-center gap-4 rounded-lg border border-border bg-card p-6">
              <PackageSearch size={30} color="#737373" />
              <View className="gap-1">
                <Text variant="h3" className="text-center">No pudimos cargar tus pedidos</Text>
                <Text variant="small" className="text-center">
                  Verifica tu conexion e intenta nuevamente.
                </Text>
              </View>
              <Button variant="outline" onPress={() => ordersQuery.refetch()}>
                Reintentar
              </Button>
            </View>
          ) : orders.length === 0 ? (
            <View className="items-center gap-4 rounded-lg border border-border bg-card p-6">
              <PackageSearch size={32} color="#737373" />
              <View className="gap-1">
                <Text variant="h3" className="text-center">Aun no tienes pedidos</Text>
                <Text variant="small" className="text-center">
                  Cuando compres en esta tienda, tus ordenes apareceran aqui.
                </Text>
              </View>
              <Button onPress={goToProducts}>Explorar productos</Button>
            </View>
          ) : (
            <>
              <View className={isWide ? 'flex-row items-end justify-between gap-4' : 'gap-1'}>
                <View className="gap-1">
                  <Text className="font-semibold">
                    {orders.length} {orders.length === 1 ? 'orden' : 'ordenes'}
                  </Text>
                  <Text variant="small">Toca una orden para ver el detalle completo.</Text>
                </View>
                {ordersQuery.isFetching && !ordersQuery.isLoading && (
                  <View className="flex-row items-center gap-2">
                    <ActivityIndicator size="small" color="#737373" />
                    <Text variant="xs">Actualizando</Text>
                  </View>
                )}
              </View>

              {orders.map((order) => (
                <OrderCard
                  key={order.documentId}
                  order={order}
                  currency={tenant?.currency}
                  onPress={goToOrder}
                />
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface ScreenHeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
}

function ScreenHeader({ title, subtitle, onBack }: ScreenHeaderProps) {
  return (
    <View className="border-b border-border bg-background px-4 py-3">
      <View className="mx-auto w-full max-w-5xl flex-row items-center gap-3">
        <Button variant="ghost" size="sm" onPress={onBack} className="px-1">
          <ArrowLeft size={22} color="#171717" />
        </Button>
        <View className="min-w-0 flex-1">
          <Text variant="h2">{title}</Text>
          <Text variant="small">{subtitle}</Text>
        </View>
      </View>
    </View>
  );
}
