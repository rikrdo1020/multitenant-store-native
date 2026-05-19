import { useQuery, keepPreviousData, useMutation, useQueryClient } from "@tanstack/react-query";
import { superadminService } from "@/services/superadmin";
import type { SuperadminUserFilters } from "@/types";

export function useSuperadminUsers(filters?: SuperadminUserFilters) {
  return useQuery({
    queryKey: ["superadmin-users", filters],
    queryFn: () => superadminService.listUsers(filters),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useSetUserActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      superadminService.setUserActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superadmin-users"] });
    },
  });
}
