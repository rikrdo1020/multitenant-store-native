import { TouchableOpacity, View } from 'react-native';
import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { adminColors } from '@/lib/admin-theme';

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
      activeOpacity={0.6}
      className="flex-row items-center justify-between rounded-lg px-1 py-2.5"
    >
      <View className="flex-row items-center gap-2.5">
        {Icon && (
          <View className="w-5 items-center">
            <Icon size={14} color={adminColors.mutedForeground} />
          </View>
        )}
        <Text variant="small" className="text-foreground">
          {label}
        </Text>
      </View>
      <ChevronRight size={14} color={adminColors.mutedForeground} />
    </TouchableOpacity>
  );
}
