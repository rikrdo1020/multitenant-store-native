import { TouchableOpacity, View } from 'react-native';
import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';

interface AdminSettingsActionProps {
  icon?: LucideIcon;
  label: string;
  onPress: () => void;
}

export function AdminSettingsAction({
  icon: Icon,
  label,
  onPress,
}: AdminSettingsActionProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between rounded-lg bg-muted px-3 py-2"
    >
      <View className="flex-row items-center gap-2">
        {Icon && <Icon size={14} className="text-muted-foreground" />}
        <Text variant="small" className="text-foreground">
          {label}
        </Text>
      </View>
      <ChevronRight size={16} className="text-muted-foreground" />
    </TouchableOpacity>
  );
}
