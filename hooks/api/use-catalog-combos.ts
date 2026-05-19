import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { comboService } from '@/services/combos';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { CreateComboPayload, UpdateComboPayload } from '@/types';

export function useCatalogCombos() {
  const { tenant } = useTenantStore();
  const slug = tenant?.slug;

  return useQuery({
    queryKey: ['combos', slug],
    queryFn: () => comboService.getCombos(slug!),
    enabled: !!slug,
    staleTime: 5 * 60_000,
  });
}

export function useCreateCombo() {
  const queryClient = useQueryClient();
  const { tenant } = useTenantStore();
  const slug = tenant?.slug;

  return useMutation({
    mutationFn: (payload: CreateComboPayload) =>
      comboService.createCombo(slug!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combos'] });
    },
  });
}

export function useUpdateCombo() {
  const queryClient = useQueryClient();
  const { tenant } = useTenantStore();
  const slug = tenant?.slug;

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateComboPayload }) =>
      comboService.updateCombo(slug!, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combos'] });
    },
  });
}

export function useDeleteCombo() {
  const queryClient = useQueryClient();
  const { tenant } = useTenantStore();
  const slug = tenant?.slug;

  return useMutation({
    mutationFn: (id: string) => comboService.deleteCombo(slug!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combos'] });
    },
  });
}
