import { View } from 'react-native';
import { RefreshCw } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

interface AccountRetryPanelProps {
  title: string;
  description: string;
  onRetry: () => void;
}

export function AccountRetryPanel({ title, description, onRetry }: AccountRetryPanelProps) {
  return (
    <View className="items-center gap-4 rounded-lg border border-border bg-card px-5 py-10">
      <View className="h-11 w-11 items-center justify-center rounded-full bg-muted">
        <RefreshCw size={20} color="#171717" />
      </View>
      <View className="gap-1">
        <Text variant="h3" className="text-center">
          {title}
        </Text>
        <Text variant="small" className="text-center">
          {description}
        </Text>
      </View>
      <Button variant="outline" onPress={onRetry}>
        Reintentar
      </Button>
    </View>
  );
}
