import type { CartItem, ComboDefinition, ComboRule, PricingLine, PricingResult } from '@/types';
import { generateItemKey } from './utils';

type PriceState = Map<string, number[]>;

interface ActiveComboDefinition {
  documentId: string;
  price: number;
  rules: ComboRule[];
}

export function calculateCartPricing(
  items: CartItem[],
  combos: ComboDefinition[] = [],
): PricingResult {
  const lines: PricingLine[] = items.map((item) => ({
    itemKey: generateItemKey(item.documentId, item.selectedOptions),
    name: item.name,
    quantity: item.quantity,
    unitPrice: item.price,
    lineTotal: roundMoney(item.price * item.quantity),
    discountApplied: 0,
  }));

  const originalTotal = roundMoney(lines.reduce((sum, line) => sum + line.lineTotal, 0));
  const activeCombos = combos.flatMap((combo) => {
    const normalized = normalizeCombo(combo);
    return normalized ? [normalized] : [];
  });

  if (!activeCombos.length || !items.length) {
    return {
      total: originalTotal,
      originalTotal,
      savings: 0,
      lines,
    };
  }

  const savings = roundMoney(findBestSavings(buildPriceState(items), activeCombos));
  const total = roundMoney(Math.max(0, originalTotal - savings));

  return {
    total,
    originalTotal,
    savings,
    lines,
  };
}

function findBestSavings(
  state: PriceState,
  combos: ActiveComboDefinition[],
  applications = new Map<string, number>(),
  memo = new Map<string, number>(),
): number {
  const memoKey = buildMemoKey(state, applications);
  const cached = memo.get(memoKey);
  if (cached !== undefined) return cached;

  let bestSavings = 0;
  for (const combo of combos) {
    const applicationCount = applications.get(combo.documentId) ?? 0;
    if (applicationCount >= 5) continue;

    const applied = tryApplyCombo(state, combo);
    if (!applied || applied.savings <= 0) continue;

    const nextApplications = new Map(applications);
    nextApplications.set(combo.documentId, applicationCount + 1);

    bestSavings = Math.max(
      bestSavings,
      applied.savings + findBestSavings(applied.state, combos, nextApplications, memo),
    );
  }

  const rounded = roundMoney(bestSavings);
  memo.set(memoKey, rounded);
  return rounded;
}

function tryApplyCombo(
  state: PriceState,
  combo: ActiveComboDefinition,
): { state: PriceState; savings: number } | null {
  const nextState = cloneState(state);
  let matchedTotal = 0;

  for (const rule of combo.rules) {
    const prices = nextState.get(rule.productType) ?? [];
    if (prices.length < rule.quantity) return null;

    const matchedPrices = prices.splice(0, rule.quantity);
    matchedTotal += matchedPrices.reduce((sum, price) => sum + price, 0);

    if (prices.length === 0) {
      nextState.delete(rule.productType);
    } else {
      nextState.set(rule.productType, prices);
    }
  }

  return {
    state: nextState,
    savings: roundMoney(matchedTotal - combo.price),
  };
}

function buildPriceState(items: CartItem[]): PriceState {
  const state: PriceState = new Map();

  for (const item of items) {
    if (!item.type) continue;

    const prices = state.get(item.type) ?? [];
    for (let count = 0; count < item.quantity; count += 1) {
      prices.push(item.price);
    }
    state.set(item.type, prices);
  }

  for (const prices of state.values()) {
    prices.sort((a, b) => b - a);
  }

  return state;
}

function cloneState(state: PriceState): PriceState {
  return new Map([...state.entries()].map(([type, prices]) => [type, [...prices]]));
}

function normalizeCombo(combo: ComboDefinition): ActiveComboDefinition | null {
  if (!combo.isActive) return null;

  const rules = combo.rules.filter(isValidComboRule);
  if (!rules.length) return null;

  const price = Number(combo.price);
  if (!Number.isFinite(price)) return null;

  return {
    documentId: combo.documentId,
    price: roundMoney(price),
    rules,
  };
}

function isValidComboRule(rule: ComboRule): boolean {
  return (
    typeof rule.productType === 'string' &&
    rule.productType.trim().length > 0 &&
    Number.isInteger(rule.quantity) &&
    rule.quantity > 0
  );
}

function buildMemoKey(state: PriceState, applications: Map<string, number>): string {
  return JSON.stringify({
    applications: [...applications.entries()].sort(([a], [b]) => a.localeCompare(b)),
    state: [...state.entries()].sort(([a], [b]) => a.localeCompare(b)),
  });
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
