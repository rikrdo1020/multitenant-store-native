import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { TagsTab } from '@/components/admin/catalog/TagsTab';

export default function TagsScreen() {
  return (
    <ScreenWrapper safeArea={false}>
      <TagsTab />
    </ScreenWrapper>
  );
}
