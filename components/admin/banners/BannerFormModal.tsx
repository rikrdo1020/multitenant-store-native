import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { BannerFormFields } from './BannerFormFields';
import {
  bannerFormSchema,
  bannerToFormValues,
  toBannerPayload,
  type BannerFormValues,
} from './banner-form-schema';
import type { StoreBanner, StoreBannerPayload } from '@/types';

interface BannerFormModalProps {
  visible: boolean;
  banner?: StoreBanner | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: StoreBannerPayload) => Promise<string | null>;
}

export function BannerFormModal({
  visible,
  banner,
  loading,
  onClose,
  onSubmit,
}: BannerFormModalProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: bannerToFormValues(banner),
  });

  useEffect(() => {
    if (visible) {
      form.reset(bannerToFormValues(banner));
      setFormError(null);
    }
  }, [banner, form, visible]);

  const submit = form.handleSubmit(async (values) => {
    const error = await onSubmit(toBannerPayload(values));
    setFormError(error);
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center px-4" style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={loading ? undefined : onClose} />
        <View className="max-h-[90%] w-full max-w-xl rounded-lg border border-border bg-background p-5">
          <View className="mb-4">
            <Text variant="h2">{banner ? 'Editar banner' : 'Nuevo banner'}</Text>
            <Text variant="small">Define el contenido visible en la home de la tienda.</Text>
          </View>
          <ScrollView className="max-h-[520px]" showsVerticalScrollIndicator={false}>
            <BannerFormFields control={form.control} errors={form.formState.errors} />
          </ScrollView>
          {formError && <Text className="mb-3 text-destructive">{formError}</Text>}
          <View className="flex-row gap-3">
            <Button variant="outline" className="flex-1" disabled={loading} onPress={onClose}>
              Cancelar
            </Button>
            <Button className="flex-1" loading={loading} onPress={submit}>
              Guardar
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
