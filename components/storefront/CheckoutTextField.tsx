import { TextInput, View, type KeyboardTypeOptions } from 'react-native';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils';

interface CheckoutTextFieldProps {
  label: string;
  value?: string;
  placeholder?: string;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  onChangeText: (value: string) => void;
}

export function CheckoutTextField({
  label,
  value,
  placeholder,
  error,
  keyboardType,
  multiline,
  onChangeText,
}: CheckoutTextFieldProps) {
  return (
    <View className="gap-1.5">
      <Text variant="xs" className="font-semibold uppercase">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        accessibilityLabel={label}
        placeholder={placeholder}
        placeholderTextColor="#737373"
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        className={cn(
          'rounded-md border border-border bg-background px-3 text-sm text-foreground',
          multiline ? 'min-h-20 py-3' : 'h-11 py-0',
          error && 'border-destructive',
        )}
      />
      {error && (
        <Text variant="xs" className="text-destructive">
          {error}
        </Text>
      )}
    </View>
  );
}
