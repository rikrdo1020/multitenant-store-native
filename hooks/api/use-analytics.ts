import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { SalesQuery, TopProductsQuery, AnalyticsQuery } from '@/types';

const DAY_MS = 24 * 60 * 60 * 1000;

export type DateRange = 7 | 30 | 90;

function rangeParams(days: DateRange): AnalyticsQuery {
  const to = new Date();
  const from = new Date(to.getTime() - days * DAY_MS);
  return { from: from.toISOString(), to: to.toISOString() };
}

export function useAnalyticsOverview(days: DateRange = 30) {
  const { tenant } = useTenantStore();
  const params = rangeParams(days);

  return useQuery({
    queryKey: ['analytics', 'overview', tenant?.slug, days],
    queryFn: () => analyticsService.getOverview(tenant!.slug, params),
    enabled: !!tenant?.slug,
    staleTime: 5 * 60_000,
  });
}

export function useAnalyticsSales(days: DateRange = 30, groupBy: SalesQuery['groupBy'] = 'day') {
  const { tenant } = useTenantStore();
  const params: SalesQuery = { ...rangeParams(days), groupBy };

  return useQuery({
    queryKey: ['analytics', 'sales', tenant?.slug, days, groupBy],
    queryFn: () => analyticsService.getSales(tenant!.slug, params),
    enabled: !!tenant?.slug,
    staleTime: 5 * 60_000,
  });
}

export function useAnalyticsTopProducts(days: DateRange = 30, limit = 5) {
  const { tenant } = useTenantStore();
  const params: TopProductsQuery = { ...rangeParams(days), limit };

  return useQuery({
    queryKey: ['analytics', 'top-products', tenant?.slug, days, limit],
    queryFn: () => analyticsService.getTopProducts(tenant!.slug, params),
    enabled: !!tenant?.slug,
    staleTime: 5 * 60_000,
  });
}

export function useAnalyticsLowStock(threshold = 5, limit?: number) {
  const { tenant } = useTenantStore();

  return useQuery({
    queryKey: ['analytics', 'low-stock', tenant?.slug, threshold, limit ?? 'all'],
    queryFn: async () => {
      const products = await analyticsService.getLowStock(tenant!.slug, threshold);
      return limit ? products.slice(0, limit) : products;
    },
    enabled: !!tenant?.slug,
    staleTime: 60_000,
  });
}

export function useAnalyticsCustomers(days: DateRange = 30) {
  const { tenant } = useTenantStore();
  const params = rangeParams(days);

  return useQuery({
    queryKey: ['analytics', 'customers', tenant?.slug, days],
    queryFn: () => analyticsService.getCustomers(tenant!.slug, params),
    enabled: !!tenant?.slug,
    staleTime: 5 * 60_000,
  });
}
