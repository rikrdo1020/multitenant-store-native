import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { useCreateOrder } from "@/hooks/api/use-create-order";
import { useShippingMethods } from "@/hooks/api/use-shipping-methods";
import { useTenant } from "@/hooks/api/use-tenant";
import { buildCreateOrderPayload } from "@/lib/order";
import { showToast } from "@/lib/toast";
import { paymentService } from "@/services/payments";
import { useCartStore } from "@/stores/use-cart-store";
import { useCheckoutStore } from "@/stores/use-checkout-store";
import type { ApiError, Order, PaymentProviderType } from "@/types";
import type { YappyPaymentParams } from "@/components/storefront/YappyWebViewModal";

export function usePaymentScreen(tenantSlug?: string) {
  const router = useRouter();
  const { data: tenant } = useTenant(tenantSlug ?? "");

  const setCartTenantScope = useCartStore((state) => state.setTenantScope);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const setCheckoutTenantScope = useCheckoutStore((state) => state.setTenantScope);
  const customerData = useCheckoutStore((state) => state.customerData);
  const shippingAddress = useCheckoutStore((state) => state.shippingAddress);
  const selectedMethodId = useCheckoutStore((state) => state.selectedMethodId);
  const selectedLocationId = useCheckoutStore((state) => state.selectedLocationId);
  const clearCheckout = useCheckoutStore((state) => state.clearCheckout);

  const [isScopeReady, setIsScopeReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadScopes() {
      await Promise.all([
        setCartTenantScope(tenantSlug ?? null),
        setCheckoutTenantScope(tenantSlug ?? null),
      ]);
      if (mounted) setIsScopeReady(true);
    }
    void loadScopes();
    return () => { mounted = false; };
  }, [setCartTenantScope, setCheckoutTenantScope, tenantSlug]);

  const shippingQuery = useShippingMethods(tenantSlug);
  const shippingMethod = shippingQuery.data?.find(
    (m) => m.documentId === selectedMethodId,
  );

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentProviderType>("cash");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [yappyModalVisible, setYappyModalVisible] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (tenant?.provider === "yappy") {
      setSelectedPaymentMethod("yappy");
    }
  }, [tenant?.provider]);

  const createOrderMutation = useCreateOrder(tenantSlug);

  const yappyMutation = useMutation({
    mutationFn: (params: {
      orderId: string;
      viewToken: string;
      amount: number;
      aliasYappy: string;
    }) =>
      paymentService.createYappyPayment(tenantSlug!, params),
  });

  const availableMethods = buildAvailableMethods(tenant?.provider);

  const navigateToConfirmation = useCallback(
    (order: Order) => {
      clearCart();
      clearCheckout();
      const params = new URLSearchParams({
        orderId: order.orderId,
        ...(order.viewToken ? { viewToken: order.viewToken } : {}),
      });

      router.replace(
        `/(storefront)/${tenantSlug}/checkout/confirmation?${params.toString()}` as never,
      );
    },
    [clearCart, clearCheckout, router, tenantSlug],
  );

  const handlePay = async () => {
    if (!isScopeReady || !tenantSlug || !customerData || !shippingAddress || !shippingMethod) {
      showToast(
        "Datos incompletos",
        "destructive",
        "Vuelve al formulario y completa todos los campos.",
      );
      return;
    }

    setSubmitError(null);

    try {
      const order = await createOrderMutation.mutateAsync(
        buildCreateOrderPayload({
          items,
          customerData,
          shippingAddress,
          shippingMethod,
          selectedLocationId,
          paymentMethod: selectedPaymentMethod,
        }),
      );

      if (selectedPaymentMethod === "cash") {
        navigateToConfirmation(order);
        return;
      }

      setPendingOrder(order);
      setYappyModalVisible(true);
    } catch (error) {
      const apiError = error as ApiError;
      const message =
        apiError.message ?? "No pudimos procesar el pago. Intenta nuevamente.";
      setSubmitError(message);
      showToast("Error al pagar", "destructive", message);
    }
  };

  const handleYappyCreatePayment = useCallback(
    async (aliasYappy: string): Promise<YappyPaymentParams> => {
      if (!pendingOrder) throw new Error("No hay orden pendiente");
      if (!pendingOrder.viewToken) {
        throw new Error("No hay token de confirmacion para esta orden");
      }

      const result = await yappyMutation.mutateAsync({
        orderId: pendingOrder.orderId,
        viewToken: pendingOrder.viewToken,
        amount: pendingOrder.total,
        aliasYappy,
      });

      if (!result.transactionId || !result.documentName || !result.token) {
        throw new Error("Respuesta de pago inválida");
      }

      return {
        transactionId: result.transactionId,
        documentName: result.documentName,
        token: result.token,
      };
    },
    [pendingOrder, yappyMutation],
  );

  const handleYappySuccess = useCallback(() => {
    setYappyModalVisible(false);
    if (pendingOrder) navigateToConfirmation(pendingOrder);
  }, [pendingOrder, navigateToConfirmation]);

  const handleYappyError = useCallback(() => {
    setYappyModalVisible(false);
    setPendingOrder(null);
    showToast("Error al pagar", "destructive", "El pago con Yappy no pudo completarse.");
  }, []);

  const handleYappyDismiss = useCallback(() => {
    setYappyModalVisible(false);
    setPendingOrder(null);
  }, []);

  const isPending = createOrderMutation.isPending || !isScopeReady;

  return {
    tenant,
    availableMethods,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    submitError,
    isPending,
    handlePay,
    yappyModalVisible,
    handleYappyCreatePayment,
    handleYappySuccess,
    handleYappyError,
    handleYappyDismiss,
  };
}

function buildAvailableMethods(tenantProvider?: string) {
  return [
    ...(tenantProvider === "yappy"
      ? [
          {
            id: "yappy" as PaymentProviderType,
            label: "Yappy",
            description: "Paga con tu app de Yappy",
          },
        ]
      : []),
    {
      id: "cash" as PaymentProviderType,
      label: "Efectivo / Contra entrega",
      description: "Paga al recibir tu pedido",
    },
  ];
}
