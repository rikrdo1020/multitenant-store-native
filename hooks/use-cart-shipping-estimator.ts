import { useEffect, useState } from 'react';
import { useShippingCalculation, useShippingMethods } from '@/hooks/api/use-shipping-methods';
import {
  getSelectedShippingLocation,
  getShippingCost,
  requiresShippingLocation,
} from '@/lib/shipping';
import { useCheckoutStore } from '@/stores/use-checkout-store';
import type { ShippingMethod } from '@/types';

export function useCartShippingEstimator(tenantSlug?: string) {
  const selectedMethodId = useCheckoutStore((state) => state.selectedMethodId);
  const selectedLocationId = useCheckoutStore((state) => state.selectedLocationId);
  const setCheckoutTenantScope = useCheckoutStore((state) => state.setTenantScope);
  const setSelectedMethod = useCheckoutStore((state) => state.setSelectedMethod);
  const setSelectedLocation = useCheckoutStore((state) => state.setSelectedLocation);
  const shippingQuery = useShippingMethods(tenantSlug);
  const [isScopeReady, setIsScopeReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadCheckoutScope() {
      setIsScopeReady(false);
      await setCheckoutTenantScope(tenantSlug ?? null);
      if (mounted) setIsScopeReady(true);
    }

    void loadCheckoutScope();

    return () => {
      mounted = false;
    };
  }, [setCheckoutTenantScope, tenantSlug]);

  const methods = shippingQuery.data ?? [];
  const selectedMethod = methods.find((method) => method.documentId === selectedMethodId);
  const selectedLocation = getSelectedShippingLocation(selectedMethod, selectedLocationId);
  const needsLocation = requiresShippingLocation(selectedMethod);
  const hasCompleteSelection = !!selectedMethod && (!needsLocation || !!selectedLocation);
  const calculationQuery = useShippingCalculation(
    { methodId: selectedMethod?.documentId, locationId: selectedLocation?.documentId },
    tenantSlug,
  );
  const fallbackCost = selectedMethod ? getShippingCost(selectedMethod, selectedLocationId) : undefined;
  const shippingCost = hasCompleteSelection
    ? calculationQuery.data?.cost ?? fallbackCost
    : undefined;

  useEffect(() => {
    if (!selectedMethodId || shippingQuery.isLoading) return;
    if (!selectedMethod) setSelectedMethod(null);
  }, [selectedMethod, selectedMethodId, setSelectedMethod, shippingQuery.isLoading]);

  useEffect(() => {
    const logistics = selectedMethod?.logistics ?? [];
    if (logistics.length === 1 && selectedLocationId !== logistics[0].documentId) {
      setSelectedLocation(logistics[0].documentId);
    }
  }, [selectedLocationId, selectedMethod, setSelectedLocation]);

  return {
    methods,
    selectedMethod,
    selectedLocation,
    selectedMethodId,
    selectedLocationId,
    shippingCost,
    isLoading: !isScopeReady || shippingQuery.isLoading,
    isError: Boolean(shippingQuery.error),
    isCalculating: calculationQuery.isFetching,
    retry: () => void shippingQuery.refetch(),
    selectMethod: (method: ShippingMethod) => setSelectedMethod(method.documentId),
    selectLocation: setSelectedLocation,
  };
}

export type CartShippingEstimatorViewModel = ReturnType<typeof useCartShippingEstimator>;
