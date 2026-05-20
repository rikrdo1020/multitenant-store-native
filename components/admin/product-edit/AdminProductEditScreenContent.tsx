import { ActivityIndicator, ScrollView, View } from 'react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Button } from '@/components/ui/Button';
import { AdminProductBasicFields } from './AdminProductBasicFields';
import { AdminProductCommerceFields } from './AdminProductCommerceFields';
import { AdminProductMediaFields } from './AdminProductMediaFields';
import { AdminProductRelationsFields } from './AdminProductRelationsFields';
import { AdminProductSeoFields } from './AdminProductSeoFields';
import { useAdminProductEditScreen } from '@/hooks/use-admin-product-edit-screen';

export function AdminProductEditScreenContent() {
  const product = useAdminProductEditScreen();

  if (product.isLoading) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView className="flex-1 p-4">
        <AdminProductBasicFields product={product} />
        <AdminProductCommerceFields product={product} />
        <AdminProductRelationsFields product={product} />
        <AdminProductMediaFields product={product} />
        <AdminProductSeoFields product={product} />
        <Button className="mt-4" onPress={product.submit} loading={product.isSubmitting}>
          {product.isNew ? 'Crear producto' : 'Guardar cambios'}
        </Button>
        <View className="h-8" />
      </ScrollView>
    </ScreenWrapper>
  );
}
