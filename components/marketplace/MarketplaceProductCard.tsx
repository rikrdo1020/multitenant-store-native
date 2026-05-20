import { Image, Text, TouchableOpacity, View } from 'react-native';
import type { MarketplaceFeaturedProduct } from '@/types';

interface MarketplaceProductCardProps {
  product: MarketplaceFeaturedProduct;
  onPress: () => void;
}

export function MarketplaceProductCard({ product, onPress }: MarketplaceProductCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={{ backgroundColor: '#1a1a1a', borderColor: '#252525', borderRadius: 10, borderWidth: 1, overflow: 'hidden', width: 120 }}>
      {product.images[0] ? (
        <Image source={{ uri: product.images[0] }} style={{ backgroundColor: '#1e1e1e', height: 90, width: '100%' }} resizeMode="cover" />
      ) : (
        <View style={{ backgroundColor: '#1e1e1e', height: 90, width: '100%' }} />
      )}
      <View style={{ padding: 8 }}>
        <Text numberOfLines={2} style={{ color: '#e5e5e5', fontSize: 11, fontWeight: '600', lineHeight: 15 }}>
          {product.name}
        </Text>
        <Text style={{ color: '#737373', fontSize: 11, marginTop: 4 }}>${product.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}
