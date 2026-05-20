import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { MarketplaceStoreCard } from '@/components/marketplace/MarketplaceStoreCard';
import { MarketplaceEmptyPanel, MarketplaceErrorPanel, MarketplaceLoadingPanel } from '@/components/marketplace/MarketplaceStatePanels';
import { useMarketplaceScreen } from '@/hooks/use-marketplace-screen';

export function MarketplaceScreenContent() {
  const marketplace = useMarketplaceScreen();

  return (
    <SafeAreaView style={{ backgroundColor: '#0a0a0a', flex: 1 }}>
      <MarketplaceHeader onBack={marketplace.goBack} />
      {marketplace.isLoading ? <MarketplaceLoadingPanel /> : null}
      {marketplace.isError ? <MarketplaceErrorPanel onRetry={marketplace.retry} /> : null}
      {!marketplace.isLoading && !marketplace.isError && marketplace.data ? (
        <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 40, paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
          {marketplace.data.stores.length === 0 ? <MarketplaceEmptyPanel /> : null}
          {marketplace.data.stores.map((store) => (
            <MarketplaceStoreCard key={store.documentId} store={store} onOpenProduct={marketplace.goToProduct} onOpenStore={marketplace.goToStore} />
          ))}
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}
