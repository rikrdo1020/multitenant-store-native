import { Image, View } from 'react-native';
import type { ReactNode } from 'react';
import { Package } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { formatOrderDate, getOrderTotals } from '@/lib/order-display';
import { formatPrice } from '@/lib/utils';
import type { CreateOrderItemPayload, Order } from '@/types';

export function AdminOrderItemsSection({ order }: { order: Order }) {
  const totals = getOrderTotals(order);

  return (
    <AdminSection title="Items del pedido">
      <View className="overflow-hidden rounded-lg border border-border">
        {order.items.map((item, index) => (
          <AdminOrderItemRow
            key={`${item.productId}-${index}`}
            item={item}
            isLast={index === order.items.length - 1}
          />
        ))}
        <View className="flex-row justify-between border-t border-border bg-muted/40 px-4 py-3">
          <Text variant="body" className="font-semibold text-foreground">
            Total confirmado
          </Text>
          <Text variant="body" className="font-bold text-foreground">
            {formatPrice(totals.total)}
          </Text>
        </View>
      </View>
    </AdminSection>
  );
}

export function AdminOrderCustomerSection({ order }: { order: Order }) {
  return (
    <AdminSection title="Cliente">
      <View className="gap-2">
        <InfoRow label="Nombre" value={order.customerData.name} />
        <InfoRow label="Email" value={order.customerData.email} />
        {order.customerData.phone ? <InfoRow label="Telefono" value={order.customerData.phone} /> : null}
        {order.customerData.notes ? <InfoRow label="Notas" value={order.customerData.notes} /> : null}
      </View>
    </AdminSection>
  );
}

export function AdminOrderShippingSection({ order }: { order: Order }) {
  const shipping = order.shippingData;
  const address = shipping?.address;

  if (!address && !shipping?.method && !shipping?.location) return null;

  return (
    <AdminSection title="Direccion de envio">
      <View className="gap-2">
        {address?.address ? <InfoRow label="Direccion" value={address.address} /> : null}
        {address?.city ? <InfoRow label="Ciudad" value={address.city} /> : null}
        {address?.department ? <InfoRow label="Departamento" value={address.department} /> : null}
        {address?.reference ? <InfoRow label="Referencia" value={address.reference} /> : null}
        {shipping?.method ? <InfoRow label="Metodo" value={shipping.method.name} /> : null}
        {shipping?.location ? <InfoRow label="Punto de entrega" value={shipping.location.label} /> : null}
      </View>
    </AdminSection>
  );
}

export function AdminOrderTrackingSection({ order }: { order: Order }) {
  if (!order.trackingNumber && !order.trackingCarrier && !order.trackingUrl) return null;

  return (
    <AdminSection title="Tracking">
      <View className="gap-2">
        {order.trackingNumber ? <InfoRow label="Numero" value={order.trackingNumber} /> : null}
        {order.trackingCarrier ? <InfoRow label="Carrier" value={order.trackingCarrier} /> : null}
        {order.trackingUrl ? <InfoRow label="URL" value={order.trackingUrl} /> : null}
      </View>
    </AdminSection>
  );
}

export function AdminOrderPaymentSection({ order }: { order: Order }) {
  const totals = getOrderTotals(order);

  return (
    <AdminSection title="Pago">
      <View className="gap-2">
        <InfoRow label="Metodo" value={formatPaymentMethod(order.paymentMethod)} />
        {order.paymentStatus ? <InfoRow label="Estado de pago" value={order.paymentStatus} /> : null}
        <InfoRow label="Subtotal" value={formatPrice(totals.subtotal)} />
        <InfoRow label="Descuento" value={formatPrice(totals.discount)} />
        <InfoRow label="Envio" value={formatPrice(totals.shippingCost)} />
        {totals.tax > 0 ? <InfoRow label="Impuesto" value={formatPrice(totals.tax)} /> : null}
        <InfoRow label="Total" value={formatPrice(totals.total)} />
      </View>
    </AdminSection>
  );
}

export function AdminOrderStatusHistorySection({ order }: { order: Order }) {
  if (!order.statusHistory?.length) return null;

  return (
    <AdminSection title="Historial de estados">
      <View className="overflow-hidden rounded-lg border border-border">
        {order.statusHistory.map((entry, index) => (
          <View
            key={`${entry.status}-${entry.createdAt ?? entry.timestamp ?? index}`}
            className={`gap-2 px-4 py-3 ${index !== (order.statusHistory?.length ?? 0) - 1 ? 'border-b border-border' : ''}`}
          >
            <View className="flex-row items-center justify-between gap-3">
              <OrderStatusBadge status={entry.status} />
              <Text variant="xs" className="text-muted-foreground">
                {formatOrderDate(entry.createdAt ?? entry.timestamp ?? '')}
              </Text>
            </View>
            {entry.note ? (
              <Text variant="small" className="text-muted-foreground">
                {entry.note}
              </Text>
            ) : null}
          </View>
        ))}
      </View>
    </AdminSection>
  );
}

function AdminOrderItemRow({ item, isLast }: { item: CreateOrderItemPayload; isLast: boolean }) {
  return (
    <View className={`flex-row items-center gap-3 p-3 ${isLast ? '' : 'border-b border-border'}`}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} className="h-12 w-12 rounded-md bg-muted" resizeMode="cover" />
      ) : (
        <View className="h-12 w-12 items-center justify-center rounded-md bg-muted">
          <Package size={18} color="#737373" />
        </View>
      )}
      <View className="min-w-0 flex-1">
        <Text variant="body" className="font-medium text-foreground">
          {item.name}
        </Text>
        {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 ? (
          <Text variant="xs" className="text-muted-foreground">
            {Object.entries(item.selectedOptions).map(([key, value]) => `${key}: ${value}`).join(' / ')}
          </Text>
        ) : null}
        <Text variant="small" className="text-muted-foreground">
          {item.quantity} x {formatPrice(item.unitPrice)}
        </Text>
      </View>
      <Text variant="body" className="font-semibold text-foreground">
        {formatPrice(item.quantity * item.unitPrice)}
      </Text>
    </View>
  );
}

function AdminSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-3 rounded-lg border border-border bg-card p-4">
      <Text variant="h3">{title}</Text>
      {children}
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between gap-4">
      <Text variant="small" className="text-muted-foreground">
        {label}
      </Text>
      <Text variant="small" className="min-w-0 flex-1 text-right font-medium text-foreground">
        {value}
      </Text>
    </View>
  );
}

function formatPaymentMethod(method?: string): string {
  switch (method) {
    case 'yappy':
      return 'Yappy';
    case 'cash':
      return 'Efectivo / contra entrega';
    case 'stripe':
      return 'Tarjeta';
    case 'pending':
      return 'Pendiente';
    default:
      return method ?? 'No disponible';
  }
}
