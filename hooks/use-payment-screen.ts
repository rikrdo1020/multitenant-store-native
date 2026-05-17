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

export function usePaymentScreen(tenantSlug?: string) {
  const router = useRouter();
  const { data: tenant } = useTenant(tenantSlug ?? "");

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const customerData = useCheckoutStore((state) => state.customerData);
  const shippingAddress = useCheckoutStore((state) => state.shippingAddress);
  const selectedMethodId = useCheckoutStore((state) => state.selectedMethodId);
  const selectedLocationId = useCheckoutStore(
    (state) => state.selectedLocationId,
  );
  const clearCheckout = useCheckoutStore((state) => state.clearCheckout);

  const shippingQuery = useShippingMethods(tenantSlug);
  const shippingMethod = shippingQuery.data?.find(
    (m) => m.documentId === selectedMethodId,
  );

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentProviderType>("cash");
  const [aliasYappy, setAliasYappy] = useState("");
  const [aliasError, setAliasError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (tenant?.provider === "yappy") {
      setSelectedPaymentMethod("yappy");
    }
  }, [tenant?.provider]);

  const createOrderMutation = useCreateOrder(tenantSlug);

  const yappyMutation = useMutation({
    mutationFn: (params: { orderId: string; amount: number }) =>
      paymentService.createYappyPayment(tenantSlug!, {
        ...params,
        aliasYappy: aliasYappy.trim(),
      }),
  });

  const availableMethods = buildAvailableMethods(tenant?.provider);

  const validateAlias = (): boolean => {
    if (selectedPaymentMethod !== "yappy") return true;
    const trimmed = aliasYappy.trim();
    if (!trimmed) {
      setAliasError("Ingresa tu alias de Yappy.");
      return false;
    }
    if (!/^\d{4}-\d{4}$/.test(trimmed)) {
      setAliasError("Formato inválido. Ejemplo: 6789-1234");
      return false;
    }
    setAliasError(null);
    return true;
  };

  const navigateToConfirmation = useCallback(
    (order: Order) => {
      clearCart();
      clearCheckout();
      router.replace(
        `/(storefront)/${tenantSlug}/checkout/confirmation?orderId=${order.orderId}` as never,
      );
    },
    [clearCart, clearCheckout, router, tenantSlug],
  );

  const handlePay = async () => {
    if (!tenantSlug || !customerData || !shippingAddress || !shippingMethod) {
      showToast(
        "Datos incompletos",
        "destructive",
        "Vuelve al formulario y completa todos los campos.",
      );
      return;
    }

    if (!validateAlias()) return;

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

      await yappyMutation.mutateAsync({
        orderId: order.orderId,
        amount: order.total,
      });
      navigateToConfirmation(order);
    } catch (error) {
      const apiError = error as ApiError;
      const message =
        apiError.message ?? "No pudimos procesar el pago. Intenta nuevamente.";
      setSubmitError(message);
      showToast("Error al pagar", "destructive", message);
    }
  };

  const isPending = createOrderMutation.isPending || yappyMutation.isPending;

  return {
    tenant,
    availableMethods,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    aliasYappy,
    setAliasYappy,
    aliasError,
    submitError,
    isPending,
    handlePay,
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
