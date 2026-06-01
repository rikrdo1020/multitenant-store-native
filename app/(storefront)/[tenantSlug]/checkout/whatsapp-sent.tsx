import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle2 } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

export default function WhatsAppSentScreen() {
  const { tenantSlug, orderId } = useLocalSearchParams<{ tenantSlug: string; orderId: string }>();
  const router = useRouter();

  const goToProducts = () => router.replace(`/(storefront)/${tenantSlug}/products` as never);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center gap-6 px-6">
        <CheckCircle2 size={56} color="#16a34a" strokeWidth={1.5} />

        <View className="w-full items-center gap-2">
          <Text variant="h1" className="text-center w-full">
            ¡Pedido enviado!
          </Text>
          {orderId ? (
            <Text variant="small" className="text-center text-muted-foreground w-full">
              Tu pedido{' '}
              <Text variant="small" className="font-semibold text-foreground">
                {orderId}
              </Text>{' '}
              fue registrado y el resumen fue enviado al vendedor por WhatsApp.
            </Text>
          ) : (
            <Text variant="small" className="text-center text-muted-foreground w-full">
              Tu pedido fue registrado y el resumen fue enviado al vendedor por WhatsApp.
            </Text>
          )}
          <Text variant="small" className="text-center text-muted-foreground w-full mt-1">
            El vendedor coordinará contigo la entrega y confirmación del pago.
          </Text>
        </View>

        <View className="w-full gap-3">
          <Button size="lg" onPress={goToProducts}>
            Volver a la tienda
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
