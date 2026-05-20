import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';

interface AuthPanelHeaderProps {
  stepLabel: string;
  backLabel?: string;
  onBack?: () => void;
}

export function AuthPanelHeader({ stepLabel, backLabel, onBack }: AuthPanelHeaderProps) {
  if (onBack) {
    return (
      <View className="flex-row items-center justify-between px-6 pt-8">
        <Pressable
          onPress={onBack}
          hitSlop={{ top: 10, bottom: 10, left: 0, right: 20 }}
          className="flex-row items-center gap-2"
          accessibilityRole="button"
          accessibilityLabel={backLabel ?? 'Volver'}
        >
          <View className="h-[1.5px] w-4 bg-foreground" />
          <Text className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground">
            {backLabel ?? 'Volver'}
          </Text>
        </Pressable>
        <StepText>{stepLabel}</StepText>
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-3 px-6 pt-8">
      <View className="h-px flex-1 bg-border" />
      <StepText>{stepLabel}</StepText>
    </View>
  );
}

function StepText({ children }: { children: string }) {
  return (
    <Text className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </Text>
  );
}
