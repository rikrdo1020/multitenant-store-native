import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AccountAuthenticatedView } from '@/components/storefront/account/AccountAuthenticatedView';
import { AccountAuthPrompt } from '@/components/storefront/account/AccountAuthPrompt';
import { AccountDialogs } from '@/components/storefront/account/AccountDialogs';
import { useAccountScreen } from '@/hooks/use-account-screen';

interface AccountScreenContentProps {
  tenantSlug?: string;
}

export function AccountScreenContent({ tenantSlug }: AccountScreenContentProps) {
  const account = useAccountScreen(tenantSlug);

  if (!account.isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
          <AccountAuthPrompt onLogin={account.goToLogin} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <AccountAuthenticatedView account={account} />
      </ScrollView>

      <AccountDialogs account={account} />
    </SafeAreaView>
  );
}
