import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type FieldErrors } from 'react-hook-form';
import { useTenant } from '@/hooks/api/use-tenant';
import { useCreateOrder } from '@/hooks/api/use-create-order';
import { useShippingMethods } from '@/hooks/api/use-shipping-methods';
import { useCustomerAddresses, useCustomerProfile } from '@/hooks/api/use-customers';
import {
  getCheckoutFormErrorMessage,
  getCheckoutSubmitErrorMessage,
} from '@/lib/checkout-feedback';
import { useCartPricing } from '@/hooks/use-cart-pricing';
import { ADMIN_URL } from '@/lib/constants';
import { mapSavedAddressToCheckoutValues } from '@/lib/customer-address';
import { buildCreateOrderPayload, getCartStockIssue, PENDING_PAYMENT_METHOD } from '@/lib/order';
import {
  getSelectedShippingLocation,
  getShippingCost,
  requiresShippingLocation,
} from '@/lib/shipping';
import { showToast } from '@/lib/toast';
import { generateWhatsAppUrl } from '@/lib/whatsapp-message';
import { checkoutFormSchema, type CheckoutFormData } from '@/lib/validators';
import { useAuthStore } from '@/stores/use-auth-store';
import { useCartStore } from '@/stores/use-cart-store';
import { useCheckoutStore } from '@/stores/use-checkout-store';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { ApiError, CustomerAddress, CustomerFormData, ShippingAddressData, ShippingMethod } from '@/types';

export const EMPTY_CHECKOUT_FORM: CheckoutFormData = {
  name: '',
  email: '',
  phone: '',
  notes: '',
  address: '',
  reference: '',
  city: '',
  department: '',
};

export function useCheckoutScreen(tenantSlug?: string) {
  const router = useRouter();
  const { tenant: adminTenant } = useTenantStore();
  const { data: storefrontTenant } = useTenant(tenantSlug ?? '');
  const tenant = storefrontTenant ?? adminTenant;
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const setCartTenantScope = useCartStore((state) => state.setTenantScope);
  const customerData = useCheckoutStore((state) => state.customerData);
  const shippingAddress = useCheckoutStore((state) => state.shippingAddress);
  const selectedMethodId = useCheckoutStore((state) => state.selectedMethodId);
  const selectedLocationId = useCheckoutStore((state) => state.selectedLocationId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setCheckoutTenantScope = useCheckoutStore((state) => state.setTenantScope);
  const setCustomerData = useCheckoutStore((state) => state.setCustomerData);
  const setShippingAddress = useCheckoutStore((state) => state.setShippingAddress);
  const setSelectedMethod = useCheckoutStore((state) => state.setSelectedMethod);
  const setSelectedLocation = useCheckoutStore((state) => state.setSelectedLocation);
  const clearCheckout = useCheckoutStore((state) => state.clearCheckout);
  const shippingQuery = useShippingMethods(tenantSlug);
  const profileQuery = useCustomerProfile(tenantSlug, isAuthenticated);
  const addressesQuery = useCustomerAddresses(tenantSlug, isAuthenticated);
  const createOrderMutation = useCreateOrder(tenantSlug);
  const [isScopeReady, setIsScopeReady] = useState(false);
  const [hydratedTenant, setHydratedTenant] = useState<string | null>(null);
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<string | null>(null);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isFreePlan = tenant?.plan !== 'PRO';

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
        ...(value.department ? { department: value.department } : {}),
        ...(value.reference ? { reference: value.reference } : {}),
      });
    });

    return () => subscription.unsubscribe();
  }, [form, isScopeReady, setCustomerData, setShippingAddress]);

  const shippingMethods = shippingQuery.data ?? [];
  const savedAddresses = addressesQuery.data ?? [];
  const selectedMethod = shippingMethods.find((method) => method.documentId === selectedMethodId);
  const selectedLocation = getSelectedShippingLocation(selectedMethod, selectedLocationId);
  const { pricing, isPricingLoading, pricingError, retryPricing } = useCartPricing(
    items,
    tenantSlug,
  );
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

  const goBack = () =>
    router.canGoBack()
      ? router.back()
      : router.replace(`/(storefront)/${tenantSlug}/cart` as never);
  const goToProducts = () => router.push(`/(storefront)/${tenantSlug}/products` as never);

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

  const handleSelectSavedAddress = (address: CustomerAddress) => {
    const nextValues = mapSavedAddressToCheckoutValues(address, profileQuery.data);
    setSelectedSavedAddressId(address.documentId);
    setSubmitError(null);

    Object.entries(nextValues).forEach(([field, value]) => {
      form.setValue(field as keyof CheckoutFormData, value ?? '', {
        shouldDirty: true,
        shouldValidate: true,
      });
    });

    showToast('Direccion cargada', 'success', 'Revisa los datos antes de continuar.');
  };

  const retrySavedAddresses = () => {
    void addressesQuery.refetch();
  };

  const retryShippingMethods = () => {
    void shippingQuery.refetch();
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

    const stockIssue = getCartStockIssue(items);
    if (stockIssue) {
      showCheckoutError(stockIssue, 'Actualiza el carrito antes de continuar.');
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
      ...(values.department?.trim() ? { department: values.department.trim() } : {}),
      ...(values.reference?.trim() ? { reference: values.reference.trim() } : {}),
    };

    setCustomerData(nextCustomerData);
    setShippingAddress(nextShippingAddress);

    if (isFreePlan) {
      await handleWhatsAppCheckout(nextCustomerData, nextShippingAddress, selectedMethod);
      return;
    }

    router.push(`/(storefront)/${tenantSlug}/checkout/payment` as never);
  };

  const handleWhatsAppCheckout = async (
    nextCustomerData: CustomerFormData,
    nextShippingAddress: ShippingAddressData,
    shippingMethod: ShippingMethod,
  ) => {
    if (!tenant?.whatsappPhone) {
      showCheckoutError(
        'Sin número de WhatsApp configurado.',
        'El vendedor no ha configurado su número de WhatsApp. Contacta al administrador.',
      );
      return;
    }

    try {
      const order = await createOrderMutation.mutateAsync(
        buildCreateOrderPayload({
          items,
          customerData: nextCustomerData,
          shippingAddress: nextShippingAddress,
          shippingMethod,
          selectedLocationId,
          paymentMethod: PENDING_PAYMENT_METHOD,
        }),
      );

      const deliveryType = shippingMethod.type === 'pickup_point' ? 'pickup' : 'delivery';
      const waUrl = generateWhatsAppUrl({
        storeName: tenant.name,
        whatsappPhone: tenant.whatsappPhone,
        orderId: order.orderId,
        customerName: nextCustomerData.name,
        deliveryType,
        items,
        total: order.total,
        currency: tenant.currency ?? '$',
        adminUrl: ADMIN_URL || undefined,
      });

      clearCart();
      clearCheckout();
      await Linking.openURL(waUrl);

      router.replace(
        `/(storefront)/${tenantSlug}/checkout/whatsapp-sent?orderId=${order.orderId}` as never,
      );
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.message ?? 'No pudimos procesar el pedido. Intenta nuevamente.';
      showCheckoutError(message);
    }
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

  const isSubmitting = createOrderMutation.isPending;

  return {
    control: form.control,
    errors: form.formState.errors,
    currency: tenant?.currency,
    items,
    pricing,
    isPricingLoading,
    pricingError,
    retryPricing,
    isShippingLoading: shippingQuery.isLoading,
    isShippingErrored: shippingQuery.isError,
    areSavedAddressesLoading: addressesQuery.isLoading,
    areSavedAddressesErrored: addressesQuery.isError,
    canUseSavedAddresses: isAuthenticated,
    savedAddresses,
    selectedSavedAddressId,
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
    isFreePlan,
    isSubmitting,
    goBack,
    goToProducts,
    handleSelectMethod,
    handleSelectLocation,
    handleSelectSavedAddress,
    retrySavedAddresses,
    retryShippingMethods,
    submitOrder,
  };
}

export type CheckoutScreenViewModel = ReturnType<typeof useCheckoutScreen>;
