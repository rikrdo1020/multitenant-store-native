import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { orderService } from '@/services/orders';
import type { Order } from '@/types';

interface UseOrderTrackingScreenParams {
  tenantSlug?: string;
  orderId?: string;
  viewToken?: string;
}

export function useOrderTrackingScreen({
  tenantSlug,
  orderId,
  viewToken,
}: UseOrderTrackingScreenParams) {
  const router = useRouter();
  const [tenantInput, setTenantInput] = useState(tenantSlug ?? '');
  const [orderIdInput, setOrderIdInput] = useState(orderId ?? '');
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    setTenantInput(tenantSlug ?? '');
    setOrderIdInput(orderId ?? '');
  }, [tenantSlug, orderId]);

  const tokenQuery = useQuery<Order>({
    queryKey: ['order-tracking', tenantSlug, orderId, viewToken],
    queryFn: () =>
      orderId
        ? orderService.getOrder(tenantSlug!, orderId, viewToken!)
        : orderService.getOrderByViewToken(tenantSlug!, viewToken!),
    enabled: !!tenantSlug && !!viewToken,
    retry: false,
  });

  const emailMutation = useMutation({
    mutationFn: () =>
      orderService.trackOrderByEmail(tenantInput.trim(), {
        orderId: orderIdInput.trim(),
        email: emailInput.trim(),
      }),
  });

  const order = tokenQuery.data ?? emailMutation.data;
  const isLoading = tokenQuery.isLoading || emailMutation.isPending;
  const canSubmitByEmail =
    !!tenantInput.trim() && !!orderIdInput.trim() && !!emailInput.trim() && !isLoading;

  return {
    order,
    isLoading,
    tokenError: tokenQuery.isError,
    emailError: emailMutation.error,
    tenantInput,
    setTenantInput,
    orderIdInput,
    setOrderIdInput,
    emailInput,
    setEmailInput,
    canSubmitByEmail,
    submitByEmail: () => emailMutation.mutate(),
    goBack: () => router.back(),
  };
}

export type OrderTrackingViewModel = ReturnType<typeof useOrderTrackingScreen>;
