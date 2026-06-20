import type { CartItem } from '@/types';

export interface WhatsAppOrderParams {
  storeName: string;
  whatsappPhone: string;
  orderId: string;
  customerName: string;
  deliveryType: 'delivery' | 'pickup';
  items: CartItem[];
  total: number;
  currency: string;
  adminUrl?: string;
}

export function generateWhatsAppUrl(params: WhatsAppOrderParams): string {
  const message = buildMessage(params);
  const encoded = encodeURIComponent(message);
  const phone = normalizePhone(params.whatsappPhone);
  return `https://wa.me/${phone}?text=${encoded}`;
}

function buildMessage(params: WhatsAppOrderParams): string {
  const { storeName, orderId, customerName, deliveryType, items, total, currency, adminUrl } =
    params;

  const separator = '----------------------------';
  const deliveryLabel = deliveryType === 'pickup' ? 'Retiro en tienda' : 'Entrega a domicilio';
  const shortId = orderId.length > 8 ? orderId.slice(-8).toUpperCase() : orderId.toUpperCase();

  const itemLines = items
    .map((item) => {
      const subtotal = formatAmount(item.price * item.quantity, currency);
      const variantSuffix = item.selectedOptions
        ? ` (${formatVariants(item.selectedOptions)})`
        : '';
      return `  • ${item.quantity}x ${item.name}${variantSuffix} — ${subtotal}`;
    })
    .join('\n');

  const lines: string[] = [
    `*NUEVO PEDIDO — ${storeName}*`,
    separator,
    `*Orden:* #${shortId}`,
    `*Cliente:* ${customerName}`,
    `*Entrega:* ${deliveryLabel}`,
    separator,
    '*Productos:*',
    itemLines,
    separator,
    `*TOTAL: ${formatAmount(total, currency)}*`,
  ];

  if (adminUrl) {
    lines.push(separator);
    lines.push(`Ver pedido: ${adminUrl}/orders/${orderId}`);
  }

  return lines.join('\n');
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

function formatAmount(amount: number, currency: string): string {
  return `${currency}${amount.toFixed(2)}`;
}

function formatVariants(options: Record<string, string>): string {
  return Object.entries(options)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');
}
