import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { OrderStatusBadge } from '@/components/storefront/OrderStatusBadge';
import {
  OrderTrackingProductsSection,
  OrderTrackingShippingSection,
  OrderTrackingTotalsSection,
} from '@/components/storefront/OrderTrackingSections';
import { OrderTrackingTimeline } from '@/components/storefront/OrderTrackingTimeline';
import { formatOrderDate, getEffectiveOrderStatus } from '@/lib/order-display';
import type { Order } from '@/types';

export function OrderTrackingResult({ order }: { order: Order }) {
  const status = getEffectiveOrderStatus(order);

  return (
    <View className="gap-4">
      <View className="gap-3 rounded-lg border border-border bg-card p-4">
        <View className="gap-3 sm:flex-row sm:items-center sm:justify-between">
          <View className="gap-1">
            <Text variant="h2">Orden {order.orderId}</Text>
            <Text variant="small">{formatOrderDate(order.createdAt)}</Text>
          </View>
          <OrderStatusBadge status={status} />
        </View>
        <OrderTrackingTimeline status={status} />
      </View>

      <OrderTrackingProductsSection order={order} />
      <OrderTrackingShippingSection order={order} />
      <OrderTrackingTotalsSection order={order} />
    </View>
  );
}
