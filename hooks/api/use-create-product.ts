import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/products';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { CreateProductPayload } from '@/types';
import { invalidateProductDependentQueries } from './product-query-invalidation';

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { tenant } = useTenantStore();
  const slug = tenant?.slug;

  return useMutation({
    mutationFn: (payload: CreateProductPayload) =>
      productService.createProduct(slug!, payload),
    onSuccess: () => {
      invalidateProductDependentQueries(queryClient, slug);
    },
  });
}
