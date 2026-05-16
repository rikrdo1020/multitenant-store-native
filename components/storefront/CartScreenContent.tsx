import { ScrollView, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { CartEmptyState } from '@/components/storefront/CartEmptyState';
import { CartHeader } from '@/components/storefront/CartHeader';
import { CartItemRow } from '@/components/storefront/CartItemRow';
import { CartMobileCheckoutBar } from '@/components/storefront/CartMobileCheckoutBar';
import { CartSummary } from '@/components/storefront/CartSummary';
import { useCartScreen } from '@/hooks/use-cart-screen';
import { generateItemKey } from '@/lib/utils';

interface CartScreenContentProps {
  tenantSlug?: string;
}

export function CartScreenContent({ tenantSlug }: CartScreenContentProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 860;
  const cart = useCartScreen(tenantSlug);

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
            <View className="min-w-0 flex-1 gap-3">
              {cart.items.map((item) => (
                <CartItemRow
                  key={generateItemKey(item.documentId, item.selectedOptions)}
                  item={item}
                  currency={cart.currency}
                  onDecrease={cart.handleDecrease}
                  onIncrease={cart.handleIncrease}
                  onRemove={cart.handleRemove}
                />
              ))}
              <Button variant="outline" onPress={cart.goToProducts}>
                Seguir comprando
              </Button>
            </View>

            <View className={isWide ? 'w-96' : undefined}>
              <CartSummary
                pricing={cart.pricing}
                currency={cart.currency}
                shippingLabel="En checkout"
                actionLabel={isWide ? 'Ir al checkout' : undefined}
                onAction={isWide ? cart.goToCheckout : undefined}
              />
            </View>
          </View>
        </ScrollView>
      )}

      {!isWide && cart.items.length > 0 && (
        <CartMobileCheckoutBar
          pricing={cart.pricing}
          currency={cart.currency}
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
