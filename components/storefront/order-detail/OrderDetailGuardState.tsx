import { SafeAreaView } from "react-native-safe-area-context";
import { OrderDetailHeader } from "./OrderDetailHeader";
import { OrderDetailMessage } from "./OrderDetailMessage";

interface OrderDetailGuardStateProps {
  headerSubtitle: string;
  title: string;
  message: string;
  actionLabel: string;
  onBack: () => void;
  onAction: () => void;
  variant?: "default" | "outline";
}

export function OrderDetailGuardState({
  headerSubtitle,
  title,
  message,
  actionLabel,
  onBack,
  onAction,
  variant,
}: OrderDetailGuardStateProps) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <OrderDetailHeader
        title="Detalle de orden"
        subtitle={headerSubtitle}
        onBack={onBack}
      />
      <OrderDetailMessage
        title={title}
        message={message}
        actionLabel={actionLabel}
        onAction={onAction}
        variant={variant}
      />
    </SafeAreaView>
  );
}
