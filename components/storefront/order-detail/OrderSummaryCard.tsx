import { View } from "react-native";
import { OrderStatusBadge } from "@/components/storefront/OrderStatusBadge";
import { Text } from "@/components/ui/Text";
import { getOrderItemCount } from "@/lib/order-display";
import type { Order, OrderDisplayStatus } from "@/types";
import { OrderTimeline } from "./OrderTimeline";

interface OrderSummaryCardProps {
  order: Order;
  status: OrderDisplayStatus;
}

export function OrderSummaryCard({ order, status }: OrderSummaryCardProps) {
  const itemCount = getOrderItemCount(order);

  return (
    <View className="gap-3 rounded-lg border border-border bg-card p-4">
      <View className="gap-3 sm:flex-row sm:items-center sm:justify-between">
        <View className="gap-1">
          <Text variant="h2">Resumen de la orden</Text>
          <Text variant="small">
            {itemCount} {itemCount === 1 ? "producto" : "productos"}
          </Text>
        </View>
        <OrderStatusBadge status={status} />
      </View>
      <OrderTimeline status={status} />
    </View>
  );
}
