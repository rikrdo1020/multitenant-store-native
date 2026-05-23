import { ActivityIndicator, View } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

interface CartSummaryFeedbackProps {
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function CartSummaryFeedback({
  isLoading,
  error,
  onRetry,
}: CartSummaryFeedbackProps) {
  if (isLoading) {
    return (
      <View className="flex-row items-center gap-2 rounded-md bg-secondary p-3">
        <ActivityIndicator size="small" color="#0a0a0a" />
        <Text variant="small" className="min-w-0 flex-1">
          Calculando combos disponibles...
        </Text>
      </View>
    );
  }

  if (!error) return null;

  return (
    <View className="gap-3 rounded-md border border-destructive/30 bg-destructive/10 p-3">
      <View className="flex-row items-start gap-2">
        <AlertCircle size={16} color="#dc2626" />
        <Text variant="small" className="min-w-0 flex-1 text-destructive">
          {error}
        </Text>
      </View>
      {onRetry && (
        <Button variant="outline" size="sm" onPress={() => void onRetry()}>
          Reintentar
        </Button>
      )}
    </View>
  );
}
