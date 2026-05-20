import { View } from 'react-native';
import { CheckoutSummaryColumn } from '@/components/storefront/CheckoutSummaryColumn';
import type { CheckoutScreenViewModel } from '@/hooks/use-checkout-screen';

interface CheckoutSummaryPanelProps {
  checkout: CheckoutScreenViewModel;
  isWide: boolean;
}

export function CheckoutSummaryPanel({ checkout, isWide }: CheckoutSummaryPanelProps) {
  return (
    <View className={isWide ? 'w-96 gap-4' : 'gap-4'}>
      <CheckoutSummaryColumn
        items={checkout.items}
        pricing={checkout.pricing}
        currency={checkout.currency}
        selectedMethod={checkout.selectedMethod}
        shippingCost={checkout.shippingCost}
        isSubmitting={false}
        isShippingLoading={checkout.isShippingLoading}
        hasShippingMethods={checkout.shippingMethods.length > 0}
        submitError={checkout.submitError}
        onSubmit={checkout.submitOrder}
      />
    </View>
  );
}
