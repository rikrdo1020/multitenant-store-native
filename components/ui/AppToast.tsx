import { Platform, View } from 'react-native';
import Toast, { type ToastConfig, type ToastConfigParams } from 'react-native-toast-message';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react-native';
import { Text } from './Text';

type ToastVariant = 'success' | 'error' | 'info';

const TOAST_ACCENT: Record<ToastVariant, string> = {
  success: '#16a34a',
  error: '#dc2626',
  info: '#0a0a0a',
};

const toastConfig: ToastConfig = {
  success: (props) => <ToastCard {...props} variant="success" />,
  error: (props) => <ToastCard {...props} variant="error" />,
  info: (props) => <ToastCard {...props} variant="info" />,
};

export function AppToast() {
  return (
    <Toast
      config={toastConfig}
      position="bottom"
      bottomOffset={28}
      visibilityTime={2200}
      swipeable
    />
  );
}

function ToastCard({
  text1,
  text2,
  variant,
}: ToastConfigParams<unknown> & {
  variant: ToastVariant;
}) {
  const accent = TOAST_ACCENT[variant];

  return (
    <View
      pointerEvents="box-none"
      style={{
        width: '100%',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
      }}
    >
      <View
        className="flex-row items-start gap-2 rounded-md border border-border bg-background px-3 py-3"
        style={{
          width: Platform.OS === 'web' ? 360 : '100%',
          maxWidth: 360,
          borderLeftWidth: 4,
          borderLeftColor: accent,
          shadowColor: '#000',
          shadowOpacity: 0.12,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 4,
        }}
      >
        <ToastIcon variant={variant} color={accent} />
        <View className="min-w-0 flex-1 gap-0.5">
          {text1 && (
            <Text className="font-semibold text-foreground" numberOfLines={2}>
              {text1}
            </Text>
          )}
          {text2 && (
            <Text variant="small" numberOfLines={3}>
              {text2}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

function ToastIcon({ variant, color }: { variant: ToastVariant; color: string }) {
  if (variant === 'success') return <CheckCircle2 size={18} color={color} />;
  if (variant === 'error') return <AlertCircle size={18} color={color} />;
  return <Info size={18} color={color} />;
}
