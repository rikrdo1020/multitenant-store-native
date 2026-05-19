import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { CategoriesTab } from '@/components/admin/catalog/CategoriesTab';

export default function CategoriesScreen() {
  return (
    <ScreenWrapper safeArea={false}>
      <CategoriesTab />
    </ScreenWrapper>
  );
}
