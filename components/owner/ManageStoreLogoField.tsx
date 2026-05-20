import { Image, TouchableOpacity, View } from 'react-native';
import { Store } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';

interface ManageStoreLogoFieldProps {
  logoUri?: string | null;
  onPress: () => void;
}

export function ManageStoreLogoField({ logoUri, onPress }: ManageStoreLogoFieldProps) {
  return (
    <View className="items-center gap-3 py-2">
      <TouchableOpacity
        onPress={onPress}
        className="h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-border bg-muted"
      >
        {logoUri ? (
          <Image source={{ uri: logoUri }} className="h-28 w-28" resizeMode="cover" />
        ) : (
          <Store size={36} className="text-muted-foreground" />
        )}
      </TouchableOpacity>
      <Text variant="xs" className="text-muted-foreground">Toca el logo para cambiarlo</Text>
    </View>
  );
}
