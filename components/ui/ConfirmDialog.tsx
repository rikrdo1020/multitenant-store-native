import { Modal, View } from 'react-native';
import { Text } from './Text';
import { Button } from './Button';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  loading,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full rounded-xl bg-background p-6 shadow-lg">
          <Text variant="h3" className="mb-2 text-center">
            {title}
          </Text>
          <Text variant="body" className="mb-6 text-center text-muted-foreground">
            {message}
          </Text>
          <View className="flex-row gap-3">
            <Button testID="confirm-cancel" variant="outline" className="flex-1" onPress={onCancel} disabled={loading}>
              {cancelText}
            </Button>
            <Button
              testID="confirm-confirm"
              variant="destructive"
              className="flex-1"
              onPress={onConfirm}
              loading={loading}
            >
              {confirmText}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
