import { useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTenant } from '@/hooks/api/use-tenant';
import { useOrder } from '@/hooks/api/use-orders';
import { getEffectiveOrderStatus, getOrderTotals } from '@/lib/order-display';
import { useAuthStore } from '@/stores/use-auth-store';

interface UseOrderDetailScreenParams {
  tenantSlug?: string;
  orderId?: string;
}

export function useOrderDetailScreen({ tenantSlug, orderId }: UseOrderDetailScreenParams) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const tenantQuery = useTenant(tenantSlug ?? '');
  const orderQuery = useOrder(isAuthenticated ? tenantSlug : undefined, orderId);
  const order = orderQuery.data;

  return {
    tenant: tenantQuery.data,
    order,
    isWide: width >= 980,
    isAuthenticated,
    isLoading: orderQuery.isLoading,
    isError: orderQuery.isError,
    retryOrder: () => orderQuery.refetch(),
    status: order ? getEffectiveOrderStatus(order) : undefined,
    totals: order ? getOrderTotals(order) : undefined,
    goBack: () => router.back(),
    goToLogin: () => {
      const returnTo = tenantSlug && orderId ? `/(storefront)/${tenantSlug}/orders/${orderId}` : '/';
      router.push(`/(auth)/login?returnTo=${encodeURIComponent(returnTo)}` as never);
    },
  };
}

export type OrderDetailViewModel = ReturnType<typeof useOrderDetailScreen>;
