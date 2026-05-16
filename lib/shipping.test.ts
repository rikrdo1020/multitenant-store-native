import { describe, expect, it } from '@jest/globals';
import {
  getSelectedShippingLocation,
  getShippingBasePrice,
  getShippingCost,
  getShippingLocationPrice,
  requiresShippingLocation,
} from './shipping';
import type { ShippingMethod } from '@/types';

const shippingMethod: ShippingMethod = {
  documentId: 'ship_001',
  name: 'Envio local',
  type: 'delivery_zone',
  basePrice: 4.5,
  logistics: [
    {
      documentId: 'loc_001',
      key: 'city',
      label: 'Ciudad',
      extraPrice: 1.25,
    },
  ],
};

describe('shipping helpers', () => {
  it('GIVEN a shipping method with a base price WHEN reading base price SHOULD return the numeric value', () => {
    expect(getShippingBasePrice(shippingMethod)).toBe(4.5);
  });

  it('GIVEN a shipping location WHEN reading extra price SHOULD return the numeric value', () => {
    expect(getShippingLocationPrice(shippingMethod.logistics?.[0])).toBe(1.25);
  });

  it('GIVEN a selected location WHEN calculating shipping cost SHOULD include base and extra price', () => {
    expect(getShippingCost(shippingMethod, 'loc_001')).toBe(5.75);
  });

  it('GIVEN missing money values WHEN calculating shipping cost SHOULD treat them as zero', () => {
    expect(getShippingCost({ ...shippingMethod, basePrice: null, logistics: [] })).toBe(0);
  });

  it('GIVEN logistics options WHEN checking requirement SHOULD require a location selection', () => {
    expect(requiresShippingLocation(shippingMethod)).toBe(true);
    expect(getSelectedShippingLocation(shippingMethod, 'loc_001')?.label).toBe('Ciudad');
  });
});
