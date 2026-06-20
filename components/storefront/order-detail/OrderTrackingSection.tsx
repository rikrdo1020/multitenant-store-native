import { Linking, TouchableOpacity, View } from "react-native";
import { ExternalLink, Truck } from "lucide-react-native";
import { Text } from "@/components/ui/Text";
import type { Order } from "@/types";
import { InfoBlock } from "./OrderInfoBlocks";

export function OrderTrackingSection({ order }: { order: Order }) {
  if (!order.trackingNumber && !order.trackingCarrier && !order.trackingUrl) {
    return null;
  }

  return (
    <View className="gap-4 rounded-lg border border-border bg-card p-4">
      <View className="flex-row items-center gap-2">
        <Truck size={18} color="#171717" />
        <Text variant="h3">Seguimiento</Text>
      </View>
      <View className="gap-3">
        {order.trackingCarrier ? <InfoBlock label="Carrier" value={order.trackingCarrier} /> : null}
        {order.trackingNumber ? <InfoBlock label="Tracking" value={order.trackingNumber} /> : null}
        {order.trackingUrl ? (
          <TouchableOpacity className="flex-row items-center gap-2" onPress={() => void Linking.openURL(order.trackingUrl!)}>
            <ExternalLink size={16} color="#171717" />
            <Text className="font-semibold underline">Abrir tracking</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}
