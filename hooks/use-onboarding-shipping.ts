import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateShippingMethod } from '@/hooks/api/use-shipping-methods';
import { showToast } from '@/lib/toast';
import { onboardingShippingSchema, type OnboardingShippingFormData } from '@/lib/validators';

export function useOnboardingShipping() {
  const router = useRouter();
  const createMethod = useCreateShippingMethod();

  const form = useForm<OnboardingShippingFormData>({
    resolver: zodResolver(onboardingShippingSchema),
    defaultValues: { name: '', type: 'delivery_zone', basePrice: 0 },
  });

  const onSubmit = async (data: OnboardingShippingFormData) => {
    try {
      await createMethod.mutateAsync({
        name: data.name.trim(),
        type: data.type,
        basePrice: data.basePrice,
        requiresDetails: true,
        isActive: true,
        locations: [],
      });
      router.replace('/(admin)/dashboard');
    } catch {
      showToast('No pudimos guardar el método de envío', 'error');
    }
  };

  const skip = () => router.replace('/(admin)/dashboard');

  return {
    form,
    isPending: createMethod.isPending,
    onSubmit: form.handleSubmit(onSubmit),
    skip,
  };
}
