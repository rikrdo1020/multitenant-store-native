import type { QueryClient } from '@tanstack/react-query';

export function invalidateProductDependentQueries(
  queryClient: QueryClient,
  tenantSlug?: string,
) {
  queryClient.invalidateQueries({ queryKey: ['admin-products'] });
  queryClient.invalidateQueries({ queryKey: ['products'] });
  queryClient.invalidateQueries({ queryKey: ['analytics', 'low-stock', tenantSlug] });
  queryClient.invalidateQueries({ queryKey: ['store-home', tenantSlug] });
}
