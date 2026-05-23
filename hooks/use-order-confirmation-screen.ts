import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { orderService } from '@/services/orders';
import type { Order } from '@/types';

const FAILED_STATUSES = new Set(['failed', 'cancelled', 'rejected', 'expired']);
const SUCCESS_STATUSES = new Set(['paid', 'dispatched']);

interface UseOrderConfirmationScreenParams {
  tenantSlug?: string;
  orderId?: string;
  viewToken?: string;
}

export function useOrderConfirmationScreen({
  tenantSlug,
  orderId,
  viewToken,
}: UseOrderConfirmationScreenParams) {
  const router = useRouter();
  const orderQuery = useQuery<Order>({
    queryKey: ['order-confirmation', tenantSlug, orderId, viewToken],
    queryFn: () => orderService.getOrder(tenantSlug!, orderId!, viewToken!),
    enabled: !!tenantSlug && !!orderId && !!viewToken,
    refetchInterval: false,
    staleTime: 0,
  });

  const goToProducts = () => router.replace(`/(storefront)/${tenantSlug}/products` as never);
  const goBackToPayment = () => router.replace(`/(storefront)/${tenantSlug}/checkout/payment` as never);
  const order = orderQuery.data;
  const status = order?.orderStatus;

  return {
    order,
    isLoading: orderQuery.isLoading,
    isUnavailable: !viewToken || orderQuery.isError || !order,
    isSuccess: !!status && SUCCESS_STATUSES.has(status),
    isFailed: !!status && FAILED_STATUSES.has(status),
    failureMessage: status ? getFailureMessage(status) : undefined,
    goToProducts,
    goBackToPayment,
  };
}

function getFailureMessage(status: string): string {
  switch (status) {
    case 'cancelled':
      return 'Cancelaste el pago.';
    case 'rejected':
      return 'El pago fue rechazado.';
    case 'expired':
      return 'La sesion de pago expiro.';
    default:
      return 'Intenta nuevamente o elige otro metodo de pago.';
  }
}

export type OrderConfirmationViewModel = ReturnType<typeof useOrderConfirmationScreen>;
