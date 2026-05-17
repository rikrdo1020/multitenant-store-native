import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type FieldErrors } from 'react-hook-form';
import { useShippingMethods } from '@/hooks/api/use-shipping-methods';
import {
  getCheckoutFormErrorMessage,
  getCheckoutSubmitErrorMessage,
} from '@/lib/checkout-feedback';
import { calculateCartPricing } from '@/lib/pricing';
import {
  getSelectedShippingLocation,
  getShippingCost,
  requiresShippingLocation,
} from '@/lib/shipping';
import { showToast } from '@/lib/toast';
import { checkoutFormSchema, type CheckoutFormData } from '@/lib/validators';
import { useCartStore } from '@/stores/use-cart-store';
import { useCheckoutStore } from '@/stores/use-checkout-store';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { CustomerFormData, ShippingAddressData, ShippingMethod } from '@/types';

export const EMPTY_CHECKOUT_FORM: CheckoutFormData = {
  name: '',
  email: '',
  phone: '',
  notes: '',
  address: '',
  reference: '',
  city: '',
};

export function useCheckoutScreen(tenantSlug?: string) {
  const router = useRouter();
  const { tenant } = useTenantStore();
  const items = useCartStore((state) => state.items);
  const setCartTenantScope = useCartStore((state) => state.setTenantScope);
  const customerData = useCheckoutStore((state) => state.customerData);
  const shippingAddress = useCheckoutStore((state) => state.shippingAddress);
  const selectedMethodId = useCheckoutStore((state) => state.selectedMethodId);
  const selectedLocationId = useCheckoutStore((state) => state.selectedLocationId);
  const setCheckoutTenantScope = useCheckoutStore((state) => state.setTenantScope);
  const setCustomerData = useCheckoutStore((state) => state.setCustomerData);
  const setShippingAddress = useCheckoutStore((state) => state.setShippingAddress);
  const setSelectedMethod = useCheckoutStore((state) => state.setSelectedMethod);
  const setSelectedLocation = useCheckoutStore((state) => state.setSelectedLocation);
  const shippingQuery = useShippingMethods(tenantSlug);
  const [isScopeReady, setIsScopeReady] = useState(false);
  const [hydratedTenant, setHydratedTenant] = useState<string | null>(null);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: EMPTY_CHECKOUT_FORM,
  });

  useEffect(() => {
    let mounted = true;

    async function loadScopes() {
      setIsScopeReady(false);
      await Promise.all([
        setCartTenantScope(tenantSlug ?? null),
        setCheckoutTenantScope(tenantSlug ?? null),
      ]);
      if (mounted) setIsScopeReady(true);
    }

    void loadScopes();

    return () => {
      mounted = false;
    };
  }, [setCartTenantScope, setCheckoutTenantScope, tenantSlug]);

  useEffect(() => {
    if (!isScopeReady || !tenantSlug || hydratedTenant === tenantSlug) return;

    form.reset({
      ...EMPTY_CHECKOUT_FORM,
      ...customerData,
      ...shippingAddress,
    });
    setHydratedTenant(tenantSlug);
  }, [customerData, form, hydratedTenant, isScopeReady, shippingAddress, tenantSlug]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (!isScopeReady) return;

      setCustomerData({
        name: value.name ?? '',
        email: value.email ?? '',
        phone: value.phone ?? '',
        ...(value.notes ? { notes: value.notes } : {}),
      });

      setShippingAddress({
        address: value.address ?? '',
        city: value.city ?? '',
        ...(value.reference ? { reference: value.reference } : {}),
      });
    });

    return () => subscription.unsubscribe();
  }, [form, isScopeReady, setCustomerData, setShippingAddress]);

  const shippingMethods = shippingQuery.data ?? [];
  const selectedMethod = shippingMethods.find((method) => method.documentId === selectedMethodId);
  const selectedLocation = getSelectedShippingLocation(selectedMethod, selectedLocationId);
  const pricing = useMemo(() => calculateCartPricing(items), [items]);
  const shippingCost = selectedMethod ? getShippingCost(selectedMethod, selectedLocationId) : 0;
  const methodRequiresLocation = requiresShippingLocation(selectedMethod);

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

  const goBack = () => router.back();
  const goToProducts = () => router.push(`/(storefront)/${tenantSlug}/products` as never);
  const goToCart = () => router.push(`/(storefront)/${tenantSlug}/cart` as never);

  const handleSelectMethod = (method: ShippingMethod) => {
    setSelectedMethod(method.documentId);
    setSelectionError(null);
    setSubmitError(null);
  };

  const handleSelectLocation = (locationId: string) => {
    setSelectedLocation(locationId);
    setSelectionError(null);
    setSubmitError(null);
  };

  const getShippingSelectionError = () => {
    if (!selectedMethod) return 'Selecciona un metodo de envio.';
    if (methodRequiresLocation && !selectedLocation) return 'Selecciona una zona o punto de entrega.';
    return null;
  };

  const showCheckoutError = (message: string, description?: string) => {
    setSubmitError(message);
    showToast('Revisa el checkout', 'destructive', description ?? message);
  };

  const handleProceedToPayment = async (values: CheckoutFormData) => {
    setSubmitError(null);

    if (items.length === 0) {
      showCheckoutError('Tu carrito esta vacio.');
      return;
    }

    const shippingError = getShippingSelectionError();
    if (shippingError || !selectedMethod) {
      const message = shippingError ?? 'Selecciona un metodo de envio.';
      setSelectionError(message);
      showCheckoutError(message);
      return;
    }

    const nextCustomerData: CustomerFormData = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      ...(values.notes?.trim() ? { notes: values.notes.trim() } : {}),
    };
    const nextShippingAddress: ShippingAddressData = {
      address: values.address.trim(),
      city: values.city.trim(),
      ...(values.reference?.trim() ? { reference: values.reference.trim() } : {}),
    };

    setCustomerData(nextCustomerData);
    setShippingAddress(nextShippingAddress);

    router.push(`/(storefront)/${tenantSlug}/checkout/payment` as never);
  };

  const handleInvalidSubmit = (errors: FieldErrors<CheckoutFormData>) => {
    const shippingError = getShippingSelectionError();
    if (shippingError) setSelectionError(shippingError);
    const hasFormErrors = Object.keys(errors).length > 0;

    showCheckoutError(
      getCheckoutSubmitErrorMessage({ hasFormErrors, shippingError }),
      hasFormErrors ? getCheckoutFormErrorMessage(errors) : undefined,
    );
  };

  const submitOrder = () => {
    const shippingError = getShippingSelectionError();
    if (shippingError) setSelectionError(shippingError);

    void form.handleSubmit(handleProceedToPayment, handleInvalidSubmit)();
  };

  return {
    control: form.control,
    errors: form.formState.errors,
    currency: tenant?.currency,
    items,
    pricing,
    shippingQuery,
    shippingMethods,
    selectedMethodId,
    selectedLocationId,
    selectedMethod,
    selectedLocation,
    shippingCost,
    methodRequiresLocation,
    selectionError,
    submitError,
    isScopeReady,
    goBack,
    goToProducts,
    goToCart,
    handleSelectMethod,
    handleSelectLocation,
    submitOrder,
  };
}
