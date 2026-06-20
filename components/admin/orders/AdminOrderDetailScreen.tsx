import { ActivityIndicator, ScrollView, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { AdminOrderStatusControls } from '@/components/admin/orders/AdminOrderStatusControls';
import {
  AdminOrderCustomerSection,
  AdminOrderItemsSection,
  AdminOrderPaymentSection,
  AdminOrderShippingSection,
  AdminOrderStatusHistorySection,
  AdminOrderTrackingSection,
} from '@/components/admin/orders/AdminOrderDetailSections';
import { useAdminOrderDetailScreen } from '@/hooks/use-admin-order-detail-screen';

interface AdminOrderDetailScreenProps {
  orderId?: string;
}

export function AdminOrderDetailScreen({ orderId }: AdminOrderDetailScreenProps) {
  const detail = useAdminOrderDetailScreen(orderId);
  const order = detail.order;

  if (detail.isLoading) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" className="text-primary" />
          <Text variant="body" className="mt-3 text-muted-foreground">
            Cargando pedido...
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (detail.error || !order) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center gap-4 p-6">
          <View className="gap-1">
            <Text variant="h2" className="text-center text-destructive">
              Error al cargar
            </Text>
            <Text variant="small" className="text-center">
              No pudimos cargar este pedido.
            </Text>
          </View>
          <Button onPress={() => detail.refetch()}>Reintentar</Button>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="border-b border-border bg-background px-4 py-3">
          <View className="mx-auto w-full max-w-6xl flex-row items-center gap-3">
            <Button variant="ghost" size="sm" onPress={detail.goBack} className="px-1">
              <ArrowLeft size={22} color="#171717" />
            </Button>
            <View className="min-w-0 flex-1">
              <Text variant="h1" numberOfLines={1}>
                Orden {order.orderId}
              </Text>
              <Text variant="small">Gestiona pago, envio y seguimiento.</Text>
            </View>
            <OrderStatusBadge status={order.orderStatus} />
          </View>
        </View>

        <View className="mx-auto w-full max-w-6xl gap-4 px-4 py-4">
          <AdminOrderStatusControls detail={detail} order={order} />
          <AdminOrderItemsSection order={order} />
          <AdminOrderCustomerSection order={order} />
          <AdminOrderShippingSection order={order} />
          <AdminOrderTrackingSection order={order} />
          <AdminOrderPaymentSection order={order} />
          <AdminOrderStatusHistorySection order={order} />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
