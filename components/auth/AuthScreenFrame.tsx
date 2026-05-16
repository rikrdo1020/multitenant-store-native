import { type ReactNode, useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  type ViewStyle,
  useWindowDimensions,
} from 'react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { cn } from '@/lib/utils';

interface AuthScreenFrameProps {
  children: ReactNode;
  scroll?: boolean;
  maxWidth?: number;
}

export function AuthScreenFrame({
  children,
  scroll = true,
  maxWidth = 420,
}: AuthScreenFrameProps) {
  const { height, width } = useWindowDimensions();
  const isWideLayout = width >= 768;

  const panelStyle = useMemo(() => {
    if (!isWideLayout) return undefined;

    const base = {
      maxWidth,
      minHeight: Math.min(Math.max(height - 48, 560), 668),
      width: '100%' as const,
    };

    if (Platform.OS === 'web') {
      return {
        ...base,
        boxShadow: '0 24px 64px rgba(17, 17, 17, 0.08)',
      } as unknown as ViewStyle;
    }

    return {
      ...base,
      shadowColor: '#111111',
      shadowOffset: { width: 0, height: 18 },
      shadowOpacity: 0.08,
      shadowRadius: 28,
    };
  }, [height, isWideLayout, maxWidth]);

  return (
    <ScreenWrapper scroll={scroll} safeArea className={cn(isWideLayout && 'bg-muted')}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View
          className={cn(
            'flex-1 w-full',
            isWideLayout && 'items-center justify-center px-5 py-6'
          )}
        >
          <View
            className={cn(
              'w-full flex-1 bg-background',
              isWideLayout && 'flex-none border border-border'
            )}
            style={panelStyle}
          >
            {children}
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
