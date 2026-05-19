import type { ReactNode } from 'react';
import { Modal, ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { AccountFormModalActions } from './AccountFormModalActions';
import { AccountFormModalFrame } from './AccountFormModalFrame';
import { AccountFormModalHeader } from './AccountFormModalHeader';

interface AccountFormModalProps {
  visible: boolean;
  title: string;
  description: string;
  submitLabel: string;
  isSubmitting: boolean;
  submitError: string | null;
  children: ReactNode;
  onClose: () => void;
  onSubmit: () => void;
}

export function AccountFormModal({
  visible,
  title,
  description,
  submitLabel,
  isSubmitting,
  submitError,
  children,
  onClose,
  onSubmit,
}: AccountFormModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <AccountFormModalFrame isSubmitting={isSubmitting} onClose={onClose}>
        <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
          <View className="gap-5">
            <AccountFormModalHeader
              title={title}
              description={description}
              disabled={isSubmitting}
              onClose={onClose}
            />

            <View className="gap-1">{children}</View>

            {submitError && (
              <View className="border-l-2 border-destructive py-1 pl-4">
                <Text className="text-sm text-destructive">{submitError}</Text>
              </View>
            )}

            <AccountFormModalActions
              submitLabel={submitLabel}
              isSubmitting={isSubmitting}
              onClose={onClose}
              onSubmit={onSubmit}
            />
          </View>
        </ScrollView>
      </AccountFormModalFrame>
    </Modal>
  );
}
