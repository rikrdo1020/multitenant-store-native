import { View } from 'react-native';
import { Text } from '@/components/ui/Text';

interface MemberFormErrorProps {
  message?: string;
}

export function MemberFormError({ message }: MemberFormErrorProps) {
  if (!message) return null;

  return (
    <View className="border-l-2 border-destructive py-1 pl-4">
      <Text className="text-sm text-destructive">{message}</Text>
    </View>
  );
}
