import { Pressable, View } from 'react-native';
import { ChevronRight, Package } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { OrderStatusBadge } from '@/components/storefront/OrderStatusBadge';
import { formatOrderDate, getEffectiveOrderStatus, getOrderItemCount } from '@/lib/order-display';
import { formatPrice } from '@/lib/utils';
import type { Order } from '@/types';

interface OrderCardProps {
  order: Order;
  currency?: string;
  onPress: (order: Order) => void;
}

export function OrderCard({ order, currency, onPress }: OrderCardProps) {
  const itemCount = getOrderItemCount(order);
  const status = getEffectiveOrderStatus(order);

  return (
    <Pressable
      onPress={() => onPress(order)}
      className="rounded-lg border border-border bg-card p-4 active:bg-muted"
    >
      <View className="gap-4 md:flex-row md:items-center md:justify-between">
        <View className="min-w-0 flex-1 gap-2">
          <View className="flex-row items-start justify-between gap-3">
            <View className="min-w-0 flex-1 gap-1">
              <Text className="font-semibold">Orden {order.orderId}</Text>
              <Text variant="small">{formatOrderDate(order.createdAt)}</Text>
            </View>
            <OrderStatusBadge status={status} />
          </View>

          <View className="flex-row items-center gap-2">
            <Package size={16} color="#737373" />
            <Text variant="small">
              {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between gap-4 md:justify-end">
          <View className="items-start md:items-end">
            <Text variant="xs">Total</Text>
            <Text className="font-bold">{formatPrice(order.total, currency)}</Text>
          </View>
          <ChevronRight size={20} color="#737373" />
        </View>
      </View>
    </Pressable>
  );
}
