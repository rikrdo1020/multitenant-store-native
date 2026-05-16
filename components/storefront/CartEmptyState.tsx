import { View } from 'react-native';
import { ShoppingCart } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

interface CartEmptyStateProps {
  onBrowseProducts: () => void;
}

export function CartEmptyState({ onBrowseProducts }: CartEmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-5 px-8">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-secondary">
        <ShoppingCart size={28} color="#0a0a0a" />
      </View>
      <View className="items-center gap-2">
        <Text variant="h2" className="text-center">
          Tu carrito esta vacio
        </Text>
        <Text variant="small" className="max-w-sm text-center leading-5">
          Agrega productos del catalogo para preparar tu orden.
        </Text>
      </View>
      <Button onPress={onBrowseProducts}>Ver catalogo</Button>
    </View>
  );
}
