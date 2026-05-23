import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { CartSummary } from '@/components/storefront/CartSummary';
import { CheckoutItemSummary } from '@/components/storefront/CheckoutItemSummary';
import { generateItemKey } from '@/lib/utils';
import type { CartItem, PricingResult, ShippingMethod } from '@/types';

interface CheckoutSummaryColumnProps {
  items: CartItem[];
  pricing: PricingResult;
  currency?: string;
  selectedMethod?: ShippingMethod;
  shippingCost: number;
  isSubmitting: boolean;
  isShippingLoading: boolean;
  isPricingLoading: boolean;
  pricingError: string | null;
  hasShippingMethods: boolean;
  submitError: string | null;
  onRetryPricing: () => void;
  onSubmit: () => void;
}

export function CheckoutSummaryColumn({
  items,
  pricing,
  currency,
  selectedMethod,
  shippingCost,
  isSubmitting,
  isShippingLoading,
  isPricingLoading,
  pricingError,
  hasShippingMethods,
  submitError,
  onRetryPricing,
  onSubmit,
}: CheckoutSummaryColumnProps) {
  return (
    <>
      <View className="gap-4 rounded-lg border border-border bg-background p-4">
        <Text variant="h3">Productos</Text>
        <View className="gap-3">
          {items.map((item) => (
            <CheckoutItemSummary
              key={generateItemKey(item.documentId, item.selectedOptions)}
              item={item}
              currency={currency}
            />
          ))}
        </View>
      </View>

      <CartSummary
        pricing={pricing}
        currency={currency}
        isPricingLoading={isPricingLoading}
        pricingError={pricingError}
        onRetryPricing={onRetryPricing}
        shippingCost={selectedMethod ? shippingCost : undefined}
        shippingLabel="Selecciona envio"
        actionLabel="Continuar al pago"
        actionLoading={isSubmitting}
        actionDisabled={isSubmitting || isShippingLoading || isPricingLoading || !hasShippingMethods}
        actionError={submitError}
        onAction={onSubmit}
      />

      <View className="rounded-md bg-secondary px-3 py-3">
        <Text variant="xs" className="leading-5">
          El pago se confirma en el siguiente paso. No vaciamos el carrito hasta que el pago quede confirmado.
        </Text>
      </View>
    </>
  );
}
