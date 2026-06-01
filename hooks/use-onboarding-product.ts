import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { productService } from '@/services/products';
import { uploadService } from '@/services/upload';
import { useTenantStore } from '@/stores/use-tenant-store';
import { showToast } from '@/lib/toast';
import { slugify, generateDKU } from '@/lib/utils';
import { onboardingProductSchema, type OnboardingProductFormData } from '@/lib/validators';

export function useOnboardingProduct() {
  const router = useRouter();
  const { tenant } = useTenantStore();
  const queryClient = useQueryClient();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const form = useForm<OnboardingProductFormData>({
    resolver: zodResolver(onboardingProductSchema),
    defaultValues: { name: '', price: undefined, stock: undefined, description: '' },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: { data: OnboardingProductFormData; imageUrl?: string }) => {
      const { data, imageUrl } = payload;
      const name = data.name.trim();
      return productService.createProduct(tenant!.slug, {
        name,
        slug: slugify(name),
        dku: generateDKU(name),
        price: data.price,
        stock: data.stock,
        description: data.description ? { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: data.description }] }] } : undefined,
        images: imageUrl ? [imageUrl] : [],
        productStatus: 'draft',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const onSubmit = async (data: OnboardingProductFormData) => {
    try {
      let imageUrl: string | undefined;
      if (imageUri) {
        setUploading(true);
        const uploaded = await uploadService.uploadImage(imageUri, 'products');
        imageUrl = uploaded.url;
        setUploading(false);
      }
      await mutateAsync({ data, imageUrl });
      router.replace('/(owner)/onboarding-shipping');
    } catch {
      setUploading(false);
      showToast('No pudimos guardar el producto', 'error');
    }
  };

  const skip = () => router.replace('/(owner)/onboarding-shipping');

  return {
    form,
    imageUri,
    pickImage,
    isPending: isPending || uploading,
    onSubmit: form.handleSubmit(onSubmit),
    skip,
  };
}
