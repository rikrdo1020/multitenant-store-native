import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Product } from '@/types';
import {
  getMissingOptionNames,
  getSelectedOptionsForCart,
  normalizeProductOptions,
} from '@/lib/product-detail';
import { showToast } from '@/lib/toast';
import { generateItemKey } from '@/lib/utils';
import { useCartStore } from '@/stores/use-cart-store';

export function useProductDetail(product: Product | undefined, tenantSlug?: string) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isCartScopeReady, setIsCartScopeReady] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const setTenantScope = useCartStore((state) => state.setTenantScope);

  const optionGroups = useMemo(
    () => normalizeProductOptions(product?.options),
    [product?.options],
  );

  const missingOptionNames = useMemo(
    () => getMissingOptionNames(optionGroups, selectedOptions),
    [optionGroups, selectedOptions],
  );

  const selectedOptionsForCart = useMemo(
    () => getSelectedOptionsForCart(optionGroups, selectedOptions),
    [optionGroups, selectedOptions],
  );
  const selectedCartQuantity = useMemo(() => {
    if (!product) return 0;

    const selectedKey = generateItemKey(product.documentId, selectedOptionsForCart);
    const currentItem = cartItems.find(
      (item) => generateItemKey(item.documentId, item.selectedOptions) === selectedKey,
    );

    return currentItem?.quantity ?? 0;
  }, [cartItems, product, selectedOptionsForCart]);

  const availableStock = product?.availableStock ?? product?.stock ?? 0;
  const isOutOfStock = !product || availableStock <= 0;
  const canAddToCart = !!product && isCartScopeReady && !isOutOfStock && missingOptionNames.length === 0;
  const addDisabledReason = getAddDisabledReason(isCartScopeReady, isOutOfStock, missingOptionNames);

  useEffect(() => {
    setSelectedOptions({});
  }, [product?.documentId]);

  useEffect(() => {
    let isActive = true;

    if (tenantSlug) {
      setIsCartScopeReady(false);
      void setTenantScope(tenantSlug).finally(() => {
        if (isActive) {
          setIsCartScopeReady(true);
        }
      });
    } else {
      setIsCartScopeReady(false);
    }

    return () => {
      isActive = false;
    };
  }, [setTenantScope, tenantSlug]);

  const selectOption = useCallback((optionName: string, value: string) => {
    setSelectedOptions((current) => ({ ...current, [optionName]: value }));
  }, []);

  const addToCart = useCallback(() => {
    if (!product || !tenantSlug || !canAddToCart) return;

    const effectiveStock = product.availableStock ?? product.stock;
    if (selectedCartQuantity >= effectiveStock) {
      showToast(
        'Stock maximo alcanzado',
        'info',
        `${product.name} tiene ${effectiveStock} disponible${effectiveStock === 1 ? '' : 's'}.`,
      );
      return;
    }

    addItem(product, selectedOptionsForCart, tenantSlug);
    showToast('Producto agregado al carrito', 'success', product.name);
  }, [
    addItem,
    canAddToCart,
    product,
    selectedCartQuantity,
    selectedOptionsForCart,
    tenantSlug,
  ]);

  return {
    optionGroups,
    selectedOptions,
    missingOptionNames,
    selectedOptionsForCart,
    canAddToCart,
    addDisabledReason,
    isCartScopeReady,
    selectOption,
    addToCart,
  };
}

function getAddDisabledReason(
  isCartScopeReady: boolean,
  isOutOfStock: boolean,
  missingOptionNames: string[],
): string | null {
  if (!isCartScopeReady) return 'Preparando carrito';
  if (isOutOfStock) return 'Producto agotado';
  if (missingOptionNames.length === 0) return null;
  return `Selecciona ${missingOptionNames.join(', ')}`;
}
