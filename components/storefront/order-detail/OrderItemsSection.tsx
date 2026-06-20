import { Image, View } from "react-native";
import { Package } from "lucide-react-native";
import { Text } from "@/components/ui/Text";
import { formatOrderOptions } from "@/lib/order-display";
import { formatPrice } from "@/lib/utils";
import type { CreateOrderItemPayload, Order } from "@/types";

export function OrderItemsSection({
  order,
  currency,
}: {
  order: Order;
  currency?: string;
}) {
  return (
    <View className="gap-3 rounded-lg border border-border bg-card p-4">
      <Text variant="h3">Productos</Text>
      <View className="gap-3">
        {order.items.map((item, index) => (
          <OrderItemRow key={`${item.productId}-${index}`} item={item} currency={currency} />
        ))}
      </View>
    </View>
  );
}

function OrderItemRow({ item, currency }: { item: CreateOrderItemPayload; currency?: string }) {
  return (
    <View className="flex-row gap-3 border-b border-border pb-3 last:border-b-0 last:pb-0">
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} className="h-16 w-16 rounded-md bg-muted" resizeMode="cover" />
      ) : (
        <View className="h-16 w-16 items-center justify-center rounded-md bg-muted">
          <Package size={20} color="#737373" />
        </View>
      )}
      <View className="min-w-0 flex-1 gap-1">
        <View className="gap-1 sm:flex-row sm:items-start sm:justify-between">
          <Text className="min-w-0 flex-1 font-semibold">{item.name}</Text>
          <Text className="font-semibold">
            {formatPrice(item.unitPrice * item.quantity, currency)}
          </Text>
        </View>
        <Text variant="small">{formatOrderOptions(item)}</Text>
        <Text variant="small">
          {item.quantity} x {formatPrice(item.unitPrice, currency)}
        </Text>
      </View>
    </View>
  );
}
