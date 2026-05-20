import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customers';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { UpdateCustomerPayload } from '@/types';

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  const { tenant } = useTenantStore();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCustomerPayload }) =>
      customerService.updateCustomer(tenant!.slug, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
    },
  });
}
