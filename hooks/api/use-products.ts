import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { productService } from "@/services/products";
import { useTenantStore } from "@/stores/use-tenant-store";
import type { ProductFilters } from "@/types";

export function useProducts(
  filters: Omit<ProductFilters, 'page'>,
  tenantSlugOverride?: string,
) {
  const { tenant } = useTenantStore();
  const slug = tenantSlugOverride ?? tenant?.slug;

  return useInfiniteQuery({
    queryKey: ["products", slug, filters],
    queryFn: ({ pageParam }) =>
      productService.getProducts(slug!, { ...filters, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
    enabled: !!slug,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
}
