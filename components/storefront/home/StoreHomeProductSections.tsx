import { Pressable, ScrollView, View } from 'react-native';
import { StoreHomeProductTile } from '@/components/storefront/home/StoreHomeProductTile';
import { Text } from '@/components/ui/Text';
import type { Product } from '@/types';

interface ProductSectionProps {
  title: string;
  products: Product[];
  currency?: string;
  horizontal?: boolean;
  onViewAll: () => void;
  onProductPress: (product: Product) => void;
}

export function StoreHomeProductSection({
  title,
  products,
  currency,
  horizontal = false,
  onViewAll,
  onProductPress,
}: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <View className="gap-3">
      <SectionHeader title={title} onViewAll={onViewAll} />
      {horizontal ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingRight: 16 }}
        >
          {products.map((product) => (
            <StoreHomeProductTile
              key={product.documentId}
              product={product}
              currency={currency}
              compact
              onPress={onProductPress}
            />
          ))}
        </ScrollView>
      ) : (
        <View className="flex-row flex-wrap gap-3">
          {products.map((product) => (
            <StoreHomeProductTile
              key={product.documentId}
              product={product}
              currency={currency}
              onPress={onProductPress}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function SectionHeader({
  title,
  onViewAll,
}: {
  title: string;
  onViewAll: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <Text variant="h3">{title}</Text>
      <Pressable onPress={onViewAll} hitSlop={8}>
        <Text className="font-semibold text-foreground">Ver todo</Text>
      </Pressable>
    </View>
  );
}
