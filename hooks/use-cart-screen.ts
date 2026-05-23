import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useCartPricing } from '@/hooks/use-cart-pricing';
import { showToast } from '@/lib/toast';
import { useCartStore } from '@/stores/use-cart-store';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { CartItem } from '@/types';

export function useCartScreen(tenantSlug?: string) {
  const router = useRouter();
  const { tenant } = useTenantStore();
  const items = useCartStore((state) => state.items);
  const setTenantScope = useCartStore((state) => state.setTenantScope);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const [isReady, setIsReady] = useState(false);
  const [isClearConfirmVisible, setIsClearConfirmVisible] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadCartScope() {
      setIsReady(false);
      await setTenantScope(tenantSlug ?? null);
      if (mounted) setIsReady(true);
    }

    void loadCartScope();

    return () => {
      mounted = false;
    };
  }, [setTenantScope, tenantSlug]);

  const { pricing, isPricingLoading, pricingError, retryPricing } = useCartPricing(
    items,
    tenantSlug,
  );

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(`/(storefront)/${tenantSlug}/products` as never);
  };

  const goToProducts = () => {
    router.push(`/(storefront)/${tenantSlug}/products` as never);
  };

  const goToCheckout = () => {
    if (items.length === 0) {
      showToast('Agrega productos antes de ir al checkout.', 'info');
      return;
    }

    router.push(`/(storefront)/${tenantSlug}/checkout` as never);
  };

  const handleDecrease = (item: CartItem) => {
    setIsClearConfirmVisible(false);

    if (item.quantity <= 1) {
      removeItem(item.documentId, item.selectedOptions);
      showToast(`${item.name} eliminado del carrito.`, 'success');
      return;
    }

    updateQuantity(item.documentId, item.quantity - 1, item.selectedOptions);
    showToast('Cantidad actualizada.', 'success');
  };

  const handleIncrease = (item: CartItem) => {
    setIsClearConfirmVisible(false);

    if (item.quantity >= item.stock) {
      showToast(`Stock maximo para ${item.name}: ${item.stock}.`, 'info');
      return;
    }

    updateQuantity(item.documentId, item.quantity + 1, item.selectedOptions);
    showToast('Cantidad actualizada.', 'success');
  };

  const handleRemove = (item: CartItem) => {
    setIsClearConfirmVisible(false);
    removeItem(item.documentId, item.selectedOptions);
    showToast(`${item.name} eliminado del carrito.`, 'success');
  };

  const handleClearCart = () => {
    clearCart();
    setIsClearConfirmVisible(false);
    showToast('Carrito vaciado.', 'success');
  };

  return {
    currency: tenant?.currency,
    items,
    pricing,
    isPricingLoading,
    pricingError,
    retryPricing,
    isReady,
    isClearConfirmVisible,
    goBack,
    goToProducts,
    goToCheckout,
    openClearConfirm: () => setIsClearConfirmVisible(true),
    closeClearConfirm: () => setIsClearConfirmVisible(false),
    handleDecrease,
    handleIncrease,
    handleRemove,
    handleClearCart,
  };
}

export type CartScreenViewModel = ReturnType<typeof useCartScreen>;
