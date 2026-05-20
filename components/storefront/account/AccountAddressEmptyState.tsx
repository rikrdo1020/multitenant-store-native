import { View } from 'react-native';
import { Home } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

interface AccountAddressEmptyStateProps {
  onCreate: () => void;
}

export function AccountAddressEmptyState({ onCreate }: AccountAddressEmptyStateProps) {
  return (
    <View className="items-center gap-3 rounded-lg border border-dashed border-border px-4 py-8">
      <View className="h-11 w-11 items-center justify-center rounded-full bg-muted">
        <Home size={20} color="#171717" />
      </View>
      <View className="gap-1">
        <Text className="text-center font-semibold">Aun no tienes direcciones</Text>
        <Text variant="small" className="text-center">
          Agrega una direccion para reutilizarla en compras futuras.
        </Text>
      </View>
      <Button variant="outline" onPress={onCreate}>
        Agregar direccion
      </Button>
    </View>
  );
}
