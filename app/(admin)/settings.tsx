import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/use-auth-store';
import { useTenantStore } from '@/stores/use-tenant-store';
import { LogOut, Store, User } from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const { tenant, setTenant } = useTenantStore();

  const handleLogout = () => {
    clearAuth();
    setTenant(null);
    router.replace('/(auth)/login');
  };

  return (
    <ScreenWrapper>
      <View className="flex-1 p-4">
        <Text variant="h1" className="mb-6">
          Configuración
        </Text>

        {/* Perfil */}
        <View className="mb-6 rounded-xl border border-border bg-card p-4">
          <View className="mb-3 flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User size={24} className="text-primary" />
            </View>
            <View>
              <Text variant="body" className="font-semibold text-foreground">
                {user?.name ?? 'Usuario'}
              </Text>
              <Text variant="small" className="text-muted-foreground">
                {user?.email ?? ''}
              </Text>
            </View>
          </View>
          <Text variant="small" className="text-muted-foreground">
            Rol: {user?.role ?? 'N/A'}
          </Text>
        </View>

        {/* Tienda activa */}
        <View className="mb-6 rounded-xl border border-border bg-card p-4">
          <View className="mb-3 flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Store size={24} className="text-primary" />
            </View>
            <View>
              <Text variant="body" className="font-semibold text-foreground">
                {tenant?.name ?? 'Sin tienda'}
              </Text>
              <Text variant="small" className="text-muted-foreground">
                {tenant?.slug ?? 'No hay tienda seleccionada'}
              </Text>
            </View>
          </View>

          {!tenant && (
            <Button
              variant="outline"
              className="mt-2"
              onPress={() => router.push('/(owner)/create-store')}
            >
              Crear tienda
            </Button>
          )}
        </View>

        {/* Cerrar sesión */}
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center justify-center gap-2 rounded-xl border border-destructive bg-destructive/5 p-4"
        >
          <LogOut size={20} className="text-destructive" />
          <Text variant="body" className="font-semibold text-destructive">
            Cerrar sesión
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}
