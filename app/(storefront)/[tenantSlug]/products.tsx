import { useState } from 'react';
import { View, FlatList, RefreshControl, Pressable, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, SlidersHorizontal, LayoutGrid, List } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { ProductCard } from '@/components/storefront/ProductCard';
import { SearchBar } from '@/components/storefront/SearchBar';
import { CategoryTabs } from '@/components/storefront/CategoryTabs';
import { FilterSheet } from '@/components/storefront/FilterSheet';
import { CartIconButton } from '@/components/storefront/CartIconButton';
import { useCatalog } from '@/hooks/use-catalog';
import { useCartCount } from '@/hooks/use-cart-count';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { ProductFilters } from '@/types';

export default function ProductsScreen() {
  const router = useRouter();
  const {
    tenantSlug,
    category,
    featured,
    sort: routeSort,
  } = useLocalSearchParams<{
    tenantSlug: string;
    category?: string;
    featured?: string;
    sort?: ProductFilters['sort'];
  }>();
  const { tenant } = useTenantStore();
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [filterVisible, setFilterVisible] = useState(false);
  const cartItemCount = useCartCount(tenantSlug);

  const {
    search,
    handleSearchChange,
    selectedCategory,
    handleCategorySelect,
    selectedBrand,
    sort,
    minPrice,
    maxPrice,
    handleApplyFilters,
    products,
    meta,
    categories,
    brands,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    refetch,
    clearFilters,
  } = useCatalog(tenantSlug, {
    category,
    featured: featured === 'true' ? true : undefined,
    sort: routeSort,
  });

  const hasActiveFilters = !!(
    sort ||
    selectedBrand ||
    selectedCategory ||
    featured ||
    minPrice !== undefined ||
    maxPrice !== undefined
  );

  if (!tenantSlug || isLoading) return <LoadingScreen />;

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-4 pt-2 pb-3 gap-3">
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() =>
              router.canGoBack()
                ? router.back()
                : router.replace(`/(storefront)/${tenantSlug}` as never)
            }
            hitSlop={8}
          >
            <ArrowLeft size={22} color="#0a0a0a" />
          </Pressable>
          <Text variant="h2" className="flex-1">Catálogo</Text>
          {isFetching && !isLoading && (
            <ActivityIndicator size="small" color="#737373" />
          )}
          <CartIconButton
            count={cartItemCount}
            onPress={() => router.push(`/(storefront)/${tenantSlug}/cart` as never)}
          />
          <Pressable
            onPress={() => setLayout((l) => (l === 'grid' ? 'list' : 'grid'))}
            hitSlop={8}
          >
            {layout === 'grid'
              ? <List size={20} color="#0a0a0a" />
              : <LayoutGrid size={20} color="#0a0a0a" />}
          </Pressable>
          <Pressable onPress={() => setFilterVisible(true)} hitSlop={8} accessibilityLabel="Abrir filtros">
            <SlidersHorizontal size={20} color={hasActiveFilters ? '#0a0a0a' : '#737373'} />
          </Pressable>
        </View>
        <SearchBar value={search} onChangeText={handleSearchChange} />
      </View>

      {/* Category chips */}
      <View className="mb-2">
        <CategoryTabs
          categories={categories}
          selectedId={selectedCategory}
          onSelect={handleCategorySelect}
        />
      </View>

      {/* Results count */}
      {meta && (
        <View className="px-4 mb-3">
          <Text variant="xs" className="text-muted-foreground">
            {meta.total} {meta.total === 1 ? 'producto' : 'productos'}
          </Text>
        </View>
      )}

      {/* Content */}
      {isError ? (
        <View className="flex-1 items-center justify-center gap-4 px-8">
          <Text variant="h3" className="text-muted-foreground text-center">
            Error al cargar productos
          </Text>
          <Button variant="outline" onPress={() => refetch()}>Reintentar</Button>
        </View>
      ) : products.length === 0 && !isFetching ? (
        <View className="flex-1 items-center justify-center gap-2 px-8">
          <Text variant="h3" className="text-foreground">Sin resultados</Text>
          <Text variant="small" className="text-muted-foreground text-center">
            No encontramos productos con esa búsqueda
          </Text>
          {(search || selectedCategory || hasActiveFilters) && (
            <Button
              variant="ghost"
              size="sm"
              onPress={() => {
                clearFilters();
              }}
            >
              Limpiar filtros
            </Button>
          )}
        </View>
      ) : (
        <FlatList
          key={layout}
          data={products}
          keyExtractor={(item) => item.documentId}
          numColumns={layout === 'grid' ? 2 : 1}
          columnWrapperStyle={
            layout === 'grid'
              ? { paddingHorizontal: 16, gap: 12, marginBottom: 12 }
              : undefined
          }
          contentContainerStyle={{ paddingBottom: 32 }}
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={isFetching && !isLoading} onRefresh={() => refetch()} />
          }
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.3}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              currency={tenant?.currency}
              layout={layout}
              onPress={() =>
                router.push(`/(storefront)/${tenantSlug}/products/${item.slug}` as never)
              }
            />
          )}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator size="small" color="#737373" className="py-4" />
            ) : null
          }
        />
      )}

      <FilterSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        brands={brands}
        currentFilters={{ sort, brand: selectedBrand, minPrice, maxPrice }}
        onApply={handleApplyFilters}
      />
    </SafeAreaView>
  );
}
