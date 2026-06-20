import { View } from "react-native";
import { Truck } from "lucide-react-native";
import { Text } from "@/components/ui/Text";
import { getOrderTotals } from "@/lib/order-display";
import { formatPrice } from "@/lib/utils";
import { TotalRow } from "./OrderInfoBlocks";

interface OrderTotalsSectionProps {
  totals: ReturnType<typeof getOrderTotals>;
  currency?: string;
}

export function OrderTotalsSection({ totals, currency }: OrderTotalsSectionProps) {
  return (
    <View className="gap-4 rounded-lg border border-border bg-card p-4">
      <View className="flex-row items-center gap-2">
        <Truck size={18} color="#171717" />
        <Text variant="h3">Totales</Text>
      </View>
      <View className="gap-3">
        <TotalRow label="Subtotal" value={formatPrice(totals.subtotal, currency)} />
        <TotalRow label="Descuento" value={formatPrice(totals.discount, currency)} />
        <TotalRow label="Envio" value={formatPrice(totals.shippingCost, currency)} />
        {totals.tax > 0 ? <TotalRow label="Impuesto" value={formatPrice(totals.tax, currency)} /> : null}
        <View className="h-px bg-border" />
        <TotalRow label="Total" value={formatPrice(totals.total, currency)} strong />
      </View>
    </View>
  );
}
