import { View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

interface BannersHeaderProps {
  tenantName: string;
  isWide: boolean;
  onCreate: () => void;
}

export function BannersHeader({ tenantName, isWide, onCreate }: BannersHeaderProps) {
  return (
    <View className={isWide ? 'flex-row items-start justify-between gap-4' : 'gap-4'}>
      <View className="min-w-0 flex-1 gap-1">
        <Text variant="h1">Banners</Text>
        <Text variant="body" className="text-muted-foreground">
          Configura la portada de {tenantName}.
        </Text>
      </View>
      <Button onPress={onCreate} className={isWide ? undefined : 'w-full'}>
        <View className="flex-row items-center gap-2">
          <Plus size={17} color="#ffffff" />
          <Text className="font-semibold text-primary-foreground">Nuevo banner</Text>
        </View>
      </Button>
    </View>
  );
}
