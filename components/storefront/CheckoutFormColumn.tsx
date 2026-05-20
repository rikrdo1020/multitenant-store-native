import { View } from 'react-native';
import { CheckoutAddressForm } from '@/components/storefront/CheckoutAddressForm';
import { CheckoutCustomerForm } from '@/components/storefront/CheckoutCustomerForm';
import { SavedAddressSelector } from '@/components/storefront/SavedAddressSelector';
import { ShippingMethodSelector } from '@/components/storefront/ShippingMethodSelector';
import type { CheckoutScreenViewModel } from '@/hooks/use-checkout-screen';

interface CheckoutFormColumnProps {
  checkout: CheckoutScreenViewModel;
  isWide: boolean;
}

export function CheckoutFormColumn({ checkout, isWide }: CheckoutFormColumnProps) {
  return (
    <View className="min-w-0 flex-1 gap-4">
      {checkout.canUseSavedAddresses && (
        <SavedAddressSelector
          addresses={checkout.savedAddresses}
          selectedAddressId={checkout.selectedSavedAddressId}
          isLoading={checkout.areSavedAddressesLoading}
          isError={checkout.areSavedAddressesErrored}
          onRetry={checkout.retrySavedAddresses}
          onSelectAddress={checkout.handleSelectSavedAddress}
        />
      )}

      <CheckoutCustomerForm control={checkout.control} errors={checkout.errors} isWide={isWide} />
      <CheckoutAddressForm control={checkout.control} errors={checkout.errors} isWide={isWide} />

      <ShippingMethodSelector
        methods={checkout.shippingMethods}
        currency={checkout.currency}
        isLoading={checkout.isShippingLoading}
        isError={checkout.isShippingErrored}
        selectedMethodId={checkout.selectedMethodId}
        selectedLocationId={checkout.selectedLocationId}
        selectionError={checkout.selectionError}
        onRetry={checkout.retryShippingMethods}
        onSelectMethod={checkout.handleSelectMethod}
        onSelectLocation={checkout.handleSelectLocation}
      />
    </View>
  );
}
