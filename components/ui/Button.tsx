import { TouchableOpacity, ActivityIndicator, type TouchableOpacityProps } from 'react-native';
import { Text } from './Text';
import { cn } from '@/lib/utils';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
  loading?: boolean;
}

export function Button({
  children,
  className,
  variant = 'default',
  size = 'default',
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    default: 'bg-primary',
    outline: 'border border-border bg-transparent',
    ghost: 'bg-transparent',
    destructive: 'bg-destructive',
  };

  const sizes = {
    default: 'px-4 py-3',
    sm: 'px-3 py-2',
    lg: 'px-6 py-4',
  };

  const textVariants = {
    default: 'text-primary-foreground',
    outline: 'text-foreground',
    ghost: 'text-foreground',
    destructive: 'text-destructive-foreground',
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      className={cn(
        'items-center justify-center rounded-md active:opacity-80',
        variants[variant],
        sizes[size],
        (disabled || loading) && 'opacity-50',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'default' ? '#fff' : '#000'} />
      ) : typeof children === 'string' ? (
        <Text className={cn('font-semibold', textVariants[variant])}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
