import { View, Image, Pressable } from 'react-native';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  currency?: string;
  layout?: 'grid' | 'list';
}

export function ProductCard({ product, onPress, currency, layout = 'grid' }: ProductCardProps) {
  const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.price - displayPrice) / product.price) * 100)
    : 0;
  const imageUri = product.images[0];
  const outOfStock = product.stock === 0;

  if (layout === 'list') {
    return (
      <Pressable
        onPress={onPress}
        className="flex-row bg-white rounded-2xl overflow-hidden border border-border active:opacity-90 mx-4 mb-3"
      >
        <View className="w-24 h-24 bg-secondary flex-shrink-0">
          {imageUri ? (
            <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Text variant="xs" className="text-muted-foreground">Sin imagen</Text>
            </View>
          )}
          {hasDiscount && (
            <View className="absolute top-1.5 left-1.5 bg-foreground px-1.5 py-0.5 rounded-full">
              <Text variant="xs" className="text-white font-bold">-{discountPct}%</Text>
            </View>
          )}
          {outOfStock && (
            <View className="absolute inset-0 bg-white/75 items-center justify-center">
              <Text variant="xs" className="font-semibold text-muted-foreground tracking-wide uppercase">
                Agotado
              </Text>
            </View>
          )}
        </View>

        <View className="flex-1 p-3 justify-center gap-0.5">
          {product.brand && (
            <Text variant="xs" className="text-muted-foreground uppercase tracking-widest">
              {product.brand.name}
            </Text>
          )}
          <Text variant="small" className="text-foreground font-medium leading-snug" numberOfLines={2}>
            {product.name}
          </Text>
          <View className="flex-row items-baseline gap-1.5 mt-1">
            <Text variant="small" className="font-bold text-foreground">
              {formatPrice(displayPrice, currency)}
            </Text>
            {hasDiscount && (
              <Text variant="xs" className="line-through text-muted-foreground">
                {formatPrice(product.price, currency)}
              </Text>
            )}
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'flex-1 bg-white rounded-2xl overflow-hidden border border-border active:opacity-90',
      )}
      style={{ maxWidth: '48%' }}
    >
      <View className="aspect-square bg-secondary">
        {imageUri ? (
          <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="w-full h-full items-center justify-center">
            <Text variant="xs" className="text-muted-foreground">Sin imagen</Text>
          </View>
        )}

        {hasDiscount && (
          <View className="absolute top-2 left-2 bg-foreground px-2 py-0.5 rounded-full">
            <Text variant="xs" className="text-white font-bold">-{discountPct}%</Text>
          </View>
        )}

        {outOfStock && (
          <View className="absolute inset-0 bg-white/75 items-center justify-center">
            <Text variant="xs" className="font-semibold text-muted-foreground tracking-wide uppercase">
              Agotado
            </Text>
          </View>
        )}
      </View>

      <View className="p-3 gap-0.5">
        {product.brand && (
          <Text variant="xs" className="text-muted-foreground uppercase tracking-widest">
            {product.brand.name}
          </Text>
        )}
        <Text variant="small" className="text-foreground font-medium leading-snug" numberOfLines={2}>
          {product.name}
        </Text>
        <View className="flex-row items-baseline gap-1.5 mt-1">
          <Text variant="small" className="font-bold text-foreground">
            {formatPrice(displayPrice, currency)}
          </Text>
          {hasDiscount && (
            <Text variant="xs" className="line-through text-muted-foreground">
              {formatPrice(product.price, currency)}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}
