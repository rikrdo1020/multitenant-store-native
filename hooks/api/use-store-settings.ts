import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/services/settings';
import type { UpdateSettingsPayload } from '@/types';

export function useStoreSettings() {
  return useQuery({
    queryKey: ['store-settings'],
    queryFn: () => settingsService.getSettings(),
    staleTime: 5 * 60_000,
  });
}

export function useUpdateStoreSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateSettingsPayload) => settingsService.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
    },
  });
}
