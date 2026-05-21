import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AccountAuthenticatedView } from '@/components/storefront/account/AccountAuthenticatedView';
import { AccountHeader } from '@/components/storefront/account/AccountHeader';
import { AccountAuthPrompt } from '@/components/storefront/account/AccountAuthPrompt';
import { AccountDialogs } from '@/components/storefront/account/AccountDialogs';
import { useAccountScreen } from '@/hooks/use-account-screen';

interface AccountScreenContentProps {
  tenantSlug?: string;
  contentHeader?: ReactNode;
  safeArea?: boolean;
  showHeader?: boolean;
}

export function AccountScreenContent({
  tenantSlug,
  contentHeader,
  safeArea = true,
  showHeader = true,
}: AccountScreenContentProps) {
  const account = useAccountScreen(tenantSlug);
  const Root = safeArea ? SafeAreaView : View;

  if (!account.isAuthenticated) {
    return (
      <Root className="flex-1 bg-background">
        {showHeader && <AccountHeader />}
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
          {contentHeader}
          <AccountAuthPrompt onLogin={account.goToLogin} />
        </ScrollView>
      </Root>
    );
  }

  return (
    <Root className="flex-1 bg-background">
      {showHeader && (
        <AccountHeader
          canOpenAdminPanel={account.canOpenAdminPanel}
          onOpenAdminPanel={account.goToAdminPanel}
        />
      )}
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {contentHeader}
        <AccountAuthenticatedView account={account} />
      </ScrollView>

      <AccountDialogs account={account} />
    </Root>
  );
}
