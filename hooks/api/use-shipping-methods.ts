import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { shippingService } from '@/services/shipping';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { ShippingMethodPayload } from '@/types';

const shippingMethodsQueryKey = (slug?: string) => ['shipping-methods', slug];
const adminShippingMethodsQueryKey = (slug?: string) => ['shipping-methods', slug, 'admin'];
const shippingCalculationQueryKey = (slug?: string, methodId?: string, locationId?: string | null) => [
  'shipping-methods',
  slug,
  'calculate',
  methodId,
  locationId ?? null,
];

function invalidateShippingMethods(slug?: string) {
  queryClient.invalidateQueries({ queryKey: shippingMethodsQueryKey(slug) });
  queryClient.invalidateQueries({ queryKey: adminShippingMethodsQueryKey(slug) });
}

export function useShippingMethods(tenantSlugOverride?: string, enabled = true) {
  const { tenant } = useTenantStore();
  const tenantSlug = tenantSlugOverride ?? tenant?.slug;

  return useQuery({
    queryKey: shippingMethodsQueryKey(tenantSlug),
    queryFn: () => shippingService.getShippingMethods(tenantSlug!),
    enabled: !!tenantSlug && enabled,
    staleTime: 5 * 60_000,
  });
}

export function useAdminShippingMethods(tenantSlugOverride?: string, enabled = true) {
  const { tenant } = useTenantStore();
  const tenantSlug = tenantSlugOverride ?? tenant?.slug;

  return useQuery({
    queryKey: adminShippingMethodsQueryKey(tenantSlug),
    queryFn: () => shippingService.getAdminShippingMethods(tenantSlug!),
    enabled: !!tenantSlug && enabled,
    staleTime: 5 * 60_000,
  });
}

export function useCreateShippingMethod(tenantSlugOverride?: string) {
  const { tenant } = useTenantStore();
  const slug = tenantSlugOverride ?? tenant?.slug;

  return useMutation({
    mutationFn: (payload: ShippingMethodPayload) =>
      shippingService.createShippingMethod(slug!, payload),
    onSuccess: () => {
      invalidateShippingMethods(slug);
    },
  });
}

export function useUpdateShippingMethod(tenantSlugOverride?: string) {
  const { tenant } = useTenantStore();
  const slug = tenantSlugOverride ?? tenant?.slug;

  return useMutation({
    mutationFn: (payload: { methodId: string; data: ShippingMethodPayload }) =>
      shippingService.updateShippingMethod(slug!, payload.methodId, payload.data),
    onSuccess: () => {
      invalidateShippingMethods(slug);
    },
  });
}

export function useDeleteShippingMethod(tenantSlugOverride?: string) {
  const { tenant } = useTenantStore();
  const slug = tenantSlugOverride ?? tenant?.slug;

  return useMutation({
    mutationFn: (methodId: string) => shippingService.deleteShippingMethod(slug!, methodId),
    onSuccess: () => {
      invalidateShippingMethods(slug);
    },
  });
}

export function useShippingCalculation(
  params: { methodId?: string | null; locationId?: string | null },
  tenantSlugOverride?: string,
) {
  const { tenant } = useTenantStore();
  const slug = tenantSlugOverride ?? tenant?.slug;

  return useQuery({
    queryKey: shippingCalculationQueryKey(slug, params.methodId ?? undefined, params.locationId),
    queryFn: () =>
      shippingService.calculateShipping(slug!, {
        methodId: params.methodId!,
        locationId: params.locationId,
      }),
    enabled: !!slug && !!params.methodId,
    staleTime: 30_000,
  });
}
