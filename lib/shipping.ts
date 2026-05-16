import type { ShippingLocation, ShippingMethod } from '@/types';

export function getShippingBasePrice(method?: ShippingMethod | null): number {
  return toMoney(method?.basePrice);
}

export function getSelectedShippingLocation(
  method?: ShippingMethod | null,
  locationId?: string | null,
): ShippingLocation | undefined {
  if (!method || !locationId) return undefined;
  return method.logistics?.find((location) => location.documentId === locationId);
}

export function getShippingLocationPrice(location?: ShippingLocation | null): number {
  return toMoney(location?.extraPrice);
}

export function getShippingCost(
  method?: ShippingMethod | null,
  locationId?: string | null,
): number {
  const location = getSelectedShippingLocation(method, locationId);
  return roundMoney(getShippingBasePrice(method) + getShippingLocationPrice(location));
}

export function requiresShippingLocation(method?: ShippingMethod | null): boolean {
  return (method?.logistics?.length ?? 0) > 0;
}

function toMoney(value: number | null | undefined): number {
  if (value == null || Number.isNaN(Number(value))) return 0;
  return Number(value);
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
