import { TouchableOpacity, View } from 'react-native';
import { ArrowLeft, Settings } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';

interface ManageStoreHeaderProps {
  onBack: () => void;
  onSettings: () => void;
}

export function ManageStoreHeader({ onBack, onSettings }: ManageStoreHeaderProps) {
  return (
    <View className="flex-row items-center justify-between border-b border-border px-4 py-4">
      <TouchableOpacity onPress={onBack} className="p-1">
        <ArrowLeft size={22} className="text-foreground" />
      </TouchableOpacity>
      <Text variant="body" className="font-semibold">Editar tienda</Text>
      <TouchableOpacity onPress={onSettings} className="p-1">
        <Settings size={22} className="text-foreground" />
      </TouchableOpacity>
    </View>
  );
}
