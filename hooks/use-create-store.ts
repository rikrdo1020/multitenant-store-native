import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { tenantService } from '@/services/tenant';
import { uploadService } from '@/services/upload';
import { useTenantStore } from '@/stores/use-tenant-store';
import { useAuthStore } from '@/stores/use-auth-store';
import { createStoreSchema, type CreateStoreFormData } from '@/lib/validators';
import { showToast } from '@/lib/toast';

export function useCreateStore() {
  const router = useRouter();
  const setTenant = useTenantStore((s) => s.setTenant);
  const { user, setUser } = useAuthStore();

  // Creating a new store has no current tenant context — clear any stale value
  // so the API interceptor doesn't send x-tenant-id from a previous session.
  useEffect(() => {
    setTenant(null);
  }, []);
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const form = useForm<CreateStoreFormData>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: { name: '', slug: '', description: '' },
  });

  const { mutateAsync: create, isPending } = useMutation({
    mutationFn: tenantService.createStore,
    onSuccess: (tenant) => {
      setTenant(tenant);
      if (user) setUser({ ...user, role: 'admin' });
      router.replace('/(owner)/onboarding-product');
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

  const onSubmit = async (data: CreateStoreFormData) => {
    try {
      let logo: string | undefined;
      if (logoUri) {
        setUploading(true);
        const uploaded = await uploadService.uploadImage(logoUri, 'logos');
        logo = uploaded.url;
        setUploading(false);
      }
      await create({ ...data, ...(logo ? { logo } : {}) });
    } catch {
      setUploading(false);
      showToast('Error al crear la tienda', 'error');
    }
  };

  return { form, logoUri, pickLogo, onSubmit: form.handleSubmit(onSubmit), isPending: isPending || uploading };
}
