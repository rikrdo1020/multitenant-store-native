import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, PackageCheck, ShoppingCart } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { ProductImageCarousel } from '@/components/storefront/ProductImageCarousel';
import { ProductOptionSelector } from '@/components/storefront/ProductOptionSelector';
import { CartIconButton } from '@/components/storefront/CartIconButton';
import { formatPrice } from '@/lib/utils';
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
  const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const description = getProductDescriptionText(product.description);
  const stockLabel = product.stock > 0
    ? `${product.stock} ${product.stock === 1 ? 'disponible' : 'disponibles'}`
    : 'Agotado';

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 112 }} showsVerticalScrollIndicator={false}>
        <View>
          <ProductImageCarousel images={product.images} productName={product.name} />
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            hitSlop={8}
            className="absolute left-4 top-4 h-10 w-10 items-center justify-center rounded-full bg-background"
          >
            <ArrowLeft size={21} color="#0a0a0a" />
          </Pressable>
          <CartIconButton
            count={cartItemCount}
            onPress={onCartPress}
            className="absolute right-4 top-4"
          />
        </View>

        <View className="gap-6 px-4 py-5">
          <View className="gap-3">
            <View className="flex-row flex-wrap items-center gap-2">
              {product.brand && (
                <Text variant="xs" className="font-semibold uppercase tracking-widest text-muted-foreground">
                  {product.brand.name}
                </Text>
              )}
              {product.category && (
                <Text variant="xs" className="rounded-md bg-secondary px-2 py-1 text-foreground">
                  {product.category.name}
                </Text>
              )}
            </View>

            <Text variant="h1" className="leading-tight">
              {product.name}
            </Text>

            <View className="flex-row items-baseline gap-2">
              <Text variant="h2" className="font-bold">
                {formatPrice(displayPrice, currency)}
              </Text>
              {hasDiscount && (
                <Text variant="small" className="line-through">
                  {formatPrice(product.price, currency)}
                </Text>
              )}
            </View>

            <View className="flex-row items-center gap-2">
              <PackageCheck size={17} color={product.stock > 0 ? '#16a34a' : '#737373'} />
              <Text
                variant="small"
                className={product.stock > 0 ? 'font-medium text-green-700' : 'font-medium'}
              >
                {stockLabel}
              </Text>
            </View>
          </View>

          {optionGroups.length > 0 && (
            <View className="gap-5">
              {optionGroups.map((option) => (
                <ProductOptionSelector
                  key={option.name}
                  option={option}
                  selectedValue={selectedOptions[option.name]}
                  onSelect={onSelectOption}
                />
              ))}
            </View>
          )}

          {product.tags && product.tags.length > 0 && (
            <View className="gap-3">
              <Text variant="small" className="font-semibold text-foreground">Etiquetas</Text>
              <View className="flex-row flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Text
                    key={tag.documentId}
                    variant="xs"
                    className="rounded-md border border-border px-2 py-1 text-foreground"
                  >
                    {tag.name}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {description && (
            <View className="gap-2">
              <Text variant="h3">Descripcion</Text>
              <Text variant="body" className="leading-6 text-muted-foreground">
                {description}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="border-t border-border bg-background px-4 pb-4 pt-3">
        {addDisabledReason && (
          <Text variant="xs" className="mb-2 text-center">
            {addDisabledReason}
          </Text>
        )}
        <Button size="lg" disabled={!canAddToCart} onPress={onAddToCart}>
          <View className="flex-row items-center gap-2">
            <ShoppingCart size={18} color="#ffffff" />
            <Text className="font-semibold text-primary-foreground">
              Agregar al carrito
            </Text>
          </View>
        </Button>
      </View>
    </SafeAreaView>
  );
}
