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
