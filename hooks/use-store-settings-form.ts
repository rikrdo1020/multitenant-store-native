import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { storeSettingsSchema, type StoreSettingsFormData } from '@/lib/validators';
import { useStoreSettings, useUpdateStoreSettings } from '@/hooks/api/use-store-settings';
import { showToast } from '@/lib/toast';

export function useStoreSettingsForm() {
  const { data: settings, isLoading } = useStoreSettings();
  const { mutateAsync: updateSettings, isPending } = useUpdateStoreSettings();

  const form = useForm<StoreSettingsFormData>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: { currency: 'USD', taxRate: 0, lowStockThreshold: 5 },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        currency: settings.currency,
        taxRate: settings.taxRate,
        lowStockThreshold: settings.lowStockThreshold,
      });
    }
  }, [settings]);

  const onSubmit = async (data: StoreSettingsFormData) => {
    try {
      await updateSettings(data);
      showToast('Configuración guardada', 'success');
    } catch {
      showToast('Error al guardar configuración', 'error');
    }
  };

  return { form, isLoading, isPending, onSubmit: form.handleSubmit(onSubmit) };
}
