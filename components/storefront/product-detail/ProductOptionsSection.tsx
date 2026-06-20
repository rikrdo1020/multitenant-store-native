import { View } from "react-native";
import { ProductOptionSelector } from "@/components/storefront/ProductOptionSelector";
import type { ProductOption } from "@/types";

interface ProductOptionsSectionProps {
  optionGroups: ProductOption[];
  selectedOptions: Record<string, string>;
  onSelectOption: (optionName: string, value: string) => void;
}

export function ProductOptionsSection({
  optionGroups,
  selectedOptions,
  onSelectOption,
}: ProductOptionsSectionProps) {
  if (optionGroups.length === 0) return null;

  return (
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
  );
}
