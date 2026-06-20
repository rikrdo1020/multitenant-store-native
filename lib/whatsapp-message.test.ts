import { describe, expect, it } from '@jest/globals';
import { generateWhatsAppUrl } from './whatsapp-message';
import type { WhatsAppOrderParams } from './whatsapp-message';

const BASE_PARAMS: WhatsAppOrderParams = {
  storeName: 'Mi Tienda',
  whatsappPhone: '+507 6123-4567',
  orderId: 'abcdef1234567890',
  customerName: 'Juan Pérez',
  deliveryType: 'delivery',
  items: [
    {
      documentId: 'prod_001',
      name: 'Camisa',
      price: 20,
      quantity: 2,
      stock: 10,
    },
  ],
  total: 40,
  currency: '$',
};

function decoded(url: string): string {
  return decodeURIComponent(url.split('?text=')[1]);
}

describe('generateWhatsAppUrl', () => {
  it('GIVEN valid params SHOULD return wa.me URL with encoded text param', () => {
    const url = generateWhatsAppUrl(BASE_PARAMS);

    expect(url).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
  });

  it('GIVEN phone with spaces and dashes SHOULD strip non-digit chars', () => {
    const url = generateWhatsAppUrl({ ...BASE_PARAMS, whatsappPhone: '+507 6123-4567' });

    expect(url).toMatch(/^https:\/\/wa\.me\/50761234567\?text=/);
  });

  it('GIVEN delivery type SHOULD show Entrega a domicilio', () => {
    const url = generateWhatsAppUrl({ ...BASE_PARAMS, deliveryType: 'delivery' });

    expect(decoded(url)).toContain('Entrega a domicilio');
  });

  it('GIVEN pickup type SHOULD show Retiro en tienda', () => {
    const url = generateWhatsAppUrl({ ...BASE_PARAMS, deliveryType: 'pickup' });

    expect(decoded(url)).toContain('Retiro en tienda');
  });

  it('GIVEN item with selected options SHOULD include variant in message', () => {
    const params: WhatsAppOrderParams = {
      ...BASE_PARAMS,
      items: [
        {
          documentId: 'prod_001',
          name: 'Camisa',
          price: 20,
          quantity: 1,
          stock: 10,
          selectedOptions: { Talla: 'M', Color: 'Negro' },
        },
      ],
    };

    expect(decoded(generateWhatsAppUrl(params))).toContain('Talla: M');
    expect(decoded(generateWhatsAppUrl(params))).toContain('Color: Negro');
  });

  it('GIVEN multiple items SHOULD include each item line', () => {
    const params: WhatsAppOrderParams = {
      ...BASE_PARAMS,
      items: [
        { documentId: 'p1', name: 'Producto A', price: 10, quantity: 1, stock: 5 },
        { documentId: 'p2', name: 'Producto B', price: 15, quantity: 3, stock: 5 },
      ],
    };
    const msg = decoded(generateWhatsAppUrl(params));

    expect(msg).toContain('1x Producto A');
    expect(msg).toContain('3x Producto B');
  });

  it('GIVEN orderId longer than 8 chars SHOULD use last 8 chars uppercased as short ID', () => {
    const url = generateWhatsAppUrl({ ...BASE_PARAMS, orderId: 'abcdef1234567890' });

    expect(decoded(url)).toContain('#34567890');
  });

  it('GIVEN total with decimals SHOULD format with 2 decimal places', () => {
    const url = generateWhatsAppUrl({ ...BASE_PARAMS, total: 40.5 });

    expect(decoded(url)).toContain('$40.50');
  });

  it('GIVEN no adminUrl SHOULD omit manage link from message', () => {
    const url = generateWhatsAppUrl({ ...BASE_PARAMS, adminUrl: undefined });

    expect(decoded(url)).not.toContain('Ver pedido');
  });

  it('GIVEN adminUrl SHOULD include full manage link in message', () => {
    const url = generateWhatsAppUrl({
      ...BASE_PARAMS,
      adminUrl: 'https://admin.example.com',
    });

    expect(decoded(url)).toContain('https://admin.example.com/orders/abcdef1234567890');
  });

  it('GIVEN store name SHOULD include it in message header', () => {
    const url = generateWhatsAppUrl({ ...BASE_PARAMS, storeName: 'Tienda XYZ' });

    expect(decoded(url)).toContain('NUEVO PEDIDO — Tienda XYZ');
  });

  it('GIVEN customer name SHOULD include it in message', () => {
    const url = generateWhatsAppUrl({ ...BASE_PARAMS, customerName: 'María López' });

    expect(decoded(url)).toContain('María López');
  });

  it('GIVEN message SHOULD NOT include payment method line', () => {
    const url = generateWhatsAppUrl(BASE_PARAMS);

    expect(decoded(url)).not.toContain('Método:');
  });
});
