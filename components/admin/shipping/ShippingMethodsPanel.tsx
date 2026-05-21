import { ActivityIndicator, Pressable, View } from 'react-native';
import { RefreshCw, Truck } from 'lucide-react-native';
import { ShippingMethodRow } from '@/components/admin/shipping/ShippingMethodRow';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import type { ShippingMethod } from '@/types';

interface ShippingMethodsPanelProps {
  methods: ShippingMethod[];
  isWide: boolean;
  isLoading: boolean;
  isError: boolean;
  isRefreshing: boolean;
  isMutating: boolean;
  onRefresh: () => void;
  onCreate: () => void;
  onEdit: (method: ShippingMethod) => void;
  onRemove: (method: ShippingMethod) => void;
}

export function ShippingMethodsPanel(props: ShippingMethodsPanelProps) {
  return (
    <View className="rounded-lg border border-border bg-card">
      <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
        <View className="flex-row items-center gap-2">
          <Truck size={18} className="text-foreground" />
          <Text className="font-semibold text-foreground">Metodos de envio</Text>
        </View>
        <Pressable
          onPress={props.onRefresh}
          disabled={props.isRefreshing}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Actualizar metodos de envio"
        >
          {props.isRefreshing ? <ActivityIndicator size="small" /> : <RefreshCw size={17} className="text-muted-foreground" />}
        </Pressable>
      </View>
      <ShippingMethodsPanelContent {...props} />
    </View>
  );
}

function ShippingMethodsPanelContent(props: ShippingMethodsPanelProps) {
  if (props.isLoading) return <PanelMessage title="Cargando metodos..." />;
  if (props.isError) {
    return <PanelMessage title="No pudimos cargar los envios." actionLabel="Reintentar" onAction={props.onRefresh} />;
  }
  if (props.methods.length === 0) {
    return <PanelMessage title="Aun no hay metodos de envio." actionLabel="Crear metodo" onAction={props.onCreate} />;
  }

  return (
    <View>
      {props.methods.map((method, index) => (
        <View key={method.documentId} className={index > 0 ? 'border-t border-border' : undefined}>
          <ShippingMethodRow
            method={method}
            isWide={props.isWide}
            disabled={props.isMutating}
            onEdit={props.onEdit}
            onRemove={props.onRemove}
          />
        </View>
      ))}
    </View>
  );
}

function PanelMessage({ title, actionLabel, onAction }: { title: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <View className="items-center gap-3 p-6">
      <Text className="text-center text-muted-foreground">{title}</Text>
      {actionLabel && onAction && <Button size="sm" variant="outline" onPress={onAction}>{actionLabel}</Button>}
    </View>
  );
}
