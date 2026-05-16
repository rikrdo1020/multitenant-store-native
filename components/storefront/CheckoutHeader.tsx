import { Pressable, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

interface CheckoutHeaderProps {
  compact?: boolean;
  onBack: () => void;
  onCartPress?: () => void;
}

export function CheckoutHeader({ compact = false, onBack, onCartPress }: CheckoutHeaderProps) {
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
          <Text variant="h2">Checkout</Text>
          {!compact && <Text variant="xs">Datos de envio y resumen final</Text>}
        </View>
        {onCartPress && (
          <Button variant="ghost" size="sm" onPress={onCartPress}>
            Carrito
          </Button>
        )}
      </View>
    </View>
  );
}
