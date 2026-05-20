import { ActivityIndicator, View } from 'react-native';
import { RefreshCw } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { SavedAddressCard } from '@/components/storefront/SavedAddressCard';
import type { CustomerAddress } from '@/types';

interface SavedAddressSelectorContentProps {
  addresses: CustomerAddress[];
  selectedAddressId: string | null;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onSelectAddress: (address: CustomerAddress) => void;
}

export function SavedAddressSelectorContent({
  addresses,
  selectedAddressId,
  isLoading,
  isError,
  onRetry,
  onSelectAddress,
}: SavedAddressSelectorContentProps) {
  if (isLoading) {
    return (
      <View className="flex-row items-center gap-3 rounded-md border border-border p-3">
        <ActivityIndicator size="small" />
        <Text variant="small">Cargando direcciones...</Text>
      </View>
    );
  }

  if (isError) return <SavedAddressSelectorError onRetry={onRetry} />;
  if (addresses.length === 0) return <SavedAddressSelectorEmpty />;

  return (
    <View className="gap-2">
      {addresses.map((address) => (
        <SavedAddressCard
          key={address.documentId}
          address={address}
          isSelected={selectedAddressId === address.documentId}
          onSelect={() => onSelectAddress(address)}
        />
      ))}
    </View>
  );
}

function SavedAddressSelectorError({ onRetry }: { onRetry: () => void }) {
  return (
    <View className="gap-3 rounded-md border border-border p-3">
      <View className="flex-row items-start gap-2">
        <RefreshCw size={16} color="#737373" />
        <View className="min-w-0 flex-1">
          <Text className="font-semibold">No pudimos cargar tus direcciones</Text>
          <Text variant="small">Puedes escribir la direccion manualmente.</Text>
        </View>
      </View>
      <Button variant="outline" size="sm" onPress={onRetry}>
        Reintentar
      </Button>
    </View>
  );
}

function SavedAddressSelectorEmpty() {
  return (
    <View className="rounded-md border border-dashed border-border p-3">
      <Text className="font-semibold">No tienes direcciones guardadas</Text>
      <Text variant="small">Puedes completar el formulario manualmente.</Text>
    </View>
  );
}
