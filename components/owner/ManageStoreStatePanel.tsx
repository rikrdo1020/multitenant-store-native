import { View } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

interface ManageStoreStatePanelProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondaryAction?: () => void;
}

export function ManageStoreStatePanel({
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondaryAction,
}: ManageStoreStatePanelProps) {
  return (
    <View className="flex-1 items-center justify-center gap-4 px-6">
      <View className="h-12 w-12 items-center justify-center rounded-full bg-muted">
        <AlertCircle size={22} className="text-foreground" />
      </View>
      <View className="gap-1">
        <Text variant="h3" className="text-center">
          {title}
        </Text>
        <Text variant="small" className="text-center">
          {description}
        </Text>
      </View>
      {actionLabel && onAction && <Button onPress={onAction}>{actionLabel}</Button>}
      {secondaryLabel && onSecondaryAction && (
        <Button variant="outline" onPress={onSecondaryAction}>
          {secondaryLabel}
        </Button>
      )}
    </View>
  );
}
