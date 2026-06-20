import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { CheckoutHeader } from '@/components/storefront/CheckoutHeader';
import { YappyWebViewModal } from '@/components/storefront/YappyWebViewModal';
import { PaymentMethodCard } from '@/components/storefront/payment/PaymentMethodCard';
import { PaymentMethodInfo } from '@/components/storefront/payment/PaymentMethodInfo';
import { usePaymentScreen } from '@/hooks/use-payment-screen';

export function PaymentScreenContent({ tenantSlug }: { tenantSlug: string }) {
  const router = useRouter();
  const payment = usePaymentScreen(tenantSlug);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <CheckoutHeader compact onBack={() => router.canGoBack() ? router.back() : router.replace(`/(storefront)/${tenantSlug}/checkout` as never)} />
      <YappyWebViewModal visible={payment.yappyModalVisible} onCreatePayment={payment.handleYappyCreatePayment} onSuccess={payment.handleYappySuccess} onError={payment.handleYappyError} onDismiss={payment.handleYappyDismiss} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View className="gap-6">
          <View className="gap-1">
            <Text variant="h2">Metodo de pago</Text>
            <Text variant="small" className="text-muted-foreground">Selecciona como quieres pagar tu pedido</Text>
          </View>
          <View className="gap-3">
            {payment.availableMethods.map((method) => (
              <PaymentMethodCard key={method.id} {...method} selected={payment.selectedPaymentMethod === method.id} onSelect={payment.setSelectedPaymentMethod} />
            ))}
          </View>
          <PaymentMethodInfo method={payment.selectedPaymentMethod} />
          {payment.submitError ? (
            <View className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3">
              <Text variant="small" className="text-destructive">{payment.submitError}</Text>
            </View>
          ) : null}
          <Button size="lg" loading={payment.isPending} disabled={payment.isPending} onPress={() => void payment.handlePay()}>
            {payment.selectedPaymentMethod === 'cash' ? 'Confirmar pedido' : 'Pagar con Yappy'}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
