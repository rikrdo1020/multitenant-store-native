import { ScrollView, View } from 'react-native';
import { CartItemsColumn } from '@/components/storefront/CartItemsColumn';
import { CartMobileCheckoutBar } from '@/components/storefront/CartMobileCheckoutBar';
import { CartTotalsColumn } from '@/components/storefront/CartTotalsColumn';
import type { CartShippingEstimatorViewModel } from '@/hooks/use-cart-shipping-estimator';
import type { CartScreenViewModel } from '@/hooks/use-cart-screen';

interface CartFilledStateProps {
  cart: CartScreenViewModel;
  estimator: CartShippingEstimatorViewModel;
  isWide: boolean;
}

export function CartFilledState({ cart, estimator, isWide }: CartFilledStateProps) {
  return (
    <>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: isWide ? 32 : 112 }}>
        <View className={isWide ? 'flex-row items-start gap-5' : 'gap-5'}>
          <CartItemsColumn
            items={cart.items}
            currency={cart.currency}
            onDecrease={cart.handleDecrease}
            onIncrease={cart.handleIncrease}
            onRemove={cart.handleRemove}
            onBrowseProducts={cart.goToProducts}
          />
          <CartTotalsColumn
            pricing={cart.pricing}
            estimator={estimator}
            currency={cart.currency}
            isWide={isWide}
            isPricingLoading={cart.isPricingLoading}
            pricingError={cart.pricingError}
            onRetryPricing={cart.retryPricing}
            onCheckout={cart.goToCheckout}
          />
        </View>
      </ScrollView>

      {!isWide && (
        <CartMobileCheckoutBar
          pricing={cart.pricing}
          currency={cart.currency}
          pricingStatusLabel={getMobilePricingStatus(cart)}
          shippingCost={estimator.selectedMethod ? estimator.shippingCost : undefined}
          onCheckout={cart.goToCheckout}
        />
      )}
    </>
  );
}

function getMobilePricingStatus(cart: CartScreenViewModel) {
  if (cart.isPricingLoading) return 'Calculando combos';
  if (cart.pricingError) return 'Total parcial';
  return undefined;
}
