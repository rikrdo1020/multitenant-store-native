import { ScrollView, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { CartEmptyState } from '@/components/storefront/CartEmptyState';
import { CartHeader } from '@/components/storefront/CartHeader';
import { CartItemsColumn } from '@/components/storefront/CartItemsColumn';
import { CartMobileCheckoutBar } from '@/components/storefront/CartMobileCheckoutBar';
import { CartTotalsColumn } from '@/components/storefront/CartTotalsColumn';
import { useCartShippingEstimator } from '@/hooks/use-cart-shipping-estimator';
import { useCartScreen } from '@/hooks/use-cart-screen';

interface CartScreenContentProps {
  tenantSlug?: string;
}

export function CartScreenContent({ tenantSlug }: CartScreenContentProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 860;
  const cart = useCartScreen(tenantSlug);
  const shippingEstimator = useCartShippingEstimator(tenantSlug);

  if (!cart.isReady) return <LoadingScreen message="Cargando carrito..." />;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <CartHeader
        itemCount={cart.items.length}
        onBack={cart.goBack}
        onClear={cart.openClearConfirm}
      />

      {cart.items.length === 0 ? (
        <CartEmptyState onBrowseProducts={cart.goToProducts} />
      ) : (
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
              estimator={shippingEstimator}
              currency={cart.currency}
              isWide={isWide}
              onCheckout={cart.goToCheckout}
            />
          </View>
        </ScrollView>
      )}

      {!isWide && cart.items.length > 0 && (
        <CartMobileCheckoutBar
          pricing={cart.pricing}
          currency={cart.currency}
          shippingCost={shippingEstimator.selectedMethod ? shippingEstimator.shippingCost : undefined}
          onCheckout={cart.goToCheckout}
        />
      )}

      <ConfirmDialog
        visible={cart.isClearConfirmVisible}
        title="Vaciar carrito"
        description="Se eliminaran todos los productos seleccionados."
        confirmLabel="Vaciar"
        destructive
        onCancel={cart.closeClearConfirm}
        onConfirm={cart.handleClearCart}
      />
    </SafeAreaView>
  );
}
