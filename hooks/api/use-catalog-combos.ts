import { useMutation, useQueryClient } from '@tanstack/react-query';
import { comboService } from '@/services/combos';
import { combosQueryKey, useCombos } from '@/hooks/api/use-combos';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { CreateComboPayload, UpdateComboPayload } from '@/types';

export function useCatalogCombos() {
  return useCombos();
}

export function useCreateCombo() {
  const queryClient = useQueryClient();
  const { tenant } = useTenantStore();
  const slug = tenant?.slug;

  return useMutation({
    mutationFn: (payload: CreateComboPayload) =>
      comboService.createCombo(slug!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: combosQueryKey(slug) });
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
      queryClient.invalidateQueries({ queryKey: combosQueryKey(slug) });
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
      queryClient.invalidateQueries({ queryKey: combosQueryKey(slug) });
    },
  });
}
