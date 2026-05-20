import { Pressable, View } from 'react-native';
import { Package } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';

interface AccountOrdersPanelProps {
  onPress: () => void;
}

export function AccountOrdersPanel({ onPress }: AccountOrdersPanelProps) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-lg border border-border bg-card p-5 active:bg-muted"
    >
      <View className="flex-row items-center gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-full bg-muted">
          <Package size={20} color="#171717" />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="font-semibold">Mis pedidos</Text>
          <Text variant="small">Revisa el estado y detalle de tus ordenes.</Text>
        </View>
      </View>
    </Pressable>
  );
}
