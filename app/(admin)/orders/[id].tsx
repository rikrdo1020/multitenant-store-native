import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { useAdminOrder } from '@/hooks/api/use-admin-order';
import { useUpdateOrderStatus } from '@/hooks/api/use-update-order-status';
import { formatPrice } from '@/lib/utils';
import type { OrderStatus } from '@/types';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';

const STATUS_OPTIONS: { label: string; value: OrderStatus }[] = [
  { label: 'Pendiente',  value: 'pending' },
  { label: 'Pagado',     value: 'paid' },
  { label: 'Cancelado',  value: 'cancelled' },
  { label: 'Fallido',    value: 'failed' },
  { label: 'Rechazado',  value: 'rejected' },
  { label: 'Expirado',   value: 'expired' },
];

export default function AdminOrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: order, isLoading, error, refetch } = useAdminOrder(id);
  const updateStatus = useUpdateOrderStatus();

  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleStatusSelect = (status: OrderStatus) => {
    setShowStatusPicker(false);
    updateStatus.mutate({ orderId: id, status });
  };

  const handleCancel = () => {
    setShowCancelConfirm(false);
    updateStatus.mutate({ orderId: id, status: 'cancelled' });
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" className="text-primary" />
        </View>
      </ScreenWrapper>
    );
  }

  if (error || !order) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center p-6">
          <Text variant="h2" className="mb-2 text-destructive">Error al cargar</Text>
          <Button onPress={() => refetch()}>Reintentar</Button>
        </View>
      </ScreenWrapper>
    );
  }

  const shipping = order.shippingData;
  const canCancel = order.orderStatus === 'pending' || order.orderStatus === 'paid';

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="flex-row items-center gap-3 px-4 pt-4 pb-2">
          <TouchableOpacity onPress={() => router.back()} className="rounded-full p-1">
            <ArrowLeft size={22} className="text-foreground" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text variant="h1">#{order.orderId}</Text>
          </View>
          <OrderStatusBadge status={order.orderStatus} />
        </View>

        {/* Cambio de estado */}
        <View className="mx-4 mb-4 rounded-xl border border-border bg-card p-4">
          <Text variant="small" className="mb-2 font-semibold uppercase tracking-wide text-muted-foreground">
            Estado del pedido
          </Text>
          <TouchableOpacity
            onPress={() => setShowStatusPicker(true)}
            className="flex-row items-center justify-between rounded-lg border border-border bg-background px-4 py-3"
            disabled={updateStatus.isPending}
          >
            <OrderStatusBadge status={order.orderStatus} />
            <ChevronDown size={18} className="text-muted-foreground" />
          </TouchableOpacity>
        </View>

        {/* Items pedidos */}
        <SectionTitle title="Items del pedido" />
        <View className="mx-4 mb-4 rounded-xl border border-border bg-card overflow-hidden">
          {order.items.map((item, idx) => (
            <View
              key={`${item.productId}-${idx}`}
              className={`flex-row items-center p-3 gap-3 ${idx !== order.items.length - 1 ? 'border-b border-border' : ''}`}
            >
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  className="h-12 w-12 rounded-md bg-muted"
                  resizeMode="cover"
                />
              ) : (
                <View className="h-12 w-12 rounded-md bg-muted" />
              )}
              <View className="flex-1">
                <Text variant="body" className="font-medium text-foreground">{item.name}</Text>
                {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                  <Text variant="xs" className="text-muted-foreground">
                    {Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(' / ')}
                  </Text>
                )}
                <Text variant="small" className="text-muted-foreground">
                  {item.quantity} × {formatPrice(item.unitPrice)}
                </Text>
              </View>
              <Text variant="body" className="font-semibold text-foreground">
                {formatPrice(item.quantity * item.unitPrice)}
              </Text>
            </View>
          ))}
          <View className="flex-row justify-between border-t border-border bg-muted/40 px-4 py-3">
            <Text variant="body" className="font-semibold text-foreground">Total</Text>
            <Text variant="body" className="font-bold text-foreground">{formatPrice(order.total)}</Text>
          </View>
        </View>

        {/* Cliente y dirección */}
        <SectionTitle title="Cliente" />
        <View className="mx-4 mb-4 rounded-xl border border-border bg-card p-4 gap-2">
          <InfoRow label="Nombre" value={order.customerData.name} />
          <InfoRow label="Email" value={order.customerData.email} />
          {order.customerData.phone && (
            <InfoRow label="Teléfono" value={order.customerData.phone} />
          )}
          {order.customerData.notes && (
            <InfoRow label="Notas" value={order.customerData.notes} />
          )}
        </View>

        {shipping?.address && (
          <>
            <SectionTitle title="Dirección de envío" />
            <View className="mx-4 mb-4 rounded-xl border border-border bg-card p-4 gap-2">
              <InfoRow label="Dirección" value={shipping.address.address} />
              <InfoRow label="Ciudad" value={shipping.address.city} />
              {shipping.address.reference && (
                <InfoRow label="Referencia" value={shipping.address.reference} />
              )}
              {shipping.method && (
                <InfoRow label="Método" value={shipping.method.name} />
              )}
              {shipping.location && (
                <InfoRow label="Punto de entrega" value={shipping.location.label} />
              )}
            </View>
          </>
        )}

        {/* Pago */}
        <SectionTitle title="Pago" />
        <View className="mx-4 mb-4 rounded-xl border border-border bg-card p-4 gap-2">
          {order.paymentMethod && (
            <InfoRow
              label="Método"
              value={order.paymentMethod === 'yappy' ? 'Yappy' : order.paymentMethod === 'cash' ? 'Efectivo' : order.paymentMethod}
            />
          )}
          {order.paymentStatus && (
            <InfoRow label="Estado de pago" value={order.paymentStatus} />
          )}
          <InfoRow label="Total" value={formatPrice(order.total)} />
        </View>

        {/* Historial de estados */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <>
            <SectionTitle title="Historial de estados" />
            <View className="mx-4 mb-4 rounded-xl border border-border bg-card overflow-hidden">
              {order.statusHistory.map((entry, idx) => (
                <View
                  key={idx}
                  className={`flex-row items-center justify-between px-4 py-3 ${idx !== (order.statusHistory?.length ?? 0) - 1 ? 'border-b border-border' : ''}`}
                >
                  <OrderStatusBadge status={entry.status} />
                  <Text variant="xs" className="text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleString('es-PA')}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Cancelar orden */}
        {canCancel && (
          <View className="mx-4 mt-2">
            <Button
              variant="destructive"
              onPress={() => setShowCancelConfirm(true)}
              disabled={updateStatus.isPending}
            >
              Cancelar orden
            </Button>
          </View>
        )}
      </ScrollView>

      {/* Status picker modal */}
      <Modal
        visible={showStatusPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStatusPicker(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/40"
          onPress={() => setShowStatusPicker(false)}
        >
          <View className="rounded-t-2xl bg-background pb-8">
            <View className="mx-auto mb-2 mt-3 h-1 w-12 rounded-full bg-muted-foreground/30" />
            <Text variant="body" className="px-4 pb-3 pt-1 font-semibold text-foreground">
              Cambiar estado
            </Text>
            {STATUS_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => handleStatusSelect(opt.value)}
                className={`flex-row items-center justify-between px-4 py-3.5 ${
                  order.orderStatus === opt.value ? 'bg-primary/5' : ''
                }`}
              >
                <OrderStatusBadge status={opt.value} />
                {order.orderStatus === opt.value && (
                  <Text variant="small" className="text-primary font-medium">Actual</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      <ConfirmDialog
        visible={showCancelConfirm}
        title="Cancelar orden"
        description={`¿Cancelar la orden #${order.orderId}? Esta acción no se puede deshacer.`}
        confirmLabel="Sí, cancelar"
        destructive
        loading={updateStatus.isPending}
        onConfirm={handleCancel}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </ScreenWrapper>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <Text variant="small" className="mx-4 mb-1 font-semibold uppercase tracking-wide text-muted-foreground">
      {title}
    </Text>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between gap-4">
      <Text variant="small" className="text-muted-foreground">{label}</Text>
      <Text variant="small" className="flex-1 text-right font-medium text-foreground">{value}</Text>
    </View>
  );
}
