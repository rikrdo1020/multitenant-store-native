import { Pressable, View } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { ROLE_OPTIONS } from '@/lib/member-helpers';
import { cn } from '@/lib/utils';
import type { TeamRole } from '@/types';

interface RolePickerProps {
  value: TeamRole;
  disabled: boolean;
  error?: string;
  onChange: (role: TeamRole) => void;
}

export function RolePicker({ value, disabled, error, onChange }: RolePickerProps) {
  return (
    <View className="gap-2">
      <Text variant="small" className="font-medium text-foreground">
        Rol
      </Text>
      <View className="gap-2">
        {ROLE_OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              disabled={disabled}
              className={cn(
                'rounded-md border p-3',
                selected ? 'border-primary bg-primary/10' : 'border-border bg-background',
              )}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              <View className="flex-row items-start gap-3">
                <ShieldCheck
                  size={18}
                  className={selected ? 'text-primary' : 'text-muted-foreground'}
                />
                <View className="min-w-0 flex-1 gap-1">
                  <Text className="font-semibold text-foreground">{option.label}</Text>
                  <Text variant="small" className="leading-5">
                    {option.description}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
      {error && (
        <Text variant="xs" className="text-destructive">
          {error}
        </Text>
      )}
    </View>
  );
}
