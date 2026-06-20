import { ActivityIndicator, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

interface BannersStatePanelProps {
  title?: string;
  description: string;
  loading?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

export function BannersStatePanel({
  title,
  description,
  loading,
  actionLabel,
  onAction,
}: BannersStatePanelProps) {
  return (
    <View className="flex-1 items-center justify-center gap-4 p-6">
      {loading && <ActivityIndicator size="large" />}
      {title && <Text variant="h2" className="text-center">{title}</Text>}
      <Text variant="body" className="text-center text-muted-foreground">{description}</Text>
      {actionLabel && onAction && (
        <Button variant="outline" onPress={onAction}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
}
