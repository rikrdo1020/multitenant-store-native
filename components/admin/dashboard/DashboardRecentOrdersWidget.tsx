import { ActivityIndicator, Pressable, View } from 'react-native';
import { ShoppingCart } from 'lucide-react-native';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { formatDashboardMoney, relativeTime } from './dashboard-utils';
import type { RecentOrder } from '@/types';

interface DashboardRecentOrdersWidgetProps {
  orders: RecentOrder[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onOrderPress: (order: RecentOrder) => void;
  onViewAll: () => void;
}

export function DashboardRecentOrdersWidget({
  orders,
  loading,
  error,
  onRetry,
  onOrderPress,
  onViewAll,
}: DashboardRecentOrdersWidgetProps) {
  return (
    <View className="gap-3 rounded-lg border border-border bg-card p-4">
      <WidgetHeader onViewAll={onViewAll} />
      {loading ? (
        <ActivityIndicator className="my-4" />
      ) : error ? (
        <View className="gap-3 rounded-md border border-red-200 bg-red-50 p-3">
          <Text className="font-semibold text-red-700">No pudimos cargar los pedidos recientes.</Text>
          <Button variant="outline" size="sm" onPress={onRetry}>
            Reintentar
          </Button>
        </View>
      ) : orders.length === 0 ? (
        <Text variant="small" className="text-muted-foreground">Aun no hay pedidos recientes.</Text>
      ) : (
        <View className="gap-2">
          {orders.map((order) => (
            <Pressable key={order.documentId} onPress={() => onOrderPress(order)} className="gap-2 rounded-md border border-border p-3">
              <View className="flex-row items-start justify-between gap-3">
                <View className="min-w-0 flex-1">
                  <Text className="font-semibold text-foreground">{order.orderNumber}</Text>
                  <Text variant="xs" numberOfLines={1}>{order.customer.name ?? 'Cliente sin nombre'}</Text>
                </View>
                <Text className="font-bold text-foreground">{formatDashboardMoney(order.total)}</Text>
              </View>
              <View className="flex-row items-center justify-between gap-3">
                <OrderStatusBadge status={order.orderStatus} />
                <Text variant="xs">{relativeTime(order.createdAt)}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

function WidgetHeader({ onViewAll }: { onViewAll: () => void }) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <View className="flex-row items-center gap-2">
        <ShoppingCart size={17} color="#18181b" />
        <Text variant="h3">Pedidos recientes</Text>
      </View>
      <Pressable onPress={onViewAll} hitSlop={8}>
        <Text className="font-semibold text-foreground">Ver todos</Text>
      </Pressable>
    </View>
  );
}
