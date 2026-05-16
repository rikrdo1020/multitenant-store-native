import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = 'USD'): string {
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency,
  }).format(price);
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }
  return phone;
}

export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function generateDKU(name?: string): string {
  const prefix = name ? slugify(name).slice(0, 6).toUpperCase() : 'PROD';
  const random = Math.floor(1000 + Math.random() * 9000);
  const timestamp = Date.now().toString(36).slice(-3).toUpperCase();
  return `${prefix}-${random}${timestamp}`;
}

export function sanitizeDecimalInput(text: string): string {
  let cleaned = text.replace(/[^0-9.,]/g, '');
  const firstDot = cleaned.indexOf('.');
  const firstComma = cleaned.indexOf(',');
  if (firstDot !== -1) {
    cleaned = cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/[.,]/g, '');
  }
  if (firstComma !== -1) {
    cleaned = cleaned.slice(0, firstComma + 1) + cleaned.slice(firstComma + 1).replace(/[.,]/g, '');
  }
  return cleaned;
}

export function sanitizeIntegerInput(text: string): string {
  return text.replace(/[^0-9]/g, '');
}

export function generateItemKey(
  documentId: string,
  selectedOptions?: Record<string, string>
): string {
  if (!selectedOptions || Object.keys(selectedOptions).length === 0) {
    return documentId;
  }

  const sortedOptions = Object.keys(selectedOptions)
    .sort()
    .reduce<Record<string, string>>((acc, key) => {
      acc[key] = selectedOptions[key];
      return acc;
    }, {});

  return `${documentId}:${JSON.stringify(sortedOptions)}`;
}
