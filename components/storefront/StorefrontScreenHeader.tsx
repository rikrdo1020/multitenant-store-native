import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';

interface StorefrontScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backAccessibilityLabel?: string;
  rightAction?: ReactNode;
}

export function StorefrontScreenHeader({
  title,
  subtitle,
  onBack,
  backAccessibilityLabel = 'Volver',
  rightAction,
}: StorefrontScreenHeaderProps) {
  return (
    <View className="border-b border-border px-4 pb-3 pt-2">
      <View className="flex-row items-center gap-3">
        {onBack && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={backAccessibilityLabel}
            onPress={onBack}
            hitSlop={8}
          >
            <ArrowLeft size={22} color="#0a0a0a" />
          </Pressable>
        )}

        <View className="min-w-0 flex-1">
          <Text variant="h2">{title}</Text>
          {subtitle && <Text variant="xs">{subtitle}</Text>}
        </View>

        {rightAction}
      </View>
    </View>
  );
}
