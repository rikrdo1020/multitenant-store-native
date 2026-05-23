import { View } from 'react-native';
import { Text } from '@/components/ui/Text';

interface SummaryRowProps {
  label: string;
  value: string;
  muted?: boolean;
}

export function SummaryRow({ label, value, muted }: SummaryRowProps) {
  return (
    <View className="flex-row items-center justify-between gap-4">
      <Text variant="small">{label}</Text>
      <Text className={muted ? 'text-muted-foreground' : 'font-semibold text-foreground'}>
        {value}
      </Text>
    </View>
  );
}
