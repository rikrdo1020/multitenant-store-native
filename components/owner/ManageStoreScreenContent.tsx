import { ActivityIndicator, ScrollView, View } from 'react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { ManageStoreForm } from '@/components/owner/ManageStoreForm';
import { ManageStoreHeader } from '@/components/owner/ManageStoreHeader';
import { ManageStoreLogoField } from '@/components/owner/ManageStoreLogoField';
import { getManageStoreScreenState } from '@/components/owner/manage-store-screen-state';
import { ManageStoreStatePanel } from '@/components/owner/ManageStoreStatePanel';
import { useManageStoreScreen } from '@/hooks/use-manage-store-screen';

export function ManageStoreScreenContent() {
  const store = useManageStoreScreen();
  const state = getManageStoreScreenState(store);

  if (state?.kind === 'loading') {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      </ScreenWrapper>
    );
  }

  if (state?.kind === 'panel') {
    return (
      <ScreenWrapper>
        <ManageStoreStatePanel {...state} />
      </ScreenWrapper>
    );
  }

  const profile = store.profile;
  if (!profile) return null;

  const displayLogo = store.logoUri ?? profile.logo ?? null;

  return (
    <ScreenWrapper>
      <ManageStoreHeader onBack={store.goBack} onSettings={store.goToStoreSettings} />
      <ScrollView contentContainerClassName="gap-5 px-6 py-6" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <ManageStoreLogoField logoUri={displayLogo} onPress={store.pickLogo} />
        <ManageStoreForm store={store} />
      </ScrollView>
    </ScreenWrapper>
  );
}
