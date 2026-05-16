import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { Button } from './Button';
import { Text } from './Text';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancelar',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center px-4" style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={cancelLabel}
          style={StyleSheet.absoluteFill}
          onPress={onCancel}
        />

        <View className="w-full max-w-md gap-5 rounded-lg border border-border bg-background p-5">
          <View className="flex-row items-start gap-3">
            {destructive && (
              <View className="h-9 w-9 items-center justify-center rounded-full bg-secondary">
                <AlertTriangle size={18} color="#dc2626" />
              </View>
            )}
            <View className="min-w-0 flex-1 gap-1">
              <Text variant="h3">{title}</Text>
              <Text variant="small" className="leading-5">
                {description}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-3">
            <Button variant="outline" className="flex-1" onPress={onCancel}>
              {cancelLabel}
            </Button>
            <Button
              variant={destructive ? 'destructive' : 'default'}
              className="flex-1"
              onPress={onConfirm}
            >
              {confirmLabel}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
});
