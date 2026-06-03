import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTenantStore } from '@/stores/use-tenant-store';
import { tenantService } from '@/services/tenant';
import { yappySettingsSchema, type YappySettingsFormData } from '@/lib/validators';
import { showToast } from '@/lib/toast';

export function useYappySettingsForm() {
  const { tenant, setTenant } = useTenantStore();
  const queryClient = useQueryClient();

  const form = useForm<YappySettingsFormData>({
    resolver: zodResolver(yappySettingsSchema),
    defaultValues: {
      yappyPhone: '',
      yappyName: '',
    },
  });

  useEffect(() => {
    if (tenant) {
      form.reset({
        yappyPhone: tenant.yappyPhone ?? '',
        yappyName: tenant.yappyName ?? '',
      });
    }
  }, [tenant, form]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: YappySettingsFormData) =>
      tenantService.updateStore(tenant!.documentId, data),
    onSuccess: (updated) => {
      setTenant(updated);
      queryClient.invalidateQueries({ queryKey: ['store-profile'] });
      showToast('Datos Yappy guardados', 'success');
    },
    onError: () => {
      showToast('Error al guardar datos Yappy', 'error');
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(data);
  });

  return { form, isPending, onSubmit };
}
