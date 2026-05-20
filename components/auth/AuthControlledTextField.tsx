import type { ReactNode } from 'react';
import { Platform, TextInput, View, type KeyboardTypeOptions, type TextStyle } from 'react-native';
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils';

const webTextInputFocusStyle = Platform.OS === 'web' ? ({ outlineStyle: 'none' } as unknown as TextStyle) : undefined;
interface AuthControlledTextFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  error?: string;
  focused: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  rightElement?: ReactNode;
  onFocus: () => void;
  onBlur: () => void;
}
export function AuthControlledTextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  error,
  focused,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  rightElement,
  onFocus,
  onBlur,
}: AuthControlledTextFieldProps<T>) {
  return (
    <View className="gap-2">
      <Text className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur: onFieldBlur, value } }) => (
          <View className={cn(
            'border-b-[1.5px] pb-2.5',
            rightElement && 'flex-row items-center',
            error ? 'border-destructive' : focused ? 'border-foreground' : 'border-border',
          )}>
            <TextInput
              className={cn(
                'bg-transparent py-0 text-[15px] text-foreground outline-none',
                rightElement && 'flex-1',
              )}
              style={webTextInputFocusStyle}
              placeholder={placeholder}
              placeholderTextColor="#b0b0b0"
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              autoCorrect={autoCorrect}
              secureTextEntry={secureTextEntry}
              value={value}
              onChangeText={onChange}
              onBlur={() => {
                onFieldBlur();
                onBlur();
              }}
              onFocus={onFocus}
              accessibilityLabel={label}
            />
            {rightElement}
          </View>
        )}
      />
      {error ? <Text className="text-[11px] tracking-wide text-destructive">{error}</Text> : null}
    </View>
  );
}
