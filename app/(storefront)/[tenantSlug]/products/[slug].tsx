import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ProductDetailView } from '@/components/storefront/ProductDetailView';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useProduct } from '@/hooks/api/use-product';
import { useProductDetail } from '@/hooks/use-product-detail';
import { useTenantStore } from '@/stores/use-tenant-store';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { tenantSlug, slug } = useLocalSearchParams<{ tenantSlug: string; slug: string }>();
  const { tenant } = useTenantStore();
  const productQuery = useProduct(tenantSlug, slug);
  const detail = useProductDetail(productQuery.data, tenantSlug);

  if (productQuery.isLoading) return <LoadingScreen />;

  if (productQuery.isError || !productQuery.data) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center gap-4 px-8">
          <Text variant="h3" className="text-center">No pudimos cargar el producto</Text>
          <Button variant="outline" onPress={() => productQuery.refetch()}>
            Reintentar
          </Button>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ProductDetailView
      product={productQuery.data}
      currency={tenant?.currency}
      optionGroups={detail.optionGroups}
      selectedOptions={detail.selectedOptions}
      canAddToCart={detail.canAddToCart}
      addDisabledReason={detail.addDisabledReason}
      onSelectOption={detail.selectOption}
      onAddToCart={detail.addToCart}
      onBack={() => router.back()}
    />
  );
}
