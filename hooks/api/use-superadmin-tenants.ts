import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { superadminService } from "@/services/superadmin";
import type { SuperadminTenantFilters } from "@/types";

export function useSuperadminTenants(filters?: SuperadminTenantFilters) {
  return useQuery({
    queryKey: ["superadmin-tenants", filters],
    queryFn: () => superadminService.listTenants(filters),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}
