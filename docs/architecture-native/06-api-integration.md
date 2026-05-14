# Native App API Integration

## API Client (`services/api.ts`)

Axios instance with interceptors for auth, tenant headers, and error handling.

```ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## Request Interceptor

```ts
api.interceptors.request.use(async (config) => {
  const token = await getAccessToken(); // from SecureStore / localStorage
  const tenant = getActiveTenant();     // from AsyncStorage

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (tenant) {
    config.headers['x-tenant-id'] = tenant.slug;
  }

  return config;
});
```

## Response Interceptor

```ts
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token expired — try refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed — logout user
        logout();
        return Promise.reject(refreshError);
      }
    }

    // Server error
    if (error.response?.status >= 500) {
      showToast('Error del servidor. Intenta más tarde.', 'destructive');
    }

    return Promise.reject(normalizeError(error));
  }
);
```

## Error Normalization

All API errors are normalized to a consistent shape:

```ts
interface ApiError {
  code: string;      // UPPER_SNAKE_CASE error code
  message: string;   // Human-readable (Spanish)
  statusCode: number;
  details?: Array<{ field: string; message: string }>;
}
```

## Service Functions

```ts
// services/products.ts
export const productService = {
  getProducts: (tenantSlug: string, filters: ProductFilters) =>
    api.get('/products', { params: { ...filters, tenant: tenantSlug } }).then(r => r.data),

  getProduct: (tenantSlug: string, slug: string) =>
    api.get(`/products/${slug}`, { headers: { 'x-tenant-id': tenantSlug } }).then(r => r.data),
};

// services/orders.ts
export const orderService = {
  createOrder: (data: CreateOrderPayload) =>
    api.post('/orders', data).then(r => r.data),

  getOrder: (orderId: string) =>
    api.get(`/orders/${orderId}`).then(r => r.data),
};
```

## Offline Support

React Query provides built-in offline support:
- Queries retry automatically when connection returns
- Mutations can be paused and resumed
- `networkMode: 'always'` allows reading stale cache while offline

### Optimistic Updates

```ts
const mutation = useMutation({
  mutationFn: updateProduct,
  onMutate: async (newProduct) => {
    await queryClient.cancelQueries({ queryKey: ['products'] });
    const previous = queryClient.getQueryData(['products']);
    queryClient.setQueryData(['products'], (old) => updateInList(old, newProduct));
    return { previous };
  },
  onError: (err, newProduct, context) => {
    queryClient.setQueryData(['products'], context?.previous);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  },
});
```

## Image Upload

```ts
// services/upload.ts
export async function uploadImage(uri: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', {
    uri,
    name: 'image.jpg',
    type: 'image/jpeg',
  } as any);

  const response = await api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data.url;
}
```

## Type Safety

All service functions return typed responses:

```ts
interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
}

// Usage
const { data } = await productService.getProducts(tenantSlug, filters);
// data is typed as ApiResponse<Product[]>
```

## Environment-Based URLs

```ts
// lib/constants.ts
export const API_URL = __DEV__
  ? 'http://localhost:3001/api/v1'
  : process.env.EXPO_PUBLIC_API_URL!;
```

On native development, use your machine's local IP instead of `localhost`:
```ts
const DEV_URL = 'http://192.168.1.X:3001/api/v1'; // your machine IP
```
