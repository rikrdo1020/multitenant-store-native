import { View } from 'react-native';
import { AccountOrdersPanel } from './AccountOrdersPanel';
import { AccountProfileLoadingPanel } from './AccountProfileLoadingPanel';
import { AccountProfilePanel } from './AccountProfilePanel';
import { AccountRetryPanel } from './AccountRetryPanel';
import type { AccountScreenViewModel } from '@/hooks/use-account-screen';

interface AccountProfileColumnProps {
  account: AccountScreenViewModel;
}

export function AccountProfileColumn({ account }: AccountProfileColumnProps) {
  return (
    <View className={account.isWide ? 'min-w-0 flex-[1.05] gap-5' : 'gap-5'}>
      {account.isProfileLoading ? (
        <AccountProfileLoadingPanel />
      ) : account.isProfileErrored ? (
        <AccountRetryPanel
          title="No pudimos cargar tu perfil"
          description="Tus pedidos siguen disponibles. Intenta de nuevo para editar tus datos."
          onRetry={account.retryProfile}
        />
      ) : (
        <AccountProfilePanel
          profile={account.profile}
          fallbackUserName={account.user?.name ?? 'Cliente'}
          fallbackEmail={account.user?.email}
          onEdit={account.openEditProfile}
        />
      )}

      <AccountOrdersPanel onPress={account.goToOrders} />
    </View>
  );
}
