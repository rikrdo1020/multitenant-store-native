import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenWrapper } from "@/components/shared/ScreenWrapper";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { OrderListItem } from "@/components/admin/OrderListItem";
import { useAdminOrders } from "@/hooks/api/use-admin-orders";
import { useTenantStore } from "@/stores/use-tenant-store";
import type { AdminOrderFilters, Order, OrderStatus } from "@/types";
import { SlidersHorizontal } from "lucide-react-native";

type StatusFilter = OrderStatus | "all";

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "Todos", value: "all" },
  { label: "Pendiente", value: "pending" },
  { label: "Pagado", value: "paid" },
  { label: "Cancelado", value: "cancelled" },
  { label: "Fallido", value: "failed" },
  { label: "Rechazado", value: "rejected" },
  { label: "Expirado", value: "expired" },
];

export default function AdminOrdersScreen() {
  const router = useRouter();
  const { tenant } = useTenantStore();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  const filters: AdminOrderFilters = {
    ...(statusFilter !== "all" ? { status: statusFilter } : {}),
    page,
    pageSize: 20,
  };

  const { data, isLoading, isRefetching, refetch, error } =
    useAdminOrders(filters);

  const handleRefresh = useCallback(() => {
    setPage(1);
    refetch();
  }, [refetch]);

  const handleOrderPress = (order: Order) => {
    router.push(`/(admin)/orders/${order.documentId}`);
  };

  const handleStatusChange = (value: StatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  const orders = data?.data ?? [];
  const meta = data?.meta;
  const hasNextPage = meta ? page < meta.totalPages : false;

  if (!tenant) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center p-6">
          <Text variant="h2" className="mb-2 text-center">
            Sin tienda
          </Text>
          <Text variant="body" className="text-center text-muted-foreground">
            Selecciona una tienda para ver los pedidos.
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" className="text-primary" />
          <Text variant="body" className="mt-4 text-muted-foreground">
            Cargando pedidos...
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center p-6">
          <Text variant="h2" className="mb-2 text-center text-destructive">
            Error al cargar
          </Text>
          <Text
            variant="body"
            className="mb-6 text-center text-muted-foreground"
          >
            {error instanceof Error ? error.message : "Error inesperado"}
          </Text>
          <Button onPress={() => refetch()}>Reintentar</Button>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View className="flex-1">
        <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
          <Text variant="h1">Pedidos</Text>
          <SlidersHorizontal size={20} className="text-muted-foreground" />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-2 -mx-1 flex-grow-0"
          contentContainerStyle={{ paddingHorizontal: 12, gap: 6 }}
        >
          {STATUS_FILTERS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => handleStatusChange(opt.value)}
              className={`rounded-full border px-4 py-2 ${
                statusFilter === opt.value
                  ? "border-primary bg-primary"
                  : "border-border bg-background"
              }`}
            >
              <Text
                variant="small"
                className={`font-medium ${
                  statusFilter === opt.value
                    ? "text-primary-foreground"
                    : "text-foreground"
                }`}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          style={{ flex: 1 }}
          data={orders}
          keyExtractor={(item) => item.documentId}
          renderItem={({ item }) => (
            <OrderListItem order={item} onPress={handleOrderPress} />
          )}
          ItemSeparatorComponent={() => <View className="h-2" />}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
            />
          }
          ListEmptyComponent={
            <View className="mt-16 items-center">
              <Text variant="body" className="text-muted-foreground">
                No hay pedidos.
              </Text>
            </View>
          }
          ListFooterComponent={
            hasNextPage ? (
              <TouchableOpacity
                onPress={() => setPage((p) => p + 1)}
                className="mt-4 items-center py-3"
              >
                <Text variant="small" className="text-primary font-medium">
                  Cargar más
                </Text>
              </TouchableOpacity>
            ) : null
          }
        />
      </View>
    </ScreenWrapper>
  );
}
