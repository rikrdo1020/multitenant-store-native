import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle2, Clock, XCircle } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { orderService } from '@/services/orders';
import type { Order } from '@/types';

const FAILED_STATUSES = new Set(['failed', 'cancelled', 'rejected', 'expired']);
const SUCCESS_STATUSES = new Set(['paid', 'dispatched']);

export default function ConfirmationScreen() {
  const { tenantSlug, orderId } = useLocalSearchParams<{ tenantSlug: string; orderId: string }>();
  const router = useRouter();

  const orderQuery = useQuery<Order>({
    queryKey: ['order-confirmation', orderId],
    queryFn: () => orderService.getOrder(tenantSlug!, orderId!),
    enabled: !!tenantSlug && !!orderId,
    refetchInterval: false,
    staleTime: 0,
  });

  const goToProducts = () => router.replace(`/(storefront)/${tenantSlug}/products` as never);
  const goBack = () => router.replace(`/(storefront)/${tenantSlug}/checkout/payment` as never);

  if (orderQuery.isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (orderQuery.isError || !orderQuery.data) {
    return (
      <SafeAreaView className="flex-1 bg-background p-6">
        <View className="flex-1 items-center justify-center gap-4">
          <Text variant="h2">No encontramos tu pedido</Text>
          <Button onPress={goToProducts}>Volver a la tienda</Button>
        </View>
      </SafeAreaView>
    );
  }

  const order = orderQuery.data;
  const status = order.orderStatus;

  if (SUCCESS_STATUSES.has(status)) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center gap-6 px-6">
          <CheckCircle2 size={56} color="#16a34a" strokeWidth={1.5} />
          <View className="items-center gap-2">
            <Text variant="h1" className="text-center">
              ¡Pedido confirmado!
            </Text>
            <Text variant="small" className="text-center text-muted-foreground">
              Tu pedido{' '}
              <Text variant="small" className="font-semibold text-foreground">
                {order.orderId}
              </Text>{' '}
              fue procesado exitosamente.
            </Text>
          </View>
          <View className="w-full gap-3">
            <Button size="lg" onPress={goToProducts}>
              Seguir comprando
            </Button>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (FAILED_STATUSES.has(status)) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center gap-6 px-6">
          <XCircle size={56} color="#dc2626" strokeWidth={1.5} />
          <View className="items-center gap-2">
            <Text variant="h1" className="text-center">
              Pago no completado
            </Text>
            <Text variant="small" className="text-center text-muted-foreground">
              El pedido {order.orderId} no pudo ser confirmado.{'\n'}
              {statusMessage(status)}
            </Text>
          </View>
          <View className="w-full gap-3">
            <Button size="lg" onPress={goBack}>
              Intentar de nuevo
            </Button>
            <Button variant="outline" size="lg" onPress={goToProducts}>
              Volver a la tienda
            </Button>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Pending: real Yappy — static screen, library sends notification to phone
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center gap-6 px-6">
        <Clock size={56} color="#2563eb" strokeWidth={1.5} />
        <View className="items-center gap-2">
          <Text variant="h1" className="text-center">
            Solicitud enviada
          </Text>
          <Text variant="small" className="text-center text-muted-foreground">
            Te enviamos una solicitud de pago en tu app de Yappy.{'\n'}Tu pedido es{' '}
            <Text variant="small" className="font-semibold text-foreground">
              {order.orderId}
            </Text>
          </Text>
        </View>
        <View className="w-full gap-3">
          <Button size="lg" onPress={goToProducts}>
            Volver a la tienda
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

function statusMessage(status: string): string {
  switch (status) {
    case 'cancelled':
      return 'Cancelaste el pago.';
    case 'rejected':
      return 'El pago fue rechazado.';
    case 'expired':
      return 'La sesión de pago expiró.';
    default:
      return 'Intenta nuevamente o elige otro método de pago.';
  }
}
