import { Pressable, View } from 'react-native';
import { X } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';

interface AccountFormModalHeaderProps {
  title: string;
  description: string;
  disabled: boolean;
  onClose: () => void;
}

export function AccountFormModalHeader({
  title,
  description,
  disabled,
  onClose,
}: AccountFormModalHeaderProps) {
  return (
    <View className="flex-row items-start justify-between gap-3">
      <View className="min-w-0 flex-1 gap-1">
        <Text variant="h3">{title}</Text>
        <Text variant="small">{description}</Text>
      </View>
      <Pressable
        onPress={onClose}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel="Cerrar"
        hitSlop={10}
      >
        <X size={20} color="#737373" />
      </Pressable>
    </View>
  );
}
