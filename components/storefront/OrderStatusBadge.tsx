import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { getOrderStatusDisplay } from '@/lib/order-display';
import { cn } from '@/lib/utils';
import type { OrderDisplayStatus } from '@/types';

interface OrderStatusBadgeProps {
  status: OrderDisplayStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const display = getOrderStatusDisplay(status);

  return (
    <View className={cn('self-start rounded-full border px-2.5 py-1', display.badgeClassName)}>
      <Text variant="xs" className={cn('font-semibold', display.textClassName)}>
        {display.label}
      </Text>
    </View>
  );
}
