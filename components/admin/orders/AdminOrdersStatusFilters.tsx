import { ScrollView, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/Text";
import {
  ADMIN_ORDER_STATUS_FILTERS,
  type AdminOrderStatusFilter,
} from "@/hooks/use-admin-orders-screen";

interface AdminOrdersStatusFiltersProps {
  selected: AdminOrderStatusFilter;
  onSelect: (value: AdminOrderStatusFilter) => void;
}

export function AdminOrdersStatusFilters({
  selected,
  onSelect,
}: AdminOrdersStatusFiltersProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-2 -mx-1 flex-grow-0"
      contentContainerStyle={{ paddingHorizontal: 12, gap: 6 }}
    >
      {ADMIN_ORDER_STATUS_FILTERS.map((option) => {
        const active = selected === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onSelect(option.value)}
            className={`rounded-full border px-4 py-2 ${
              active ? "border-primary bg-primary" : "border-border bg-background"
            }`}
          >
            <Text
              variant="small"
              className={`font-medium ${
                active ? "text-primary-foreground" : "text-foreground"
              }`}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
