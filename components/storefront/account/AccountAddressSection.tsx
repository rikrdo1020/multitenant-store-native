import { ActivityIndicator, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { AccountAddressCard } from './AccountAddressCard';
import { AccountAddressEmptyState } from './AccountAddressEmptyState';
import { AccountRetryPanel } from './AccountRetryPanel';
import type { CustomerAddress } from '@/types';

interface AccountAddressSectionProps {
  addresses: CustomerAddress[];
  isLoading: boolean;
  isError: boolean;
  isMutating: boolean;
  onRetry: () => void;
  onCreate: () => void;
  onEdit: (address: CustomerAddress) => void;
  onDelete: (address: CustomerAddress) => void;
  onSetDefault: (address: CustomerAddress) => void;
}

export function AccountAddressSection({
  addresses,
  isLoading,
  isError,
  isMutating,
  onRetry,
  onCreate,
  onEdit,
  onDelete,
  onSetDefault,
}: AccountAddressSectionProps) {
  return (
    <View className="gap-4 rounded-lg border border-border bg-card p-5">
      <View className="flex-row items-start justify-between gap-4">
        <View className="min-w-0 flex-1 gap-1">
          <Text variant="h3">Mis direcciones</Text>
          <Text variant="small">Guarda direcciones para acelerar tu checkout.</Text>
        </View>
        <Button size="sm" onPress={onCreate}>
          <View className="flex-row items-center gap-2">
            <Plus size={15} color="#ffffff" />
            <Text className="font-semibold text-primary-foreground">Nueva</Text>
          </View>
        </Button>
      </View>

      {isLoading ? (
        <View className="items-center gap-3 py-10">
          <ActivityIndicator />
          <Text variant="small">Cargando direcciones...</Text>
        </View>
      ) : isError ? (
        <AccountRetryPanel
          title="No pudimos cargar tus direcciones"
          description="Intenta de nuevo para verlas aqui."
          onRetry={onRetry}
        />
      ) : addresses.length === 0 ? (
        <AccountAddressEmptyState onCreate={onCreate} />
      ) : (
        <View className="gap-3">
          {addresses.map((address) => (
            <AccountAddressCard
              key={address.documentId}
              address={address}
              disabled={isMutating}
              onEdit={() => onEdit(address)}
              onDelete={() => onDelete(address)}
              onSetDefault={() => onSetDefault(address)}
            />
          ))}
        </View>
      )}
    </View>
  );
}
