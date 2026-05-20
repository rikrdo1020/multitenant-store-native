import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { MarketplaceProductCard } from '@/components/marketplace/MarketplaceProductCard';
import type { MarketplaceFeaturedProduct, MarketplaceStore } from '@/types';

interface MarketplaceStoreCardProps {
  store: MarketplaceStore;
  onOpenProduct: (store: MarketplaceStore, product: MarketplaceFeaturedProduct) => void;
  onOpenStore: (store: MarketplaceStore) => void;
}

export function MarketplaceStoreCard({ store, onOpenProduct, onOpenStore }: MarketplaceStoreCardProps) {
  return (
    <View style={{ backgroundColor: '#111111', borderColor: '#1e1e1e', borderRadius: 16, borderWidth: 1, overflow: 'hidden' }}>
      <TouchableOpacity activeOpacity={0.75} onPress={() => onOpenStore(store)} style={{ padding: 20, paddingBottom: 14 }}>
        <View style={{ alignItems: 'center', flexDirection: 'row', gap: 12 }}>
          <StoreLogo store={store} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#ffffff', fontSize: 17, fontWeight: '700' }}>{store.name}</Text>
            {store.description ? <Text numberOfLines={1} style={{ color: '#737373', fontSize: 12, marginTop: 2 }}>{store.description}</Text> : null}
          </View>
          <Text style={{ color: '#404040', fontSize: 16 }}>{'>'}</Text>
        </View>
      </TouchableOpacity>
      <FeaturedProducts store={store} onOpenProduct={onOpenProduct} />
    </View>
  );
}

function FeaturedProducts({ store, onOpenProduct }: Omit<MarketplaceStoreCardProps, 'onOpenStore'>) {
  if (store.products.length === 0) return null;

  return (
    <View style={{ borderTopColor: '#1e1e1e', borderTopWidth: 1, marginHorizontal: 20, paddingVertical: 14 }}>
      <Text style={{ color: '#404040', fontSize: 10, letterSpacing: 1.5, marginBottom: 12, textTransform: 'uppercase' }}>Productos destacados</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -4 }}>
        <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 4 }}>
          {store.products.map((product) => <MarketplaceProductCard key={product.documentId} product={product} onPress={() => onOpenProduct(store, product)} />)}
        </View>
      </ScrollView>
    </View>
  );
}

function StoreLogo({ store }: { store: MarketplaceStore }) {
  const accentColor = store.primaryColor ?? '#ffffff';
  if (store.logo) {
    return <Image source={{ uri: store.logo }} style={{ backgroundColor: '#1e1e1e', borderRadius: 10, height: 40, width: 40 }} />;
  }

  return (
    <View style={{ alignItems: 'center', backgroundColor: `${accentColor}22`, borderRadius: 10, height: 40, justifyContent: 'center', width: 40 }}>
      <Text style={{ color: accentColor, fontSize: 16, fontWeight: '700' }}>{store.name[0].toUpperCase()}</Text>
    </View>
  );
}
