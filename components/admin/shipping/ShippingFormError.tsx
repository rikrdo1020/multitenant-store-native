import { View } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';

export function ShippingFormError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <View className="flex-row items-start gap-2 rounded-md border border-destructive p-3">
      <AlertCircle size={16} color="#dc2626" />
      <Text variant="small" className="min-w-0 flex-1 text-destructive">
        {message}
      </Text>
    </View>
  );
}
