import { View } from 'react-native';
import { AccountAddressColumn } from './AccountAddressColumn';
import { AccountHeader } from './AccountHeader';
import { AccountProfileColumn } from './AccountProfileColumn';
import type { AccountScreenViewModel } from '@/hooks/use-account-screen';

interface AccountAuthenticatedViewProps {
  account: AccountScreenViewModel;
}

export function AccountAuthenticatedView({ account }: AccountAuthenticatedViewProps) {
  return (
    <View className="mx-auto w-full max-w-6xl gap-5">
      <AccountHeader />
      <View className={account.layoutClassName}>
        <AccountProfileColumn account={account} />
        <AccountAddressColumn account={account} />
      </View>
    </View>
  );
}
