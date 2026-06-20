import { View } from 'react-native';
import { CheckoutSummaryColumn } from '@/components/storefront/CheckoutSummaryColumn';
import type { CheckoutScreenViewModel } from '@/hooks/use-checkout-screen';

interface CheckoutSummaryPanelProps {
  checkout: CheckoutScreenViewModel;
  isWide: boolean;
}

export function CheckoutSummaryPanel({ checkout, isWide }: CheckoutSummaryPanelProps) {
  const actionLabel = checkout.isFreePlan ? 'Enviar pedido por WhatsApp' : 'Continuar al pago';
  const actionNote = checkout.isFreePlan
    ? 'Tu pedido será enviado al vendedor por WhatsApp. El método de pago se coordina directamente con la tienda.'
    : 'El pago se confirma en el siguiente paso. No vaciamos el carrito hasta que el pago quede confirmado.';

  return (
    <View className={isWide ? 'w-96 gap-4' : 'gap-4'}>
      <CheckoutSummaryColumn
        items={checkout.items}
        pricing={checkout.pricing}
        currency={checkout.currency}
        selectedMethod={checkout.selectedMethod}
        shippingCost={checkout.shippingCost}
        isSubmitting={checkout.isSubmitting}
        isShippingLoading={checkout.isShippingLoading}
        isPricingLoading={checkout.isPricingLoading}
        pricingError={checkout.pricingError}
        hasShippingMethods={checkout.shippingMethods.length > 0}
        submitError={checkout.submitError}
        onRetryPricing={checkout.retryPricing}
        actionLabel={actionLabel}
        actionNote={actionNote}
        onSubmit={checkout.submitOrder}
      />
    </View>
  );
}
