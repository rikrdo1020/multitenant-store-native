import Toast from 'react-native-toast-message';

type AppToastVariant = 'success' | 'info' | 'error' | 'destructive';

export function showToast(
  message: string,
  variant: AppToastVariant = 'info',
  description?: string,
) {
  Toast.show({
    type: variant === 'destructive' ? 'error' : variant,
    text1: message,
    text2: description,
    position: 'bottom',
  });
}
