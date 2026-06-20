import { View } from 'react-native';
import { SummaryRow } from '@/components/storefront/SummaryRow';
import { formatPrice } from '@/lib/utils';
import type { PricingResult } from '@/types';

interface CartSummaryLinesProps {
  pricing: PricingResult;
  currency?: string;
  shippingCost?: number;
  shippingLabel?: string;
}

export function CartSummaryLines({
  pricing,
  currency,
  shippingCost,
  shippingLabel,
}: CartSummaryLinesProps) {
  const hasShippingCost = typeof shippingCost === 'number';

  return (
    <View className="gap-3">
      <SummaryRow label="Subtotal" value={formatPrice(pricing.originalTotal, currency)} />
      {pricing.savings > 0 && (
        <SummaryRow label="Descuento por combo" value={`-${formatPrice(pricing.savings, currency)}`} />
      )}
      <SummaryRow
        label="Envio"
        value={hasShippingCost ? formatPrice(shippingCost, currency) : shippingLabel ?? 'En checkout'}
        muted={!hasShippingCost}
      />
    </View>
  );
}
