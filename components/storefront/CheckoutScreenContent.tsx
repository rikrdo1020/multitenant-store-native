import { ScrollView, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { CheckoutEmptyState } from '@/components/storefront/CheckoutEmptyState';
import { CheckoutFormColumn } from '@/components/storefront/CheckoutFormColumn';
import { CheckoutHeader } from '@/components/storefront/CheckoutHeader';
import { CheckoutSummaryPanel } from '@/components/storefront/CheckoutSummaryPanel';
import { useCheckoutScreen } from '@/hooks/use-checkout-screen';

interface CheckoutScreenContentProps {
  tenantSlug?: string;
}

export function CheckoutScreenContent({ tenantSlug }: CheckoutScreenContentProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 920;
  const checkout = useCheckoutScreen(tenantSlug);

  if (!checkout.isScopeReady) {
    return <LoadingScreen message="Preparando checkout..." />;
  }

  if (checkout.items.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <CheckoutHeader compact onBack={checkout.goBack} />
        <CheckoutEmptyState onBrowseProducts={checkout.goToProducts} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <CheckoutHeader onBack={checkout.goToCart} onCartPress={checkout.goToCart} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View className={isWide ? 'flex-row items-start gap-5' : 'gap-5'}>
          <CheckoutFormColumn checkout={checkout} isWide={isWide} />
          <CheckoutSummaryPanel checkout={checkout} isWide={isWide} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
