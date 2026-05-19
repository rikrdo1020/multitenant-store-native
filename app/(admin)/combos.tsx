import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { ProductTypesCombosScreen } from '@/components/admin/catalog/ProductTypesCombosScreen';

export default function CombosScreen() {
  return (
    <ScreenWrapper safeArea={false}>
      <ProductTypesCombosScreen />
    </ScreenWrapper>
  );
}
