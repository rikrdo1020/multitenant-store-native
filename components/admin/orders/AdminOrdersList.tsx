import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import { OrderListItem } from "@/components/admin/OrderListItem";
import { Text } from "@/components/ui/Text";
import type { Order } from "@/types";

interface AdminOrdersListProps {
  orders: Order[];
  isRefetching: boolean;
  hasNextPage: boolean;
  onRefresh: () => void;
  onLoadNextPage: () => void;
  onOrderPress: (order: Order) => void;
}

export function AdminOrdersList({
  orders,
  isRefetching,
  hasNextPage,
  onRefresh,
  onLoadNextPage,
  onOrderPress,
}: AdminOrdersListProps) {
  return (
    <FlatList
      style={{ flex: 1 }}
      data={orders}
      keyExtractor={(item) => item.documentId}
      renderItem={({ item }) => (
        <OrderListItem order={item} onPress={onOrderPress} />
      )}
      ItemSeparatorComponent={() => <View className="h-2" />}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
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
          <TouchableOpacity onPress={onLoadNextPage} className="mt-4 items-center py-3">
            <Text variant="small" className="text-primary font-medium">
              Cargar mas
            </Text>
          </TouchableOpacity>
        ) : null
      }
    />
  );
}
