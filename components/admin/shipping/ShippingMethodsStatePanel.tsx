import { View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

interface ShippingMethodsStatePanelProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ShippingMethodsStatePanel({
  title,
  description,
  actionLabel,
  onAction,
}: ShippingMethodsStatePanelProps) {
  return (
    <View className="flex-1 items-center justify-center gap-4 p-6">
      <Text variant="h2" className="text-center">
        {title}
      </Text>
      <Text variant="body" className="max-w-md text-center text-muted-foreground">
        {description}
      </Text>
      {actionLabel && onAction && <Button onPress={onAction}>{actionLabel}</Button>}
    </View>
  );
}
