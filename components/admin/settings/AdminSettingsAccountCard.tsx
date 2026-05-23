import { TouchableOpacity, View } from 'react-native';
import { ChevronRight, ShoppingBag, MapPin, User } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';

interface AdminSettingsAccountCardProps {
  onPress: () => void;
}

export function AdminSettingsAccountCard({ onPress }: AdminSettingsAccountCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-xl border border-border bg-card p-4"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <User size={24} className="text-primary" />
          </View>
          <View>
            <Text variant="body" className="font-semibold text-foreground">
              Mi cuenta
            </Text>
            <Text variant="small" className="text-muted-foreground">
              Perfil, direcciones y pedidos
            </Text>
          </View>
        </View>
        <ChevronRight size={20} className="text-muted-foreground" />
      </View>

      <View className="mt-3 flex-row gap-4 border-t border-border pt-3">
        <View className="flex-row items-center gap-1">
          <User size={12} className="text-muted-foreground" />
          <Text variant="xs" className="text-muted-foreground">Perfil</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <MapPin size={12} className="text-muted-foreground" />
          <Text variant="xs" className="text-muted-foreground">Direcciones</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <ShoppingBag size={12} className="text-muted-foreground" />
          <Text variant="xs" className="text-muted-foreground">Pedidos</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
