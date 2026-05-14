import { Text as RNText, type TextProps } from 'react-native';
import { cn } from '@/lib/utils';

interface CustomTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'xs';
}

export function Text({ className, variant = 'body', ...props }: CustomTextProps) {
  const variantStyles = {
    h1: 'text-3xl font-bold text-foreground',
    h2: 'text-2xl font-semibold text-foreground',
    h3: 'text-xl font-semibold text-foreground',
    body: 'text-base text-foreground',
    small: 'text-sm text-muted-foreground',
    xs: 'text-xs text-muted-foreground',
  };

  return <RNText className={cn(variantStyles[variant], className)} {...props} />;
}
