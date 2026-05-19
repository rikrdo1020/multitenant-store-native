import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMarketplaceStores } from '@/hooks/api/use-marketplace-stores';
import type { MarketplaceStore, MarketplaceFeaturedProduct } from '@/services/marketplace';

export default function Marketplace() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useMarketplaceStores();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      {/* Header */}
      <View style={{
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 16,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
      }}>
        <View>
          <Text style={{ color: '#404040', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
            Marketplace
          </Text>
          <Text style={{ color: '#ffffff', fontSize: 28, fontWeight: '800', letterSpacing: -0.8 }}>
            Tiendas
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.back()} style={{ paddingBottom: 4 }}>
          <Text style={{ color: '#737373', fontSize: 13 }}>← Volver</Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#ffffff" />
        </View>
      )}

      {isError && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
          <Text style={{ color: '#737373', fontSize: 14, textAlign: 'center', marginBottom: 16 }}>
            No se pudo cargar las tiendas
          </Text>
          <TouchableOpacity onPress={() => refetch()} style={{
            borderWidth: 1,
            borderColor: '#2a2a2a',
            borderRadius: 10,
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}>
            <Text style={{ color: '#ffffff', fontSize: 13 }}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isLoading && !isError && data && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 16 }}
        >
          {data.stores.length === 0 && (
            <View style={{
              backgroundColor: '#111111',
              borderRadius: 14,
              padding: 24,
              borderWidth: 1,
              borderColor: '#1e1e1e',
              alignItems: 'center',
            }}>
              <Text style={{ color: '#737373', fontSize: 14 }}>No hay tiendas disponibles aún.</Text>
            </View>
          )}

          {data.stores.map((store) => (
            <StoreCard key={store.documentId} store={store} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function StoreCard({ store }: { store: MarketplaceStore }) {
  const accentColor = store.primaryColor ?? '#ffffff';

  return (
    <View style={{
      backgroundColor: '#111111',
      borderRadius: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#1e1e1e',
    }}>
      {/* Store header — tappable → catalog */}
      <Link href={`/(storefront)/${store.slug}`} asChild>
      <TouchableOpacity
        activeOpacity={0.75}
        style={{ padding: 20, paddingBottom: 14 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {store.logo ? (
            <Image
              source={{ uri: store.logo }}
              style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#1e1e1e' }}
            />
          ) : (
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: accentColor + '22',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{ color: accentColor, fontSize: 16, fontWeight: '700' }}>
                {store.name[0].toUpperCase()}
              </Text>
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Text style={{ color: '#ffffff', fontSize: 17, fontWeight: '700', letterSpacing: -0.3 }}>
              {store.name}
            </Text>
            {store.description ? (
              <Text numberOfLines={1} style={{ color: '#737373', fontSize: 12, marginTop: 2 }}>
                {store.description}
              </Text>
            ) : null}
          </View>

          <Text style={{ color: '#404040', fontSize: 16 }}>›</Text>
        </View>
      </TouchableOpacity>
      </Link>

      {/* Featured products */}
      {store.products.length > 0 && (
        <>
          <View style={{ height: 1, backgroundColor: '#1e1e1e', marginHorizontal: 20 }} />
          <View style={{ padding: 20, paddingTop: 14 }}>
            <Text style={{ color: '#404040', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
              Productos destacados
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -4 }}>
              <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 4 }}>
                {store.products.map((product) => (
                  <ProductCard
                    key={product.documentId}
                    product={product}
                    storeSlug={store.slug}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
}

function ProductCard({ product, storeSlug }: { product: MarketplaceFeaturedProduct; storeSlug: string }) {
  return (
    <Link href={`/(storefront)/${storeSlug}/products/${product.slug}`} asChild>
    <TouchableOpacity
      activeOpacity={0.75}
      style={{
        width: 120,
        backgroundColor: '#1a1a1a',
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#252525',
      }}
    >
      {product.images[0] ? (
        <Image
          source={{ uri: product.images[0] }}
          style={{ width: '100%', height: 90, backgroundColor: '#1e1e1e' }}
          resizeMode="cover"
        />
      ) : (
        <View style={{ width: '100%', height: 90, backgroundColor: '#1e1e1e' }} />
      )}
      <View style={{ padding: 8 }}>
        <Text numberOfLines={2} style={{ color: '#e5e5e5', fontSize: 11, fontWeight: '600', lineHeight: 15 }}>
          {product.name}
        </Text>
        <Text style={{ color: '#737373', fontSize: 11, marginTop: 4 }}>
          ${product.price.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
    </Link>
  );
}
