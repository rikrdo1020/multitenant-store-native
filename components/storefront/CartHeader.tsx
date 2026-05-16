import { Pressable, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

interface CartHeaderProps {
  itemCount: number;
  onBack: () => void;
  onClear: () => void;
}

export function CartHeader({ itemCount, onBack, onClear }: CartHeaderProps) {
  return (
    <View className="border-b border-border px-4 pb-3 pt-2">
      <View className="flex-row items-center gap-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          onPress={onBack}
          hitSlop={8}
        >
          <ArrowLeft size={22} color="#0a0a0a" />
        </Pressable>
        <View className="min-w-0 flex-1">
          <Text variant="h2">Carrito</Text>
          <Text variant="xs">
            {itemCount === 0
              ? 'Sin productos seleccionados'
              : `${itemCount} ${itemCount === 1 ? 'producto' : 'productos'} en tu compra`}
          </Text>
        </View>
        {itemCount > 0 && (
          <Button variant="ghost" size="sm" onPress={onClear}>
            Vaciar
          </Button>
        )}
      </View>
    </View>
  );
}
