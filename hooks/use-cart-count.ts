import { useEffect, useMemo } from 'react';
import { useCartStore } from '@/stores/use-cart-store';

export function useCartCount(tenantSlug?: string) {
  const items = useCartStore((state) => state.items);
  const setTenantScope = useCartStore((state) => state.setTenantScope);

  useEffect(() => {
    void setTenantScope(tenantSlug ?? null);
  }, [setTenantScope, tenantSlug]);

  return useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );
}
