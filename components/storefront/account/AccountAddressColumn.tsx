import { View } from 'react-native';
import { LogOut } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { AccountAddressSection } from './AccountAddressSection';
import type { AccountScreenViewModel } from '@/hooks/use-account-screen';

interface AccountAddressColumnProps {
  account: AccountScreenViewModel;
}

export function AccountAddressColumn({ account }: AccountAddressColumnProps) {
  return (
    <View className={account.isWide ? 'min-w-0 flex-[1.35] gap-5' : 'gap-5'}>
      <AccountAddressSection
        addresses={account.addresses}
        isLoading={account.areAddressesLoading}
        isError={account.areAddressesErrored}
        isMutating={account.isAddressMutating}
        onRetry={account.retryAddresses}
        onCreate={account.openCreateAddress}
        onEdit={account.openEditAddress}
        onDelete={account.requestDeleteAddress}
        onSetDefault={account.handleSetDefaultAddress}
      />

      <Button variant="outline" onPress={account.handleLogout}>
        <View className="flex-row items-center gap-2">
          <LogOut size={16} color="#171717" />
          <Text className="font-semibold">Cerrar sesion</Text>
        </View>
      </Button>
    </View>
  );
}
