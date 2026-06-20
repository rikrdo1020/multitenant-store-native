import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { getOrderTimeline } from '@/lib/order-display';
import { cn } from '@/lib/utils';
import type { OrderDisplayStatus } from '@/types';

export function OrderTrackingTimeline({ status }: { status: OrderDisplayStatus }) {
  const steps = getOrderTimeline(status);

  return (
    <View className="gap-3">
      {steps.map((step, index) => (
        <View key={step.key} className="flex-row gap-3">
          <View className="items-center">
            <View
              className={cn(
                'h-3 w-3 rounded-full',
                step.state === 'done' && 'bg-emerald-500',
                step.state === 'current' && 'bg-amber-500',
                step.state === 'pending' && 'bg-neutral-300',
                step.state === 'blocked' && 'bg-red-500',
              )}
            />
            {index < steps.length - 1 ? <View className="mt-1 h-6 w-px bg-border" /> : null}
          </View>
          <View className="min-w-0 flex-1">
            <Text className={cn(step.state === 'pending' && 'text-muted-foreground')}>
              {step.label}
            </Text>
            {step.state === 'current' ? <Text variant="xs">Estado actual</Text> : null}
          </View>
        </View>
      ))}
    </View>
  );
}

export function TrackingInfoRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between gap-4">
      <Text className={strong ? 'font-semibold' : 'text-muted-foreground'}>{label}</Text>
      <Text className={strong ? 'text-xl font-bold' : 'font-medium'}>{value}</Text>
    </View>
  );
}
