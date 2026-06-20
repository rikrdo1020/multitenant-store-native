import { Pressable, View } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils';
import type { PaymentProviderType } from '@/types';

interface PaymentMethodCardProps {
  id: PaymentProviderType;
  label: string;
  description: string;
  selected: boolean;
  onSelect: (id: PaymentProviderType) => void;
}

export function PaymentMethodCard({
  id,
  label,
  description,
  selected,
  onSelect,
}: PaymentMethodCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Metodo de pago ${label}`}
      accessibilityState={{ selected }}
      onPress={() => onSelect(id)}
      className={cn(
        'flex-row items-center gap-4 rounded-lg border p-4',
        selected ? 'border-foreground bg-secondary' : 'border-border bg-background',
      )}
    >
      <View className="min-w-0 flex-1 gap-0.5">
        <Text className="font-semibold">{label}</Text>
        <Text variant="xs" className="leading-4 text-muted-foreground">{description}</Text>
      </View>
      {selected ? <CheckCircle2 size={20} color="#0a0a0a" /> : null}
    </Pressable>
  );
}
