# Native App Navigation

## Router

**Expo Router v4** — file-based routing that works on iOS, Android, and Web.

## Route Structure

```
app/
├── _layout.tsx                    # Root layout: providers, auth gate, tenant resolver
├── index.tsx                      # Entry point: redirect to tenant selector or active tenant
├── (auth)/
│   ├── _layout.tsx                # Auth stack navigator (no header on native)
│   ├── login.tsx
│   ├── register.tsx
│   └── forgot-password.tsx
├── (storefront)/
│   ├── _layout.tsx                # Tab navigator (Home | Catalog | Cart | Account)
│   └── [tenantSlug]/
│       ├── _layout.tsx            # Stack navigator for this tenant
│       ├── index.tsx              # Store home (hero, featured, categories)
│       ├── products.tsx           # Catalog list with filters
│       ├── products/
│       │   └── [slug].tsx         # Product detail
│       ├── categories/
│       │   └── [slug].tsx         # Products filtered by category
│       ├── brands/
│       │   └── [slug].tsx         # Products filtered by brand
│       ├── cart.tsx               # Shopping cart
│       └── checkout/
│           ├── _layout.tsx        # Checkout stack (native) or steps (web)
│           ├── index.tsx          # Customer info + shipping
│           └── payment.tsx        # Payment screen
├── (admin)/
│   ├── _layout.tsx                # Drawer navigator (native) / sidebar (web)
│   ├── dashboard.tsx              # Stats overview
│   ├── products/
│   │   ├── index.tsx              # Product list
│   │   └── [id].tsx               # Product edit/create
│   ├── orders/
│   │   ├── index.tsx              # Order list
│   │   └── [id].tsx               # Order detail
│   ├── categories.tsx
│   ├── brands.tsx
│   ├── tags.tsx
│   ├── product-types.tsx
│   ├── shipping-methods.tsx
│   ├── combos.tsx
│   ├── customers.tsx
│   ├── settings.tsx
│   └── members.tsx
└── (owner)/
    ├── _layout.tsx                # Stack navigator
    ├── create-store.tsx           # Onboarding: create first tenant
    └── manage-store.tsx           # Edit tenant profile, payment config
```

## Navigation Patterns

### Root Layout (`app/_layout.tsx`)

```tsx
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TenantProvider>
          <ThemeProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(storefront)" />
              <Stack.Screen name="(admin)" />
              <Stack.Screen name="(owner)" />
            </Stack>
          </ThemeProvider>
        </TenantProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

### Auth Gate

The root layout checks auth state:
- No user → redirect to `/(auth)/login`
- User with no tenant and not admin → redirect to `/(owner)/create-store`
- User with tenant → redirect to active storefront or admin panel

### Storefront Tabs (`app/(storefront)/_layout.tsx`)

```tsx
<Tabs>
  <Tabs.Screen name="[tenantSlug]/index" options={{ title: 'Inicio', tabBarIcon: Home }} />
  <Tabs.Screen name="[tenantSlug]/products" options={{ title: 'Catálogo', tabBarIcon: Search }} />
  <Tabs.Screen name="[tenantSlug]/cart" options={{ title: 'Carrito', tabBarIcon: ShoppingCart }} />
  <Tabs.Screen name="[tenantSlug]/account" options={{ title: 'Cuenta', tabBarIcon: User }} />
</Tabs>
```

On **web**: tabs can be rendered as a top navbar or sidebar depending on screen size.

### Admin Drawer (`app/(admin)/_layout.tsx`)

```tsx
<Drawer>
  <Drawer.Screen name="dashboard" />
  <Drawer.Screen name="products/index" />
  <Drawer.Screen name="orders/index" />
  {/* ... */}
</Drawer>
```

On **web**: drawer becomes a fixed sidebar.

## Deep Linking

Expo Router handles deep links automatically.

```typescript
// app.json / app.config.ts
{
  "scheme": "multitenant",
  "android": {
    "intentFilters": [
      {
        "action": "VIEW",
        "data": [{ "scheme": "https", "host": "*.multitenant.app" }],
        "category": ["BROWSABLE", "DEFAULT"]
      }
    ]
  }
}
```

### Deep Link Routes

| Link | Screen |
|------|--------|
| `multitenant://store/{tenantSlug}` | Store home |
| `multitenant://store/{tenantSlug}/products/{slug}` | Product detail |
| `multitenant://store/{tenantSlug}/checkout/confirmation?orderId=XXX&viewToken=YYY` | Order confirmation |
| `multitenant://admin/orders/{id}` | Admin order detail |
| `https://{tenantSlug}.multitenant.app/products/{slug}` | Web product detail |

## Web Compatibility

- Expo Router renders routes as URL paths on web.
- `usePathname()`, `useRouter()`, `useLocalSearchParams()` work on all platforms.
- Platform-specific layouts via `_layout.web.tsx` and `_layout.native.tsx` when needed.
- Web uses standard browser navigation (back button, URL bar).

## Tenant Resolution in Navigation

1. User selects or creates a store
2. `tenantSlug` is saved to `useTenantStore`
3. All storefront routes include `[tenantSlug]` param
4. API calls include `x-tenant-id: {tenantSlug}` header
5. Switching tenants navigates to the new tenant's home and clears tenant-scoped stores
