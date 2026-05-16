import { View } from 'react-native';
import { AlertCircle, ShoppingBag } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { formatPrice } from '@/lib/utils';
import type { PricingResult } from '@/types';

interface CartSummaryProps {
  pricing: PricingResult;
  currency?: string;
  shippingCost?: number;
  shippingLabel?: string;
  actionLabel?: string;
  actionDisabled?: boolean;
  actionLoading?: boolean;
  actionError?: string | null;
  actionSuccess?: {
    title: string;
    description?: string;
  } | null;
  onAction?: () => void;
}

export function CartSummary({
  pricing,
  currency,
  shippingCost,
  shippingLabel,
  actionLabel,
  actionDisabled,
  actionLoading,
  actionError,
  actionSuccess,
  onAction,
}: CartSummaryProps) {
  const hasShippingCost = typeof shippingCost === 'number';
  const finalTotal = pricing.total + (shippingCost ?? 0);

  return (
    <View className="gap-4 rounded-lg border border-border bg-background p-4">
      <View className="flex-row items-center gap-2">
        <ShoppingBag size={18} color="#0a0a0a" />
        <Text variant="h3">Resumen</Text>
      </View>

      <View className="gap-3">
        <SummaryRow label="Subtotal" value={formatPrice(pricing.originalTotal, currency)} />
        <SummaryRow
          label="Descuento por combo"
          value={pricing.savings > 0 ? `-${formatPrice(pricing.savings, currency)}` : formatPrice(0, currency)}
          muted={pricing.savings === 0}
        />
        <SummaryRow
          label="Envio"
          value={hasShippingCost ? formatPrice(shippingCost, currency) : shippingLabel ?? 'En checkout'}
          muted={!hasShippingCost}
        />
      </View>

      <View className="border-t border-border pt-4">
        <View className="flex-row items-center justify-between gap-4">
          <Text className="font-semibold">Total</Text>
          <Text variant="h2" className="font-bold">
            {formatPrice(finalTotal, currency)}
          </Text>
        </View>
      </View>

      {actionError && (
        <View className="flex-row items-start gap-2 rounded-md border border-destructive p-3">
          <AlertCircle size={16} color="#dc2626" />
          <Text variant="small" className="min-w-0 flex-1 text-destructive">
            {actionError}
          </Text>
        </View>
      )}

      {actionSuccess && (
        <View className="rounded-md border border-green-200 bg-green-50 p-3">
          <Text className="font-semibold text-green-800">
            {actionSuccess.title}
          </Text>
          {actionSuccess.description && (
            <Text variant="small" className="mt-1 text-green-800">
              {actionSuccess.description}
            </Text>
          )}
        </View>
      )}

      {actionLabel && onAction && (
        <Button
          size="lg"
          onPress={onAction}
          disabled={actionDisabled}
          loading={actionLoading}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
}

function SummaryRow({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between gap-4">
      <Text variant="small">{label}</Text>
      <Text className={muted ? 'text-muted-foreground' : 'font-semibold text-foreground'}>
        {value}
      </Text>
    </View>
  );
}
