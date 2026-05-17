import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { marketplaceService } from './marketplace';
import api from './api';

jest.mock('./api');

const mockedApi = jest.mocked(api);

const makeStore = (overrides = {}) => ({
  documentId: 'tenant_1',
  slug: 'mi-tienda',
  name: 'Mi Tienda',
  description: 'Descripción de prueba',
  logo: null,
  primaryColor: '#ff0000',
  products: [],
  ...overrides,
});

const makeApiResponse = (stores: ReturnType<typeof makeStore>[], meta = {}) => ({
  data: {
    success: true,
    data: stores,
    meta: { page: 1, pageSize: 20, total: stores.length, totalPages: 1, ...meta },
  },
});

describe('marketplaceService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getStores', () => {
    it('GIVEN successful response SHOULD return stores and meta', async () => {
      const store = makeStore();
      mockedApi.get.mockResolvedValue(makeApiResponse([store]));

      const result = await marketplaceService.getStores();

      expect(result.stores).toHaveLength(1);
      expect(result.stores[0]).toMatchObject({ documentId: 'tenant_1', slug: 'mi-tienda' });
      expect(result.meta.total).toBe(1);
    });

    it('GIVEN default params SHOULD call GET /marketplace/stores with page 1 pageSize 20', async () => {
      mockedApi.get.mockResolvedValue(makeApiResponse([]));

      await marketplaceService.getStores();

      expect(mockedApi.get).toHaveBeenCalledWith('/marketplace/stores', {
        params: { page: 1, pageSize: 20 },
      });
    });

    it('GIVEN custom pagination SHOULD forward params to request', async () => {
      mockedApi.get.mockResolvedValue(makeApiResponse([], { page: 3, pageSize: 5 }));

      await marketplaceService.getStores(3, 5);

      expect(mockedApi.get).toHaveBeenCalledWith('/marketplace/stores', {
        params: { page: 3, pageSize: 5 },
      });
    });

    it('GIVEN empty stores SHOULD return empty array', async () => {
      mockedApi.get.mockResolvedValue(makeApiResponse([]));

      const result = await marketplaceService.getStores();

      expect(result.stores).toHaveLength(0);
      expect(result.meta.total).toBe(0);
    });

    it('GIVEN store with featured products SHOULD include products in result', async () => {
      const store = makeStore({
        products: [
          { documentId: 'prod_1', name: 'Producto A', slug: 'producto-a', price: 29.99, images: ['https://example.com/img.jpg'] },
        ],
      });
      mockedApi.get.mockResolvedValue(makeApiResponse([store]));

      const result = await marketplaceService.getStores();

      expect(result.stores[0].products).toHaveLength(1);
      expect(result.stores[0].products[0].price).toBe(29.99);
    });

    it('GIVEN multiple stores SHOULD return all of them', async () => {
      mockedApi.get.mockResolvedValue(
        makeApiResponse([
          makeStore({ documentId: 't1', slug: 'store-a' }),
          makeStore({ documentId: 't2', slug: 'store-b' }),
        ], { total: 2 }),
      );

      const result = await marketplaceService.getStores();

      expect(result.stores).toHaveLength(2);
      expect(result.stores[1].slug).toBe('store-b');
    });

    it('GIVEN API error SHOULD propagate the rejection', async () => {
      mockedApi.get.mockRejectedValue(new Error('Network error'));

      await expect(marketplaceService.getStores()).rejects.toThrow('Network error');
    });
  });
});
