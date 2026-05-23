import { TouchableOpacity, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { adminColors } from '@/lib/admin-theme';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import type { AdminSettingsViewModel } from '@/hooks/use-admin-settings-screen';

interface AdminSettingsStoreSelectorProps {
  settings: AdminSettingsViewModel;
}

export function AdminSettingsStoreSelector({ settings }: AdminSettingsStoreSelectorProps) {
  return (
    <View className="rounded-xl border border-border bg-card overflow-hidden">
      {settings.stores.map((store, index) => {
        const isActive = settings.tenant?.documentId === store.documentId;
        const initial = store.name.charAt(0).toUpperCase();
        const isLast = index === settings.stores.length - 1;

        return (
          <TouchableOpacity
            key={store.documentId}
            onPress={() => settings.switchStore(store.documentId)}
            activeOpacity={0.6}
            className={`flex-row items-center gap-3 px-4 py-3.5 ${
              !isLast ? 'border-b border-border' : ''
            } ${isActive ? 'bg-muted/60' : 'bg-transparent'}`}
          >
            {/* Store initial badge */}
            <View
              className={`h-8 w-8 items-center justify-center rounded-lg ${
                isActive ? 'bg-foreground' : 'bg-muted'
              }`}
            >
              <Text
                variant="xs"
                className={`font-bold ${isActive ? 'text-background' : 'text-foreground'}`}
              >
                {initial}
              </Text>
            </View>

            <View className="flex-1">
              <Text variant="small" className="font-medium text-foreground leading-tight">
                {store.name}
              </Text>
              <Text variant="xs" className="text-muted-foreground">
                {store.slug}
              </Text>
            </View>

            {isActive && <Check size={16} color={adminColors.foreground} />}
          </TouchableOpacity>
        );
      })}

      {/* Add store row */}
      <View className="border-t border-border px-4 py-3">
        <Button variant="outline" onPress={settings.goToCreateStore}>
          + Nueva tienda
        </Button>
      </View>
    </View>
  );
}
