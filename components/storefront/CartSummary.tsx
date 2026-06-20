import { View } from 'react-native';
import { ShoppingBag } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { CartSummaryActionButton } from '@/components/storefront/CartSummaryActionButton';
import { CartSummaryActionFeedback } from '@/components/storefront/CartSummaryActionFeedback';
import { CartSummaryFeedback } from '@/components/storefront/CartSummaryFeedback';
import { CartSummaryLines } from '@/components/storefront/CartSummaryLines';
import { CartSummaryTotal } from '@/components/storefront/CartSummaryTotal';
import type { PricingResult } from '@/types';

interface CartSummaryProps {
  pricing: PricingResult;
  currency?: string;
  shippingCost?: number;
  shippingLabel?: string;
  actionLabel?: string;
  actionDisabled?: boolean;
  actionLoading?: boolean;
  actionError?: string | null;
  isPricingLoading?: boolean;
  pricingError?: string | null;
  onRetryPricing?: () => void;
  actionSuccess?: {
    title: string;
    description?: string;
  } | null;
  onAction?: () => void;
}

export function CartSummary({
  pricing,
  currency,
  shippingCost,
  shippingLabel,
  actionLabel,
  actionDisabled,
  actionLoading,
  actionError,
  isPricingLoading,
  pricingError,
  onRetryPricing,
  actionSuccess,
  onAction,
}: CartSummaryProps) {
  const finalTotal = pricing.total + (shippingCost ?? 0);

  return (
    <View className="gap-4 rounded-lg border border-border bg-background p-4">
      <View className="flex-row items-center gap-2">
        <ShoppingBag size={18} color="#0a0a0a" />
        <Text variant="h3">Resumen</Text>
      </View>

      <CartSummaryLines
        pricing={pricing}
        currency={currency}
        shippingCost={shippingCost}
        shippingLabel={shippingLabel}
      />

      <CartSummaryFeedback
        isLoading={isPricingLoading}
        error={pricingError}
        onRetry={onRetryPricing}
      />

      <CartSummaryTotal total={finalTotal} currency={currency} />

      <CartSummaryActionFeedback error={actionError} success={actionSuccess} />

      <CartSummaryActionButton
        label={actionLabel}
        disabled={actionDisabled}
        loading={actionLoading}
        onPress={onAction}
      />
    </View>
  );
}
