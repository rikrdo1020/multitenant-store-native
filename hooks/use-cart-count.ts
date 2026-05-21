import { useEffect, useMemo } from 'react';
import { useCartStore } from '@/stores/use-cart-store';

export function useCartCount(tenantSlug?: string) {
  const items = useCartStore((state) => state.items);
  const tenantKey = useCartStore((state) => state.tenantKey);
  const setTenantScope = useCartStore((state) => state.setTenantScope);

  useEffect(() => {
    const nextTenantKey = tenantSlug ?? null;
    if (tenantKey !== nextTenantKey) {
      void setTenantScope(nextTenantKey);
    }
  }, [setTenantScope, tenantKey, tenantSlug]);

  return useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );
}
