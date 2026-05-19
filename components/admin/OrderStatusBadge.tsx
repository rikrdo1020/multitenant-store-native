import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types';

const statusConfig: Record<OrderStatus, { label: string; color: string; textColor: string }> = {
  pending:  { label: 'Pendiente', color: 'bg-yellow-100', textColor: 'text-yellow-800' },
  paid:     { label: 'Pagado',    color: 'bg-green-100',  textColor: 'text-green-800' },
  cancelled:{ label: 'Cancelado', color: 'bg-red-100',    textColor: 'text-red-800' },
  failed:   { label: 'Fallido',   color: 'bg-gray-100',   textColor: 'text-gray-600' },
  rejected: { label: 'Rechazado', color: 'bg-orange-100', textColor: 'text-orange-800' },
  expired:  { label: 'Expirado',  color: 'bg-gray-100',   textColor: 'text-gray-500' },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.pending;
  return (
    <View className={cn('rounded-full px-2.5 py-0.5', config.color)}>
      <Text variant="xs" className={cn('font-medium', config.textColor)}>
        {config.label}
      </Text>
    </View>
  );
}
