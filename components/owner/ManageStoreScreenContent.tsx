import { ActivityIndicator, ScrollView, View } from 'react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { ManageStoreForm } from '@/components/owner/ManageStoreForm';
import { ManageStoreHeader } from '@/components/owner/ManageStoreHeader';
import { ManageStoreLogoField } from '@/components/owner/ManageStoreLogoField';
import { useManageStoreScreen } from '@/hooks/use-manage-store-screen';

export function ManageStoreScreenContent() {
  const store = useManageStoreScreen();

  if (store.isLoading || !store.profile) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      </ScreenWrapper>
    );
  }

  const displayLogo = store.logoUri ?? store.profile.logo ?? null;

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
