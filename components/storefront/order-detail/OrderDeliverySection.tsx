import { View } from "react-native";
import { MapPin } from "lucide-react-native";
import { Text } from "@/components/ui/Text";
import {
  getOrderShippingAddress,
  getOrderShippingLocationName,
  getOrderShippingMethodName,
} from "@/lib/order-display";
import type { Order } from "@/types";
import { InfoBlock } from "./OrderInfoBlocks";

export function OrderDeliverySection({ order }: { order: Order }) {
  const addressLines = getOrderShippingAddress(order);
  const methodName = getOrderShippingMethodName(order);
  const locationName = getOrderShippingLocationName(order);

  return (
    <View className="gap-4 rounded-lg border border-border bg-card p-4">
      <View className="flex-row items-center gap-2">
        <MapPin size={18} color="#171717" />
        <Text variant="h3">Entrega</Text>
      </View>
      <View className="gap-3">
        <InfoBlock label="Direccion" value={addressLines.join(", ")} />
        <InfoBlock label="Metodo de envio" value={methodName} />
        {locationName ? <InfoBlock label="Zona o punto" value={locationName} /> : null}
      </View>
    </View>
  );
}
