import { View } from 'react-native';
import { Settings, Store } from 'lucide-react-native';
import { AdminSettingsAction } from '@/components/admin/settings/AdminSettingsAction';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import type { AdminSettingsViewModel } from '@/hooks/use-admin-settings-screen';

interface AdminSettingsStoreCardProps {
  settings: AdminSettingsViewModel;
}

export function AdminSettingsStoreCard({ settings }: AdminSettingsStoreCardProps) {
  const storeName = settings.tenant?.name ?? 'Sin tienda';
  const storeInitial = storeName.charAt(0).toUpperCase();

  return (
    <View className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Store identity row */}
      <View className="flex-row items-center gap-3 px-4 py-4">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-foreground">
          <Text variant="small" className="font-bold text-background">
            {storeInitial}
          </Text>
        </View>
        <View className="flex-1">
          <Text variant="small" className="font-semibold text-foreground leading-tight">
            {storeName}
          </Text>
          {settings.tenant?.slug ? (
            <Text variant="xs" className="text-muted-foreground">
              {settings.tenant.slug}
            </Text>
          ) : (
            <Text variant="xs" className="text-muted-foreground">
              No hay tienda seleccionada
            </Text>
          )}
        </View>
      </View>

      {/* Actions */}
      {!settings.tenant ? (
        <View className="border-t border-border px-4 py-3">
          <Button variant="outline" onPress={settings.goToCreateStore}>
            Crear tienda
          </Button>
        </View>
      ) : (
        <StoreActions settings={settings} />
      )}
    </View>
  );
}

function StoreActions({ settings }: AdminSettingsStoreCardProps) {
  const hasAnyAction =
    settings.canOpenStorefront || settings.canEditStoreProfile || settings.canEditStoreSettings;

  if (!hasAnyAction) return null;

  return (
    <View className="border-t border-border px-3 py-2">
      {settings.canOpenStorefront && (
        <AdminSettingsAction icon={Store} label="Ver tienda" onPress={settings.goToStorefront} />
      )}
      {(settings.canEditStoreProfile || settings.canEditStoreSettings) && (
        <AdminSettingsAction
          icon={Settings}
          label="Configurar tienda"
          onPress={settings.goToStoreConfig}
        />
      )}
    </View>
  );
}
