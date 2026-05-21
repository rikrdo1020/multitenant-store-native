import { TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';

interface AdminDrawerHeaderProps {
  title?: string;
  onClose: () => void;
}

export function AdminDrawerHeader({ title = 'Admin', onClose }: AdminDrawerHeaderProps) {
  return (
    <View className="flex-row items-center justify-between border-b border-border px-4 py-4">
      <Text variant="h3" className="font-bold">
        {title}
      </Text>
      <TouchableOpacity onPress={onClose}>
        <X size={24} className="text-foreground" />
      </TouchableOpacity>
    </View>
  );
}
