# Native App Code Conventions

## Language

- UI text: **Spanish** (all user-facing strings)
- Code: **English** (variables, functions, types, component names)
- Comments: **English**

## File Conventions

| Location | Rule |
|----------|------|
| `app/` | Routes only. No business logic. Delegate to components/hooks. |
| `components/ui/` | Primitive UI — no app-specific logic. Reusable across projects. |
| `components/store/` | Storefront-specific components. |
| `components/admin/` | Admin panel components. |
| `components/forms/` | RHF + Zod + UI field wrappers. |
| `hooks/api/use-*.ts` | One React Query hook per API entity. |
| `hooks/use-*.ts` | Other custom hooks. |
| `stores/use-*-store.ts` | Zustand stores, one per domain. |
| `services/*.ts` | API service modules, one per domain. |
| `lib/*.ts` | Utilities, constants, validators, pricing engine. |
| `types/index.ts` | All domain TypeScript interfaces. |

## Component Pattern

```tsx
// Components are presentational. Data via props or hooks.
export function ProductCard({ product, onPress }: ProductCardProps) {
  return (
    <Card onPress={onPress}>
      <Image source={{ uri: product.images[0] }} className="w-full h-48" />
      <View className="p-3">
        <Text className="font-semibold text-lg">{product.name}</Text>
        <Text className="text-primary font-bold">${product.price}</Text>
      </View>
    </Card>
  );
}
```

Rules:
- If component > ~80 lines: extract logic to a hook or sub-components.
- Never fetch data directly in components (use hooks).
- Never access Zustand stores directly in deep components (pass via props or use hooks).

## Form Pattern

```tsx
const schema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(7, 'Teléfono inválido'),
});

type FormData = z.infer<typeof schema>;

export function CustomerForm({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  const { control, handleSubmit } = useForm<FormData>({
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

Never manage form state with `useState`.

## Data Fetching Pattern

```tsx
// hook
export function useProducts(filters: ProductFilters) {
  const { tenant } = useTenantStore();
  return useQuery({
    queryKey: ['products', tenant?.slug, filters],
    queryFn: () => productService.getProducts(tenant!.slug, filters),
    enabled: !!tenant,
    staleTime: 60_000,
  });
}

// component
export function ProductList() {
  const [filters, setFilters] = useState<ProductFilters>({});
  const { data, isLoading, error } = useProducts(filters);

  if (isLoading) return <ProductListSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <FlatList
      data={data?.data}
      renderItem={({ item }) => <ProductCard product={item} />}
    />
  );
}
```

## Mutations Pattern

```tsx
const mutation = useMutation({
  mutationFn: createProduct,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
    showToast('Producto creado', 'success');
    router.back();
  },
  onError: (error) => {
    showToast(error.message, 'destructive');
  },
});
```

## Platform-Specific Code

```tsx
import { Platform } from 'react-native';

// Conditional rendering
{Platform.OS === 'ios' && <IOSpecificThing />}

// Platform-specific files
// Button.native.tsx — used on iOS/Android
// Button.web.tsx — used on web
// Button.tsx — fallback
```

## Price Format

```ts
// lib/utils.ts
export function formatPrice(price: number, currency = 'USD'): string {
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency,
  }).format(price);
}

// Usage
<Text>{formatPrice(product.price)}</Text> // "$ 25.00"
```

## Phone Format

Display: `+507 XXXX-XXXX` (Panama default). Storage: raw digits.

## Cart Item Identity

Items with variant options use composite key: `documentId:JSON.stringify(selectedOptions)`. Items without options use `documentId` alone.

## Document ID Convention

Backend `id` field is aliased to `documentId` in API responses. Use `documentId` in all UI code.

## AsyncStorage Keys

Prefix all keys with app identifier to avoid collisions:
```ts
const CART_KEY = (tenantId: string) => `mt:cart:${tenantId}`;
const AUTH_KEY = 'mt:auth';
const TENANT_KEY = 'mt:active-tenant';
```

## Loading States

- Always show skeletons or spinners while data loads.
- Use `isLoading` (initial load) vs `isFetching` (background refetch) appropriately.
- Buttons show loading spinner when mutation is pending.

## Error Handling

- API errors: show toast with `error.message`.
- Network errors: show retry button.
- 401 errors: redirect to login.
- Validation errors: show inline field errors.

## Navigation

- Use `router.push()` for forward navigation.
- Use `router.back()` for going back.
- Use `router.replace()` for auth redirects (prevents back-button to login).
- Always pass typed params via URL search params or route params.
