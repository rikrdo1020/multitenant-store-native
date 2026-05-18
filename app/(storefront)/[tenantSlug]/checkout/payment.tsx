import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle2 } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { CheckoutHeader } from "@/components/storefront/CheckoutHeader";
import { YappyWebViewModal } from "@/components/storefront/YappyWebViewModal";
import { usePaymentScreen } from "@/hooks/use-payment-screen";
import { cn } from "@/lib/utils";
import type { PaymentProviderType } from "@/types";

export default function PaymentScreen() {
  const { tenantSlug } = useLocalSearchParams<{ tenantSlug: string }>();
  const router = useRouter();
  const payment = usePaymentScreen(tenantSlug);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <CheckoutHeader compact onBack={() => router.back()} />

      <YappyWebViewModal
        visible={payment.yappyModalVisible}
        onCreatePayment={payment.handleYappyCreatePayment}
        onSuccess={payment.handleYappySuccess}
        onError={payment.handleYappyError}
        onDismiss={payment.handleYappyDismiss}
      />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View className="gap-6">
          <View className="gap-1">
            <Text variant="h2">Método de pago</Text>
            <Text variant="small" className="text-muted-foreground">
              Selecciona cómo quieres pagar tu pedido
            </Text>
          </View>

          <View className="gap-3">
            {payment.availableMethods.map((method) => (
              <PaymentMethodCard
                key={method.id}
                id={method.id}
                label={method.label}
                description={method.description}
                selected={payment.selectedPaymentMethod === method.id}
                onSelect={payment.setSelectedPaymentMethod}
              />
            ))}
          </View>

          {payment.selectedPaymentMethod === "yappy" && (
            <View className="rounded-lg border border-border bg-secondary p-4">
              <Text variant="small" className="font-semibold">
                ¿Cómo funciona Yappy?
              </Text>
              <Text variant="xs" className="mt-1 leading-5 text-muted-foreground">
                Al confirmar, ingresarás tu número Yappy y recibirás una
                notificación en tu app para aprobar el pago.
              </Text>
            </View>
          )}

          {payment.selectedPaymentMethod === "cash" && (
            <View className="rounded-lg border border-border bg-secondary p-4">
              <Text variant="small" className="font-semibold">
                Pago en efectivo
              </Text>
              <Text
                variant="xs"
                className="mt-1 leading-5 text-muted-foreground"
              >
                Prepara el monto exacto al momento de la entrega. El pedido
                quedará registrado y el cobrador confirmará el pago.
              </Text>
            </View>
          )}

          {payment.submitError && (
            <View className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3">
              <Text variant="small" className="text-destructive">
                {payment.submitError}
              </Text>
            </View>
          )}

          <Button
            size="lg"
            loading={payment.isPending}
            disabled={payment.isPending}
            onPress={() => void payment.handlePay()}
          >
            {payment.selectedPaymentMethod === "cash"
              ? "Confirmar pedido"
              : "Pagar con Yappy"}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface PaymentMethodCardProps {
  id: PaymentProviderType;
  label: string;
  description: string;
  selected: boolean;
  onSelect: (id: PaymentProviderType) => void;
}

function PaymentMethodCard({
  id,
  label,
  description,
  selected,
  onSelect,
}: PaymentMethodCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Método de pago ${label}`}
      accessibilityState={{ selected }}
      onPress={() => onSelect(id)}
      className={cn(
        "flex-row items-center gap-4 rounded-lg border p-4",
        selected
          ? "border-foreground bg-secondary"
          : "border-border bg-background",
      )}
    >
      <View className="min-w-0 flex-1 gap-0.5">
        <Text className="font-semibold">{label}</Text>
        <Text variant="xs" className="leading-4 text-muted-foreground">
          {description}
        </Text>
      </View>

      {selected && <CheckCircle2 size={20} color="#0a0a0a" />}
    </Pressable>
  );
}
