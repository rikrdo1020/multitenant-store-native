import { z } from 'zod';
import type { ShippingMethod, ShippingMethodPayload } from '@/types';

export const SHIPPING_TYPE_OPTIONS = [
  {
    value: 'delivery_zone',
    label: 'Entrega por zona',
    description: 'Usa zonas de cobertura con recargo opcional.',
  },
  {
    value: 'pickup_point',
    label: 'Retiro en punto',
    description: 'El cliente elige un punto de retiro.',
  },
  {
    value: 'third_party',
    label: 'Courier externo',
    description: 'Envio por proveedor externo o cotizacion manual.',
  },
] as const;

export const shippingMethodFormSchema = z.object({
  name: z.string().min(3, 'Minimo 3 caracteres'),
  type: z.enum(['pickup_point', 'delivery_zone', 'third_party']),
  basePrice: z.coerce.number().min(0, 'No puede ser negativo'),
  requiresDetails: z.boolean().default(false),
  disclaimer: z.string().max(240, 'Maximo 240 caracteres').optional(),
  isActive: z.boolean().default(true),
  locations: z.array(z.object({
    key: z.string().min(2, 'Minimo 2 caracteres').regex(/^[a-z0-9-]+$/, 'Solo minusculas, numeros y guiones'),
    label: z.string().min(2, 'Minimo 2 caracteres'),
    extraPrice: z.coerce.number().min(0, 'No puede ser negativo'),
  })).default([]),
});

export type ShippingMethodFormData = z.infer<typeof shippingMethodFormSchema>;
export type ShippingMethodType = ShippingMethodFormData['type'];

export const defaultShippingMethodValues: ShippingMethodFormData = {
  name: '',
  type: 'delivery_zone',
  basePrice: 0,
  requiresDetails: true,
  disclaimer: '',
  isActive: true,
  locations: [],
};

export function getShippingMethodFormValues(method?: ShippingMethod | null): ShippingMethodFormData {
  if (!method) return defaultShippingMethodValues;

  return {
    name: method.name,
    type: method.type,
    basePrice: method.basePrice ?? 0,
    requiresDetails: method.requiresDetails ?? false,
    disclaimer: method.disclaimer ?? '',
    isActive: method.isActive ?? true,
    locations: (method.logistics ?? []).map((location) => ({
      key: location.key,
      label: location.label,
      extraPrice: location.extraPrice ?? 0,
    })),
  };
}

export function toShippingMethodPayload(values: ShippingMethodFormData): ShippingMethodPayload {
  return {
    name: values.name.trim(),
    type: values.type,
    basePrice: values.basePrice,
    requiresDetails: values.requiresDetails,
    isActive: values.isActive,
    ...(values.disclaimer?.trim() ? { disclaimer: values.disclaimer.trim() } : {}),
    locations: values.locations.map((location) => ({
      key: location.key.trim().toLowerCase(),
      label: location.label.trim(),
      extraPrice: location.extraPrice,
    })),
  };
}

export function getShippingTypeLabel(type: ShippingMethod['type']): string {
  return SHIPPING_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? type;
}
