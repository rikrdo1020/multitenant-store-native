import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagService } from '@/services/tags';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { CreateTagPayload, UpdateTagPayload } from '@/types';

export function useCatalogTags() {
  const { tenant } = useTenantStore();
  const slug = tenant?.slug;

  return useQuery({
    queryKey: ['tags', slug],
    queryFn: () => tagService.getTags(slug!),
    enabled: !!slug,
    staleTime: 5 * 60_000,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();
  const { tenant } = useTenantStore();
  const slug = tenant?.slug;

  return useMutation({
    mutationFn: (payload: CreateTagPayload) => tagService.createTag(slug!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();
  const { tenant } = useTenantStore();
  const slug = tenant?.slug;

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTagPayload }) =>
      tagService.updateTag(slug!, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  const { tenant } = useTenantStore();
  const slug = tenant?.slug;

  return useMutation({
    mutationFn: (id: string) => tagService.deleteTag(slug!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}
