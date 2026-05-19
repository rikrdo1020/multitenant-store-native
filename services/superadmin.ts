import api from "./api";
import type {
  ApiResponse,
  SuperadminTenantsResult,
  SuperadminTenantDetail,
  SuperadminUsersResult,
  SuperadminTenantFilters,
  SuperadminUserFilters,
  TenantStatus,
} from "@/types";

export const superadminService = {
  listTenants: async (
    filters: SuperadminTenantFilters = {},
  ): Promise<SuperadminTenantsResult> => {
    const { page = 1, pageSize = 20 } = filters;
    const response = await api.get<ApiResponse<SuperadminTenantsResult["data"]>>(
      "/superadmin/tenants",
      { params: { page, pageSize }, headers: { "x-tenant-id": undefined } },
    );
    return { data: response.data.data, meta: response.data.meta! };
  },

  getTenant: async (id: string): Promise<SuperadminTenantDetail> => {
    const response = await api.get<ApiResponse<SuperadminTenantDetail>>(
      `/superadmin/tenants/${id}`,
      { headers: { "x-tenant-id": undefined } },
    );
    return response.data.data;
  },

  setTenantStatus: async (
    documentId: string,
    status: TenantStatus,
  ): Promise<SuperadminTenantDetail> => {
    const response = await api.put<ApiResponse<SuperadminTenantDetail>>(
      `/superadmin/tenants/${documentId}/status`,
      { status },
      { headers: { "x-tenant-id": undefined } },
    );
    return response.data.data;
  },

  listUsers: async (
    filters: SuperadminUserFilters = {},
  ): Promise<SuperadminUsersResult> => {
    const { page = 1, pageSize = 20 } = filters;
    const response = await api.get<ApiResponse<SuperadminUsersResult["data"]>>(
      "/superadmin/users",
      { params: { page, pageSize }, headers: { "x-tenant-id": undefined } },
    );
    return { data: response.data.data, meta: response.data.meta! };
  },

  setUserActive: async (
    documentId: string,
    isActive: boolean,
  ): Promise<{ documentId: string; email: string; name: string | null; isActive: boolean }> => {
    const response = await api.put<ApiResponse<{ documentId: string; email: string; name: string | null; isActive: boolean }>>(
      `/superadmin/users/${documentId}/active`,
      { isActive },
      { headers: { "x-tenant-id": undefined } },
    );
    return response.data.data;
  },
};
