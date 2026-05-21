import { describe, expect, it } from '@jest/globals';
import {
  getShippingMethodFormValues,
  toShippingMethodPayload,
} from './shipping-method-form';
import type { ShippingMethod } from '@/types';

const inactiveMethod: ShippingMethod = {
  documentId: 'ship_1',
  name: 'Envio pausado',
  type: 'delivery_zone',
  basePrice: 4,
  requiresDetails: true,
  disclaimer: 'Solo dias habiles',
  isActive: false,
  logistics: [],
};

describe('shipping method form helpers', () => {
  it('GIVEN no method WHEN building defaults SHOULD start as active', () => {
    expect(getShippingMethodFormValues().isActive).toBe(true);
  });

  it('GIVEN inactive method WHEN mapping to form SHOULD preserve active state', () => {
    expect(getShippingMethodFormValues(inactiveMethod).isActive).toBe(false);
  });

  it('GIVEN form values WHEN building payload SHOULD include active flag', () => {
    expect(toShippingMethodPayload(getShippingMethodFormValues(inactiveMethod)))
      .toMatchObject({ isActive: false });
  });
});
