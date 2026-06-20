import { View } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';

interface ActionSuccess {
  title: string;
  description?: string;
}

interface CartSummaryActionFeedbackProps {
  error?: string | null;
  success?: ActionSuccess | null;
}

export function CartSummaryActionFeedback({
  error,
  success,
}: CartSummaryActionFeedbackProps) {
  if (error) {
    return (
      <View className="flex-row items-start gap-2 rounded-md border border-destructive p-3">
        <AlertCircle size={16} color="#dc2626" />
        <Text variant="small" className="min-w-0 flex-1 text-destructive">
          {error}
        </Text>
      </View>
    );
  }

  if (!success) return null;

  return (
    <View className="rounded-md border border-green-200 bg-green-50 p-3">
      <Text className="font-semibold text-green-800">{success.title}</Text>
      {success.description && (
        <Text variant="small" className="mt-1 text-green-800">
          {success.description}
        </Text>
      )}
    </View>
  );
}
