# MultiTenant Store — Native App

React Native application built with Expo SDK 52. Supports iOS, Android, and Web.

## Tech Stack

- Expo SDK 52 + React Native 0.76
- Expo Router v4 (file-based routing)
- TypeScript 5
- NativeWind v4 (Tailwind CSS for RN)
- TanStack React Query v5
- Zustand v5
- React Hook Form + Zod
- Axios
- Expo SecureStore / AsyncStorage

## Project Structure

```
app/                    # Expo Router routes
  (auth)/               # Login, register, forgot-password
  (storefront)/         # Public store (tabs)
    [tenantSlug]/       # Tenant-specific routes
  (admin)/              # Admin panel
  (owner)/              # Store owner onboarding
components/
  ui/                   # Primitive UI components
  store/                # Storefront-specific components
  admin/                # Admin panel components
  forms/                # Form wrappers
  shared/               # Cross-cutting components
hooks/
  api/                  # React Query hooks
stores/                 # Zustand stores
services/               # API service modules
lib/                    # Utilities, constants, validators
 types/                  # Domain TypeScript types
```

## Getting Started

```bash
npm install
npx expo start
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
EXPO_PUBLIC_API_URL=http://localhost:3001/api/v1
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_APP_NAME=MultiTenant Store
```
