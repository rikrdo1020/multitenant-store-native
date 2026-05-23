# Native App Business Rules

## Tenant Selection (NR-01)

- On first open, user sees a tenant selector or can enter a store slug/subdomain.
- Selected tenant is persisted in `useTenantStore`.
- All subsequent API calls include `x-tenant-id: {tenantSlug}` header.
- Cart, checkout, and catalog data are scoped to the active tenant.
- Switching tenants clears the cart and checkout stores for the old tenant.

## Storefront (NR-02)

### Store Profile
- Fetched via `GET /store/profile` using tenant slug.
- Shows tenant name, logo, description, primary color.
- Primary color dynamically themes the UI.

### Home Screen
- Featured products (`isFeatured = true`) ordered by `featuredOrder ASC`.
- Category grid.
- Promotional banners (future).

### Product Catalog
- Infinite scroll pagination (not page numbers).
- Filters: category, brand, type, price range, search.
- Sort: price asc/desc, newest.
- Product cards show: image, name, price, discount badge, stock status.

### Product Detail
- Image carousel/gallery.
- Variant selector (if `options` defined).
- Add to cart button (disabled if out of stock).
- Related products (same category, future).

## Cart (NR-03)

- Persisted in AsyncStorage, scoped by `tenantId`.
- Cart icon in tab bar shows item count badge.
- Cart screen shows item list with quantity steppers.
- Swipe to remove (native), delete button (web).
- Bottom summary: subtotal, shipping (if method selected), total.
- "Proceed to checkout" button.

### Cart Rules
- `addItem` on existing: quantity +1, capped at `product.stock`.
- `updateQuantity(id, 0)`: removes item.
- Price used: `discountPrice ?? price`.
- Pricing routed through `calculateCartPricing()` — combo-aware.
- Item key = `documentId` or `documentId:JSON.stringify(selectedOptions)` if variants.

## Checkout (NR-04)

Prerequisites:
1. Cart not empty (redirect to catalog if empty).
2. Valid customer data.
3. Valid shipping method selected.

### Customer Form
- `name` (min 3 chars)
- `email` (valid format)
- `phone` (min 7 chars, formatted display)
- `notes` (optional)

### Shipping Selection
- List available shipping methods for tenant.
- `pickup_point`: show location list, no address needed.
- `delivery_zone` / `third_party`: show address input + reference.
- `setSelectedMethod()` resets location and address automatically.
- Shipping cost preview updates when method/location changes.

### Payment
- Uses tenant's configured provider (Stripe by default).
- Stripe: Payment Sheet (native) or Payment Element (web).
- On success: clear cart + checkout store, navigate to success screen.
- On failure: show error, allow retry.

### Order Success
- Shows order ID, summary, and "Continue shopping" button.
- Option to copy order ID or share via native share sheet.

## Order Tracking (NR-05)

- Guest users can track orders via tenant + order ID + view token.
- Authenticated customers see order history in Account tab.
- Order detail shows: items, totals, status timeline, shipping info.
- Status colors: `pending` = yellow, `paid` = green, `failed` = red, `cancelled` = gray.

## Admin Panel (NR-06)

### Dashboard
- Total orders (today, week, month).
- Revenue summary.
- Low stock alerts.
- Recent orders list.

### Products
- CRUD with image upload (camera/gallery on native, file picker on web).
- Stock management.
- Variant options editor.
- Bulk actions (future).

### Orders
- List with status filters.
- Detail view with customer info, items, shipping.
- Mark as dispatched toggle.
- Status update (manual override).

### Settings
- Tenant profile (name, logo, colors, description).
- Payment provider configuration.
- Shipping methods.
- Low stock threshold.
- Member management (invite, roles, remove).

## Store Owner Onboarding (NR-07)

1. User registers/logs in.
2. If no tenant, prompted to create store.
3. Enter store name → auto-generate slug.
4. Upload logo (optional).
5. Select primary color.
6. Configure payment provider (or skip for later).
7. Store is created, redirect to admin dashboard.

## Notifications (Future)

- Push notifications for new orders (admin).
- Push notifications for order status changes (customer).
- Uses Expo Notifications API.

## Currencies & Taxes

- Display currency from `TenantSetting.currency` (default USD).
- Price format: `$X,XXX.00`
- Tax: shown as separate line if `taxRate > 0`.
