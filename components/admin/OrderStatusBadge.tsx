import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types';

const statusConfig: Record<
  OrderStatus,
  { label: string; badgeClassName: string; textClassName: string; dotClassName: string }
> = {
  pending: {
    label: 'Pendiente',
    badgeClassName: 'border-amber-200 bg-amber-50',
    textClassName: 'text-amber-800',
    dotClassName: 'bg-amber-500',
  },
  paid: {
    label: 'Pagado',
    badgeClassName: 'border-emerald-200 bg-emerald-50',
    textClassName: 'text-emerald-800',
    dotClassName: 'bg-emerald-500',
  },
  cancelled: {
    label: 'Cancelado',
    badgeClassName: 'border-red-200 bg-red-50',
    textClassName: 'text-red-800',
    dotClassName: 'bg-red-500',
  },
  failed: {
    label: 'Fallido',
    badgeClassName: 'border-neutral-300 bg-neutral-100',
    textClassName: 'text-neutral-700',
    dotClassName: 'bg-neutral-500',
  },
  rejected: {
    label: 'Rechazado',
    badgeClassName: 'border-orange-200 bg-orange-50',
    textClassName: 'text-orange-800',
    dotClassName: 'bg-orange-500',
  },
  expired: {
    label: 'Expirado',
    badgeClassName: 'border-slate-200 bg-slate-50',
    textClassName: 'text-slate-600',
    dotClassName: 'bg-slate-400',
  },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.pending;
  return (
    <View className={cn('flex-row items-center gap-1.5 rounded-full border px-2.5 py-1', config.badgeClassName)}>
      <View className={cn('h-1.5 w-1.5 rounded-full', config.dotClassName)} />
      <Text variant="xs" className={cn('font-semibold', config.textClassName)}>
        {config.label}
      </Text>
    </View>
  );
}
