import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductActionBar } from '@/components/storefront/product-detail/ProductActionBar';
import { ProductDescriptionSection } from '@/components/storefront/product-detail/ProductDescriptionSection';
import { ProductHeroMedia } from '@/components/storefront/product-detail/ProductHeroMedia';
import { ProductInfoSection } from '@/components/storefront/product-detail/ProductInfoSection';
import { ProductOptionsSection } from '@/components/storefront/product-detail/ProductOptionsSection';
import { ProductTagsSection } from '@/components/storefront/product-detail/ProductTagsSection';
import { getProductDescriptionText } from '@/lib/product-detail';
import type { Product, ProductOption } from '@/types';

interface ProductDetailViewProps {
  product: Product;
  currency?: string;
  optionGroups: ProductOption[];
  selectedOptions: Record<string, string>;
  canAddToCart: boolean;
  addDisabledReason: string | null;
  onSelectOption: (optionName: string, value: string) => void;
  onAddToCart: () => void;
  onBack: () => void;
  onCartPress: () => void;
  cartItemCount: number;
}

export function ProductDetailView({
  product,
  currency,
  optionGroups,
  selectedOptions,
  canAddToCart,
  addDisabledReason,
  onSelectOption,
  onAddToCart,
  onBack,
  onCartPress,
  cartItemCount,
}: ProductDetailViewProps) {
  const description = getProductDescriptionText(product.description);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 112 }} showsVerticalScrollIndicator={false}>
        <ProductHeroMedia
          product={product}
          cartItemCount={cartItemCount}
          onBack={onBack}
          onCartPress={onCartPress}
        />

        <View className="gap-6 px-4 py-5">
          <ProductInfoSection product={product} currency={currency} />
          <ProductOptionsSection
            optionGroups={optionGroups}
            selectedOptions={selectedOptions}
            onSelectOption={onSelectOption}
          />
          <ProductTagsSection product={product} />
          <ProductDescriptionSection description={description} />
        </View>
      </ScrollView>

      <ProductActionBar
        canAddToCart={canAddToCart}
        addDisabledReason={addDisabledReason}
        onAddToCart={onAddToCart}
      />
    </SafeAreaView>
  );
}
