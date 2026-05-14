# MultiTenant Store — Native App System Overview

## What It Is

React Native application built with Expo. Supports **iOS**, **Android**, and **Web** from a single codebase.

The app is a **multi-tenant e-commerce platform** where users can:
- **As a shopper**: Browse stores, add products to cart, checkout, track orders
- **As a store owner/admin**: Create and manage a store, manage products/orders, configure payments

## Repository Layout

```
native-app/
├── app/                         # Expo Router (file-based routing)
│   ├── (auth)/                  # Auth stack (login, register, forgot-password)
│   ├── (storefront)/            # Public store (tabs: home, catalog, cart, account)
│   │   ├── [tenantSlug]/        # Tenant-specific routes
│   │   │   ├── index.tsx        # Store home
│   │   │   ├── products.tsx     # Product catalog
│   │   │   ├── products/
│   │   │   │   └── [slug].tsx   # Product detail
│   │   │   ├── categories/
│   │   │   │   └── [slug].tsx   # Category products
│   │   │   ├── cart.tsx         # Cart screen
│   │   │   └── checkout/        # Checkout flow
│   │   │       ├── index.tsx    # Customer & shipping
│   │   │       └── payment.tsx  # Payment screen
│   │   └── _layout.tsx          # Storefront layout (tabs)
│   ├── (admin)/                 # Admin panel (drawer/stack)
│   │   ├── dashboard.tsx
│   │   ├── products/
│   │   ├── orders/
│   │   ├── settings/
│   │   └── _layout.tsx
│   ├── (owner)/                 # Store owner onboarding & management
│   │   ├── create-store.tsx
│   │   └── manage-store.tsx
│   ├── _layout.tsx              # Root layout (providers, auth gate)
│   └── index.tsx                # App entry (tenant selector or redirect)
├── components/
│   ├── ui/                      # Base UI components (Button, Input, Card...)
│   ├── store/                   # Storefront-specific components
│   ├── admin/                   # Admin panel components
│   ├── forms/                   # Form wrappers (RHF + Zod)
│   └── shared/                  # Cross-cutting components
├── hooks/
│   ├── api/                     # React Query hooks (one per entity)
│   └── use-*.ts                 # Other custom hooks
├── stores/
│   ├── use-cart-store.ts        # Zustand cart store
│   ├── use-checkout-store.ts    # Zustand checkout store
│   ├── use-auth-store.ts        # Zustand auth store
│   └── use-tenant-store.ts      # Active tenant store
├── services/
│   ├── api.ts                   # Axios instance + interceptors
│   ├── auth.ts                  # Auth API calls
│   ├── tenant.ts                # Tenant API calls
│   └── payments.ts              # Payment provider integrations
├── lib/
│   ├── constants.ts             # App constants
│   ├── utils.ts                 # Helpers, formatters
│   ├── pricing.ts               # Combo pricing engine (shared with backend)
│   └── validators.ts            # Zod schemas
├── types/
│   └── index.ts                 # All TypeScript domain types
├── assets/
│   ├── images/
│   └── fonts/
└── docs/                        # This documentation
```

## Layer Architecture

```
PRESENTATION
  Routes (Expo Router — screen components)
  Components (render only, data via props)
  Hooks (React Query — queries, mutations, derived state)
        |
CLIENT STATE
  Zustand Stores (cart, checkout, auth, tenant)
  AsyncStorage (persisted state)
        |
API CLIENT
  Axios instance (interceptors, base URL, headers)
  Services (typed API functions)
        |
BACKEND API
  REST API (see architecture-backend docs)
```

## Key Architectural Decisions

| Decision | Why |
|----------|-----|
| Expo SDK | Faster development, OTA updates, web support out of the box |
| Expo Router | File-based routing, works on native + web, deep linking built-in |
| React Native (not webview) | Native performance, platform APIs, better UX |
| Single codebase for native + web | Shared logic, faster iteration, consistent UX |
| React Query for server state | Caching, refetching, optimistic updates, offline support |
| Zustand for client state | Lightweight, no boilerplate, works with AsyncStorage |
| Axios (not fetch) | Request/response interceptors, better error handling, timeout config |
| Expo SecureStore (native) / localStorage (web) | Secure token storage on device |

## Tech Stack

| Layer | Tech | Version |
|-------|------|---------|
| Framework | Expo | ~52 |
| Runtime | React Native | 0.76+ |
| Language | TypeScript | 5.x |
| Router | Expo Router | ~4 |
| Styles | NativeWind (Tailwind for RN) | latest |
| UI Components | React Native Reusables | latest |
| Server state | TanStack React Query | 5.x |
| Client state | Zustand | 5.x |
| Forms | React Hook Form | 7.x |
| Validation | Zod | 3.x |
| HTTP Client | Axios | 1.x |
| Storage | AsyncStorage + Expo SecureStore | latest |
| Payments | Expo Stripe / In-App Browser | latest |
| Icons | Lucide React Native | latest |
| Toasts | Sonner (web) / Toast (native) | latest |
| Charts | Victory Native XL | latest |
