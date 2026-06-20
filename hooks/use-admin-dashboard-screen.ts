import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  useAnalyticsLowStock,
  useAnalyticsOverview,
  useAnalyticsSales,
  useAnalyticsTopProducts,
  type DateRange,
} from '@/hooks/api/use-analytics';
import { useRecentOrders } from '@/hooks/api/use-admin-orders';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { LowStockProduct, RecentOrder } from '@/types';

export function useAdminDashboardScreen() {
  const router = useRouter();
  const { tenant } = useTenantStore();
  const [range, setRange] = useState<DateRange>(30);
  const groupBy = range === 90 ? 'week' : 'day';

  const overviewQuery = useAnalyticsOverview(range);
  const salesQuery = useAnalyticsSales(range, groupBy);
  const topProductsQuery = useAnalyticsTopProducts(range, 5);
  const lowStockQuery = useAnalyticsLowStock(5, 5);
  const recentOrdersQuery = useRecentOrders(8);

  const isRefreshing =
    overviewQuery.isLoading ||
    salesQuery.isLoading ||
    topProductsQuery.isLoading ||
    lowStockQuery.isLoading ||
    recentOrdersQuery.isLoading;

  const refresh = () => {
    void overviewQuery.refetch();
    void salesQuery.refetch();
    void topProductsQuery.refetch();
    void lowStockQuery.refetch();
    void recentOrdersQuery.refetch();
  };

  return {
    tenant,
    range,
    setRange,
    overview: overviewQuery.data,
    sales: salesQuery.data ?? [],
    topProducts: topProductsQuery.data ?? [],
    lowStock: lowStockQuery.data ?? [],
    recentOrders: recentOrdersQuery.data ?? [],
    overviewLoading: overviewQuery.isLoading,
    salesLoading: salesQuery.isLoading,
    topProductsLoading: topProductsQuery.isLoading,
    lowStockLoading: lowStockQuery.isLoading,
    recentOrdersLoading: recentOrdersQuery.isLoading,
    lowStockError: lowStockQuery.isError,
    recentOrdersError: recentOrdersQuery.isError,
    retryLowStock: () => void lowStockQuery.refetch(),
    retryRecentOrders: () => void recentOrdersQuery.refetch(),
    isRefreshing,
    refresh,
    goToProduct: (product: LowStockProduct) =>
      router.push(`/(admin)/products/${product.slug}` as never),
    goToLowStock: () =>
      router.push('/(admin)/products?stockStatus=low_stock' as never),
    goToOrder: (order: RecentOrder) =>
      router.push(`/(admin)/orders/${order.documentId}` as never),
    goToOrders: () => router.push('/(admin)/orders' as never),
  };
}

export type AdminDashboardViewModel = ReturnType<typeof useAdminDashboardScreen>;
