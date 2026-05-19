import { Image, ScrollView, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, MapPin, Package, Truck } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { OrderStatusBadge } from '@/components/storefront/OrderStatusBadge';
import { useTenant } from '@/hooks/api/use-tenant';
import { useOrder } from '@/hooks/api/use-orders';
import {
  formatOrderDate,
  formatOrderOptions,
  getEffectiveOrderStatus,
  getOrderItemCount,
  getOrderShippingAddress,
  getOrderShippingLocationName,
  getOrderShippingMethodName,
  getOrderTimeline,
  getOrderTotals,
} from '@/lib/order-display';
import { cn, formatPrice } from '@/lib/utils';
import { useAuthStore } from '@/stores/use-auth-store';
import type { CreateOrderItemPayload, Order } from '@/types';

interface OrderDetailScreenContentProps {
  tenantSlug?: string;
  orderId?: string;
}

export function OrderDetailScreenContent({ tenantSlug, orderId }: OrderDetailScreenContentProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 980;
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const tenantQuery = useTenant(tenantSlug ?? '');
  const tenant = tenantQuery.data;
  const orderQuery = useOrder(isAuthenticated ? tenantSlug : undefined, orderId);

  const goBack = () => router.back();
  const goToLogin = () => {
    const returnTo = tenantSlug && orderId ? `/(storefront)/${tenantSlug}/orders/${orderId}` : '/';
    router.push(`/(auth)/login?returnTo=${encodeURIComponent(returnTo)}` as never);
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <DetailHeader title="Detalle de orden" subtitle="Acceso requerido" onBack={goBack} />
        <View className="flex-1 items-center justify-center gap-4 px-6">
          <Package size={34} color="#737373" />
          <View className="gap-1">
            <Text variant="h3" className="text-center">Inicia sesion para continuar</Text>
            <Text variant="small" className="text-center">
              Necesitamos tu cuenta para confirmar que esta orden te pertenece.
            </Text>
          </View>
          <Button onPress={goToLogin}>Iniciar sesion</Button>
        </View>
      </SafeAreaView>
    );
  }

  if (orderQuery.isLoading) {
    return <LoadingScreen message="Cargando detalle..." />;
  }

  if (orderQuery.isError || !orderQuery.data) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <DetailHeader title="Detalle de orden" subtitle="No disponible" onBack={goBack} />
        <View className="flex-1 items-center justify-center gap-4 px-6">
          <Package size={34} color="#737373" />
          <View className="gap-1">
            <Text variant="h3" className="text-center">No encontramos esta orden</Text>
            <Text variant="small" className="text-center">
              Puede que no exista o que no este asociada a tu cuenta.
            </Text>
          </View>
          <Button variant="outline" onPress={() => orderQuery.refetch()}>
            Reintentar
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const order = orderQuery.data;
  const totals = getOrderTotals(order);
  const status = getEffectiveOrderStatus(order);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <DetailHeader
        title={`Orden ${order.orderId}`}
        subtitle={formatOrderDate(order.createdAt)}
        onBack={goBack}
      />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View className="mx-auto w-full max-w-6xl gap-5">
          <View className="gap-3 rounded-lg border border-border bg-card p-4">
            <View className="gap-3 sm:flex-row sm:items-center sm:justify-between">
              <View className="gap-1">
                <Text variant="h2">Resumen de la orden</Text>
                <Text variant="small">
                  {getOrderItemCount(order)} {getOrderItemCount(order) === 1 ? 'producto' : 'productos'}
                </Text>
              </View>
              <OrderStatusBadge status={status} />
            </View>
            <OrderTimeline status={status} />
          </View>

          <View className={isWide ? 'flex-row items-start gap-5' : 'gap-5'}>
            <View className="min-w-0 flex-1 gap-5">
              <OrderItemsSection order={order} currency={tenant?.currency} />
              <DeliverySection order={order} />
            </View>

            <View className={isWide ? 'w-96 gap-5' : 'gap-5'}>
              <PaymentSection order={order} />
              <TotalsSection totals={totals} currency={tenant?.currency} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface DetailHeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
}

function DetailHeader({ title, subtitle, onBack }: DetailHeaderProps) {
  return (
    <View className="border-b border-border bg-background px-4 py-3">
      <View className="mx-auto w-full max-w-6xl flex-row items-center gap-3">
        <Button variant="ghost" size="sm" onPress={onBack} className="px-1">
          <ArrowLeft size={22} color="#171717" />
        </Button>
        <View className="min-w-0 flex-1">
          <Text variant="h2" numberOfLines={1}>{title}</Text>
          <Text variant="small">{subtitle}</Text>
        </View>
      </View>
    </View>
  );
}

function OrderTimeline({ status }: { status: Order['orderStatus'] }) {
  const steps = getOrderTimeline(status);

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
            {index < steps.length - 1 && (
              <View className="mt-1 h-6 w-px bg-border" />
            )}
          </View>
          <View className="min-w-0 flex-1">
            <Text className={cn(step.state === 'pending' && 'text-muted-foreground')}>
              {step.label}
            </Text>
            {step.state === 'current' && (
              <Text variant="xs">Estado actual</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

function OrderItemsSection({ order, currency }: { order: Order; currency?: string }) {
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
        <Image
          source={{ uri: item.imageUrl }}
          className="h-16 w-16 rounded-md bg-muted"
          resizeMode="cover"
        />
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

function DeliverySection({ order }: { order: Order }) {
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
        <InfoBlock label="Direccion" value={addressLines.join(', ')} />
        <InfoBlock label="Metodo de envio" value={methodName} />
        {locationName && <InfoBlock label="Zona o punto" value={locationName} />}
      </View>
    </View>
  );
}

function PaymentSection({ order }: { order: Order }) {
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
        {order.confirmationNumber && (
          <InfoBlock label="Confirmacion" value={order.confirmationNumber} />
        )}
      </View>
    </View>
  );
}

function TotalsSection({ totals, currency }: { totals: ReturnType<typeof getOrderTotals>; currency?: string }) {
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
        <View className="h-px bg-border" />
        <TotalRow label="Total" value={formatPrice(totals.total, currency)} strong />
      </View>
    </View>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <View className="gap-1">
      <Text variant="xs" className="uppercase">{label}</Text>
      <Text>{value}</Text>
    </View>
  );
}

function TotalRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View className="flex-row items-center justify-between gap-4">
      <Text className={strong ? 'font-semibold' : 'text-muted-foreground'}>{label}</Text>
      <Text className={strong ? 'text-xl font-bold' : 'font-medium'}>{value}</Text>
    </View>
  );
}

function formatPaymentMethod(method?: string): string {
  switch (method) {
    case 'cash':
      return 'Efectivo / contra entrega';
    case 'yappy':
      return 'Yappy';
    case 'stripe':
      return 'Tarjeta';
    case 'pending':
      return 'Pendiente de seleccionar';
    default:
      return method ?? 'No disponible';
  }
}

function formatPaymentStatus(status: Order['orderStatus']): string {
  switch (status) {
    case 'paid':
    case 'dispatched':
      return 'Pago confirmado';
    case 'failed':
    case 'rejected':
      return 'Pago rechazado';
    case 'cancelled':
      return 'Cancelado';
    case 'expired':
      return 'Expirado';
    default:
      return 'Pendiente de pago';
  }
}
