import { useMemo } from 'react';
import { useCombos } from '@/hooks/api/use-combos';
import { calculateCartPricing } from '@/lib/pricing';
import type { CartItem } from '@/types';

export function useCartPricing(items: CartItem[], tenantSlug?: string) {
  const combosQuery = useCombos(tenantSlug, items.length > 0);

  const pricing = useMemo(
    () => calculateCartPricing(items, combosQuery.data ?? []),
    [combosQuery.data, items],
  );

  return {
    pricing,
    isPricingLoading: items.length > 0 && combosQuery.isLoading,
    pricingError: combosQuery.isError
      ? 'No pudimos calcular combos. El total final se recalculara al crear la orden.'
      : null,
    retryPricing: combosQuery.refetch,
  };
}
