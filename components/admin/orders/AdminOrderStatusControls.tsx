import { Modal, Pressable, TextInput, TouchableOpacity, View } from 'react-native';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { ADMIN_ORDER_STATUS_OPTIONS, type AdminOrderDetailViewModel } from '@/hooks/use-admin-order-detail-screen';
import { getOrderTimeline } from '@/lib/order-display';
import { cn } from '@/lib/utils';
import type { Order } from '@/types';

interface AdminOrderStatusControlsProps {
  detail: AdminOrderDetailViewModel;
  order: Order;
}

export function AdminOrderStatusControls({ detail, order }: AdminOrderStatusControlsProps) {
  return (
    <View className="gap-4 rounded-lg border border-border bg-card p-4">
      <View className="gap-3 sm:flex-row sm:items-center sm:justify-between">
        <View className="gap-1">
          <Text variant="h3">Estado del pedido</Text>
          <Text variant="small">Avanza la orden por el flujo operativo.</Text>
        </View>
        <Button
          variant="outline"
          onPress={() => detail.setShowStatusPicker(true)}
          disabled={detail.isUpdating}
        >
          Cambiar estado
        </Button>
      </View>

      <OrderFulfillmentStepper order={order} />

      {detail.updateError ? (
        <View className="rounded-md border border-destructive bg-destructive/5 p-3">
          <Text variant="small" className="text-destructive">
            {detail.updateError instanceof Error
              ? detail.updateError.message
              : 'No pudimos actualizar el pedido.'}
          </Text>
        </View>
      ) : null}

      {detail.canCancel ? (
        <Button
          variant="destructive"
          onPress={() => detail.setShowCancelConfirm(true)}
          disabled={detail.isUpdating}
        >
          Cancelar orden
        </Button>
      ) : null}

      <StatusPickerModal detail={detail} order={order} />
      <TrackingModal detail={detail} />
      <ConfirmDialog
        visible={detail.showCancelConfirm}
        title="Cancelar orden"
        description={`Cancelar la orden ${order.orderId}? Esta accion libera la reserva de stock si sigue pendiente.`}
        confirmLabel="Si, cancelar"
        destructive
        loading={detail.isUpdating}
        onConfirm={detail.handleCancel}
        onCancel={() => detail.setShowCancelConfirm(false)}
      />
    </View>
  );
}

function OrderFulfillmentStepper({ order }: { order: Order }) {
  const steps = getOrderTimeline(order.orderStatus);

  return (
    <View className="gap-3">
      {steps.map((step, index) => (
        <View key={step.key} className="flex-row gap-3">
          <View className="items-center">
            <View
              className={cn(
                'h-3 w-3 rounded-full',
                step.state === 'done' && 'bg-emerald-500',
                step.state === 'current' && 'bg-amber-500',
                step.state === 'pending' && 'bg-neutral-300',
                step.state === 'blocked' && 'bg-red-500',
              )}
            />
            {index < steps.length - 1 ? <View className="mt-1 h-6 w-px bg-border" /> : null}
          </View>
          <View className="min-w-0 flex-1">
            <Text className={cn(step.state === 'pending' && 'text-muted-foreground')}>
              {step.label}
            </Text>
            {step.state === 'current' ? <Text variant="xs">Estado actual</Text> : null}
          </View>
        </View>
      ))}
    </View>
  );
}

function StatusPickerModal({ detail, order }: AdminOrderStatusControlsProps) {
  return (
    <Modal
      visible={detail.showStatusPicker}
      transparent
      animationType="fade"
      onRequestClose={() => detail.setShowStatusPicker(false)}
    >
      <Pressable className="flex-1 justify-end bg-black/40" onPress={() => detail.setShowStatusPicker(false)}>
        <View className="rounded-t-2xl bg-background pb-8">
          <View className="mx-auto mb-2 mt-3 h-1 w-12 rounded-full bg-muted-foreground/30" />
          <Text variant="body" className="px-4 pb-3 pt-1 font-semibold text-foreground">
            Cambiar estado
          </Text>
          {ADMIN_ORDER_STATUS_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => detail.handleStatusSelect(option.value)}
              className={cn(
                'flex-row items-center justify-between px-4 py-3.5',
                order.orderStatus === option.value && 'bg-primary/5',
              )}
            >
              <OrderStatusBadge status={option.value} />
              {order.orderStatus === option.value ? (
                <Text variant="small" className="font-medium text-primary">
                  Actual
                </Text>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

function TrackingModal({ detail }: { detail: AdminOrderDetailViewModel }) {
  return (
    <Modal
      visible={detail.showTrackingForm}
      transparent
      animationType="fade"
      onRequestClose={() => detail.setShowTrackingForm(false)}
    >
      <Pressable className="flex-1 justify-end bg-black/40" onPress={() => detail.setShowTrackingForm(false)}>
        <Pressable className="gap-3 rounded-t-2xl bg-background p-4 pb-8">
          <Text variant="body" className="font-semibold text-foreground">
            Datos de envio
          </Text>
          <TrackingInput
            label="Numero de tracking"
            value={detail.trackingNumber}
            onChangeText={detail.setTrackingNumber}
          />
          <TrackingInput
            label="Carrier"
            value={detail.trackingCarrier}
            onChangeText={detail.setTrackingCarrier}
          />
          <TrackingInput
            label="URL de tracking"
            value={detail.trackingUrl}
            onChangeText={detail.setTrackingUrl}
          />
          <TrackingInput
            label="Nota interna"
            value={detail.adminNote}
            onChangeText={detail.setAdminNote}
            multiline
          />
          <Button
            onPress={detail.handleShipOrder}
            disabled={!detail.trackingNumber.trim() || detail.isUpdating}
            loading={detail.isUpdating}
          >
            Marcar como enviado
          </Button>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

interface TrackingInputProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
}

function TrackingInput({ label, value, onChangeText, multiline }: TrackingInputProps) {
  return (
    <View className="gap-1">
      <Text variant="xs" className="font-semibold uppercase text-muted-foreground">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        className="rounded-lg border border-border bg-background px-3 py-3 text-foreground"
      />
    </View>
  );
}
