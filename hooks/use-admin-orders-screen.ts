import { useCallback, useState } from "react";
import { useRouter } from "expo-router";
import { useAdminOrders } from "@/hooks/api/use-admin-orders";
import { useTenantStore } from "@/stores/use-tenant-store";
import type { AdminOrderFilters, Order, OrderStatus } from "@/types";

export type AdminOrderStatusFilter = OrderStatus | "all";

export const ADMIN_ORDER_STATUS_FILTERS: {
  label: string;
  value: AdminOrderStatusFilter;
}[] = [
  { label: "Todos", value: "all" },
  { label: "Pendiente", value: "pending" },
  { label: "Pagado", value: "paid" },
  { label: "Preparando", value: "processing" },
  { label: "Preparado", value: "ready" },
  { label: "Enviado", value: "shipped" },
  { label: "Entregado", value: "delivered" },
  { label: "Cancelado", value: "cancelled" },
  { label: "Fallido", value: "failed" },
  { label: "Rechazado", value: "rejected" },
  { label: "Expirado", value: "expired" },
];

export function useAdminOrdersScreen() {
  const router = useRouter();
  const { tenant } = useTenantStore();
  const [statusFilter, setStatusFilter] =
    useState<AdminOrderStatusFilter>("all");
  const [page, setPage] = useState(1);

  const filters: AdminOrderFilters = {
    ...(statusFilter !== "all" ? { status: statusFilter } : {}),
    page,
    pageSize: 20,
  };
  const ordersQuery = useAdminOrders(filters);
  const meta = ordersQuery.data?.meta;

  const handleRefresh = useCallback(() => {
    setPage(1);
    ordersQuery.refetch();
  }, [ordersQuery]);

  const handleStatusChange = (value: AdminOrderStatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleOrderPress = (order: Order) => {
    router.push(`/(admin)/orders/${order.documentId}`);
  };

  return {
    tenant,
    statusFilter,
    orders: ordersQuery.data?.data ?? [],
    isLoading: ordersQuery.isLoading,
    isRefetching: ordersQuery.isRefetching,
    error: ordersQuery.error,
    hasNextPage: meta ? page < meta.totalPages : false,
    retry: ordersQuery.refetch,
    handleRefresh,
    handleOrderPress,
    handleStatusChange,
    loadNextPage: () => setPage((currentPage) => currentPage + 1),
  };
}
