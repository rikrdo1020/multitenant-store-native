import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { formatSelectedOptions } from '@/lib/order';
import { formatPrice } from '@/lib/utils';
import type { CartItem } from '@/types';

interface CheckoutItemSummaryProps {
  item: CartItem;
  currency?: string;
}

export function CheckoutItemSummary({ item, currency }: CheckoutItemSummaryProps) {
  const selectedOptions = formatSelectedOptions(item.selectedOptions);

  return (
    <View className="gap-1 border-b border-border pb-3 last:border-b-0 last:pb-0">
      <View className="flex-row items-start justify-between gap-3">
        <View className="min-w-0 flex-1">
          <Text className="font-semibold" numberOfLines={2}>
            {item.name}
          </Text>
          {selectedOptions && (
            <Text variant="xs" className="mt-1 leading-4">
              {selectedOptions}
            </Text>
          )}
          <Text variant="xs" className="mt-1">
            {item.quantity} x {formatPrice(item.price, currency)}
          </Text>
        </View>
        <Text className="font-semibold">
          {formatPrice(item.price * item.quantity, currency)}
        </Text>
      </View>
    </View>
  );
}
