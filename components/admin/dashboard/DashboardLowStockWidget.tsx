import { ActivityIndicator, Image, Pressable, View } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import type { LowStockProduct } from '@/types';

interface DashboardLowStockWidgetProps {
  products: LowStockProduct[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onProductPress: (product: LowStockProduct) => void;
  onViewAll: () => void;
}

export function DashboardLowStockWidget({
  products,
  loading,
  error,
  onRetry,
  onProductPress,
  onViewAll,
}: DashboardLowStockWidgetProps) {
  return (
    <View className="gap-3 rounded-lg border border-border bg-card p-4">
      <WidgetHeader title="Stock critico" onViewAll={onViewAll} />
      {loading ? (
        <ActivityIndicator className="my-4" />
      ) : error ? (
        <View className="gap-3 rounded-md border border-red-200 bg-red-50 p-3">
          <Text className="font-semibold text-red-700">No pudimos cargar las alertas de stock.</Text>
          <Button variant="outline" size="sm" onPress={onRetry}>
            Reintentar
          </Button>
        </View>
      ) : products.length === 0 ? (
        <Text variant="small" className="text-muted-foreground">No hay productos en bajo stock.</Text>
      ) : (
        <View className="gap-2">
          {products.map((product) => (
            <Pressable key={product.documentId} onPress={() => onProductPress(product)} className="flex-row items-center gap-3 rounded-md border border-border p-2">
              {product.image ? (
                <Image source={{ uri: product.image }} className="h-10 w-10 rounded-md bg-muted" resizeMode="cover" />
              ) : (
                <View className="h-10 w-10 rounded-md bg-muted" />
              )}
              <View className="min-w-0 flex-1">
                <Text className="font-semibold text-foreground" numberOfLines={1}>{product.name}</Text>
                <Text variant="xs">Reservado: {product.reservedStock}</Text>
              </View>
              <StockBadge available={product.availableStock} />
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

function WidgetHeader({ title, onViewAll }: { title: string; onViewAll: () => void }) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <View className="flex-row items-center gap-2">
        <AlertTriangle size={17} color="#18181b" />
        <Text variant="h3">{title}</Text>
      </View>
      <Pressable onPress={onViewAll} hitSlop={8}>
        <Text className="font-semibold text-foreground">Ver todos</Text>
      </Pressable>
    </View>
  );
}

function StockBadge({ available }: { available: number }) {
  const empty = available <= 0;

  return (
    <View className={`rounded-full px-2.5 py-1 ${empty ? 'bg-red-100' : 'bg-orange-100'}`}>
      <Text className={`text-xs font-bold ${empty ? 'text-red-700' : 'text-orange-700'}`}>
        {available} disp.
      </Text>
    </View>
  );
}
