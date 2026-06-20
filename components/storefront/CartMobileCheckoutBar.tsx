import { View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { formatPrice } from '@/lib/utils';
import type { PricingResult } from '@/types';

interface CartMobileCheckoutBarProps {
  pricing: PricingResult;
  currency?: string;
  pricingStatusLabel?: string;
  shippingCost?: number;
  onCheckout: () => void;
}

export function CartMobileCheckoutBar({
  pricing,
  currency,
  pricingStatusLabel,
  shippingCost,
  onCheckout,
}: CartMobileCheckoutBarProps) {
  const total = pricing.total + (shippingCost ?? 0);
  const totalLabel = pricingStatusLabel ?? (shippingCost === undefined ? 'Total parcial' : 'Total estimado');

  return (
    <View className="border-t border-border bg-background px-4 pb-4 pt-3">
      <View className="flex-row items-center gap-3">
        <View className="min-w-0 flex-1">
          <Text variant="xs">{totalLabel}</Text>
          <Text className="font-bold text-foreground">
            {formatPrice(total, currency)}
          </Text>
        </View>
        <Button className="min-w-40" onPress={onCheckout}>
          Ir al checkout
        </Button>
      </View>
    </View>
  );
}
