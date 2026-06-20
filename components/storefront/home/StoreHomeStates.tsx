import { View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

export function StoreHomeErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <View className="flex-1 items-center justify-center gap-4 p-6">
      <Text variant="h3" className="text-center">Error al cargar la tienda</Text>
      <Text variant="body" className="text-center text-muted-foreground">
        Revisa tu conexion e intenta nuevamente.
      </Text>
      <Button variant="outline" onPress={onRetry}>
        Reintentar
      </Button>
    </View>
  );
}

export function StoreHomeEmptyState() {
  return (
    <View className="items-center gap-3 rounded-lg border border-border bg-card p-6">
      <Text variant="h3" className="text-center">Esta tienda aun no tiene productos</Text>
      <Text variant="body" className="text-center text-muted-foreground">
        Vuelve pronto para ver el catalogo disponible.
      </Text>
    </View>
  );
}
