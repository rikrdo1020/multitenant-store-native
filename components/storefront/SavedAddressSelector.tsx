import { View } from 'react-native';
import { Home } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { SavedAddressSelectorContent } from '@/components/storefront/SavedAddressSelectorContent';
import type { CustomerAddress } from '@/types';

interface SavedAddressSelectorProps {
  addresses: CustomerAddress[];
  selectedAddressId: string | null;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onSelectAddress: (address: CustomerAddress) => void;
}

export function SavedAddressSelector(props: SavedAddressSelectorProps) {
  return (
    <View className="gap-4 rounded-lg border border-border bg-background p-4">
      <View className="flex-row items-start gap-2">
        <Home size={18} color="#0a0a0a" />
        <View className="min-w-0 flex-1 gap-1">
          <Text variant="h3">Usar direccion guardada</Text>
          <Text variant="small">
            Selecciona una direccion para completar los datos de envio.
          </Text>
        </View>
      </View>
      <SavedAddressSelectorContent {...props} />
    </View>
  );
}
