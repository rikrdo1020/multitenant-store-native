import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/orders';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { OrderStatus } from '@/types';

export function useUpdateOrderStatus() {
  const { tenant } = useTenantStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      if (!tenant?.slug) throw new Error('Tenant required');
      return orderService.updateOrderStatus(tenant.slug, orderId, status);
    },
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders', tenant?.slug] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders', tenant?.slug, orderId] });
    },
  });
}
