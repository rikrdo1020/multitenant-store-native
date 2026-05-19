import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, LogOut, Settings, Store, User } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/use-auth-store';
import { useTenantStore } from '@/stores/use-tenant-store';
import { useMyStores } from '@/hooks/api/use-my-stores';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const { tenant, setTenant } = useTenantStore();
  const { data: myStores } = useMyStores();

  const handleLogout = () => {
    clearAuth();
    setTenant(null);
    router.replace('/(auth)/login');
  };

  const switchStore = (documentId: string) => {
    const target = myStores?.find((s) => s.documentId === documentId);
    if (target) setTenant(target);
  };

  const isOwner = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <ScreenWrapper>
      <View className="flex-1 p-4 gap-5">
        <Text variant="h1">Configuración</Text>

        {/* Perfil usuario */}
        <View className="rounded-xl border border-border bg-card p-4">
          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User size={24} className="text-primary" />
            </View>
            <View className="flex-1">
              <Text variant="body" className="font-semibold text-foreground">
                {user?.name ?? 'Usuario'}
              </Text>
              <Text variant="small" className="text-muted-foreground">{user?.email ?? ''}</Text>
            </View>
          </View>
          <Text variant="xs" className="mt-2 text-muted-foreground">Rol: {user?.role ?? 'N/A'}</Text>
        </View>

        {/* Tienda activa */}
        <View className="rounded-xl border border-border bg-card p-4 gap-3">
          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Store size={24} className="text-primary" />
            </View>
            <View className="flex-1">
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
              onPress={() => router.push('/(owner)/create-store')}
            >
              Crear tienda
            </Button>
          )}

          {tenant && isOwner && (
            <View className="gap-2">
              <TouchableOpacity
                onPress={() => router.push('/(owner)/manage-store')}
                className="flex-row items-center justify-between rounded-lg bg-muted px-3 py-2"
              >
                <Text variant="small" className="text-foreground">Editar perfil de tienda</Text>
                <ChevronRight size={16} className="text-muted-foreground" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/(owner)/store-settings')}
                className="flex-row items-center justify-between rounded-lg bg-muted px-3 py-2"
              >
                <View className="flex-row items-center gap-2">
                  <Settings size={14} className="text-muted-foreground" />
                  <Text variant="small" className="text-foreground">Configuración de tienda</Text>
                </View>
                <ChevronRight size={16} className="text-muted-foreground" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Selector de tienda — sólo si hay más de una */}
        {myStores && myStores.length > 1 && (
          <View className="rounded-xl border border-border bg-card p-4 gap-3">
            <Text variant="small" className="font-semibold text-foreground">Mis tiendas</Text>
            {myStores.map((store) => (
              <TouchableOpacity
                key={store.documentId}
                onPress={() => switchStore(store.documentId)}
                className={`flex-row items-center justify-between rounded-lg px-3 py-3 ${
                  tenant?.documentId === store.documentId ? 'bg-primary/10' : 'bg-muted'
                }`}
              >
                <View>
                  <Text variant="small" className="font-medium text-foreground">{store.name}</Text>
                  <Text variant="xs" className="text-muted-foreground">{store.slug}</Text>
                </View>
                {tenant?.documentId === store.documentId && (
                  <View className="h-2 w-2 rounded-full bg-primary" />
                )}
              </TouchableOpacity>
            ))}
            <Button
              variant="outline"
              onPress={() => router.push('/(owner)/create-store')}
            >
              + Nueva tienda
            </Button>
          </View>
        )}

        {/* Cerrar sesión */}
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center justify-center gap-2 rounded-xl border border-destructive bg-destructive/5 p-4"
        >
          <LogOut size={20} className="text-destructive" />
          <Text variant="body" className="font-semibold text-destructive">Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}
