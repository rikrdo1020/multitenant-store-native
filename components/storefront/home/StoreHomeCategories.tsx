import { Image, Pressable, ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import type { Category } from '@/types';

interface StoreHomeCategoriesProps {
  categories: Category[];
  onCategoryPress: (category: Category) => void;
  onViewAll: () => void;
}

export function StoreHomeCategories({
  categories,
  onCategoryPress,
  onViewAll,
}: StoreHomeCategoriesProps) {
  if (categories.length === 0) return null;

  return (
    <View className="gap-3">
      <SectionHeader title="Categorias" action="Ver todo" onAction={onViewAll} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingRight: 16 }}
      >
        {categories.map((category) => (
          <Pressable
            key={category.documentId}
            onPress={() => onCategoryPress(category)}
            className="w-36 overflow-hidden rounded-lg border border-border bg-card"
          >
            {category.image ? (
              <Image source={{ uri: category.image }} className="h-20 w-full bg-muted" resizeMode="cover" />
            ) : (
              <View className="h-20 w-full bg-muted" />
            )}
            <View className="p-3">
              <Text className="font-semibold text-foreground" numberOfLines={1}>
                {category.name}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <Text variant="h3">{title}</Text>
      <Pressable onPress={onAction} hitSlop={8}>
        <Text className="font-semibold text-foreground">{action}</Text>
      </Pressable>
    </View>
  );
}
