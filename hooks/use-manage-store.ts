import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { tenantService } from '@/services/tenant';
import { uploadService } from '@/services/upload';
import { useTenantStore } from '@/stores/use-tenant-store';
import { editStoreSchema, type EditStoreFormData } from '@/lib/validators';
import { showToast } from '@/lib/toast';

export function useManageStore() {
  const { tenant, setTenant } = useTenantStore();
  const queryClient = useQueryClient();
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['store-profile', tenant?.slug],
    queryFn: () => tenantService.getProfile(tenant!.slug),
    enabled: !!tenant?.slug,
    staleTime: 5 * 60_000,
  });

  const form = useForm<EditStoreFormData>({
    resolver: zodResolver(editStoreSchema),
    defaultValues: { name: '', slug: '', description: '' },
  });
  const { reset } = form;

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        slug: profile.slug,
        description: profile.description ?? '',
      });
    }
  }, [profile, reset]);

  const { mutateAsync: update, isPending } = useMutation({
    mutationFn: (data: EditStoreFormData & { logo?: string }) =>
      tenantService.updateStore(tenant!.documentId, data),
    onSuccess: (updated) => {
      setTenant(updated);
      queryClient.invalidateQueries({ queryKey: ['store-profile'] });
      showToast('Tienda actualizada', 'success');
    },
    onError: () => {},
  });

  const pickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setLogoUri(result.assets[0].uri);
    }
  };

  const onSubmit = async (data: EditStoreFormData) => {
    try {
      let logo: string | undefined;
      if (logoUri) {
        setUploading(true);
        const uploaded = await uploadService.uploadImage(logoUri, 'logos');
        logo = uploaded.url;
        setUploading(false);
      }
      await update({ ...data, ...(logo ? { logo } : {}) });
    } catch {
      setUploading(false);
      showToast('Error al actualizar la tienda', 'error');
    }
  };

  return {
    form,
    profile,
    isLoading,
    logoUri,
    pickLogo,
    onSubmit: form.handleSubmit(onSubmit),
    isPending: isPending || uploading,
  };
}
