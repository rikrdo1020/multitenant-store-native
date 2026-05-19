import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import api from './api';
import { customerService } from './customers';

jest.mock('./api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApi = jest.mocked(api);
const TENANT = 'demo-store';

describe('customerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN tenant slug WHEN fetching current customer SHOULD call /customers/me with tenant header', async () => {
    mockedApi.get.mockResolvedValue({
      data: {
        success: true,
        data: { documentId: 'cus_1', name: 'Buyer', email: 'buyer@example.com', phone: '6000-0000' },
      },
    });

    const result = await customerService.getMe(TENANT);

    expect(mockedApi.get).toHaveBeenCalledWith('/customers/me', {
      headers: { 'x-tenant-id': TENANT },
    });
    expect(result.email).toBe('buyer@example.com');
  });

  it('GIVEN profile payload WHEN updating current customer SHOULD PUT /customers/me', async () => {
    const payload = { name: 'Buyer Updated', phone: '6111-1111' };
    mockedApi.put.mockResolvedValue({
      data: {
        success: true,
        data: { documentId: 'cus_1', email: 'buyer@example.com', ...payload },
      },
    });

    const result = await customerService.updateMe(TENANT, payload);

    expect(mockedApi.put).toHaveBeenCalledWith('/customers/me', payload, {
      headers: { 'x-tenant-id': TENANT },
    });
    expect(result.name).toBe('Buyer Updated');
  });

  it('GIVEN address payload WHEN creating address SHOULD POST current customer address endpoint', async () => {
    const payload = {
      name: 'Casa',
      address: 'Street 1',
      city: 'Panama',
      department: 'Panama',
      phone: '6000-0000',
      isDefault: true,
    };
    mockedApi.post.mockResolvedValue({
      data: { success: true, data: { documentId: 'addr_1', ...payload } },
    });

    const result = await customerService.createAddress(TENANT, payload);

    expect(mockedApi.post).toHaveBeenCalledWith('/customers/me/addresses', payload, {
      headers: { 'x-tenant-id': TENANT },
    });
    expect(result.isDefault).toBe(true);
  });

  it('GIVEN address id WHEN deleting address SHOULD DELETE current customer address endpoint', async () => {
    mockedApi.delete.mockResolvedValue({});

    await customerService.deleteAddress(TENANT, 'addr_1');

    expect(mockedApi.delete).toHaveBeenCalledWith('/customers/me/addresses/addr_1', {
      headers: { 'x-tenant-id': TENANT },
    });
  });
});
