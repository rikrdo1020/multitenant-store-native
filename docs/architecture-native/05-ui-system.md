# Native App UI System

## Design System

Built on top of **React Native Reusables** + **NativeWind** (Tailwind CSS for React Native).

### Color Tokens

```ts
// lib/theme.ts
export const colors = {
  background: '#ffffff',
  foreground: '#0a0a0a',
  primary: 'var(--tenant-primary, #000000)',   // Dynamic per tenant
  secondary: '#f5f5f5',
  muted: '#f5f5f5',
  mutedForeground: '#737373',
  border: '#e5e5e5',
  destructive: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
};
```

Tenants can customize `primaryColor` which is applied via CSS variables on web and `ThemeProvider` on native.

### Typography

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `h1` | 32px / 2rem | 700 | Screen titles |
| `h2` | 24px / 1.5rem | 600 | Section headers |
| `h3` | 20px / 1.25rem | 600 | Card titles |
| `body` | 16px / 1rem | 400 | Paragraphs |
| `small` | 14px / 0.875rem | 400 | Captions, metadata |
| `xs` | 12px / 0.75rem | 400 | Badges, labels |

Font: **Inter** (loaded via `expo-font`).

### Spacing Scale

Based on Tailwind defaults: 4px base unit (1 = 4px, 2 = 8px, 4 = 16px, etc.)

## Component Architecture

### Primitive Components (`components/ui/`)

| Component | Props | Notes |
|-----------|-------|-------|
| `Button` | variant, size, disabled, loading, onPress | Solid, outline, ghost variants |
| `Input` | label, error, iconLeft, iconRight | Built on TextInput |
| `Select` | options, value, onValueChange | Native picker on mobile, dropdown on web |
| `Card` | className, children | Consistent shadow/border/radius |
| `Badge` | variant | default, secondary, destructive, outline |
| `Avatar` | src, fallback | Image with fallback initials |
| `Skeleton` | className | Loading placeholder |
| `Dialog` | open, onClose, title | Modal on native, dialog on web |
| `Toast` | variant, message | Bottom sheet on native, toast on web |

### Store Components (`components/store/`)

```tsx
// ProductCard
<ProductCard
  product={product}
  onPress={() => router.push(`/${tenantSlug}/products/${product.slug}`)}
  onAddToCart={() => cartStore.addItem(product)}
/>

// CartItemRow
<CartItemRow
  item={cartItem}
  onUpdateQty={(qty) => cartStore.updateQuantity(item.documentId, qty)}
  onRemove={() => cartStore.removeItem(item.documentId)}
/>
```

### Admin Components (`components/admin/`)

```tsx
// DataTable
<DataTable
  data={products}
  columns={columns}
  onRowPress={(row) => router.push(`/admin/products/${row.documentId}`)}
/>

// StatCard
<StatCard title="Ventas Hoy" value={`$${stats.todayRevenue}`} trend="+12%" />
```

## Responsive Web Support

Expo Router + NativeWind supports responsive design via Tailwind breakpoints:

```tsx
<View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {products.map(p => <ProductCard key={p.documentId} product={p} />)}
</View>
```

### Platform-Specific Behavior

```tsx
import { Platform } from 'react-native';

// Conditional rendering
{Platform.OS === 'web' ? <WebNav /> : <MobileNav />}

// NativeWind responsive
<Text className="text-base md:text-lg lg:text-xl">Title</Text>
```

## Form Components

All forms use React Hook Form + Zod + custom UI components.

```tsx
const schema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(7, 'Teléfono inválido'),
});

export function CustomerForm() {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <View className="gap-4">
      <FormField control={control} name="name" label="Nombre" />
      <FormField control={control} name="email" label="Email" />
      <FormField control={control} name="phone" label="Teléfono" />
      <Button onPress={handleSubmit(onSubmit)}>Continuar</Button>
    </View>
  );
}
```

## Theming

```tsx
// ThemeProvider applies tenant primary color
<ThemeProvider primaryColor={tenant?.primaryColor}>
  {children}
</ThemeProvider>
```

On native: uses React Native's `Appearance` API + custom color mapping.
On web: injects CSS custom properties.

## Dark Mode

Planned but not required for MVP. ThemeProvider is designed to support `colorScheme` toggling.
