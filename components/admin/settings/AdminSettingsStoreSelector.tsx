import { TouchableOpacity, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import type { AdminSettingsViewModel } from '@/hooks/use-admin-settings-screen';

interface AdminSettingsStoreSelectorProps {
  settings: AdminSettingsViewModel;
}

export function AdminSettingsStoreSelector({ settings }: AdminSettingsStoreSelectorProps) {
  return (
    <View className="gap-3 rounded-xl border border-border bg-card p-4">
      <Text variant="small" className="font-semibold text-foreground">
        Mis tiendas
      </Text>
      {settings.stores.map((store) => (
        <TouchableOpacity
          key={store.documentId}
          onPress={() => settings.switchStore(store.documentId)}
          className={`flex-row items-center justify-between rounded-lg px-3 py-3 ${
            settings.tenant?.documentId === store.documentId ? 'bg-primary/10' : 'bg-muted'
          }`}
        >
          <View>
            <Text variant="small" className="font-medium text-foreground">
              {store.name}
            </Text>
            <Text variant="xs" className="text-muted-foreground">
              {store.slug}
            </Text>
          </View>
          {settings.tenant?.documentId === store.documentId && (
            <View className="h-2 w-2 rounded-full bg-primary" />
          )}
        </TouchableOpacity>
      ))}
      <Button variant="outline" onPress={settings.goToCreateStore}>
        + Nueva tienda
      </Button>
    </View>
  );
}
