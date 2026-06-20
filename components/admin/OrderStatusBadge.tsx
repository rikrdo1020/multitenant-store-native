import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { ADMIN_ORDER_STATUS_DISPLAY } from '@/lib/admin-order-status';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = ADMIN_ORDER_STATUS_DISPLAY[status] ?? ADMIN_ORDER_STATUS_DISPLAY.pending;
  return (
    <View className={cn('flex-row items-center gap-1.5 rounded-full border px-2.5 py-1', config.badgeClassName)}>
      <View className={cn('h-1.5 w-1.5 rounded-full', config.dotClassName)} />
      <Text variant="xs" className={cn('font-semibold', config.textClassName)}>
        {config.label}
      </Text>
    </View>
  );
}
