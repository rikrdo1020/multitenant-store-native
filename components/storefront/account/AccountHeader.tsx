import { View } from 'react-native';
import { Text } from '@/components/ui/Text';

export function AccountHeader() {
  return (
    <View className="gap-1">
      <Text variant="h1">Mi cuenta</Text>
      <Text variant="small">Gestiona tu perfil, direcciones y pedidos de esta tienda.</Text>
    </View>
  );
}
