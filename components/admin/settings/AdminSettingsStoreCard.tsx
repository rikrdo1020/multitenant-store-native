import { View } from 'react-native';
import { Settings, Store, User } from 'lucide-react-native';
import { AdminSettingsAction } from '@/components/admin/settings/AdminSettingsAction';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import type { AdminSettingsViewModel } from '@/hooks/use-admin-settings-screen';

interface AdminSettingsStoreCardProps {
  settings: AdminSettingsViewModel;
}

export function AdminSettingsStoreCard({ settings }: AdminSettingsStoreCardProps) {
  return (
    <View className="gap-3 rounded-xl border border-border bg-card p-4">
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Store size={24} className="text-primary" />
        </View>
        <View className="flex-1">
          <Text variant="body" className="font-semibold text-foreground">
            {settings.tenant?.name ?? 'Sin tienda'}
          </Text>
          <Text variant="small" className="text-muted-foreground">
            {settings.tenant?.slug ?? 'No hay tienda seleccionada'}
          </Text>
        </View>
      </View>
      {!settings.tenant ? (
        <Button variant="outline" onPress={settings.goToCreateStore}>
          Crear tienda
        </Button>
      ) : (
        <StoreActions settings={settings} />
      )}
    </View>
  );
}

function StoreActions({ settings }: AdminSettingsStoreCardProps) {
  return (
    <View className="gap-2">
      {settings.canOpenStorefront && (
        <>
          <AdminSettingsAction icon={Store} label="Ver tienda" onPress={settings.goToStorefront} />
          <AdminSettingsAction icon={User} label="Cuenta en tienda" onPress={settings.goToAccount} />
        </>
      )}
      {settings.canEditStoreProfile && (
        <AdminSettingsAction label="Editar perfil de tienda" onPress={settings.goToManageStore} />
      )}
      {settings.canEditStoreSettings && (
        <AdminSettingsAction
          icon={Settings}
          label="Configuracion de tienda"
          onPress={settings.goToStoreSettings}
        />
      )}
    </View>
  );
}
