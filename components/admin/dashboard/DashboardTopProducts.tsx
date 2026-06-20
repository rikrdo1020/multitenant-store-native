import { ActivityIndicator, Image, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { formatDashboardMoney } from './dashboard-utils';
import type { TopProduct } from '@/types';

interface DashboardTopProductsProps {
  products: TopProduct[];
  loading: boolean;
}

export function DashboardTopProducts({ products, loading }: DashboardTopProductsProps) {
  return (
    <View className="gap-3">
      <Text variant="h3">Top productos</Text>
      {loading ? (
        <ActivityIndicator className="my-4" />
      ) : products.length === 0 ? (
        <View className="items-center rounded-lg border border-border bg-card p-6">
          <Text variant="small">Sin datos en este periodo</Text>
        </View>
      ) : (
        <View className="overflow-hidden rounded-lg border border-border bg-card">
          {products.map((product, index) => (
            <View key={product.productId} className={`flex-row items-center gap-3 px-4 py-3 ${index !== 0 ? 'border-t border-border' : ''}`}>
              <Text className="w-5 text-sm font-semibold text-muted-foreground">{index + 1}</Text>
              {product.imageUrl ? (
                <Image source={{ uri: product.imageUrl }} className="h-10 w-10 rounded-lg bg-muted" resizeMode="cover" />
              ) : (
                <View className="h-10 w-10 rounded-lg bg-muted" />
              )}
              <View className="min-w-0 flex-1">
                <Text className="font-medium text-foreground" numberOfLines={1}>{product.name}</Text>
                <Text variant="xs">{product.units} unidades</Text>
              </View>
              <Text className="font-semibold text-foreground">{formatDashboardMoney(product.revenue)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
