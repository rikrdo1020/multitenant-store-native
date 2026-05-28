import { TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { adminColors } from '@/lib/admin-theme';

interface AdminDrawerHeaderProps {
  title?: string;
  onClose: () => void;
}

export function AdminDrawerHeader({ title = 'Admin', onClose }: AdminDrawerHeaderProps) {
  return (
    <View className="flex-row items-center justify-between border-b border-border px-4 py-4">
      <Text variant="h3" className="font-bold tracking-tight text-foreground">
        {title}
      </Text>
      <TouchableOpacity
        onPress={onClose}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        className="h-8 w-8 items-center justify-center rounded-full bg-muted"
      >
        <X size={16} color={adminColors.foreground} />
      </TouchableOpacity>
    </View>
  );
}
