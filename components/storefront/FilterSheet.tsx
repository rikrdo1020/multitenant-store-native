import { useState } from 'react';
import { Modal, View, Pressable, ScrollView, TextInput } from 'react-native';
import { X } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { Brand, ProductFilters } from '@/types';

type SortOption = ProductFilters['sort'];

interface FilterState {
  sort?: SortOption;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  brands: Brand[];
  currentFilters: FilterState;
  onApply: (filters: FilterState) => void;
}

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Más recientes', value: undefined },
  { label: 'Precio: menor a mayor', value: 'price_asc' },
  { label: 'Precio: mayor a menor', value: 'price_desc' },
];

export function FilterSheet({ visible, onClose, brands, currentFilters, onApply }: FilterSheetProps) {
  const [local, setLocal] = useState<FilterState>(currentFilters);

  const handleOpen = () => setLocal(currentFilters);

  const handleApply = () => {
    onApply(local);
    onClose();
  };

  const handleClear = () => {
    const empty: FilterState = {};
    setLocal(empty);
    onApply(empty);
    onClose();
  };

  const hasActive = !!(local.sort || local.brand || local.minPrice !== undefined || local.maxPrice !== undefined);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      onShow={handleOpen}
    >
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />

        <View className="bg-background rounded-t-3xl px-5 pt-5 pb-10">
          <View className="flex-row items-center justify-between mb-5">
            <Text variant="h3">Filtros</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <X size={20} color="#0a0a0a" />
            </Pressable>
          </View>

          {/* Sort */}
          <Text variant="small" className="font-semibold mb-2">Ordenar por</Text>
          <View className="gap-2 mb-5">
            {SORT_OPTIONS.map((opt) => {
              const active = local.sort === opt.value;
              return (
                <Pressable
                  key={opt.value ?? 'default'}
                  onPress={() => setLocal((s) => ({ ...s, sort: opt.value }))}
                  className={cn(
                    'px-4 py-3 rounded-xl border',
                    active ? 'border-foreground bg-foreground' : 'border-border bg-transparent',
                  )}
                >
                  <Text variant="small" className={cn('font-medium', active ? 'text-white' : 'text-foreground')}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Brand */}
          {brands.length > 0 && (
            <>
              <Text variant="small" className="font-semibold mb-2">Marca</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-5"
                contentContainerStyle={{ gap: 8, paddingRight: 4 }}
              >
                {brands.map((brand) => {
                  const active = local.brand === brand.documentId;
                  return (
                    <Pressable
                      key={brand.documentId}
                      onPress={() => setLocal((s) => ({ ...s, brand: active ? undefined : brand.documentId }))}
                      className={cn(
                        'px-4 py-2 rounded-full border',
                        active ? 'bg-foreground border-foreground' : 'bg-transparent border-border',
                      )}
                    >
                      <Text variant="small" className={cn('font-medium', active ? 'text-white' : 'text-foreground')}>
                        {brand.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </>
          )}

          {/* Price range */}
          <Text variant="small" className="font-semibold mb-2">Rango de precio</Text>
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1">
              <Text variant="xs" className="text-muted-foreground mb-1">Mínimo</Text>
              <TextInput
                value={local.minPrice?.toString() ?? ''}
                onChangeText={(t) => setLocal((s) => ({ ...s, minPrice: t ? Number(t) : undefined }))}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#737373"
                className="border border-border rounded-xl px-3 py-2.5 text-foreground text-sm"
              />
            </View>
            <View className="flex-1">
              <Text variant="xs" className="text-muted-foreground mb-1">Máximo</Text>
              <TextInput
                value={local.maxPrice?.toString() ?? ''}
                onChangeText={(t) => setLocal((s) => ({ ...s, maxPrice: t ? Number(t) : undefined }))}
                keyboardType="numeric"
                placeholder="∞"
                placeholderTextColor="#737373"
                className="border border-border rounded-xl px-3 py-2.5 text-foreground text-sm"
              />
            </View>
          </View>

          <View className="flex-row gap-3">
            <Button variant="outline" className="flex-1" onPress={handleClear} disabled={!hasActive}>
              Limpiar
            </Button>
            <Button className="flex-1" onPress={handleApply}>
              Aplicar
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
