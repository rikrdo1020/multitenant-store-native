import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { useSuperadminTenant, useSetTenantStatus } from "@/hooks/api/use-superadmin-tenant";
import { useTenantStore } from "@/stores/use-tenant-store";
import type { Tenant, TenantStatus } from "@/types";

export interface TenantStatusAction {
  label: string;
  status: TenantStatus;
  destructive: boolean;
}

const STATUS_ACTIONS: TenantStatusAction[] = [
  { label: "Activar", status: "active", destructive: false },
  { label: "Suspender", status: "suspended", destructive: true },
  { label: "Desactivar", status: "inactive", destructive: true },
];

export function useSuperadminTenantDetailScreen(id?: string) {
  const router = useRouter();
  const { data: tenant, isLoading, error } = useSuperadminTenant(id ?? "");
  const { mutate: setStatus, isPending } = useSetTenantStatus();
  const setTenant = useTenantStore((state) => state.setTenant);
  const [pendingAction, setPendingAction] = useState<TenantStatusAction | null>(null);

  const availableActions = useMemo(
    () => STATUS_ACTIONS.filter((action) => action.status !== tenant?.status),
    [tenant?.status],
  );

  const createdAt = useMemo(() => {
    if (!tenant?.createdAt) return "";

    return new Date(tenant.createdAt).toLocaleDateString("es-PA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [tenant?.createdAt]);

  const goBack = () => {
    router.back();
  };

  const selectTenantForAdmin = (): boolean => {
    if (!tenant) return false;

    setTenant({
      documentId: tenant.documentId,
      slug: tenant.slug,
      name: tenant.name,
      currency: tenant.settings?.currency,
    } satisfies Tenant);
    return true;
  };

  const manageStoreAdmin = () => {
    if (!selectTenantForAdmin()) return;

    router.push("/(admin)/dashboard" as never);
  };

  const manageMembers = () => {
    if (!selectTenantForAdmin()) return;

    router.push("/(admin)/members" as never);
  };

  const confirmStatusAction = () => {
    if (!tenant || !pendingAction) return;

    setStatus({ id: tenant.documentId, status: pendingAction.status }, { onSuccess: () => setPendingAction(null) });
  };

  return {
    tenant,
    isLoading,
    hasError: Boolean(error || (!isLoading && !tenant)),
    createdAt,
    availableActions,
    pendingAction,
    isUpdatingStatus: isPending,
    goBack,
    manageStoreAdmin,
    manageMembers,
    openStatusAction: setPendingAction,
    closeStatusAction: () => setPendingAction(null),
    confirmStatusAction,
  };
}

export type SuperadminTenantDetailViewModel = ReturnType<typeof useSuperadminTenantDetailScreen>;
