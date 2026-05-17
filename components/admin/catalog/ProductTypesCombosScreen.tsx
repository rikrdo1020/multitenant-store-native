import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/Text';
import { CombosTab } from './CombosTab';
import { ProductTypesTab } from './ProductTypesTab';
import { cn } from '@/lib/utils';
import { Tag } from 'lucide-react-native';

type Tab = 'combos' | 'product-types';

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <View className="flex-row border-b border-border bg-background">
      {(['combos', 'product-types'] as Tab[]).map((tab) => {
        const isActive = tab === active;
        const label = tab === 'combos' ? 'Combos' : 'Tipos de Producto';
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onChange(tab)}
            className={cn('flex-1 py-3 items-center border-b-2', isActive ? 'border-primary' : 'border-transparent')}
          >
            <Text
              variant="small"
              className={cn('font-semibold', isActive ? 'text-primary' : 'text-muted-foreground')}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function ProductTypesCombosScreen() {
  const [active, setActive] = useState<Tab>('combos');

  return (
    <View className="flex-1">
      <TabBar active={active} onChange={setActive} />

      {active === 'combos' && (
        <View className="flex-1">
          <View className="mx-4 mt-3 flex-row items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2">
            <Tag size={13} color="#9ca3af" />
            <Text variant="xs" className="flex-1 text-muted-foreground">
              Descuentos automáticos al cumplir condiciones de compra · Usa los tipos de producto para definir reglas.
            </Text>
          </View>
          <CombosTab />
        </View>
      )}

      {active === 'product-types' && (
        <View className="flex-1">
          <View className="mx-4 mt-3 flex-row items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2">
            <Tag size={13} color="#9ca3af" />
            <Text variant="xs" className="flex-1 text-muted-foreground">
              Tabla auxiliar · Los tipos de producto se referencian en las condiciones de los combos.
            </Text>
          </View>
          <ProductTypesTab />
        </View>
      )}
    </View>
  );
}
