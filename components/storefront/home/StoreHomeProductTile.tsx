import { Image, Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface StoreHomeProductTileProps {
  product: Product;
  currency?: string;
  compact?: boolean;
  onPress: (product: Product) => void;
}

export function StoreHomeProductTile({
  product,
  currency,
  compact = false,
  onPress,
}: StoreHomeProductTileProps) {
  const imageUri = product.images?.[0];
  const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;
  const price = hasDiscount ? product.discountPrice! : product.price;

  return (
    <Pressable
      onPress={() => onPress(product)}
      className="overflow-hidden rounded-lg border border-border bg-card active:opacity-90"
      style={compact ? { width: 168 } : { flexBasis: '48%' }}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          className={compact ? 'h-32 w-full bg-muted' : 'aspect-square w-full bg-muted'}
          resizeMode="cover"
        />
      ) : (
        <View className={compact ? 'h-32 w-full bg-muted' : 'aspect-square w-full bg-muted'} />
      )}

      <View className="gap-1 p-3">
        <Text className="font-semibold text-foreground" numberOfLines={2}>
          {product.name}
        </Text>
        <View className="flex-row flex-wrap items-baseline gap-1.5">
          <Text className="font-bold text-foreground">{formatPrice(price, currency)}</Text>
          {hasDiscount && (
            <Text variant="xs" className="text-muted-foreground line-through">
              {formatPrice(product.price, currency)}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}
