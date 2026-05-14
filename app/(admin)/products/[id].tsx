import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Text } from '@/components/ui/Text';

export default function AdminProductEditScreen() {
  const { id } = useLocalSearchParams();
  return (
    <ScreenWrapper>
      <View className="p-4">
        <Text variant="h1">Editar Producto</Text>
        <Text variant="body">ID: {id}</Text>
      </View>
    </ScreenWrapper>
  );
}
