import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { formatPrice } from '@/lib/utils';

interface CartSummaryTotalProps {
  total: number;
  currency?: string;
}

export function CartSummaryTotal({ total, currency }: CartSummaryTotalProps) {
  return (
    <View className="border-t border-border pt-4">
      <View className="flex-row items-center justify-between gap-4">
        <Text className="font-semibold">Total</Text>
        <Text variant="h2" className="font-bold">
          {formatPrice(total, currency)}
        </Text>
      </View>
    </View>
  );
}
