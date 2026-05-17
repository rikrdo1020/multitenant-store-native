import { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { CategoriesTab } from './CategoriesTab';
import { BrandsTab } from './BrandsTab';
import { TagsTab } from './TagsTab';
import { ProductTypesTab } from './ProductTypesTab';
import { CombosTab } from './CombosTab';
import { cn } from '@/lib/utils';

type TabId = 'categories' | 'brands' | 'tags' | 'product-types' | 'combos';

const TABS: { id: TabId; label: string }[] = [
  { id: 'categories', label: 'Categorías' },
  { id: 'brands', label: 'Marcas' },
  { id: 'tags', label: 'Etiquetas' },
  { id: 'product-types', label: 'Tipos' },
  { id: 'combos', label: 'Combos' },
];

function TabContent({ tab }: { tab: TabId }) {
  switch (tab) {
    case 'categories':
      return <CategoriesTab />;
    case 'brands':
      return <BrandsTab />;
    case 'tags':
      return <TagsTab />;
    case 'product-types':
      return <ProductTypesTab />;
    case 'combos':
      return <CombosTab />;
    default:
      return null;
  }
}

export function CatalogScreen() {
  const [activeTab, setActiveTab] = useState<TabId>('categories');

  return (
    <ScreenWrapper safeArea={false}>
      {/* Tab bar */}
      <View className="border-b border-border bg-background">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, gap: 4 }}
        >
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 py-3 border-b-2',
                  isActive ? 'border-primary' : 'border-transparent'
                )}
              >
                <Text
                  variant="small"
                  className={cn(
                    'font-semibold',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Tab content */}
      <View className="flex-1">
        <TabContent tab={activeTab} />
      </View>
    </ScreenWrapper>
  );
}
