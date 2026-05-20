import { useRouter } from 'expo-router';
import { useMarketplaceStores } from '@/hooks/api/use-marketplace-stores';
import type { MarketplaceFeaturedProduct, MarketplaceStore } from '@/types';

export function useMarketplaceScreen() {
  const router = useRouter();
  const query = useMarketplaceStores();

  return {
    data: query.data,
    goBack: router.back,
    goToProduct: (store: MarketplaceStore, product: MarketplaceFeaturedProduct) => {
      router.push(`/(storefront)/${store.slug}/products/${product.slug}` as never);
    },
    goToStore: (store: MarketplaceStore) => {
      router.push(`/(storefront)/${store.slug}` as never);
    },
    isError: query.isError,
    isLoading: query.isLoading,
    retry: query.refetch,
  };
}
