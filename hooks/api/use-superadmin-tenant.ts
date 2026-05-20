import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { superadminService } from "@/services/superadmin";
import type { TenantStatus } from "@/types";

export function useSuperadminTenant(id: string) {
  return useQuery({
    queryKey: ["superadmin-tenant", id],
    queryFn: () => superadminService.getTenant(id),
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useSetTenantStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TenantStatus }) =>
      superadminService.setTenantStatus(id, status),
    onSuccess: (_, { id: documentId }) => {
      queryClient.invalidateQueries({ queryKey: ["superadmin-tenant", documentId] });
      queryClient.invalidateQueries({ queryKey: ["superadmin-tenants"] });
    },
  });
}
