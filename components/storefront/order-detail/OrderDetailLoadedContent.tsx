import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatOrderDate } from "@/lib/order-display";
import type { OrderDetailViewModel } from "@/hooks/use-order-detail-screen";
import { OrderDeliverySection } from "./OrderDeliverySection";
import { OrderDetailHeader } from "./OrderDetailHeader";
import { OrderItemsSection } from "./OrderItemsSection";
import { OrderPaymentSection } from "./OrderPaymentSection";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { OrderTotalsSection } from "./OrderTotalsSection";
import { OrderTrackingSection } from "./OrderTrackingSection";

interface OrderDetailLoadedContentProps {
  detail: OrderDetailViewModel;
}

export function OrderDetailLoadedContent({ detail }: OrderDetailLoadedContentProps) {
  const order = detail.order!;
  const totals = detail.totals!;
  const status = detail.status!;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <OrderDetailHeader
        title={`Orden ${order.orderId}`}
        subtitle={formatOrderDate(order.createdAt)}
        onBack={detail.goBack}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View className="mx-auto w-full max-w-6xl gap-5">
          <OrderSummaryCard order={order} status={status} />
          <View className={detail.isWide ? "flex-row items-start gap-5" : "gap-5"}>
            <View className="min-w-0 flex-1 gap-5">
              <OrderItemsSection order={order} currency={detail.tenant?.currency} />
              <OrderDeliverySection order={order} />
              <OrderTrackingSection order={order} />
            </View>
            <View className={detail.isWide ? "w-96 gap-5" : "gap-5"}>
              <OrderPaymentSection order={order} />
              <OrderTotalsSection totals={totals} currency={detail.tenant?.currency} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
