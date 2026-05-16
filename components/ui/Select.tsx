import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Text } from './Text';
import { cn } from '@/lib/utils';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  value: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

export function Select({
  label,
  value,
  options,
  onValueChange,
  placeholder = 'Seleccionar...',
  error,
  className,
}: SelectProps) {
  return (
    <View className={cn('mb-3', className)}>
      {label && (
        <Text variant="small" className="mb-1 font-medium text-foreground">
          {label}
        </Text>
      )}
      <View
        className={cn(
          'rounded-md border border-border bg-background',
          error && 'border-destructive'
        )}
      >
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={{ color: '#000' }}
        >
          <Picker.Item label={placeholder} value="" />
          {options.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>
      {error && (
        <Text variant="xs" className="mt-1 text-destructive">
          {error}
        </Text>
      )}
    </View>
  );
}
