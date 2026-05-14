import type { CartItem, ComboDefinition, PricingResult, PricingLine } from '@/types';

export function calculateCartPricing(
  items: CartItem[],
  combos?: ComboDefinition[]
): PricingResult {
  const lines: PricingLine[] = items.map((item) => ({
    itemKey: `${item.documentId}:${JSON.stringify(item.selectedOptions || {})}`,
    name: item.name,
    quantity: item.quantity,
    unitPrice: item.price,
    lineTotal: item.price * item.quantity,
    discountApplied: 0,
  }));

  let total = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  let originalTotal = total;
  let savings = 0;

  if (combos && combos.length > 0 && items.length > 0) {
    const activeCombos = combos.filter((c) => c.conditions.length > 0);
    const comboApplications = new Map<string, number>();

    for (const combo of activeCombos) {
      const appCount = comboApplications.get(combo.documentId) || 0;
      if (appCount >= 5) continue;

      const applicableItems = items.filter((item) =>
        combo.conditions.some((cond) => {
          if (cond.minQuantity && item.quantity < cond.minQuantity) return false;
          return true;
        })
      );

      if (applicableItems.length > 0) {
        const applicableTotal = applicableItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        let discount = 0;
        if (combo.discountType === 'percentage') {
          discount = applicableTotal * (combo.discount / 100);
        } else {
          discount = combo.discount;
        }

        discount = Math.min(discount, applicableTotal);
        savings += discount;
        comboApplications.set(combo.documentId, appCount + 1);
      }
    }

    total = Math.max(0, originalTotal - savings);
  }

  return {
    total,
    originalTotal,
    savings,
    lines,
  };
}
