import { TouchableOpacity, View } from 'react-native';
import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { adminColors } from '@/lib/admin-theme';

interface StoreConfigNavSectionProps {
  label: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onPress: () => void;
}

export function StoreConfigNavSection({
  label,
  icon: Icon,
  title,
  subtitle,
  onPress,
}: StoreConfigNavSectionProps) {
  return (
    <View className="gap-2">
      <Text variant="xs" className="px-1 font-semibold uppercase tracking-widest text-muted-foreground">{label}</Text>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="flex-row items-center gap-3 rounded-xl border border-border bg-card px-4 py-4">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-muted">
          <Icon size={18} color={adminColors.foreground} />
        </View>
        <View className="flex-1">
          <Text variant="small" className="font-semibold text-foreground leading-tight">{title}</Text>
          <Text variant="xs" className="mt-0.5 text-muted-foreground" numberOfLines={1}>{subtitle}</Text>
        </View>
        <ChevronRight size={16} color={adminColors.mutedForeground} />
      </TouchableOpacity>
    </View>
  );
}
