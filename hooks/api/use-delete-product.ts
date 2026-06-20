import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/products';
import { useTenantStore } from '@/stores/use-tenant-store';
import { invalidateProductDependentQueries } from './product-query-invalidation';

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { tenant } = useTenantStore();
  const slug = tenant?.slug;

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(slug!, id),
    onSuccess: () => {
      invalidateProductDependentQueries(queryClient, slug);
    },
  });
}
