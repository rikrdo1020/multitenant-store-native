import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productTypeService } from '@/services/product-types';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { CreateProductTypePayload, UpdateProductTypePayload } from '@/types';

export function useCatalogProductTypes() {
  const { tenant } = useTenantStore();
  const slug = tenant?.slug;

  return useQuery({
    queryKey: ['product-types', slug],
    queryFn: () => productTypeService.getProductTypes(slug!),
    enabled: !!slug,
    staleTime: 5 * 60_000,
  });
}

export function useCreateProductType() {
  const queryClient = useQueryClient();
  const { tenant } = useTenantStore();
  const slug = tenant?.slug;

  return useMutation({
    mutationFn: (payload: CreateProductTypePayload) =>
      productTypeService.createProductType(slug!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-types'] });
    },
  });
}

export function useUpdateProductType() {
  const queryClient = useQueryClient();
  const { tenant } = useTenantStore();
  const slug = tenant?.slug;

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductTypePayload }) =>
      productTypeService.updateProductType(slug!, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-types'] });
    },
  });
}

export function useDeleteProductType() {
  const queryClient = useQueryClient();
  const { tenant } = useTenantStore();
  const slug = tenant?.slug;

  return useMutation({
    mutationFn: (id: string) => productTypeService.deleteProductType(slug!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-types'] });
    },
  });
}
