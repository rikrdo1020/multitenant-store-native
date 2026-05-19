import { TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { OrderStatusBadge } from './OrderStatusBadge';
import { formatPrice } from '@/lib/utils';
import type { Order } from '@/types';
import { ChevronRight } from 'lucide-react-native';

interface OrderListItemProps {
  order: Order;
  onPress: (order: Order) => void;
}

export function OrderListItem({ order, onPress }: OrderListItemProps) {
  const date = new Date(order.createdAt).toLocaleDateString('es-PA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const paymentLabel = order.paymentMethod === 'yappy' ? 'Yappy' : order.paymentMethod === 'cash' ? 'Efectivo' : order.paymentMethod ?? '—';

  return (
    <TouchableOpacity
      testID="order-list-item"
      onPress={() => onPress(order)}
      className="flex-row items-center rounded-lg border border-border bg-card px-4 py-3"
      activeOpacity={0.7}
    >
      <View className="flex-1 gap-1">
        <View className="flex-row items-center gap-2">
          <Text variant="body" className="font-semibold text-foreground">
            #{order.orderId}
          </Text>
          <OrderStatusBadge status={order.orderStatus} />
        </View>
        <Text variant="small" className="text-muted-foreground">
          {order.customerData.name}
        </Text>
        <View className="flex-row items-center gap-3">
          <Text variant="xs" className="text-muted-foreground">
            {date}
          </Text>
          <Text variant="xs" className="text-muted-foreground">
            {paymentLabel}
          </Text>
        </View>
      </View>
      <View className="items-end gap-1">
        <Text variant="body" className="font-bold text-foreground">
          {formatPrice(order.total)}
        </Text>
        <ChevronRight size={16} className="text-muted-foreground" />
      </View>
    </TouchableOpacity>
  );
}
