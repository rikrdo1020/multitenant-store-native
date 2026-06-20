import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { bannerService } from '@/services/banners';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { StoreBannerPayload } from '@/types';

const bannersQueryKey = (slug?: string) => ['banners', slug];
const storeHomeQueryKey = (slug?: string) => ['store-home', slug];

export function useBanners(enabled = true) {
  const { tenant } = useTenantStore();
  const slug = tenant?.slug;

  return useQuery({
    queryKey: bannersQueryKey(slug),
    queryFn: () => bannerService.getBanners(slug!),
    enabled: !!slug && enabled,
    staleTime: 60_000,
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();
  const { tenant } = useTenantStore();
  const slug = tenant?.slug;

  return useMutation({
    mutationFn: (payload: StoreBannerPayload) =>
      bannerService.createBanner(slug!, payload),
    onSuccess: () => invalidateBannerQueries(queryClient, slug),
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();
  const { tenant } = useTenantStore();
  const slug = tenant?.slug;

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<StoreBannerPayload>;
    }) => bannerService.updateBanner(slug!, id, payload),
    onSuccess: () => invalidateBannerQueries(queryClient, slug),
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();
  const { tenant } = useTenantStore();
  const slug = tenant?.slug;

  return useMutation({
    mutationFn: (id: string) => bannerService.deleteBanner(slug!, id),
    onSuccess: () => invalidateBannerQueries(queryClient, slug),
  });
}

function invalidateBannerQueries(
  queryClient: QueryClient,
  slug?: string,
) {
  queryClient.invalidateQueries({ queryKey: bannersQueryKey(slug) });
  queryClient.invalidateQueries({ queryKey: storeHomeQueryKey(slug) });
}
