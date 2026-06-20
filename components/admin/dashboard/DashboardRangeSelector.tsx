import { TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import type { DateRange } from '@/hooks/api/use-analytics';

const RANGES: { label: string; value: DateRange }[] = [
  { label: '7d', value: 7 },
  { label: '30d', value: 30 },
  { label: '90d', value: 90 },
];

interface DashboardRangeSelectorProps {
  selected: DateRange;
  onChange: (range: DateRange) => void;
}

export function DashboardRangeSelector({
  selected,
  onChange,
}: DashboardRangeSelectorProps) {
  return (
    <View className="flex-row gap-1 rounded-xl bg-muted p-1">
      {RANGES.map((range) => (
        <TouchableOpacity
          key={range.value}
          onPress={() => onChange(range.value)}
          className={`flex-1 items-center rounded-lg py-1.5 ${selected === range.value ? 'bg-background shadow-sm' : ''}`}
        >
          <Text className={`text-sm font-medium ${selected === range.value ? 'text-foreground' : 'text-muted-foreground'}`}>
            {range.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
