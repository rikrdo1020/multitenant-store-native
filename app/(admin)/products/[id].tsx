import { TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { AdminProductEditScreenContent } from '@/components/admin/product-edit/AdminProductEditScreenContent';

export default function AdminProductEditRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <ChevronLeft size={24} className="text-foreground" />
            </TouchableOpacity>
          ),
          title: id === 'new' ? 'Nuevo Producto' : 'Editar Producto',
        }}
      />
      <AdminProductEditScreenContent />
    </>
  );
}
