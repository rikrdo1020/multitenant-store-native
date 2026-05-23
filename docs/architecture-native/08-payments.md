# Native App Payments

## Architecture

Payment flow is **provider-agnostic** at the UI level. The active provider is determined by the tenant's configuration (`tenant.provider`).

```
CheckoutScreen
    │
    ├── StripeProvider (tenant.provider === 'stripe')
    │      └── @stripe/stripe-react-native
    │
    ├── YappyProvider (tenant.provider === 'yappy')
    │      └── In-App Browser / Deep Link
    │
    └── MockProvider (PAYMENT_MOCK === true)
           └── Simulated button
```

## Stripe Flow (Default)

### 1. Create Order

```ts
const { data } = await orderService.createOrder({
  items: cartItems,
  customerData,
  shippingData,
  shippingMethodId,
});
// Returns: order with orderId + viewToken
```

### 2. Initialize Payment Sheet (Native)

```tsx
import { useStripe } from '@stripe/stripe-react-native';

export function PaymentScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const initializePayment = async () => {
    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: tenant.name,
      allowsDelayedPaymentMethods: false,
    });
  };

  const handlePayment = async () => {
    const { error } = await presentPaymentSheet();
    if (!error) {
      // Payment successful
      router.push(
        `/${tenantSlug}/checkout/confirmation?orderId=${order.orderId}&viewToken=${order.viewToken}`
      );
    }
  };
}
```

### 3. Web Stripe Flow

On web, use `@stripe/react-stripe-js` + `@stripe/stripe-js`:

```tsx
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

<Elements stripe={stripePromise} options={{ clientSecret }}>
  <CheckoutForm />
</Elements>
```

## Yappy Flow (When Implemented)

```
1. Create order → backend returns { transactionId, token, paymentUrl }
2. Open In-App Browser (expo-web-browser) with paymentUrl
3. User completes payment in Yappy
4. Yappy redirects to app://checkout/confirmation?orderId=XXX&viewToken=YYY
5. App polls order status or receives deep link
6. Close browser, show success screen
```

```ts
import * as WebBrowser from 'expo-web-browser';

const result = await WebBrowser.openAuthSessionAsync(
  paymentUrl,
  'multitenant://checkout/confirmation'
);

if (result.type === 'success') {
  // Parse URL params, verify payment
}
```

## Payment Mock Mode

For development when payment providers are unavailable:

```env
EXPO_PUBLIC_PAYMENT_MOCK=true
```

Behavior:
- Order creation is real
- Payment UI shows a simulated "Pagar (Mock)" button
- Tapping it auto-completes payment after 1 second
- Navigates to success screen
- **Never enable in production**

```tsx
{isMockMode && (
  <View className="bg-yellow-100 p-2 rounded mb-4">
    <Text className="text-yellow-800 text-sm text-center">⚠️ MODO DE PRUEBA</Text>
  </View>
)}
```

## Order Success / Failure

After payment completion, the app navigates to:

- **Success**: `/(storefront)/[tenantSlug]/checkout/confirmation?orderId=XXX&viewToken=YYY`
  - Shows order summary.
  - Clears cart.
  - Uses `viewToken` for the guest confirmation lookup.
- **Failure**: Shows error, option to retry.

## Order Status Polling

```ts
const { data: order } = useQuery({
  queryKey: ['order-confirmation', tenantSlug, orderId, viewToken],
  queryFn: () => orderService.getOrder(tenantSlug, orderId, viewToken),
  refetchInterval: (data) =>
    data?.orderStatus === 'pending' ? 3000 : false,
});
```

Polls every 3 seconds while status is `pending`.

## Deep Link Handling

```tsx
// app/_layout.tsx
useEffect(() => {
  const subscription = Linking.addEventListener('url', (event) => {
    const { path, queryParams } = Linking.parse(event.url);
    if (path === 'checkout/confirmation') {
      router.push(
        `/checkout/confirmation?orderId=${queryParams.orderId}&viewToken=${queryParams.viewToken}`
      );
    }
  });
  return () => subscription.remove();
}, []);
```

## Security

- Never store payment credentials (card numbers, etc.) client-side
- Use provider SDKs which tokenize sensitive data
- All payment confirmation happens via provider's secure UI
- `clientSecret` is short-lived and single-use
