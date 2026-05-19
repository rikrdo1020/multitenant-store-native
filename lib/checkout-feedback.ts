import type { FieldErrors } from 'react-hook-form';
import type { CheckoutFormData } from '@/lib/validators';

const CHECKOUT_FIELD_LABELS: Record<keyof CheckoutFormData, string> = {
  name: 'nombre',
  email: 'email',
  phone: 'telefono',
  notes: 'notas',
  address: 'direccion',
  reference: 'referencia',
  city: 'ciudad',
  department: 'departamento',
};

const CHECKOUT_FIELD_ORDER: (keyof CheckoutFormData)[] = [
  'name',
  'email',
  'phone',
  'address',
  'city',
  'department',
  'notes',
  'reference',
];

export function getCheckoutFormErrorMessage(errors: FieldErrors<CheckoutFormData>) {
  const invalidFields = CHECKOUT_FIELD_ORDER.filter((field) => Boolean(errors[field]));

  if (invalidFields.length === 0) {
    return 'Revisa los datos del checkout antes de crear la orden.';
  }

  if (invalidFields.length === 1) {
    return `Revisa el campo ${CHECKOUT_FIELD_LABELS[invalidFields[0]]}.`;
  }

  const visibleFields = invalidFields
    .slice(0, 3)
    .map((field) => CHECKOUT_FIELD_LABELS[field])
    .join(', ');
  const suffix = invalidFields.length > 3 ? ' y otros datos' : '';

  return `Revisa estos campos: ${visibleFields}${suffix}.`;
}

export function getCheckoutSubmitErrorMessage({
  hasFormErrors,
  shippingError,
}: {
  hasFormErrors: boolean;
  shippingError?: string | null;
}) {
  if (hasFormErrors && shippingError) {
    return 'Completa los campos requeridos y selecciona el envio.';
  }

  if (hasFormErrors) {
    return 'Completa los campos requeridos antes de crear la orden.';
  }

  return shippingError ?? 'No pudimos crear la orden. Intenta nuevamente.';
}
