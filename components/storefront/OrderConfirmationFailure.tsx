import { XCircle } from "lucide-react-native";
import { OrderConfirmationDescription } from "@/components/storefront/OrderConfirmationDescription";
import { OrderConfirmationState } from "@/components/storefront/OrderConfirmationState";
import type { OrderConfirmationViewModel } from "@/hooks/use-order-confirmation-screen";

interface OrderConfirmationFailureProps {
  confirmation: OrderConfirmationViewModel;
  orderId: string;
  total?: number;
}

export function OrderConfirmationFailure({
  confirmation,
  orderId,
  total,
}: OrderConfirmationFailureProps) {
  return (
    <OrderConfirmationState
      icon={XCircle}
      iconColor="#dc2626"
      title="Pago no completado"
      description={
        <OrderConfirmationDescription
          orderId={orderId}
          total={total}
          message={confirmation.failureMessage}
        />
      }
      actions={[
        { label: "Intentar de nuevo", onPress: confirmation.goBackToPayment },
        {
          label: "Volver a la tienda",
          variant: "outline",
          onPress: confirmation.goToProducts,
        },
      ]}
    />
  );
}
