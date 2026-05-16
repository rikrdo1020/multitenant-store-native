import { TextInput, type TextInputProps, View } from 'react-native';
import { Text } from './Text';
import { cn } from '@/lib/utils';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <View className="mb-3">
      {label && (
        <Text variant="small" className="mb-1 font-medium text-foreground">
          {label}
        </Text>
      )}
      <TextInput
        className={cn(
          'rounded-md border border-border bg-background px-3 py-3 text-base text-foreground',
          error && 'border-destructive',
          className
        )}
        placeholderTextColor="#9ca3af"
        textAlignVertical={props.multiline ? 'top' : 'center'}
        {...props}
      />
      {error && (
        <Text variant="xs" className="mt-1 text-destructive">
          {error}
        </Text>
      )}
    </View>
  );
}
