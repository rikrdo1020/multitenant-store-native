import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { comboService } from './combos';
import api from './api';

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

const mockCombo = {
  documentId: 'combo_1',
  name: 'Combo 2x1',
  description: 'Lleva 2 paga 1',
  discount: 50,
  discountType: 'percentage' as const,
  conditions: [{ productType: 'bebida', minQuantity: 2 }],
  products: [],
};

describe('comboService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN a tenant slug WHEN fetching combos SHOULD call /combos with tenant header', async () => {
    mockedApi.get.mockResolvedValue({
      data: { success: true, data: [mockCombo] },
    });

    const result = await comboService.getCombos('demo-store');

    expect(mockedApi.get).toHaveBeenCalledWith('/combos', {
      headers: { 'x-tenant-id': 'demo-store' },
    });
    expect(result[0].name).toBe('Combo 2x1');
    expect(result[0].discount).toBe(50);
  });

  it('GIVEN create payload WHEN creating combo SHOULD POST and return combo', async () => {
    const payload = {
      name: 'Combo Familiar',
      discount: 20,
      discountType: 'percentage' as const,
      productIds: ['prod_1', 'prod_2'],
    };
    mockedApi.post.mockResolvedValue({
      data: { success: true, data: { documentId: 'combo_2', ...payload, conditions: [], products: [] } },
    });

    const result = await comboService.createCombo('demo-store', payload);

    expect(mockedApi.post).toHaveBeenCalledWith('/combos', payload, {
      headers: { 'x-tenant-id': 'demo-store' },
    });
    expect(result.documentId).toBe('combo_2');
  });

  it('GIVEN update payload WHEN updating combo SHOULD PUT to /combos/:id', async () => {
    const payload = { discount: 30 };
    mockedApi.put.mockResolvedValue({
      data: { success: true, data: { ...mockCombo, discount: 30 } },
    });

    const result = await comboService.updateCombo('demo-store', 'combo_1', payload);

    expect(mockedApi.put).toHaveBeenCalledWith('/combos/combo_1', payload, {
      headers: { 'x-tenant-id': 'demo-store' },
    });
    expect(result.discount).toBe(30);
  });

  it('GIVEN an id WHEN deleting combo SHOULD call DELETE /combos/:id', async () => {
    mockedApi.delete.mockResolvedValue({});

    await comboService.deleteCombo('demo-store', 'combo_1');

    expect(mockedApi.delete).toHaveBeenCalledWith('/combos/combo_1', {
      headers: { 'x-tenant-id': 'demo-store' },
    });
  });

  it('GIVEN API error WHEN fetching combos SHOULD propagate the error', async () => {
    mockedApi.get.mockRejectedValue(new Error('Network error'));

    await expect(comboService.getCombos('demo-store')).rejects.toThrow('Network error');
  });
});
