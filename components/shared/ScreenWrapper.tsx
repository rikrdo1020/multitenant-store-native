import { View, ScrollView, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '@/lib/utils';

interface ScreenWrapperProps extends ViewProps {
  scroll?: boolean;
  safeArea?: boolean;
}

export function ScreenWrapper({
  children,
  className,
  scroll = false,
  safeArea = true,
  ...props
}: ScreenWrapperProps) {
  const Container = safeArea ? SafeAreaView : View;
  const Content = scroll ? ScrollView : View;

  return (
    <Container className={cn('flex-1 bg-background', className)} {...props}>
      <Content className="flex-1" contentContainerClassName="flex-grow">
        {children}
      </Content>
    </Container>
  );
}
