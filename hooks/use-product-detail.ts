import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Product } from '@/types';
import {
  getMissingOptionNames,
  getSelectedOptionsForCart,
  normalizeProductOptions,
} from '@/lib/product-detail';
import { useCartStore } from '@/stores/use-cart-store';

export function useProductDetail(product: Product | undefined, tenantSlug?: string) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isCartScopeReady, setIsCartScopeReady] = useState(false);
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

  const isOutOfStock = !product || product.stock <= 0;
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
    addItem(product, selectedOptionsForCart, tenantSlug);
  }, [addItem, canAddToCart, product, selectedOptionsForCart, tenantSlug]);

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
