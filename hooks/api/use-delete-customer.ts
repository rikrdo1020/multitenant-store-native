import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customers';
import { useTenantStore } from '@/stores/use-tenant-store';

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  const { tenant } = useTenantStore();

  return useMutation({
    mutationFn: (id: string) => customerService.deleteCustomer(tenant!.slug, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
    },
  });
}
