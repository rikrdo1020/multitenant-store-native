import { TouchableOpacity, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';

interface OwnerHeaderProps {
  title: string;
  onBack: () => void;
}

export function OwnerHeader({ title, onBack }: OwnerHeaderProps) {
  return (
    <View className="flex-row items-center gap-3 border-b border-border px-4 py-4">
      <TouchableOpacity onPress={onBack} className="p-1">
        <ArrowLeft size={22} className="text-foreground" />
      </TouchableOpacity>
      <Text variant="body" className="font-semibold">{title}</Text>
    </View>
  );
}
