import { ActivityIndicator, View } from 'react-native';
import { PackageSearch } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';
import type { OrderTrackingViewModel } from '@/hooks/use-order-tracking-screen';

interface OrderTrackingLookupFormProps {
  tracking: OrderTrackingViewModel;
}

export function OrderTrackingLookupForm({ tracking }: OrderTrackingLookupFormProps) {
  return (
    <View className="gap-4 rounded-lg border border-border bg-card p-4">
      <View className="items-center gap-2">
        <PackageSearch size={32} color="#737373" />
        <View className="gap-1">
          <Text variant="h3" className="text-center">
            Busca tu pedido
          </Text>
          <Text variant="small" className="text-center">
            Usa el numero de orden y el correo usado en la compra.
          </Text>
        </View>
      </View>

      {tracking.isLoading ? (
        <View className="items-center gap-2 py-4">
          <ActivityIndicator size="small" color="#171717" />
          <Text variant="small">Consultando pedido...</Text>
        </View>
      ) : null}

      {tracking.tokenError || tracking.emailError ? (
        <View className="rounded-md border border-destructive bg-destructive/5 p-3">
          <Text variant="small" className="text-destructive">
            No encontramos un pedido con esos datos.
          </Text>
        </View>
      ) : null}

      <View className="gap-2">
        <Input
          label="Tienda"
          value={tracking.tenantInput}
          onChangeText={tracking.setTenantInput}
          autoCapitalize="none"
          placeholder="demo-store"
        />
        <Input
          label="Numero de orden"
          value={tracking.orderIdInput}
          onChangeText={tracking.setOrderIdInput}
          autoCapitalize="characters"
          placeholder="ORD-..."
        />
        <Input
          label="Correo de compra"
          value={tracking.emailInput}
          onChangeText={tracking.setEmailInput}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="tu@correo.com"
        />
      </View>

      <Button
        onPress={tracking.submitByEmail}
        disabled={!tracking.canSubmitByEmail}
        loading={tracking.isLoading}
      >
        Ver pedido
      </Button>
    </View>
  );
}
