# Native App Authentication

## Auth Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Login     │────▶│   Backend   │────▶│   Tokens    │
│   Screen    │     │   /login    │     │  JWT Pair   │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                                │
                       ┌────────────────────────┘
                       ▼
              ┌─────────────────┐
              │  SecureStore    │  (native)
              │  localStorage   │  (web)
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │   API Client    │  (Authorization header)
              │  Interceptor    │
              └─────────────────┘
```

## Token Storage

| Platform | Access Token | Refresh Token |
|----------|-------------|---------------|
| iOS / Android | Expo SecureStore | Expo SecureStore |
| Web | localStorage | localStorage |

SecureStore is used on native because it encrypts data using the device's keychain/keystore.

## Login

```ts
// services/auth.ts
export async function login(email: string, password: string) {
  const response = await api.post('/auth/login', { email, password });
  const { accessToken, refreshToken, user } = response.data;
  await saveTokens(accessToken, refreshToken);
  authStore.setAuth(user, accessToken, refreshToken);
  return user;
}
```

## Token Refresh

```ts
// services/auth.ts
export async function refreshAccessToken(): Promise<string> {
  const refreshToken = await getRefreshToken();
  const response = await api.post('/auth/refresh', { refreshToken });
  const { accessToken } = response.data;
  await saveAccessToken(accessToken);
  authStore.setAccessToken(accessToken);
  return accessToken;
}
```

## Logout

```ts
export async function logout() {
  await api.post('/auth/logout'); // Optional: notify backend
  await clearTokens();
  authStore.clearAuth();
  queryClient.clear(); // Clear React Query cache
}
```

## Auth Store (`stores/use-auth-store.ts`)

```ts
interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
}
```

## Auth Hook (`hooks/use-auth.ts`)

```ts
export function useAuth() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const requireAuth = (callback: () => void) => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }
    callback();
  };

  return { user, isAuthenticated, requireAuth };
}
```

## Biometric Authentication (Native)

Optional: use `expo-local-authentication` to secure the app.

```ts
import * as LocalAuthentication from 'expo-local-authentication';

export async function authenticateWithBiometrics() {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Autenticar',
    fallbackLabel: 'Usar contraseña',
  });
  return result.success;
}
```

## Web Auth Considerations

- Same JWT flow as native
- Tokens stored in `localStorage` (web doesn't have SecureStore)
- On web, auth state survives page reload via persistence
- Consider httpOnly cookie alternative for production web deployments

## Role-Based UI

```tsx
const { user } = useAuth();

if (user?.role === 'superadmin') {
  return <SuperadminPanel />;
}

if (user?.role === 'admin' || user?.role === 'manager') {
  return <AdminPanel />;
}

return <Storefront />;
```

## Password Reset

```
1. User enters email on Forgot Password screen
2. POST /auth/forgot-password
3. Backend sends email with reset token
4. User clicks deep link: multitenant://auth/reset-password?token=xxx
5. App opens Reset Password screen
6. User enters new password
7. POST /auth/reset-password
```
