import { ScrollView, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { CheckoutAddressForm } from '@/components/storefront/CheckoutAddressForm';
import { CheckoutCustomerForm } from '@/components/storefront/CheckoutCustomerForm';
import { CheckoutEmptyState } from '@/components/storefront/CheckoutEmptyState';
import { CheckoutHeader } from '@/components/storefront/CheckoutHeader';
import { CheckoutSummaryColumn } from '@/components/storefront/CheckoutSummaryColumn';
import { ShippingMethodSelector } from '@/components/storefront/ShippingMethodSelector';
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
          <View className="min-w-0 flex-1 gap-4">
            <CheckoutCustomerForm
              control={checkout.control}
              errors={checkout.errors}
              isWide={isWide}
            />

            <CheckoutAddressForm
              control={checkout.control}
              errors={checkout.errors}
              isWide={isWide}
            />

            <ShippingMethodSelector
              methods={checkout.shippingMethods}
              currency={checkout.currency}
              isLoading={checkout.shippingQuery.isLoading}
              isError={checkout.shippingQuery.isError}
              selectedMethodId={checkout.selectedMethodId}
              selectedLocationId={checkout.selectedLocationId}
              selectionError={checkout.selectionError}
              onRetry={() => {
                void checkout.shippingQuery.refetch();
              }}
              onSelectMethod={checkout.handleSelectMethod}
              onSelectLocation={checkout.handleSelectLocation}
            />
          </View>

          <View className={isWide ? 'w-96 gap-4' : 'gap-4'}>
            <CheckoutSummaryColumn
              items={checkout.items}
              pricing={checkout.pricing}
              currency={checkout.currency}
              selectedMethod={checkout.selectedMethod}
              shippingCost={checkout.shippingCost}
              isSubmitting={false}
              isShippingLoading={checkout.shippingQuery.isLoading}
              hasShippingMethods={checkout.shippingMethods.length > 0}
              submitError={checkout.submitError}
              onSubmit={checkout.submitOrder}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
