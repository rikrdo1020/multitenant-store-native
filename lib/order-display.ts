import type { CreateOrderItemPayload, Order, OrderDisplayStatus } from '@/types';

export interface OrderStatusDisplay {
  label: string;
  badgeClassName: string;
  textClassName: string;
  dotClassName: string;
}

export interface OrderTimelineStep {
  key: string;
  label: string;
  state: 'done' | 'current' | 'pending' | 'blocked';
}

export interface OrderTotals {
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
}

const STATUS_DISPLAY: Record<OrderDisplayStatus, OrderStatusDisplay> = {
  pending: {
    label: 'Pendiente',
    badgeClassName: 'border-amber-200 bg-amber-50',
    textClassName: 'text-amber-800',
    dotClassName: 'bg-amber-500',
  },
  paid: {
    label: 'Pagada',
    badgeClassName: 'border-emerald-200 bg-emerald-50',
    textClassName: 'text-emerald-800',
    dotClassName: 'bg-emerald-500',
  },
  dispatched: {
    label: 'Despachada',
    badgeClassName: 'border-blue-200 bg-blue-50',
    textClassName: 'text-blue-800',
    dotClassName: 'bg-blue-500',
  },
  failed: {
    label: 'Fallida',
    badgeClassName: 'border-red-200 bg-red-50',
    textClassName: 'text-red-800',
    dotClassName: 'bg-red-500',
  },
  cancelled: {
    label: 'Cancelada',
    badgeClassName: 'border-neutral-300 bg-neutral-100',
    textClassName: 'text-neutral-700',
    dotClassName: 'bg-neutral-500',
  },
  rejected: {
    label: 'Rechazada',
    badgeClassName: 'border-red-200 bg-red-50',
    textClassName: 'text-red-800',
    dotClassName: 'bg-red-500',
  },
  expired: {
    label: 'Expirada',
    badgeClassName: 'border-neutral-300 bg-neutral-100',
    textClassName: 'text-neutral-700',
    dotClassName: 'bg-neutral-500',
  },
};

const FALLBACK_STATUS: OrderStatusDisplay = {
  label: 'En revision',
  badgeClassName: 'border-neutral-300 bg-neutral-100',
  textClassName: 'text-neutral-700',
  dotClassName: 'bg-neutral-500',
};

export function getOrderStatusDisplay(status?: OrderDisplayStatus): OrderStatusDisplay {
  if (!status) return FALLBACK_STATUS;
  return STATUS_DISPLAY[status] ?? FALLBACK_STATUS;
}

export function getEffectiveOrderStatus(order: Pick<Order, 'orderStatus' | 'dispatched'>): OrderDisplayStatus {
  if (order.dispatched && !['failed', 'cancelled', 'rejected', 'expired'].includes(order.orderStatus)) {
    return 'dispatched';
  }

  return order.orderStatus;
}

export function getOrderItemCount(order: Pick<Order, 'items'>): number {
  return order.items.reduce((total, item) => total + item.quantity, 0);
}

export function getOrderTotals(order: Pick<Order, 'items' | 'shippingCost' | 'total'>): OrderTotals {
  const subtotal = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shippingCost = order.shippingCost ?? 0;
  const discount = Math.max(0, subtotal + shippingCost - order.total);

  return {
    subtotal,
    shippingCost,
    discount,
    total: order.total,
  };
}

export function getOrderTimeline(status: OrderDisplayStatus): OrderTimelineStep[] {
  if (['failed', 'cancelled', 'rejected', 'expired'].includes(status)) {
    return [
      { key: 'pending', label: 'Orden recibida', state: 'done' },
      { key: status, label: getOrderStatusDisplay(status).label, state: 'blocked' },
    ];
  }

  const flow: { key: OrderDisplayStatus; label: string }[] = [
    { key: 'pending', label: 'Orden recibida' },
    { key: 'paid', label: 'Pago confirmado' },
    { key: 'dispatched', label: 'Despachada' },
  ];
  const currentIndex = Math.max(0, flow.findIndex((step) => step.key === status));

  return flow.map((step, index) => ({
    ...step,
    state: index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'pending',
  }));
}

export function formatOrderDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('es-PA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatOrderOptions(item: Pick<CreateOrderItemPayload, 'selectedOptions'>): string {
  const options = item.selectedOptions;
  if (!options || Object.keys(options).length === 0) return 'Sin variante';

  return Object.entries(options)
    .map(([label, value]) => `${label}: ${value}`)
    .join(' / ');
}

export function getOrderShippingAddress(order: Pick<Order, 'shippingData'>): string[] {
  const address = getRecord(order.shippingData?.address);
  const lines = [
    getString(address.address),
    getString(address.city),
    getString(address.department),
    getString(address.reference),
  ].filter((line): line is string => Boolean(line));

  return lines.length > 0 ? lines : ['Direccion no disponible'];
}

export function getOrderShippingMethodName(order: Pick<Order, 'shippingData' | 'shippingMethod'>): string {
  const method = getRecord(order.shippingData?.method);
  return getString(method.name) ?? order.shippingMethod?.name ?? 'Metodo no disponible';
}

export function getOrderShippingLocationName(order: Pick<Order, 'shippingData'>): string | null {
  const location = getRecord(order.shippingData?.location);
  return getString(location.label) ?? getString(location.name) ?? null;
}

function getRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function getString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}
