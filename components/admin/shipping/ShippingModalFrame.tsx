import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { X } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';

interface ShippingModalFrameProps {
  visible: boolean;
  title: string;
  description: string;
  loading: boolean;
  children: ReactNode;
  onClose: () => void;
}

export function ShippingModalFrame({
  visible,
  title,
  description,
  loading,
  children,
  onClose,
}: ShippingModalFrameProps) {
  const close = loading ? undefined : onClose;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close ?? (() => undefined)}>
      <View className="flex-1 items-center justify-center px-4" style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar modal"
          style={StyleSheet.absoluteFill}
          onPress={close}
        />
        <View className="max-h-[92%] w-full max-w-2xl gap-5 rounded-lg border border-border bg-background p-5">
          <View className="flex-row items-start justify-between gap-3">
            <View className="min-w-0 flex-1 gap-1">
              <Text variant="h3">{title}</Text>
              <Text variant="small" className="leading-5">{description}</Text>
            </View>
            <Pressable onPress={close} disabled={loading} hitSlop={10} accessibilityRole="button" accessibilityLabel="Cerrar modal">
              <X size={20} className="text-muted-foreground" />
            </Pressable>
          </View>
          {children}
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
