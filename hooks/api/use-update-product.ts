import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/products';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { UpdateProductPayload } from '@/types';
import { invalidateProductDependentQueries } from './product-query-invalidation';

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { tenant } = useTenantStore();
  const slug = tenant?.slug;

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductPayload }) =>
      productService.updateProduct(slug!, id, payload),
    onSuccess: (_, variables) => {
      invalidateProductDependentQueries(queryClient, slug);
      queryClient.invalidateQueries({ queryKey: ['product', slug, variables.id] });
    },
  });
}
