import { View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

interface ShippingMethodsHeaderProps {
  tenantName: string;
  isWide: boolean;
  onCreate: () => void;
}

export function ShippingMethodsHeader({
  tenantName,
  isWide,
  onCreate,
}: ShippingMethodsHeaderProps) {
  return (
    <View className={isWide ? 'flex-row items-start justify-between gap-4' : 'gap-4'}>
      <View className="min-w-0 flex-1 gap-1">
        <Text variant="h1">Envios</Text>
        <Text variant="body" className="text-muted-foreground">
          Configura los metodos disponibles para {tenantName}.
        </Text>
      </View>
      <Button onPress={onCreate} className={isWide ? undefined : 'w-full'}>
        <View className="flex-row items-center gap-2">
          <Plus size={17} color="#ffffff" />
          <Text className="font-semibold text-primary-foreground">Nuevo metodo</Text>
        </View>
      </Button>
    </View>
  );
}
