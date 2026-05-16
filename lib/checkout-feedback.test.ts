import { describe, expect, it } from '@jest/globals';
import type { FieldErrors } from 'react-hook-form';
import {
  getCheckoutFormErrorMessage,
  getCheckoutSubmitErrorMessage,
} from './checkout-feedback';
import type { CheckoutFormData } from './validators';

describe('checkout feedback helpers', () => {
  it('GIVEN multiple invalid checkout fields WHEN formatting feedback SHOULD return a compact summary', () => {
    const errors = {
      name: { type: 'too_small' },
      email: { type: 'invalid_string' },
      phone: { type: 'too_small' },
      address: { type: 'too_small' },
    } as FieldErrors<CheckoutFormData>;

    expect(getCheckoutFormErrorMessage(errors)).toBe(
      'Revisa estos campos: nombre, email, telefono y otros datos.',
    );
  });

  it('GIVEN form and shipping errors WHEN formatting submit feedback SHOULD mention both blockers', () => {
    expect(
      getCheckoutSubmitErrorMessage({
        hasFormErrors: true,
        shippingError: 'Selecciona un metodo de envio.',
      }),
    ).toBe('Completa los campos requeridos y selecciona el envio.');
  });

  it('GIVEN only a shipping error WHEN formatting submit feedback SHOULD keep the specific message', () => {
    expect(
      getCheckoutSubmitErrorMessage({
        hasFormErrors: false,
        shippingError: 'Selecciona una zona o punto de entrega.',
      }),
    ).toBe('Selecciona una zona o punto de entrega.');
  });
});
