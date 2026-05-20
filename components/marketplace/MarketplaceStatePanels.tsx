import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

export function MarketplaceLoadingPanel() {
  return (
    <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator color="#ffffff" />
    </View>
  );
}

export function MarketplaceErrorPanel({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: 32 }}>
      <Text style={{ color: '#737373', fontSize: 14, marginBottom: 16, textAlign: 'center' }}>
        No se pudo cargar las tiendas
      </Text>
      <TouchableOpacity onPress={onRetry} style={{ borderColor: '#2a2a2a', borderRadius: 10, borderWidth: 1, paddingHorizontal: 20, paddingVertical: 10 }}>
        <Text style={{ color: '#ffffff', fontSize: 13 }}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  );
}

export function MarketplaceEmptyPanel() {
  return (
    <View style={{ alignItems: 'center', backgroundColor: '#111111', borderColor: '#1e1e1e', borderRadius: 14, borderWidth: 1, padding: 24 }}>
      <Text style={{ color: '#737373', fontSize: 14 }}>No hay tiendas disponibles aun.</Text>
    </View>
  );
}
