import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

interface AccountFormModalFrameProps {
  children: ReactNode;
  isSubmitting: boolean;
  onClose: () => void;
}

export function AccountFormModalFrame({
  children,
  isSubmitting,
  onClose,
}: AccountFormModalFrameProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1"
    >
      <View className="flex-1 items-center justify-center px-4" style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar modal"
          style={StyleSheet.absoluteFill}
          onPress={isSubmitting ? undefined : onClose}
        />
        <View className="max-h-[90%] w-full max-w-xl rounded-lg border border-border bg-background">
          {children}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
});
