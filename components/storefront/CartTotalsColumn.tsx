import { View } from 'react-native';
import { CartShippingEstimator } from '@/components/storefront/CartShippingEstimator';
import { CartSummary } from '@/components/storefront/CartSummary';
import type { CartShippingEstimatorViewModel } from '@/hooks/use-cart-shipping-estimator';
import type { PricingResult } from '@/types';

interface CartTotalsColumnProps {
  pricing: PricingResult;
  estimator: CartShippingEstimatorViewModel;
  currency?: string;
  isWide: boolean;
  onCheckout: () => void;
}

export function CartTotalsColumn({
  pricing,
  estimator,
  currency,
  isWide,
  onCheckout,
}: CartTotalsColumnProps) {
  return (
    <View className={isWide ? 'w-96 gap-4' : 'gap-4'}>
      <CartShippingEstimator estimator={estimator} currency={currency} />
      <CartSummary
        pricing={pricing}
        currency={currency}
        shippingCost={estimator.selectedMethod ? estimator.shippingCost : undefined}
        shippingLabel="Selecciona envio"
        actionLabel={isWide ? 'Ir al checkout' : undefined}
        onAction={isWide ? onCheckout : undefined}
      />
    </View>
  );
}
