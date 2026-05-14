import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Text } from '@/components/ui/Text';

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams();
  return (
    <ScreenWrapper>
      <View className="p-4">
        <Text variant="h1">Categoría</Text>
        <Text variant="body">Slug: {slug}</Text>
      </View>
    </ScreenWrapper>
  );
}
