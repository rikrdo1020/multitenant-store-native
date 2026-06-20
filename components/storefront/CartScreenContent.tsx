import { useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { CartEmptyState } from '@/components/storefront/CartEmptyState';
import { CartFilledState } from '@/components/storefront/CartFilledState';
import { CartHeader } from '@/components/storefront/CartHeader';
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
        <CartFilledState cart={cart} estimator={shippingEstimator} isWide={isWide} />
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
