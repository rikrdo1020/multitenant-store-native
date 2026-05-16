import { Pressable, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils';
import type { ProductOption } from '@/types';

interface ProductOptionSelectorProps {
  option: ProductOption;
  selectedValue?: string;
  onSelect: (optionName: string, value: string) => void;
}

export function ProductOptionSelector({
  option,
  selectedValue,
  onSelect,
}: ProductOptionSelectorProps) {
  return (
    <View className="gap-3">
      <Text variant="small" className="font-semibold text-foreground">
        {option.name}
      </Text>

      <View className="flex-row flex-wrap gap-2">
        {option.values.map((value) => {
          const isSelected = selectedValue === value;

          return (
            <Pressable
              key={`${option.name}-${value}`}
              accessibilityRole="button"
              accessibilityLabel={`${option.name}: ${value}`}
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelect(option.name, value)}
              className={cn(
                'min-h-11 flex-row items-center gap-2 rounded-md border px-3 py-2',
                isSelected ? 'border-foreground bg-foreground' : 'border-border bg-background',
              )}
            >
              {isSelected && <Check size={16} color="#ffffff" />}
              <Text
                variant="small"
                className={cn('font-medium', isSelected ? 'text-white' : 'text-foreground')}
              >
                {value}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
