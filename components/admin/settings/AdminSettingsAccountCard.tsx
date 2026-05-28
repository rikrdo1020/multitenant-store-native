import { TouchableOpacity, View } from 'react-native';
import { ChevronRight, ShoppingBag, MapPin, User } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { adminColors } from '@/lib/admin-theme';

interface AdminSettingsAccountCardProps {
  onPress: () => void;
}

export function AdminSettingsAccountCard({ onPress }: AdminSettingsAccountCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-xl border border-border bg-card overflow-hidden"
      activeOpacity={0.7}
    >
      {/* Main row */}
      <View className="flex-row items-center gap-3 px-4 py-4">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-muted">
          <User size={18} color={adminColors.foreground} />
        </View>
        <View className="flex-1">
          <Text variant="small" className="font-semibold text-foreground leading-tight">
            Mi cuenta
          </Text>
          <Text variant="xs" className="text-muted-foreground">
            Perfil, direcciones y pedidos
          </Text>
        </View>
        <ChevronRight size={16} color={adminColors.mutedForeground} />
      </View>

      {/* Tag strip */}
      <View className="flex-row gap-3 border-t border-border bg-muted/50 px-4 py-2.5">
        <View className="flex-row items-center gap-1">
          <User size={11} color={adminColors.mutedForeground} />
          <Text variant="xs" className="text-muted-foreground">Perfil</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <MapPin size={11} color={adminColors.mutedForeground} />
          <Text variant="xs" className="text-muted-foreground">Direcciones</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <ShoppingBag size={11} color={adminColors.mutedForeground} />
          <Text variant="xs" className="text-muted-foreground">Pedidos</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
