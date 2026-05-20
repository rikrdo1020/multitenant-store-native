import { Pressable } from 'react-native';
import { Text } from '@/components/ui/Text';

interface AuthPasswordToggleProps {
  isVisible: boolean;
  onPress: () => void;
}

export function AuthPasswordToggle({ isVisible, onPress }: AuthPasswordToggleProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      accessibilityRole="button"
      accessibilityLabel={isVisible ? 'Ocultar contrasena' : 'Mostrar contrasena'}
    >
      <Text className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground">
        {isVisible ? 'OCULTAR' : 'MOSTRAR'}
      </Text>
    </Pressable>
  );
}
