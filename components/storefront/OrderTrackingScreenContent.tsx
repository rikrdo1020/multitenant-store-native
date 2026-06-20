import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { OrderTrackingLookupForm } from '@/components/storefront/OrderTrackingLookupForm';
import { OrderTrackingResult } from '@/components/storefront/OrderTrackingResult';
import { useOrderTrackingScreen } from '@/hooks/use-order-tracking-screen';

interface OrderTrackingScreenContentProps {
  tenantSlug?: string;
  orderId?: string;
  viewToken?: string;
}

export function OrderTrackingScreenContent(props: OrderTrackingScreenContentProps) {
  const tracking = useOrderTrackingScreen(props);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="border-b border-border bg-background px-4 py-3">
        <View className="mx-auto w-full max-w-5xl flex-row items-center gap-3">
          <Button variant="ghost" size="sm" onPress={tracking.goBack} className="px-1">
            <ArrowLeft size={22} color="#171717" />
          </Button>
          <View className="min-w-0 flex-1">
            <Text variant="h2">Seguimiento de pedido</Text>
            <Text variant="small">Consulta el estado sin iniciar sesion.</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View className="mx-auto w-full max-w-5xl gap-4">
          {tracking.order ? <OrderTrackingResult order={tracking.order} /> : null}
          {!tracking.order ? <OrderTrackingLookupForm tracking={tracking} /> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
