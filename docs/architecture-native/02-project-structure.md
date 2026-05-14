# Native App Project Structure

## Directory Rules

### `app/` — Routes Only

Expo Router uses the file system as the routing table.

- **Convention**: Files in `app/` are routes. Do NOT put business logic here.
- **Route groups** `(auth)`, `(storefront)`, `(admin)`, `(owner)` define layout boundaries.
- **Dynamic routes**: `[slug].tsx`, `[tenantSlug]/index.tsx`
- **Layouts**: `_layout.tsx` files define navigation containers (tabs, stack, drawer).

### `components/` — UI Components

| Subdirectory | Purpose |
|-------------|---------|
| `components/ui/` | Primitive UI components. Button, Input, Card, Text, Badge, etc. Platform-agnostic when possible. |
| `components/store/` | Storefront-specific: ProductCard, CartItemRow, CategoryGrid, etc. |
| `components/admin/` | Admin panel: DataTable, StatCard, OrderStatusBadge, etc. |
| `components/forms/` | Form field wrappers combining RHF + Zod + UI components. |
| `components/shared/` | Cross-cutting: ScreenWrapper, LoadingScreen, ErrorBoundary, EmptyState. |

### `hooks/` — Custom Hooks

| Pattern | Example |
|---------|---------|
| `hooks/api/use-products.ts` | React Query hook for fetching products |
| `hooks/api/use-orders.ts` | React Query hook for orders |
| `hooks/use-cart-pricing.ts` | Derived state from Zustand + pricing engine |
| `hooks/use-tenant.ts` | Active tenant resolution |
| `hooks/use-platform.ts` | Detect web vs native |

### `stores/` — Zustand Stores

| Store | Persistence | Key |
|-------|-------------|-----|
| `useAuthStore` | SecureStore (native) / localStorage (web) | `auth` |
| `useCartStore` | AsyncStorage | `cart-{tenantId}` |
| `useCheckoutStore` | AsyncStorage | `checkout-{tenantId}` |
| `useTenantStore` | AsyncStorage | `active-tenant` |

All stores use `persist` middleware. Cart and checkout are scoped by `tenantId` so switching stores clears/isolates cart data.

### `services/` — API Integration

| File | Purpose |
|------|---------|
| `services/api.ts` | Axios instance with interceptors, base URL, tenant header |
| `services/auth.ts` | Login, register, refresh, logout functions |
| `services/tenant.ts` | Fetch tenant profile, create store |
| `services/products.ts` | Product API calls |
| `services/orders.ts` | Order creation, status polling |
| `services/payments.ts` | Stripe integration, payment confirmation |
| `services/upload.ts` | Image upload to backend |

### `lib/` — Utilities

| File | Purpose |
|------|---------|
| `lib/constants.ts` | API URLs, app config, limits |
| `lib/utils.ts` | Formatters (price, date, phone), cn() helper |
| `lib/pricing.ts` | `calculateCartPricing()` — combo engine (same algorithm as backend) |
| `lib/validators.ts` | Zod schemas for forms |
| `lib/storage.ts` | Abstraction over AsyncStorage / SecureStore / localStorage |

### `types/` — Domain Types

```ts
// types/index.ts
export interface Product {
  documentId: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  // ...
}

export interface CartItem {
  documentId: string;
  name: string;
  price: number;
  quantity: number;
  selectedOptions?: Record<string, string>;
  image?: string;
}

export interface Tenant {
  documentId: string;
  slug: string;
  name: string;
  logo?: string;
  primaryColor?: string;
}
```

## File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Route | `*.tsx` in `app/` | `app/(storefront)/[tenantSlug]/products.tsx` |
| Layout | `_layout.tsx` | `app/(admin)/_layout.tsx` |
| Component | `PascalCase.tsx` | `components/store/ProductCard.tsx` |
| Hook | `use-kebab-case.ts` | `hooks/api/use-products.ts` |
| Store | `use-kebab-case-store.ts` | `stores/use-cart-store.ts` |
| Service | `kebab-case.ts` | `services/products.ts` |
| Type | `PascalCase` in `types/` | `types/index.ts` |

## Platform-Specific Code

Use `.native.tsx` and `.web.tsx` extensions for platform-specific implementations:

```
components/ui/
  DatePicker.tsx           # Shared wrapper
  DatePicker.native.tsx    # Native implementation
  DatePicker.web.tsx       # Web implementation
```

Expo Router automatically picks the correct file based on platform.

## Environment Variables

```env
# API
EXPO_PUBLIC_API_URL=http://localhost:3001/api/v1

# Stripe
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# App
EXPO_PUBLIC_APP_NAME=MultiTenant Store
```

> All `EXPO_PUBLIC_*` vars are embedded at build time. Never put secrets here.
