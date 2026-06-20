import { View } from "react-native";
import { SlidersHorizontal } from "lucide-react-native";
import { ScreenWrapper } from "@/components/shared/ScreenWrapper";
import { Text } from "@/components/ui/Text";
import { AdminOrdersList } from "@/components/admin/orders/AdminOrdersList";
import { AdminOrdersState } from "@/components/admin/orders/AdminOrdersState";
import { AdminOrdersStatusFilters } from "@/components/admin/orders/AdminOrdersStatusFilters";
import { useAdminOrdersScreen } from "@/hooks/use-admin-orders-screen";

export function AdminOrdersScreen() {
  const screen = useAdminOrdersScreen();

  if (!screen.tenant) {
    return (
      <ScreenWrapper>
        <AdminOrdersState title="Sin tienda" message="Selecciona una tienda para ver los pedidos." />
      </ScreenWrapper>
    );
  }

  if (screen.isLoading) {
    return (
      <ScreenWrapper>
        <AdminOrdersState message="Cargando pedidos..." loading />
      </ScreenWrapper>
    );
  }

  if (screen.error) {
    return (
      <ScreenWrapper>
        <AdminOrdersState
          title="Error al cargar"
          message={screen.error instanceof Error ? screen.error.message : "Error inesperado"}
          error
          onRetry={screen.retry}
        />
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
        <AdminOrdersStatusFilters selected={screen.statusFilter} onSelect={screen.handleStatusChange} />
        <AdminOrdersList
          orders={screen.orders}
          isRefetching={screen.isRefetching}
          hasNextPage={screen.hasNextPage}
          onRefresh={screen.handleRefresh}
          onLoadNextPage={screen.loadNextPage}
          onOrderPress={screen.handleOrderPress}
        />
      </View>
    </ScreenWrapper>
  );
}
