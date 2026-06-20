import { View } from "react-native";
import { CreditCard } from "lucide-react-native";
import { Text } from "@/components/ui/Text";
import { getEffectiveOrderStatus } from "@/lib/order-display";
import type { Order, OrderDisplayStatus } from "@/types";
import { InfoBlock } from "./OrderInfoBlocks";

export function OrderPaymentSection({ order }: { order: Order }) {
  const status = getEffectiveOrderStatus(order);

  return (
    <View className="gap-4 rounded-lg border border-border bg-card p-4">
      <View className="flex-row items-center gap-2">
        <CreditCard size={18} color="#171717" />
        <Text variant="h3">Pago</Text>
      </View>
      <View className="gap-3">
        <InfoBlock label="Metodo" value={formatPaymentMethod(order.paymentMethod)} />
        <InfoBlock label="Estado" value={formatPaymentStatus(status)} />
        {order.confirmationNumber ? <InfoBlock label="Confirmacion" value={order.confirmationNumber} /> : null}
      </View>
    </View>
  );
}

function formatPaymentMethod(method?: string): string {
  if (method === "cash") return "Efectivo / contra entrega";
  if (method === "yappy") return "Yappy";
  if (method === "stripe") return "Tarjeta";
  if (method === "pending") return "Pendiente de seleccionar";
  return method ?? "No disponible";
}

function formatPaymentStatus(status: OrderDisplayStatus): string {
  if (["paid", "processing", "ready", "shipped", "delivered", "dispatched"].includes(status)) {
    return "Pago confirmado";
  }
  if (["failed", "rejected"].includes(status)) return "Pago rechazado";
  if (status === "cancelled") return "Cancelado";
  if (status === "expired") return "Expirado";
  return "Pendiente de pago";
}
