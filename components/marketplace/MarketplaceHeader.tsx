import { Text, TouchableOpacity, View } from 'react-native';

interface MarketplaceHeaderProps {
  onBack: () => void;
}

export function MarketplaceHeader({ onBack }: MarketplaceHeaderProps) {
  return (
    <View style={{
      alignItems: 'flex-end',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 16,
      paddingHorizontal: 24,
      paddingTop: 20,
    }}>
      <View>
        <Text style={{ color: '#404040', fontSize: 11, letterSpacing: 2, marginBottom: 4, textTransform: 'uppercase' }}>
          Marketplace
        </Text>
        <Text style={{ color: '#ffffff', fontSize: 28, fontWeight: '800' }}>Tiendas</Text>
      </View>
      <TouchableOpacity onPress={onBack} style={{ paddingBottom: 4 }}>
        <Text style={{ color: '#737373', fontSize: 13 }}>{'← Volver'}</Text>
      </TouchableOpacity>
    </View>
  );
}
