# Native App State Management

## Server State — TanStack React Query

All server data goes through React Query hooks. Never fetch directly in components.

Config (`lib/query-client.ts`):
- `staleTime`: 60 seconds
- `refetchOnWindowFocus`: enabled on web, disabled on native
- `networkMode`: 'always' (support offline with retries)

### API Hooks

| Hook | File | API Endpoint |
|------|------|--------------|
| `useTenant(slug)` | `hooks/api/use-tenant.ts` | `GET /store/profile` |
| `useProducts(filters)` | `hooks/api/use-products.ts` | `GET /products` |
| `useProduct(slug)` | `hooks/api/use-product.ts` | `GET /products/:slug` |
| `useCategories()` | `hooks/api/use-categories.ts` | `GET /categories` |
| `useBrands()` | `hooks/api/use-brands.ts` | `GET /brands` |
| `useTags()` | `hooks/api/use-tags.ts` | `GET /tags` |
| `useProductTypes()` | `hooks/api/use-product-types.ts` | `GET /product-types` |
| `useShippingMethods()` | `hooks/api/use-shipping-methods.ts` | `GET /shipping-methods` |
| `useCombos()` | `hooks/api/use-combos.ts` | `GET /combos` |
| `useCreateOrder()` | `hooks/api/use-create-order.ts` | `POST /orders` |
| `useOrder(orderId)` | `hooks/api/use-order.ts` | `GET /orders/:orderId` |
| `useAdminProducts()` | `hooks/api/use-admin-products.ts` | `GET /admin/products` |
| `useAdminOrders()` | `hooks/api/use-admin-orders.ts` | `GET /admin/orders` |
| `useCartPricing(items)` | `hooks/use-cart-pricing.ts` | Local (uses combos + pricing engine) |

### Hook Pattern

```ts
export function useProducts(filters: ProductFilters) {
  const { tenant } = useTenantStore();
  return useQuery({
    queryKey: ['products', tenant?.slug, filters],
    queryFn: () => productService.getProducts(tenant!.slug, filters),
    enabled: !!tenant,
    staleTime: 60_000,
  });
}
```

### Mutation Pattern

```ts
export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { tenant } = useTenantStore();
  return useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', tenant?.slug] });
    },
  });
}
```

## Client State — Zustand

All stores use `persist` middleware with platform-aware storage (`lib/storage.ts`).

### Auth Store (`stores/use-auth-store.ts`)

**Storage**: SecureStore (iOS/Android), localStorage (web)
**Key**: `auth`

```ts
interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  setAccessToken: (token: string) => void;
}
```

### Tenant Store (`stores/use-tenant-store.ts`)

**Storage**: AsyncStorage
**Key**: `active-tenant`

```ts
interface TenantStore {
  tenant: Tenant | null;
  setTenant: (tenant: Tenant | null) => void;
}
```

Switching tenants triggers:
1. Clear cart store for old tenant
2. Clear checkout store
3. Invalidate all product/category queries
4. Navigate to new tenant home

### Cart Store (`stores/use-cart-store.ts`)

**Storage**: AsyncStorage
**Key**: `cart-{tenantId}` (scoped per tenant)

```ts
interface CartStore {
  items: CartItem[];
  addItem: (product: Product, options?: Record<string, string>) => void;
  removeItem: (documentId: string, selectedOptions?: Record<string, string>) => void;
  updateQuantity: (documentId: string, quantity: number, selectedOptions?: Record<string, string>) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
```

Rules:
- `addItem` increments existing item, capped at `product.stock`
- `updateQuantity(id, 0)` → removes item
- `getTotalPrice()` delegates to `calculateCartPricing()` (combo-aware)
- Item key = `documentId` or `documentId:JSON.stringify(selectedOptions)` when variants exist

### Checkout Store (`stores/use-checkout-store.ts`)

**Storage**: AsyncStorage
**Key**: `checkout-{tenantId}` (scoped per tenant)

```ts
interface CheckoutStore {
  customerData: CustomerFormData | null;
  receiverData: ReceiverFormData | null;
  shippingAddress: ShippingAddressData | null;
  selectedMethodId: string | null;
  selectedLocationId: string | null;
  setSelectedMethod: (methodId: string | null) => void;
  clearCheckout: () => void;
}
```

`setSelectedMethod()` automatically resets `selectedLocationId` and `shippingAddress`.

## Pricing Engine (`lib/pricing.ts`)

Combo-aware pricing system. Runs client-side (cart display) and validates server-side (order creation).

```ts
calculateCartPricing(items: CartItem[], combos?: ComboDefinition[]): PricingResult

interface PricingResult {
  total: number;
  originalTotal: number;
  savings: number;
  lines: PricingLine[];
}
```

Algorithm: greedy backtracking search over active combos, finds minimum total price. Caps combo applications at 5 per type. Items without `type` skip combo logic.

This file is shared with the backend (same algorithm, same tests).
