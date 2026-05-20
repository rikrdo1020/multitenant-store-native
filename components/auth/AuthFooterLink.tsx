import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';

interface AuthFooterLinkProps {
  prompt: string;
  actionLabel: string;
  accessibilityLabel: string;
  onPress: () => void;
}

export function AuthFooterLink({
  prompt,
  actionLabel,
  accessibilityLabel,
  onPress,
}: AuthFooterLinkProps) {
  return (
    <View className="flex-row items-center gap-4 px-6 py-10">
      <View className="h-px flex-1 bg-border" />
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel}>
        <Text className="text-[13px] text-muted-foreground">
          {prompt}{' '}
          <Text className="text-[13px] font-semibold text-foreground">{actionLabel}</Text>
        </Text>
      </Pressable>
    </View>
  );
}
