import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrderConfirmationBody } from '@/components/storefront/OrderConfirmationBody';
import { useOrderConfirmationScreen } from '@/hooks/use-order-confirmation-screen';

interface OrderConfirmationScreenContentProps {
  tenantSlug?: string;
  orderId?: string;
  viewToken?: string;
}

export function OrderConfirmationScreenContent(props: OrderConfirmationScreenContentProps) {
  const confirmation = useOrderConfirmationScreen(props);

  if (confirmation.isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <OrderConfirmationBody confirmation={confirmation} />
    </SafeAreaView>
  );
}
