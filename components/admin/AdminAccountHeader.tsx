import { View } from 'react-native';
import { Text } from '@/components/ui/Text';

export function AdminAccountHeader() {
  return (
    <View className="mx-auto mb-6 w-full max-w-6xl gap-1">
      <Text variant="h1">Mi cuenta</Text>
      <Text variant="body" className="text-muted-foreground">
        Gestiona tu perfil, direcciones y pedidos de esta tienda.
      </Text>
    </View>
  );
}
