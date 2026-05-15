import { ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface CategoryTabsProps {
  categories: Category[];
  selectedId: string | undefined;
  onSelect: (id: string | undefined) => void;
}

export function CategoryTabs({ categories, selectedId, onSelect }: CategoryTabsProps) {
  if (categories.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingVertical: 4 }}
    >
      <Pressable
        onPress={() => onSelect(undefined)}
        className={cn(
          'px-4 py-2 rounded-full border',
          !selectedId ? 'bg-foreground border-foreground' : 'bg-transparent border-border',
        )}
      >
        <Text
          variant="small"
          className={cn('font-medium', !selectedId ? 'text-white' : 'text-foreground')}
        >
          Todo
        </Text>
      </Pressable>

      {categories.map((cat) => (
        <Pressable
          key={cat.documentId}
          onPress={() => onSelect(cat.documentId)}
          className={cn(
            'px-4 py-2 rounded-full border',
            selectedId === cat.documentId
              ? 'bg-foreground border-foreground'
              : 'bg-transparent border-border',
          )}
        >
          <Text
            variant="small"
            className={cn(
              'font-medium',
              selectedId === cat.documentId ? 'text-white' : 'text-foreground',
            )}
          >
            {cat.name}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
