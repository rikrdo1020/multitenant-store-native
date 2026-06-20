import { Linking, TouchableOpacity, View } from 'react-native';
import { ExternalLink, Package, Truck } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { formatOrderOptions, getOrderTotals } from '@/lib/order-display';
import { cn, formatPrice } from '@/lib/utils';
import type { Order } from '@/types';
import { TrackingInfoRow } from './OrderTrackingTimeline';

export function OrderTrackingProductsSection({ order }: { order: Order }) {
  return (
    <View className="gap-3 rounded-lg border border-border bg-card p-4">
      <View className="flex-row items-center gap-2">
        <Package size={18} color="#171717" />
        <Text variant="h3">Productos</Text>
      </View>
      {order.items.map((item, index) => (
        <View
          key={`${item.productId}-${index}`}
          className={cn('gap-1 border-b border-border pb-3', index === order.items.length - 1 && 'border-b-0 pb-0')}
        >
          <View className="flex-row items-start justify-between gap-3">
            <Text className="min-w-0 flex-1 font-semibold">{item.name}</Text>
            <Text className="font-semibold">{formatPrice(item.unitPrice * item.quantity)}</Text>
          </View>
          <Text variant="small">{formatOrderOptions(item)}</Text>
          <Text variant="small">
            {item.quantity} x {formatPrice(item.unitPrice)}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function OrderTrackingShippingSection({ order }: { order: Order }) {
  if (!order.trackingNumber && !order.trackingCarrier && !order.trackingUrl) return null;

  return (
    <View className="gap-3 rounded-lg border border-border bg-card p-4">
      <View className="flex-row items-center gap-2">
        <Truck size={18} color="#171717" />
        <Text variant="h3">Envio</Text>
      </View>
      {order.trackingCarrier ? <TrackingInfoRow label="Carrier" value={order.trackingCarrier} /> : null}
      {order.trackingNumber ? <TrackingInfoRow label="Tracking" value={order.trackingNumber} /> : null}
      {order.trackingUrl ? (
        <TouchableOpacity className="flex-row items-center gap-2" onPress={() => void Linking.openURL(order.trackingUrl!)}>
          <ExternalLink size={16} color="#171717" />
          <Text className="font-semibold underline">Abrir tracking</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export function OrderTrackingTotalsSection({ order }: { order: Order }) {
  const totals = getOrderTotals(order);

  return (
    <View className="gap-3 rounded-lg border border-border bg-card p-4">
      <Text variant="h3">Total confirmado</Text>
      <TrackingInfoRow label="Subtotal" value={formatPrice(totals.subtotal)} />
      <TrackingInfoRow label="Descuento" value={formatPrice(totals.discount)} />
      <TrackingInfoRow label="Envio" value={formatPrice(totals.shippingCost)} />
      {totals.tax > 0 ? <TrackingInfoRow label="Impuesto" value={formatPrice(totals.tax)} /> : null}
      <View className="h-px bg-border" />
      <TrackingInfoRow label="Total" value={formatPrice(totals.total)} strong />
    </View>
  );
}
