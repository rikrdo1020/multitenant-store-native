import { View, useWindowDimensions } from 'react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { StorefrontScreenHeader } from '@/components/storefront/StorefrontScreenHeader';
import { StoreHomeCategories } from '@/components/storefront/home/StoreHomeCategories';
import { StoreHomeHero } from '@/components/storefront/home/StoreHomeHero';
import { StoreHomeProductSection } from '@/components/storefront/home/StoreHomeProductSections';
import { StoreHomeEmptyState, StoreHomeErrorState } from '@/components/storefront/home/StoreHomeStates';
import { useStorefrontHomeScreen } from '@/hooks/use-store-home-screen';

interface StoreHomeScreenContentProps {
  tenantSlug?: string;
}

export function StoreHomeScreenContent({ tenantSlug }: StoreHomeScreenContentProps) {
  const store = useStorefrontHomeScreen(tenantSlug);
  const { width } = useWindowDimensions();
  const home = store.home;
  const currency = home?.tenant.settings?.currency ?? home?.tenant.currency;

  if (store.isLoading) return <LoadingScreen />;

  if (store.isError) {
    return (
      <ScreenWrapper>
        <StorefrontScreenHeader title="Tienda" subtitle="No pudimos cargar la portada" />
        <StoreHomeErrorState onRetry={store.retryHome} />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scroll>
      <StorefrontScreenHeader
        title={store.tenant?.name || 'Tienda'}
        subtitle="Explora productos y categorias"
        onBack={store.canOpenAdminPanel ? store.goToAdminPanel : undefined}
        backAccessibilityLabel="Volver al panel de tienda"
      />
      <View className="w-full max-w-6xl self-center gap-7 p-4 pb-10 md:p-6">
        <StoreHomeHero
          banners={home?.banners ?? []}
          tenant={store.tenant}
          width={width}
          onBannerPress={store.handleBannerPress}
          onViewProducts={store.goToProducts}
        />
        <StoreHomeCategories
          categories={home?.categories ?? []}
          onCategoryPress={store.goToCategory}
          onViewAll={store.goToProducts}
        />
        <StoreHomeProductSection
          title="Productos destacados"
          products={home?.featuredProducts ?? []}
          currency={currency}
          onViewAll={store.goToFeaturedProducts}
          onProductPress={store.goToProduct}
        />
        <StoreHomeProductSection
          title="Ultimos productos"
          products={home?.latestProducts ?? []}
          currency={currency}
          horizontal
          onViewAll={store.goToLatestProducts}
          onProductPress={store.goToProduct}
        />
        {home && home.featuredProducts.length === 0 && home.latestProducts.length === 0 && (
          <StoreHomeEmptyState />
        )}
      </View>
    </ScreenWrapper>
  );
}
