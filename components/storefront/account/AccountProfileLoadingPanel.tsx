import { ActivityIndicator, View } from 'react-native';
import { Text } from '@/components/ui/Text';

export function AccountProfileLoadingPanel() {
  return (
    <View className="items-center gap-3 rounded-lg border border-border bg-card px-5 py-10">
      <ActivityIndicator />
      <Text variant="small">Cargando tu perfil...</Text>
    </View>
  );
}
