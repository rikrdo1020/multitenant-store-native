import { Pressable, View, type PressableProps } from 'react-native';
import { ShoppingCart } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils';

interface CartIconButtonProps extends PressableProps {
  count: number;
  iconColor?: string;
  className?: string;
}

export function CartIconButton({
  count,
  iconColor = '#0a0a0a',
  className,
  ...props
}: CartIconButtonProps) {
  const countLabel = count === 0
    ? 'sin productos'
    : `${count} ${count === 1 ? 'producto' : 'productos'}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir carrito, ${countLabel}`}
      hitSlop={8}
      className={cn(
        'h-10 w-10 items-center justify-center rounded-full bg-background',
        className,
      )}
      {...props}
    >
      <ShoppingCart size={20} color={iconColor} />
      {count > 0 && (
        <View className="absolute -right-1 -top-1 min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 py-0.5">
          <Text className="text-[10px] font-bold text-background">
            {count > 99 ? '99+' : count}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
