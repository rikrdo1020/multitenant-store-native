import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import api from './api';
import { getShippingErrorMessage, shippingService } from './shipping';

jest.mock('./api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApi = jest.mocked(api);

describe('shippingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN a tenant slug WHEN loading methods SHOULD call shipping endpoint with tenant header', async () => {
    mockedApi.get.mockResolvedValue({ data: { success: true, data: [{ documentId: 'ship_1' }] } });

    const methods = await shippingService.getShippingMethods('demo-store');

    expect(mockedApi.get).toHaveBeenCalledWith('/shipping', {
      headers: { 'x-tenant-id': 'demo-store' },
    });
    expect(methods[0].documentId).toBe('ship_1');
  });

  it('GIVEN an admin tenant slug WHEN loading methods SHOULD call admin shipping endpoint', async () => {
    mockedApi.get.mockResolvedValue({ data: { success: true, data: [{ documentId: 'ship_1', isActive: false }] } });

    const methods = await shippingService.getAdminShippingMethods('demo-store');

    expect(mockedApi.get).toHaveBeenCalledWith('/shipping/admin', {
      headers: { 'x-tenant-id': 'demo-store' },
    });
    expect(methods[0].isActive).toBe(false);
  });

  it('GIVEN a payload WHEN creating method SHOULD post to shipping endpoint', async () => {
    mockedApi.post.mockResolvedValue({ data: { success: true, data: { documentId: 'ship_1' } } });

    await shippingService.createShippingMethod('demo-store', {
      name: 'Local',
      type: 'delivery_zone',
      basePrice: 3,
      isActive: true,
    });

    expect(mockedApi.post).toHaveBeenCalledWith(
      '/shipping',
      { name: 'Local', type: 'delivery_zone', basePrice: 3, isActive: true },
      { headers: { 'x-tenant-id': 'demo-store' } },
    );
  });

  it('GIVEN a method id WHEN updating method SHOULD put payload with tenant header', async () => {
    mockedApi.put.mockResolvedValue({ data: { success: true, data: { documentId: 'ship_1' } } });

    await shippingService.updateShippingMethod('demo-store', 'ship_1', {
      name: 'Local',
      type: 'delivery_zone',
      locations: [{ key: 'city', label: 'Ciudad', extraPrice: 2 }],
    });

    expect(mockedApi.put).toHaveBeenCalledWith(
      '/shipping/ship_1',
      { name: 'Local', type: 'delivery_zone', locations: [{ key: 'city', label: 'Ciudad', extraPrice: 2 }] },
      { headers: { 'x-tenant-id': 'demo-store' } },
    );
  });

  it('GIVEN selected method and location WHEN calculating SHOULD pass query params', async () => {
    mockedApi.get.mockResolvedValue({ data: { success: true, data: { methodId: 'ship_1', locationId: 'loc_1', cost: 5 } } });

    const result = await shippingService.calculateShipping('demo-store', {
      methodId: 'ship_1',
      locationId: 'loc_1',
    });

    expect(mockedApi.get).toHaveBeenCalledWith('/shipping/calculate', {
      headers: { 'x-tenant-id': 'demo-store' },
      params: { methodId: 'ship_1', locationId: 'loc_1' },
    });
    expect(result.cost).toBe(5);
  });

  it('GIVEN a method id WHEN deleting SHOULD call delete with tenant header', async () => {
    mockedApi.delete.mockResolvedValue({ data: null });

    await shippingService.deleteShippingMethod('demo-store', 'ship_1');

    expect(mockedApi.delete).toHaveBeenCalledWith('/shipping/ship_1', {
      headers: { 'x-tenant-id': 'demo-store' },
    });
  });

  it('GIVEN backend shipping errors WHEN mapping messages SHOULD keep admin feedback actionable', () => {
    expect(getShippingErrorMessage({ code: 'SHIPPING_METHOD_NOT_FOUND' }, 'fallback'))
      .toBe('No encontramos ese metodo de envio.');
    expect(getShippingErrorMessage({ code: 'SHIPPING_LOCATION_NOT_FOUND' }, 'fallback'))
      .toBe('No encontramos esa zona o punto de entrega.');
    expect(getShippingErrorMessage({ code: 'FORBIDDEN' }, 'fallback'))
      .toBe('No tienes permiso para gestionar envios.');
    expect(getShippingErrorMessage({ code: 'UNKNOWN' }, 'fallback')).toBe('fallback');
  });
});
