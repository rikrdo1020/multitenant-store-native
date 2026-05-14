import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { createStoreSchema, type CreateStoreFormData } from '@/lib/validators';
import { tenantService } from '@/services/tenant';
import { useTenantStore } from '@/stores/use-tenant-store';

export default function CreateStoreScreen() {
  const router = useRouter();
  const setTenant = useTenantStore((s) => s.setTenant);
  const { control, handleSubmit } = useForm<CreateStoreFormData>({
    resolver: zodResolver(createStoreSchema),
  });

  const onSubmit = async (data: CreateStoreFormData) => {
    try {
      const tenant = await tenantService.createStore(data);
      setTenant(tenant);
      router.replace(`/(storefront)/${tenant.slug}`);
    } catch (error) {
      // Error handled by API interceptor
    }
  };

  return (
    <ScreenWrapper>
      <View className="flex-1 justify-center px-6 gap-6">
        <View className="gap-2">
          <Text variant="h1">Crear tu tienda</Text>
          <Text variant="small">Completa los datos para comenzar a vender</Text>
        </View>

        {/* TODO: Form fields for name, slug, description */}
        <Button onPress={handleSubmit(onSubmit)}>Crear Tienda</Button>
      </View>
    </ScreenWrapper>
  );
}
