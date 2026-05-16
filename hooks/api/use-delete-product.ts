import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/products';
import { useTenantStore } from '@/stores/use-tenant-store';

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { tenant } = useTenantStore();
  const slug = tenant?.slug;

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(slug!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
