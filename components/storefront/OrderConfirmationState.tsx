import { View } from 'react-native';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

interface OrderConfirmationAction {
  label: string;
  variant?: 'default' | 'outline';
  onPress: () => void;
}

interface OrderConfirmationStateProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: ReactNode;
  actions: OrderConfirmationAction[];
}

export function OrderConfirmationState({
  icon: Icon,
  iconColor,
  title,
  description,
  actions,
}: OrderConfirmationStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-6 px-6">
      <Icon size={56} color={iconColor} strokeWidth={1.5} />
      <View className="items-center gap-2">
        <Text variant="h1" className="text-center">
          {title}
        </Text>
        <Text variant="small" className="text-center text-muted-foreground">
          {description}
        </Text>
      </View>
      <View className="w-full gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            size="lg"
            variant={action.variant}
            onPress={action.onPress}
          >
            {action.label}
          </Button>
        ))}
      </View>
    </View>
  );
}
