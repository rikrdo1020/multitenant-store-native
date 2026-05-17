import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { BrandsTab } from '@/components/admin/catalog/BrandsTab';

export default function BrandsScreen() {
  return (
    <ScreenWrapper safeArea={false}>
      <BrandsTab />
    </ScreenWrapper>
  );
}
