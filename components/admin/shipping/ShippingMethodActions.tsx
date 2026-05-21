import { View } from 'react-native';
import { Pencil, Trash2 } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

interface ShippingMethodActionsProps {
  disabled: boolean;
  onEdit: () => void;
  onRemove: () => void;
}

export function ShippingMethodActions({
  disabled,
  onEdit,
  onRemove,
}: ShippingMethodActionsProps) {
  return (
    <View className="flex-row flex-wrap gap-2">
      <Button size="sm" variant="outline" disabled={disabled} onPress={onEdit}>
        <View className="flex-row items-center gap-1">
          <Pencil size={14} className="text-foreground" />
          <Text className="text-sm font-semibold text-foreground">Editar</Text>
        </View>
      </Button>
      <Button size="sm" variant="destructive" disabled={disabled} onPress={onRemove}>
        <View className="flex-row items-center gap-1">
          <Trash2 size={14} color="#ffffff" />
          <Text className="text-sm font-semibold text-destructive-foreground">
            Eliminar
          </Text>
        </View>
      </Button>
    </View>
  );
}
