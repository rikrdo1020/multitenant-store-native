import { Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useStoreHome } from '@/hooks/api/use-store-home';
import { canOpenTenantAdminPanel } from '@/lib/admin-navigation';
import { useAuthStore } from '@/stores/use-auth-store';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { Category, Product, StoreBanner } from '@/types';

export function useStorefrontHomeScreen(tenantSlug?: string) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const activeTenant = useTenantStore((state) => state.tenant);
  const homeQuery = useStoreHome(tenantSlug);
  const tenant = homeQuery.data?.tenant;

  const goToProducts = () => {
    if (tenantSlug) router.push(`/(storefront)/${tenantSlug}/products` as never);
  };

  const goToFeaturedProducts = () => {
    if (tenantSlug) {
      router.push(`/(storefront)/${tenantSlug}/products?featured=true` as never);
    }
  };

  const goToLatestProducts = () => {
    if (tenantSlug) {
      router.push(`/(storefront)/${tenantSlug}/products?sort=newest` as never);
    }
  };

  const goToCategory = (category: Category) => {
    if (tenantSlug) {
      router.push(
        `/(storefront)/${tenantSlug}/products?category=${encodeURIComponent(category.documentId)}` as never,
      );
    }
  };

  const goToProduct = (product: Product) => {
    if (tenantSlug) {
      router.push(`/(storefront)/${tenantSlug}/products/${product.slug}` as never);
    }
  };

  const handleBannerPress = (banner: StoreBanner) => {
    if (!banner.ctaUrl) {
      goToProducts();
      return;
    }

    if (banner.ctaUrl.startsWith('http')) {
      void Linking.openURL(banner.ctaUrl);
      return;
    }

    router.push(banner.ctaUrl as never);
  };

  return {
    home: homeQuery.data,
    tenant,
    isLoading: homeQuery.isLoading,
    isError: homeQuery.isError,
    retryHome: () => void homeQuery.refetch(),
    canOpenAdminPanel: canOpenTenantAdminPanel(user, activeTenant, tenantSlug),
    goToAdminPanel: () => router.push('/(admin)/dashboard' as never),
    goToProducts,
    goToFeaturedProducts,
    goToLatestProducts,
    goToCategory,
    goToProduct,
    handleBannerPress,
  };
}

export type StoreHomeScreenViewModel = ReturnType<typeof useStorefrontHomeScreen>;
