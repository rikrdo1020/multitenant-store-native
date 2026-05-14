import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/Text';

export function LoadingScreen({ message = 'Cargando...' }: { message?: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" className="text-primary" />
      <Text className="mt-4 text-muted-foreground">{message}</Text>
    </View>
  );
}
